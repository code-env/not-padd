import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";
import React, { type ReactNode } from "react";
import { db } from "@notpadd/db";
import { articles } from "@notpadd/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ArticleClient from "@/components/clients/article-client";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

interface SlugParams extends PageProps {
  children: ReactNode;
}

async function getWorkspaceFromSlug({ params }: PageProps) {
  const { slug, id } = await params;

  const organization = await auth.api.getFullOrganization({
    query: { organizationSlug: slug },
    headers: await headers(),
  });

  const article = await db.query.articles.findFirst({
    where: and(
      eq(articles.id, id),
      eq(articles.organizationId, organization?.id as string)
    ),
  });

  if (!organization) null;

  return { organization, article };
}

const ArticleSlug = async ({ params }: SlugParams) => {
  const { organization, article } = await getWorkspaceFromSlug({ params });

  if (!organization || !article) {
    return notFound();
  }

  return <ArticleClient article={article} />;
};

export default ArticleSlug;
