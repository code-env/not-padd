import type { ReqVariables } from "../../hono/index";
import { db } from "@notpadd/db";
import {
  key,
  member,
  organization,
  user as userTable,
} from "@notpadd/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";

const keysRoutes = new Hono<{ Variables: ReqVariables }>();

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

const createKeySchema = z.object({
  name: z.string().min(1),
});

const generateRandomKey = (length: number = 32): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateApiKeys = () => {
  const pk = `pk_${generateRandomKey(24)}`;
  const sk = `sk_${generateRandomKey(24)}`;
  return { pk, sk };
};

keysRoutes.post("/:organizationId", async (c) => {
  try {
    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { organizationId } = c.req.param();
    const body = await c.req.json();

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

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

    const { name } = createKeySchema.parse(body);

    const existingKey = await db
      .select({ id: key.id })
      .from(key)
      .where(and(eq(key.organizationId, organizationId), eq(key.name, name)))
      .limit(1);

    if (existingKey && existingKey[0]) {
      return c.json({ error: "Key name already exists", success: false }, 409);
    }

    const { pk, sk } = generateApiKeys();
    const keyId = crypto.randomUUID();

    const [createdKey] = await db
      .insert(key)
      .values({
        id: keyId,
        organizationId,
        name,
        pk,
        sk,
        creatorId: memberRow.id,
      })
      .returning();

    return c.json({
      success: true,
      message: "Key created successfully",
      data: { data: createdKey },
    });
  } catch (error: any) {
    console.error(error.message || error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

keysRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { page, limit, search } = c.req.query();

  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

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
        id: key.id,
        name: key.name,
        pk: key.pk,
        sk: key.sk,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt,
        creatorName: userTable.name,
        creatorEmail: userTable.email,
      })
      .from(key)
      .leftJoin(
        member,
        and(
          eq(member.id, key.creatorId),
          eq(member.organizationId, key.organizationId)
        )
      )
      .leftJoin(userTable, eq(userTable.id, member.userId))
      .where(
        and(
          eq(key.organizationId, organizationId),
          search ? sql`${key.name} ILIKE ${`%${search}%`}` : undefined
        )
      )
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(key)
      .where(eq(key.organizationId, organizationId)),
  ]);

  return c.json({
    success: true,
    message: "Keys fetched successfully",
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

keysRoutes.get("/:organizationId/:keyId", async (c) => {
  const { organizationId, keyId } = c.req.param();

  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const rows = await db
    .select({
      id: key.id,
      name: key.name,
      pk: key.pk,
      sk: key.sk,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      creatorName: userTable.name,
      creatorEmail: userTable.email,
    })
    .from(key)
    .leftJoin(
      member,
      and(
        eq(member.id, key.creatorId),
        eq(member.organizationId, key.organizationId)
      )
    )
    .leftJoin(userTable, eq(userTable.id, member.userId))
    .where(and(eq(key.organizationId, organizationId), eq(key.id, keyId)))
    .limit(1);

  if (!rows || !rows[0]) {
    return c.json({ error: "Key not found", success: false }, 404);
  }

  return c.json({
    success: true,
    message: "Key fetched successfully",
    data: rows[0],
  });
});

keysRoutes.delete("/:organizationId/:keyId", async (c) => {
  const { organizationId, keyId } = c.req.param();

  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const existingKey = await db
    .select()
    .from(key)
    .where(and(eq(key.organizationId, organizationId), eq(key.id, keyId)))
    .limit(1);

  if (!existingKey || !existingKey[0]) {
    return c.json({ error: "Key not found", success: false }, 404);
  }

  await db
    .delete(key)
    .where(and(eq(key.organizationId, organizationId), eq(key.id, keyId)));

  return c.json({
    success: true,
    message: "Key deleted successfully",
    data: { data: existingKey[0] },
  });
});

export { keysRoutes };
