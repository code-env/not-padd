import { allPosts } from "content-collections";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-20  py-32 px-16 bg-background border-x  sm:items-start">
        <h1 className="text-4xl font-medium font-mono">Notpadd Next example</h1>
        <ul className="flex flex-col w-full">
          {allPosts.map((post) => (
            <li key={post.slug} className="w-full">
              <Link
                href={`/articles/${post.slug}`}
                className="hover:bg-muted/50 w-full block py-2 px-4 rounded-md first-letter:capitalize"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
