"use client";

import { SidebarInset, SidebarProvider } from "@notpadd/ui/components/sidebar";
import { DocsSidebar } from "./docs-sidebar";
import { TableOfContents } from "./toc";

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
          <main className="flex-1 min-w-0 w-full relative">
            <div className="prose prose-neutral dark:prose-invert max-w-4xl mx-auto">
              {children}
            </div>
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
