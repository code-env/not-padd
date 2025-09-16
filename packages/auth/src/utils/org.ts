import { db } from "@notpadd/db";
import { member, organization } from "@notpadd/db/schema";
import { eq } from "drizzle-orm";

export const getActiveOrganization = async (userId: string) => {
  const memberInDb = await db.query.member.findFirst({
    where: eq(member.userId, userId),
  });

  if (!memberInDb) return null;

  const activeFirstOrg = await db.query.organization.findFirst({
    where: eq(organization.id, memberInDb.organizationId),
  });

  return activeFirstOrg;
};
