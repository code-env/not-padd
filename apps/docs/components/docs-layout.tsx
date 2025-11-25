"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@notpadd/ui/components/sidebar";
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
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
        </header>
        <div className="flex flex-1 gap-6 p-6">
          <main className="flex-1 min-w-0 w-full">
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
