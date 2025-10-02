import type { ReqVariables } from "@/index";
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
import { z } from "zod";

const articlesRoutes = new Hono<{ Variables: ReqVariables }>();

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
  } catch (error: any) {
    console.error(error.message);
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
articlesRoutes.put("/:organizationId/:slug", async (c) => {
  const { organizationId, slug } = c.req.param();
  const { title, description } = createArticleSchema.parse(await c.req.json());
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const article = await db
    .update(articles)
    .set({ title, description })
    .where(
      and(eq(articles.organizationId, organizationId), eq(articles.slug, slug))
    );

  if (!article) {
    return c.json({ error: "Article not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Article fetched successfully",
    data: {
      data: article,
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

export default articlesRoutes;
