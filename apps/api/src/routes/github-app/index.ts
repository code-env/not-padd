import type { ReqVariables } from "../../hono/index.ts";
import { db } from "@notpadd/db";
import { githubAppIntegration, member, organization } from "@notpadd/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type { Context } from "hono";
import { Hono } from "hono";
import { z } from "zod";

const githubAppRoutes = new Hono<{ Variables: ReqVariables }>();

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

const createGithubAppSchema = z.object({
  installationId: z.string().min(1),
  githubAccountName: z.string().min(1),
  githubAccountId: z.string().min(1),
  githubAccountType: z.string().min(1),
  accessTokensUrl: z.string().optional(),
  repositoriesUrl: z.string().optional(),
  metadata: z.any().optional(),
});

const updateGithubAppSchema = z.object({
  installationId: z.string().min(1).optional(),
  githubAccountName: z.string().min(1).optional(),
  githubAccountId: z.string().min(1).optional(),
  githubAccountType: z.string().min(1).optional(),
  accessTokensUrl: z.string().nullable().optional(),
  repositoriesUrl: z.string().nullable().optional(),
  metadata: z.any().nullable().optional(),
});

githubAppRoutes.post("/:organizationId", async (c) => {
  try {
    const currentUser = c.get("user");
    if (!currentUser || !currentUser.id) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const { organizationId } = c.req.param();
    const body = createGithubAppSchema.parse(await c.req.json());

    const userInOrg = await isUserInOrganization(c, organizationId);
    if (!userInOrg) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    const existingIntegration = await db
      .select({ id: githubAppIntegration.id })
      .from(githubAppIntegration)
      .where(
        and(
          eq(githubAppIntegration.organizationId, organizationId),
          eq(githubAppIntegration.installationId, body.installationId)
        )
      )
      .limit(1);

    if (existingIntegration && existingIntegration[0]) {
      return c.json(
        { error: "GitHub App integration already exists", success: false },
        409
      );
    }

    const integrationId = crypto.randomUUID();

    const [created] = await db
      .insert(githubAppIntegration)
      .values({
        id: integrationId,
        organizationId,
        installationId: body.installationId,
        githubAccountName: body.githubAccountName,
        githubAccountId: body.githubAccountId,
        githubAccountType: body.githubAccountType,
        accessTokensUrl: body.accessTokensUrl,
        repositoriesUrl: body.repositoriesUrl,
        metadata: body.metadata,
      })
      .returning();

    return c.json({
      success: true,
      message: "GitHub App integration created successfully",
      data: { data: created },
    });
  } catch (error: any) {
    console.error(error.message || error);
    return c.json({ error: "Internal server error", success: false }, 500);
  }
});

githubAppRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { page, limit } = c.req.query();

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
      .select()
      .from(githubAppIntegration)
      .where(eq(githubAppIntegration.organizationId, organizationId))
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(githubAppIntegration)
      .where(eq(githubAppIntegration.organizationId, organizationId)),
  ]);

  return c.json({
    success: true,
    message: "GitHub App integrations fetched successfully",
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

githubAppRoutes.get("/:organizationId/:integrationId", async (c) => {
  const { organizationId, integrationId } = c.req.param();

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
    .from(githubAppIntegration)
    .where(
      and(
        eq(githubAppIntegration.organizationId, organizationId),
        eq(githubAppIntegration.id, integrationId)
      )
    )
    .limit(1);

  if (!rows || !rows[0]) {
    return c.json(
      { error: "GitHub App integration not found", success: false },
      404
    );
  }

  return c.json({
    success: true,
    message: "GitHub App integration fetched successfully",
    data: rows[0],
  });
});

githubAppRoutes.put("/:organizationId/:integrationId", async (c) => {
  const { organizationId, integrationId } = c.req.param();
  const currentUser = c.get("user");
  if (!currentUser || !currentUser.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }

  const body = updateGithubAppSchema.parse(await c.req.json());

  const updateValues: Record<string, unknown> = {};
  if (body.installationId !== undefined)
    updateValues.installationId = body.installationId;
  if (body.githubAccountName !== undefined)
    updateValues.githubAccountName = body.githubAccountName;
  if (body.githubAccountId !== undefined)
    updateValues.githubAccountId = body.githubAccountId;
  if (body.githubAccountType !== undefined)
    updateValues.githubAccountType = body.githubAccountType;
  if (body.accessTokensUrl !== undefined)
    updateValues.accessTokensUrl = body.accessTokensUrl;
  if (body.repositoriesUrl !== undefined)
    updateValues.repositoriesUrl = body.repositoriesUrl;
  if (body.metadata !== undefined) updateValues.metadata = body.metadata;

  if (Object.keys(updateValues).length === 0) {
    return c.json(
      { error: "No updatable fields provided", success: false },
      400
    );
  }

  updateValues.updatedAt = new Date();

  const result = await db
    .update(githubAppIntegration)
    .set(updateValues)
    .where(
      and(
        eq(githubAppIntegration.organizationId, organizationId),
        eq(githubAppIntegration.id, integrationId)
      )
    )
    .returning();

  if (!result || !result[0]) {
    return c.json(
      { error: "GitHub App integration not found", success: false },
      404
    );
  }

  return c.json({
    success: true,
    message: "GitHub App integration updated successfully",
    data: { data: result[0] },
  });
});

githubAppRoutes.delete("/:organizationId/:integrationId", async (c) => {
  const { organizationId, integrationId } = c.req.param();

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
    .from(githubAppIntegration)
    .where(
      and(
        eq(githubAppIntegration.organizationId, organizationId),
        eq(githubAppIntegration.id, integrationId)
      )
    )
    .limit(1);

  if (!existing || !existing[0]) {
    return c.json(
      { error: "GitHub App integration not found", success: false },
      404
    );
  }

  await db
    .delete(githubAppIntegration)
    .where(
      and(
        eq(githubAppIntegration.organizationId, organizationId),
        eq(githubAppIntegration.id, integrationId)
      )
    );

  return c.json({
    success: true,
    message: "GitHub App integration deleted successfully",
    data: { data: existing[0] },
  });
});

export { githubAppRoutes };
