import type { ReqVariables } from "@/index";
import { db } from "@notpadd/db";
import { file as media } from "@notpadd/db/schema";
import { and, ilike, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const mediaRoutes = new Hono<{ Variables: ReqVariables }>();

mediaRoutes.get("/:organizationId", async (c) => {
  const { organizationId } = c.req.param();
  const { search, page, limit } = c.req.queries();

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const offset = (pageNumber - 1) * limitNumber;

  const user = c.get("user");

  if (!user || !user.id) {
    return c.json({ error: "Unauthorized", success: false }, 401);
  }
  const [results, [{ count } = { count: 0 }]] = await Promise.all([
    db
      .select()
      .from(media)
      .where(
        and(
          eq(media.organizationId, organizationId),
          search ? ilike(media.name, `%${search}%`) : undefined
        )
      )
      .limit(limitNumber)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .where(eq(media.organizationId, organizationId)),
  ]);

  return c.json({
    success: true,
    message: "Media fetched successfully",
    data: {
      data: results,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: Number(count),
      },
    },
  });
});

export default mediaRoutes;
