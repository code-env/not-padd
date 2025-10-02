import type { ReqVariables } from "@/index";
import { db } from "@notpadd/db";
import { member, organization, tag } from "@notpadd/db/schema";
import { and, eq, ilike, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";

const tagsRoutes = new Hono<{ Variables: ReqVariables }>();

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

const createTagSchema = z.object({
  name: z.string().min(1),
});

const updateTagSchema = z.object({
  name: z.string().min(1),
});

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};

tagsRoutes.post("/:organizationId", async (c) => {
  try {
    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { organizationId } = c.req.param();

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { name } = createTagSchema.parse(await c.req.json());
    const slug = slugify(name);

    const existing = await db
      .select({ id: tag.id })
      .from(tag)
      .where(and(eq(tag.organizationId, organizationId), eq(tag.slug, slug)))
      .limit(1);
    if (existing && existing[0]) {
      return c.json({ error: "Tag already exists", success: false }, 409);
    }

    const [created] = await db
      .insert(tag)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        name,
        slug,
      })
      .returning();

    return c.json({
      success: true,
      message: "Tag created successfully",
      data: { data: created },
    });
  } catch (error: any) {
    console.error(error.message || error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

tagsRoutes.get("/:organizationId/:id", async (c) => {
  const { organizationId, id } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const rows = await db
    .select()
    .from(tag)
    .where(and(eq(tag.organizationId, organizationId), eq(tag.id, id)))
    .limit(1);

  if (!rows || !rows[0]) {
    return c.json({ error: "Tag not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Tag fetched successfully",
    data: rows[0],
  });
});

tagsRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { page, limit, search } = c.req.query();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const pageNumber = parseInt(page || "1");
  const limitNumber = parseInt(limit || "10");
  const offset = (pageNumber - 1) * limitNumber;

  const [rows, total] = await Promise.all([
    db
      .select()
      .from(tag)
      .where(
        and(
          eq(tag.organizationId, organizationId),
          search ? ilike(tag.name, `%${search}%`) : undefined
        )
      )
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(tag)
      .where(eq(tag.organizationId, organizationId)),
  ]);

  return c.json({
    success: true,
    message: "Tags fetched successfully",
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

tagsRoutes.put("/:organizationId/:slug", async (c) => {
  const { organizationId, slug } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const { name } = updateTagSchema.parse(await c.req.json());
  const newSlug = slugify(name);

  const result = await db
    .update(tag)
    .set({ name, slug: newSlug })
    .where(and(eq(tag.organizationId, organizationId), eq(tag.slug, slug)))
    .returning();

  if (!result || !result[0]) {
    return c.json({ error: "Tag not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Tag updated successfully",
    data: { data: result[0] },
  });
});

tagsRoutes.delete("/:organizationId/:tagId", async (c) => {
  const { organizationId, tagId } = c.req.param();
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
    .from(tag)
    .where(and(eq(tag.organizationId, organizationId), eq(tag.id, tagId)))
    .limit(1);

  if (!existing || !existing[0]) {
    return c.json({ error: "Tag not found", success: false }, 404);
  }

  await db
    .delete(tag)
    .where(and(eq(tag.organizationId, organizationId), eq(tag.id, tagId)));

  return c.json({
    success: true,
    message: "Tag deleted successfully",
    data: { data: existing[0] },
  });
});

export default tagsRoutes;
