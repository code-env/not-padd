import type { ReqVariables } from "../../hono/index.js";
import { db } from "@notpadd/db";
import {
  articles,
  member,
  organization,
  articleTag,
  tag,
  articleAuthor,
  user as userTable,
} from "@notpadd/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import sharp from "sharp";
import { z } from "zod";

const articlesRoutes = new Hono<{ Variables: ReqVariables }>();

export async function generateBlurDataUrl(
  buffer: Buffer,
  width = 8,
  height?: number
): Promise<string> {
  try {
    const metadata = await sharp(buffer).metadata();

    if (!height && metadata.width && metadata.height) {
      height = Math.round((metadata.height / metadata.width) * width);
    } else {
      height = width;
    }

    const blurredBuffer = await sharp(buffer)
      .resize(width, height, { fit: "inside" })
      .toFormat("webp")
      .webp({ quality: 20 })
      .toBuffer();

    const base64String = blurredBuffer.toString("base64");
    return `data:image/webp;base64,${base64String}`;
  } catch (error) {
    console.error("Error generating blur data URL:", error);
    return "";
  }
}

const isUserInOrganization = async (
  c: Context<{ Variables: ReqVariables }>,
  organizationId: string
) => {
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return false;
  }

  const dbOrganization = await db
    .select({ id: organization.id })
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  if (!dbOrganization || !dbOrganization[0]) {
    return false;
  }

  const dbMember = await db
    .select({ id: member.id })
    .from(member)
    .where(
      and(
        eq(member.userId, currentUser.id),
        eq(member.organizationId, dbOrganization[0].id)
      )
    )
    .limit(1);

  return !!(dbMember && dbMember[0]);
};

const createArticleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};

articlesRoutes.post("/:organizationId", async (c) => {
  try {
    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { organizationId } = c.req.param();
    const { title, description } = createArticleSchema.parse(
      await c.req.json()
    );

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const slug = slugify(title);

    const articleId = crypto.randomUUID();

    const memberRows = await db
      .select({ id: member.id })
      .from(member)
      .where(
        and(
          eq(member.userId, currentUser.id),
          eq(member.organizationId, organizationId)
        )
      )
      .limit(1);

    const memberRow = memberRows[0];
    if (!memberRow) {
      return c.json({ error: "Member not found", success: false }, 404);
    }

    const [article] = await db.transaction(async (trx) => {
      const [createdArticle] = await trx
        .insert(articles)
        .values({
          id: articleId,
          title,
          slug,
          description,
          organizationId,
          creatorId: memberRow.id,
        })
        .returning();

      await trx.insert(articleAuthor).values({
        articleId: articleId,
        organizationId,
        memberId: memberRow.id,
      });

      return [createdArticle];
    });

    if (!article) {
      return c.json({ error: "Article not created", success: false }, 400);
    }

    return c.json({
      success: true,
      message: "Article created successfully",
      data: {
        data: article,
      },
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

articlesRoutes.get("/:organizationId/:id", async (c) => {
  const { organizationId, id } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const article = await db
    .select()
    .from(articles)
    .where(
      and(eq(articles.organizationId, organizationId), eq(articles.id, id))
    );
  if (!article || !article[0]) {
    return c.json({ error: "Article not found", success: false }, 404);
  }
  const [tagRows, authorRows] = await Promise.all([
    db
      .select({ name: tag.name })
      .from(articleTag)
      .leftJoin(
        tag,
        and(
          eq(tag.id, articleTag.tagId),
          eq(tag.organizationId, articleTag.organizationId)
        )
      )
      .where(
        and(
          eq(articleTag.organizationId, organizationId),
          eq(articleTag.articleId, id)
        )
      ),
    db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        image: userTable.image,
      })
      .from(articleAuthor)
      .leftJoin(
        member,
        and(
          eq(member.id, articleAuthor.memberId),
          eq(member.organizationId, articleAuthor.organizationId)
        )
      )
      .leftJoin(userTable, eq(userTable.id, member.userId))
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, id)
        )
      ),
  ]);

  return c.json({
    success: true,
    message: "Article fetched successfully",
    data: {
      ...article[0],
      tags: tagRows.filter((t) => !!t.name).map((t) => t.name as string),
      authors: authorRows
        .filter((a) => !!a.id)
        .map((a) => ({
          id: a.id as string,
          name: (a.name as string) ?? "",
          email: (a.email as string) ?? "",
          image: (a.image as string) ?? "",
        })),
    },
  });
});

articlesRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { page, limit, search } = c.req.query();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const pageNumber = parseInt(page || "1");
  const limitNumber = parseInt(limit || "10");

  const offset = (pageNumber - 1) * limitNumber;

  const [result, total] = await Promise.all([
    db
      .select()
      .from(articles)
      .where(eq(articles.organizationId, organizationId))
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(eq(articles.organizationId, organizationId)),
  ]);

  return c.json({
    success: true,
    message: "Articles fetched successfully",
    data: {
      data: result,
      pagination: {
        total: Number(total[0]?.count) || 0,
        page: pageNumber,
        limit: limitNumber,
      },
    },
  });
});
articlesRoutes.put("/:organizationId/:articleId", async (c) => {
  const { organizationId, articleId } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const updateSchema = z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      content: z.string().optional(),
      markdown: z.string().optional(),
      json: z.any().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      image: z.string().nullable().optional(),
      imageBlurhash: z.string().nullable().optional(),
      published: z.boolean().optional(),
      publishedAt: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
    })
    .passthrough();

  const body = updateSchema.parse(await c.req.json());

  // Get the article's creatorId to preserve it when removing authors
  const existingArticle = await db
    .select({ creatorId: articles.creatorId })
    .from(articles)
    .where(
      and(
        eq(articles.id, articleId),
        eq(articles.organizationId, organizationId)
      )
    )
    .limit(1);

  const creatorId = existingArticle[0]?.creatorId;

  const updateValues: Record<string, unknown> = {};
  if (body.title !== undefined) {
    updateValues.title = body.title;
    updateValues.slug = slugify(body.title);
  }
  if (body.description !== undefined)
    updateValues.description = body.description;
  if (body.content !== undefined) updateValues.content = body.content;
  if (body.markdown !== undefined) updateValues.markdown = body.markdown;
  if (body.json !== undefined) updateValues.json = body.json;
  if (body.excerpt !== undefined) updateValues.excerpt = body.excerpt;
  if (body.image !== undefined) updateValues.image = body.image;
  if (body.imageBlurhash !== undefined)
    updateValues.imageBlurhash = body.imageBlurhash;
  if (body.published !== undefined) updateValues.published = body.published;
  if (body.publishedAt !== undefined)
    updateValues.publishedAt = body.publishedAt;

  if (Object.keys(updateValues).length === 0) {
    return c.json(
      { error: "No updatable fields provided", success: false },
      400
    );
  }

  console.log(updateValues, body);

  const updated = await db
    .update(articles)
    .set(updateValues)
    .where(
      and(
        eq(articles.organizationId, organizationId),
        eq(articles.id, articleId)
      )
    )
    .returning();

  const tagValues = (body.tags ?? []).map((tag) => ({
    articleId,
    organizationId,
    tagId: tag,
  }));
  const authorMemberIds = await Promise.all(
    (body.authors ?? []).map(async (userId) => {
      const memberRecord = await db
        .select({ id: member.id })
        .from(member)
        .where(
          and(
            eq(member.userId, userId),
            eq(member.organizationId, organizationId)
          )
        )
        .limit(1);
      return memberRecord[0]?.id;
    })
  );

  const authorValues = authorMemberIds
    .filter((memberId): memberId is string => !!memberId)
    .map((memberId) => ({
      articleId,
      organizationId,
      memberId,
    }));

  await Promise.all([
    body.tags !== undefined
      ? (async () => {
          // First delete existing tags
          await db
            .delete(articleTag)
            .where(
              and(
                eq(articleTag.articleId, articleId),
                eq(articleTag.organizationId, organizationId)
              )
            );

          // Then insert new tags if any
          if (tagValues.length > 0) {
            await db.insert(articleTag).values(tagValues).onConflictDoNothing();
          }
        })()
      : Promise.resolve(),
    body.authors !== undefined
      ? body.authors.length === 0
        ? db
            .delete(articleAuthor)
            .where(
              and(
                eq(articleAuthor.articleId, articleId),
                eq(articleAuthor.organizationId, organizationId),
                creatorId
                  ? sql`${articleAuthor.memberId} != ${creatorId}`
                  : undefined
              )
            )
        : db.insert(articleAuthor).values(authorValues).onConflictDoNothing()
      : Promise.resolve(),
  ]);

  if (!updated || !updated[0]) {
    return c.json({ error: "Article not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Article updated successfully",
    data: {
      data: updated[0],
    },
  });
});

articlesRoutes.delete("/:organizationId/:articleId", async (c) => {
  const { organizationId, articleId } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.id, articleId));

  if (!article || !article[0]) {
    return c.json({ error: "Article not found", success: false }, 404);
  }

  await db
    .delete(articles)
    .where(
      and(
        eq(articles.organizationId, organizationId),
        eq(articles.id, articleId)
      )
    );

  return c.json({
    success: true,
    message: "Article deleted successfully",
    data: {
      data: article[0],
    },
  });
});

articlesRoutes.post("/:articleId/cover-image", async (c) => {
  const { articleId } = c.req.param();
  const { url } = await c.req.json();

  const imageResponse = await fetch(url);
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const blurDataUrl = await generateBlurDataUrl(imageBuffer);

  if (!imageBuffer || !blurDataUrl) {
    return c.json(
      { error: "Failed to generate blur data URL", success: false },
      400
    );
  }

  const updated = await db
    .update(articles)
    .set({ image: url, imageBlurhash: blurDataUrl })
    .where(eq(articles.id, articleId))

    .returning({
      image: articles.image,
      imageBlurhash: articles.imageBlurhash,
    });

  return c.json({
    success: true,
    message: "Article cover image updated successfully",
    data: { data: updated[0] },
  });
});

export { articlesRoutes };
