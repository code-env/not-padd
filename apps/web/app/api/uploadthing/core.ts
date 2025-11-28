import { auth, type Session } from "@notpadd/auth/auth";
import { db } from "@notpadd/db";
import {
  file as fileTable,
  member,
  articles as articleTable,
  organization as organizationTable,
} from "@notpadd/db/schema";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";
import sharp from "sharp";
import { getCache, setCache, cacheKeys } from "@notpadd/cache";

const f = createUploadthing();

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

const returnKey = (url: string): string | null => {
  const parts = url.split("/f/");
  const key = parts[1];
  return key ?? null;
};

const handleAuth = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) throw new UploadThingError("Unauthorized");

  return { user: session.user };
};

const handleOrganization = async (
  user: Session["user"],
  organizationId: string
) => {
  const memberRecord = await db.query.member.findFirst({
    where: and(
      eq(member.userId, user.id),
      eq(member.organizationId, organizationId)
    ),
    columns: {
      organizationId: true,
    },
  });

  if (!memberRecord)
    throw new UploadThingError("User is not a member of any organization");

  const organization = await db.query.organization.findFirst({
    where: eq(organizationTable.id, memberRecord.organizationId),
    columns: {
      id: true,
      name: true,
      slug: true,
      storageUsed: true,
      storageLimit: true,
    },
  });

  if (!organization) throw new UploadThingError("Organization not found");

  return { organization };
};

const handleArticle = async (user: Session["user"], articleId: string) => {
  const cacheKey = cacheKeys.article(user.id, articleId);
  const cached = await getCache(cacheKey);
  if (cached) {
    return c.json(cached);
  }

  const article = await db.query.articles.findFirst({
    where: eq(articleTable.id, articleId),
  });

  if (!article) throw new UploadThingError("Article not found");

  return { article };
};

export const ourFileRouter = {
  mediaUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        organizationId: z.string(),
        size: z.number(),
      })
    )
    .middleware(async ({ req, input }) => {
      const { user } = await handleAuth(req);
      const { organization } = await handleOrganization(
        user,
        input.organizationId
      );

      if (organization.storageUsed + input.size > organization.storageLimit)
        throw new UploadThingError("Organization storage limit reached");

      return { user, organization, size: input.size };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const { size } = metadata;
        const imageResponse = await fetch(file.ufsUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const blurDataUrl = await generateBlurDataUrl(imageBuffer);

        const values: typeof fileTable.$inferInsert = {
          id: crypto.randomUUID(),
          organizationId: metadata.organization.id,
          name: file.name,
          url: file.ufsUrl,
          size,
        };

        const [fileRecord, organizationRecord] = await Promise.all([
          db.insert(fileTable).values(values).returning({ id: fileTable.id }),
          db
            .update(organizationTable)
            .set({ storageUsed: metadata.organization.storageUsed + size })
            .where(eq(organizationTable.id, metadata.organization.id))
            .returning({ storageUsed: organizationTable.storageUsed }),
        ]);

        return {
          uploadedBy: metadata.user.id,
          imageBlurhash: blurDataUrl,
          fileInsertedId: fileRecord?.[0]?.id,
          storageUsed: organizationRecord?.[0]?.storageUsed,
          url: file.ufsUrl,
        };
      } catch (error) {
        if (file && error) {
          const api = new UTApi();
          await api.deleteFiles(file.key);
        }

        console.error(
          "onUploadComplete DB error:",
          error instanceof Error ? error.message : "Unknown error"
        );
        throw new UploadThingError("Failed to persist uploaded file");
      }
    }),
  coverImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        organizationId: z.string(),
        articleId: z.string(),
      })
    )
    .middleware(async ({ req, input }) => {
      const { user } = await handleAuth(req);
      const { article } = await handleArticle(user, input.articleId);

      return { user, article };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const imageResponse = await fetch(file.ufsUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const blurDataUrl = await generateBlurDataUrl(imageBuffer);

        const { article } = metadata;
        const isCoverImage = article.image !== null;
        const previousCoverImage = article.image;

        if (isCoverImage) {
          if (previousCoverImage) {
            const key = returnKey(previousCoverImage as string);
            if (key) {
              const api = new UTApi();
              await api.deleteFiles(key);
            }
          }
        }
        const updatedArticle = await db
          .update(articleTable)
          .set({
            image: file.ufsUrl,
            imageBlurhash: blurDataUrl,
          })
          .where(eq(articleTable.id, article.id))
          .returning({
            id: articleTable.id,
            image: articleTable.image,
            imageBlurhash: articleTable.imageBlurhash,
          });

        const updated = updatedArticle?.[0];
        return {
          uploadedBy: metadata.user.id,
          articleId: updated?.id,
          image: updated?.image,
          imageBlurhash: updated?.imageBlurhash,
        };
      } catch (error) {
        if (file && error) {
          const api = new UTApi();
          await api.deleteFiles(file.key);
        }

        console.error(
          "onUploadComplete DB error:",
          error instanceof Error ? error.message : "Unknown error"
        );
        throw new UploadThingError("Failed to persist uploaded file");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
