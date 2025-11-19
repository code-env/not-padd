import Mdx from "@/components/mdx";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { allPosts } from "content-collections";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-20  py-32 px-16 sm:items-start bg-background border-x">
        <ThemeSwitcher />
        <article className="prose space-y-6 max-w-full">
          <h1 className="text-4xl mb-14 font-medium font-mono first-letter:capitalize">
            {post.title}
          </h1>
          <Mdx code={post.mdx} />
        </article>
      </main>
    </div>
  );
}
