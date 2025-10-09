import type { ReqVariables } from "../../hono/index";
import { db } from "@notpadd/db";
import { articles } from "@notpadd/db/schema";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const v1Routes = new Hono<{ Variables: ReqVariables }>();

type NotpaddArticleType = "all" | "published" | "draft";

const generateFieldsErrors = (
  fields: Record<string, { error: string }>,
  provided: Record<string, unknown>
) => {
  return Object.entries(fields)
    .filter(([key]) => {
      const value = provided[key];
      if (value === undefined || value === null) return true;
      if (typeof value === "string" && value.trim() === "") return true;
      return false;
    })
    .map(([key, value]) => {
      return { [key]: value.error };
    });
};

v1Routes.get("/articles", async (c) => {
  const { type, query, organizationId } = c.req.query();

  const fields = {
    type: { error: "Content type is required" },
    query: { error: "Article type is required" },
    organizationId: { error: "Organization ID is required" },
  };
  const errors = generateFieldsErrors(fields, {
    type,
    query,
    organizationId,
  });
  if (errors.length > 0) {
    return c.json({ error: errors, success: false }, 400);
  }

  const articleType = query as NotpaddArticleType;
  const organization_Id = organizationId as string;

  const whereClauses = [eq(articles.organizationId, organization_Id)];
  if (articleType === "published") {
    whereClauses.push(eq(articles.published, true));
  } else if (articleType === "draft") {
    whereClauses.push(eq(articles.published, false));
  }

  const dbArticles = await db
    .select()
    .from(articles)
    .where(and(...whereClauses))
    .limit(10);

  return c.json({
    message: "Articles fetched successfully",
    articles: dbArticles,
  });
});

export { v1Routes };
