import type { ReqVariables } from "../../hono/index.js";
import { db } from "@notpadd/db";
import { file as media } from "@notpadd/db/schema";
import { and, ilike, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import sharp from "sharp";
import { getCache, setCache, deleteCacheByPattern } from "../../hono/cache.js";
import { cacheKeys } from "../../hono/cache-keys.js";

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

  // Try to get from cache
  const cacheKey = cacheKeys.mediaList(
    organizationId,
    page?.toString(),
    limit?.toString(),
    search?.toString()
  );
  const cached = await getCache(cacheKey);
  if (cached) {
    return c.json(cached);
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

  const response = {
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
  };

  // Cache for 10 minutes (600 seconds)
  await setCache(cacheKey, response, 600);

  return c.json(response);
});

export { mediaRoutes };
