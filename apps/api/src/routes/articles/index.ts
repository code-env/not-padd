import type { ReqVariables } from "@/index";
import { db } from "@notpadd/db";
import { articles, member, organization } from "@notpadd/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";

const articlesRoutes = new Hono<{ Variables: ReqVariables }>();

const isUserInOrganization = async (
  c: Context<{ Variables: ReqVariables }>,
  organizationId: string
) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const dbOrganization = await db
    .select()
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  if (!dbOrganization || !dbOrganization[0]) {
    return c.json({ error: "Organization not found", success: false }, 404);
  }

  const dbMember = await db
    .select()
    .from(member)
    .where(
      and(
        eq(member.userId, user.id),
        eq(member.organizationId, dbOrganization[0].id)
      )
    )
    .limit(1);
  if (!dbMember || !dbMember[0]) {
    return c.json({ error: "Member not found", success: false }, 404);
  }

  return true;
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
    const user = c.get("user");
    if (!user || !user.id) {
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

    const article = await db
      .insert(articles)
      .values({
        id: crypto.randomUUID(),
        title,
        slug,
        description,
        organizationId,
      })
      .returning();

    return c.json({
      success: true,
      message: "Article created successfully",
      data: {
        data: article[0],
      },
    });
  } catch (error: any) {
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

articlesRoutes.get("/:organizationId/:slug", async (c) => {
  const { organizationId, slug } = c.req.param();
  const user = c.get("user");
  if (!user || !user.id) {
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
      and(eq(articles.organizationId, organizationId), eq(articles.slug, slug))
    );
  if (!article || !article[0]) {
    return c.json({ error: "Article not found", success: false }, 404);
  }
  return c.json({
    success: true,
    message: "Article fetched successfully",
    data: {
      data: article[0],
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
  const user = c.get("user");
  if (!user || !user.id) {
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
  const user = c.get("user");
  if (!user || !user.id) {
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
