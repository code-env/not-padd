import Editor from "@/components/editor";
import { auth } from "@notpadd/auth/auth";
import { db } from "@notpadd/db";
import { articles } from "@notpadd/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
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

  return { organization, article };
}

const ArticleSlug = async ({ params }: PageProps) => {
  const { organization, article } = await getWorkspaceFromSlug({ params });

  if (!organization || !article) {
    return notFound();
  }

  return <Editor />;
};

export default ArticleSlug;
