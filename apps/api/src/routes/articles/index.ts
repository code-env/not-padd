import { Hono } from "hono";
import { z } from "zod";
import { member, organization, articles } from "@notpadd/db/schema";
import { eq, inArray, desc, and, sql } from "drizzle-orm";
import type { ReqVariables } from "@/index";
import type { Context } from "hono";
import { db } from "@notpadd/db";
const articlesRoutes = new Hono<{ Variables: ReqVariables }>();

const isUserInOrganization = async (
  c: Context<{ Variables: ReqVariables }>,
  organizationId: string
) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const dbOrganization = await db
    .select()
    .from(organization)
    .where(eq(organization.id, organizationId))
    .limit(1);

  if (!dbOrganization || !dbOrganization[0]) {
    return c.json({ error: "Organization not found" }, 404);
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
    return c.json({ error: "Member not found" }, 404);
  }

  return true;
};

const slugify = (text: string) => {
  return text.toLowerCase().replace(/ /g, "-");
};

articlesRoutes.post("/:organizationId", async (c) => {
  const user = c.get("user");
  if (!user || !user.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { organizationId } = c.req.param();
  const { title, content } = await c.req.json();

  const userInOrg = await isUserInOrganization(c, organizationId);
  if (!userInOrg) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const slug = slugify(title);

  const article = await db.insert(articles).values({
    id: crypto.randomUUID(),
    title,
    slug,
    content,
    organizationId,
  });
  return c.json(article);
});

export default articlesRoutes;
