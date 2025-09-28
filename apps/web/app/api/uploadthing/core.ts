import { auth, type Session } from "@notpadd/auth/auth";
import { db } from "@notpadd/db";
import {
  file as fileTable,
  member,
  organization as organizationTable,
} from "@notpadd/db/schema";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

function parseBytesToMB(bytes: number): number {
  return Number((bytes / 1024 / 1024).toFixed(2));
}

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

      const size = parseBytesToMB(input.size);

      if (organization.storageUsed + size > organization.storageLimit)
        throw new UploadThingError("Organization storage limit reached");

      return { user, organization };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { organization } = metadata;
      const fileRecord = await db.insert(fileTable).values({
        id: crypto.randomUUID(),
        organizationId: metadata.organization.id,
        name: file.name,
        url: file.ufsUrl,
        size: parseBytesToMB(file.size),
      });
      const organizationRecord = await db
        .update(organizationTable)
        .set({
          storageUsed: organization.storageUsed + parseBytesToMB(file.size),
        })
        .where(eq(organizationTable.id, organization.id));

      console.log({
        fileRecord,
        organizationRecord,
      });

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
