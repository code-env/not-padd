import { allDocs } from "content-collections";
import { notFound } from "next/navigation";
import { DocsLayout } from "@/components/docs-layout";
import { MDXContent } from "@/components/mdx-content";

type PageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  const path = slug ? slug.join("/") : "index";

  const doc = allDocs.find(
    (d) =>
      d._meta.path === path ||
      d._meta.path === `content/${path}` ||
      d._meta.path.replace(/^content\//, "") === path
  );

  if (!doc) {
    notFound();
  }

  return (
    <DocsLayout headings={doc.headings || []}>
      <MDXContent code={doc.mdx} />
    </DocsLayout>
  );
}

export async function generateStaticParams() {
  return allDocs.map((doc) => {
    let path = doc._meta.path.replace(/^content\//, "");
    path = path.replace(/\.mdx?$/, "");
    return {
      slug: path === "index" ? [] : path.split("/"),
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug ? slug.join("/") : "index";
  const doc = allDocs.find(
    (d) =>
      d._meta.path === path ||
      d._meta.path === `content/${path}` ||
      d._meta.path.replace(/^content\//, "") === path
  );

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}
