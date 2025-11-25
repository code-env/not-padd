"use client";

import { SidebarInset, SidebarProvider } from "@notpadd/ui/components/sidebar";
import { DocsSidebar } from "./docs-sidebar";
import { TableOfContents } from "./toc";
import Link from "next/link";
import { useDocs } from "@/hooks/use-docs";

type Heading = {
  level: number;
  text: string;
  slug: string;
};

type DocsLayoutProps = {
  children: React.ReactNode;
  headings?: Heading[];
};

export function DocsLayout({ children, headings = [] }: DocsLayoutProps) {
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset>
        <div className="flex flex-1 gap-6 py-20">
          <div className="fixed top-0 left-0 w-full h-96 pointer-events-none bg-gradient-to-b from-sidebar to-transparent blur-3xl" />
          <main className="flex-1 min-w-0 w-full relative flex flex-col">
            <div className="prose prose-neutral dark:prose-invert max-w-4xl w-full mx-auto">
              {children}
            </div>
            <NextPrevButtons />
          </main>
          {headings.length > 0 && (
            <aside className="hidden xl:block flex-shrink-0">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const NextPrevButtons = () => {
  const { previousDoc, nextDoc } = useDocs();

  return (
    <div className="flex items-center justify-between mt-auto max-w-4xl w-full mx-auto pt-20 gap-10">
      {previousDoc && (
        <Link
          href={`/docs/${previousDoc._meta.path.replace(/^content\//, "")}`}
          className="flex-1 border flex flex-col gap-2 p-2 hover:bg-muted/50 transition-colors max-w-1/2 rounded-lg"
        >
          <span className="text-muted-foreground text-xs">Previous</span>
          <p className="font-medium">{previousDoc.title}</p>
        </Link>
      )}
      {nextDoc && (
        <Link
          href={`/docs/${nextDoc._meta.path.replace(/^content\//, "")}`}
          className="flex-1 max-w-1/2 border flex flex-col gap-2 ml-auto p-2 items-end hover:bg-muted/50 transition-colors rounded-lg"
        >
          <span className="text-muted-foreground text-xs">Next</span>
          <p className="font-medium text-right">{nextDoc.title}</p>
        </Link>
      )}
    </div>
  );
};
