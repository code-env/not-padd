import type { ReqVariables } from "../../hono/index.ts";
import { db } from "@notpadd/db";
import {
  articleAuthor,
  articles,
  member,
  organization,
  user as userTable,
} from "@notpadd/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";

const authorsRoutes = new Hono<{ Variables: ReqVariables }>();

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

const createAuthorSchema = z.object({
  articleId: z.string().min(1),
  memberId: z.string().min(1),
});

const updateAuthorSchema = z.object({
  memberId: z.string().min(1),
});

authorsRoutes.post("/:organizationId", async (c) => {
  try {
    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { organizationId } = c.req.param();
    const { articleId, memberId } = createAuthorSchema.parse(
      await c.req.json()
    );

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    // Ensure article belongs to org
    const [articleRow] = await db
      .select({ id: articles.id })
      .from(articles)
      .where(
        and(
          eq(articles.id, articleId),
          eq(articles.organizationId, organizationId)
        )
      )
      .limit(1);
    if (!articleRow) {
      return c.json({ error: "Article not found", success: false }, 404);
    }

    // Ensure member exists in org
    const [memberRow] = await db
      .select({ id: member.id })
      .from(member)
      .where(
        and(eq(member.id, memberId), eq(member.organizationId, organizationId))
      )
      .limit(1);
    if (!memberRow) {
      return c.json({ error: "Member not found", success: false }, 404);
    }

    // Check not already exists
    const existing = await db
      .select({ articleId: articleAuthor.articleId })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId),
          eq(articleAuthor.memberId, memberId)
        )
      )
      .limit(1);
    if (existing && existing[0]) {
      return c.json({ error: "Author already added", success: false }, 409);
    }

    const [created] = await db
      .insert(articleAuthor)
      .values({ articleId, memberId, organizationId })
      .returning();

    return c.json({
      success: true,
      message: "Author added successfully",
      data: { data: created },
    });
  } catch (error: any) {
    console.error(error.message || error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

authorsRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { page, limit, articleId } = c.req.query();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const pageNumber = parseInt(page || "1");
  const limitNumber = parseInt(limit || "10");
  const offset = (pageNumber - 1) * limitNumber;

  const [rows, total] = await Promise.all([
    db
      .select({
        articleId: articleAuthor.articleId,
        memberId: articleAuthor.memberId,
        organizationId: articleAuthor.organizationId,
        createdAt: articleAuthor.createdAt,
        userId: userTable.id,
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
          articleId ? eq(articleAuthor.articleId, articleId) : undefined
        )
      )
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          articleId ? eq(articleAuthor.articleId, articleId) : undefined
        )
      ),
  ]);

  return c.json({
    success: true,
    message: "Authors fetched successfully",
    data: {
      data: rows,
      pagination: {
        total: Number(total[0]?.count) || 0,
        page: pageNumber,
        limit: limitNumber,
      },
    },
  });
});

authorsRoutes.get("/:organizationId/:articleId/:memberId", async (c) => {
  const { organizationId, articleId, memberId: memberIdParam } = c.req.param();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const rows = await db
    .select({
      articleId: articleAuthor.articleId,
      memberId: articleAuthor.memberId,
      organizationId: articleAuthor.organizationId,
      createdAt: articleAuthor.createdAt,
      userId: userTable.id,
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
        eq(articleAuthor.articleId, articleId),
        eq(articleAuthor.memberId, memberIdParam)
      )
    )
    .limit(1);

  if (!rows || !rows[0]) {
    return c.json({ error: "Author mapping not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Author fetched successfully",
    data: rows[0],
  });
});

authorsRoutes.get("/:organizationId/:articleId", async (c) => {
  const { organizationId, articleId } = c.req.param();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");
  const offset = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    db
      .select({
        id: member.id,
        userId: userTable.id,
        name: userTable.name,
        image: userTable.image,
      })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId)
        )
      )
      .leftJoin(
        member,
        and(
          eq(member.id, articleAuthor.memberId),
          eq(member.organizationId, articleAuthor.organizationId)
        )
      )
      .leftJoin(userTable, eq(userTable.id, member.userId))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId)
        )
      ),
  ]);

  console.log(rows, total);

  return c.json({
    success: true,
    message: "Authors fetched successfully",
    data: {
      data: rows,
      pagination: {
        total: Number(total[0]?.count) || 0,
        page: page,
        limit: limit,
      },
    },
  });
});

authorsRoutes.put("/:organizationId/:articleId/:memberId", async (c) => {
  try {
    const { organizationId, articleId, memberId: oldMemberId } = c.req.param();

    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { memberId: newMemberId } = updateAuthorSchema.parse(
      await c.req.json()
    );

    const [memberRow] = await db
      .select({ id: member.id })
      .from(member)
      .where(
        and(
          eq(member.id, newMemberId),
          eq(member.organizationId, organizationId)
        )
      )
      .limit(1);
    if (!memberRow) {
      return c.json({ error: "Member not found", success: false }, 404);
    }

    const existing = await db
      .select({ articleId: articleAuthor.articleId })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId),
          eq(articleAuthor.memberId, oldMemberId)
        )
      )
      .limit(1);
    if (!existing || !existing[0]) {
      return c.json({ error: "Author mapping not found", success: false }, 404);
    }

    const duplicate = await db
      .select({ articleId: articleAuthor.articleId })
      .from(articleAuthor)
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId),
          eq(articleAuthor.memberId, newMemberId)
        )
      )
      .limit(1);
    if (duplicate && duplicate[0]) {
      return c.json({ error: "Author already added", success: false }, 409);
    }

    const result = await db
      .update(articleAuthor)
      .set({ memberId: newMemberId })
      .where(
        and(
          eq(articleAuthor.organizationId, organizationId),
          eq(articleAuthor.articleId, articleId),
          eq(articleAuthor.memberId, oldMemberId)
        )
      )
      .returning();

    return c.json({
      success: true,
      message: "Author updated successfully",
      data: { data: result[0] },
    });
  } catch (error: any) {
    console.error(error.message || error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

authorsRoutes.delete("/:organizationId/:articleId/:memberId", async (c) => {
  const { organizationId, articleId, memberId: memberIdParam } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const existing = await db
    .select()
    .from(articleAuthor)
    .where(
      and(
        eq(articleAuthor.organizationId, organizationId),
        eq(articleAuthor.articleId, articleId),
        eq(articleAuthor.memberId, memberIdParam)
      )
    )
    .limit(1);

  if (!existing || !existing[0]) {
    return c.json({ error: "Author mapping not found", success: false }, 404);
  }

  await db
    .delete(articleAuthor)
    .where(
      and(
        eq(articleAuthor.organizationId, organizationId),
        eq(articleAuthor.articleId, articleId),
        eq(articleAuthor.memberId, memberIdParam)
      )
    );

  return c.json({
    success: true,
    message: "Author removed successfully",
    data: { data: existing[0] },
  });
});

export { authorsRoutes };
