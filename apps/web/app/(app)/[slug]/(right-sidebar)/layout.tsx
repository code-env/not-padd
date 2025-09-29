import { RightSidebar } from "@/components/sidebar/right-sidebar";
import { ArticleProvider } from "@/contexts";
import { SidebarInset, SidebarProvider } from "@notpadd/ui/components/sidebar";
import React, { type ReactNode } from "react";

interface RightSidebarLayoutProps {
  children: ReactNode;
}

const RightSidebarLayout = ({ children }: RightSidebarLayoutProps) => {
  return (
    <ArticleProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "25rem",
          } as React.CSSProperties
        }
      >
        <SidebarInset className="h-[calc(100vh-1rem)] min-h-[calc(100vh-1rem)] border bg-sidebar m-auto sticky top-2 overflow-auto no-scrollbar py-10">
          {children}
        </SidebarInset>
        <RightSidebar />
      </SidebarProvider>
    </ArticleProvider>
  );
};

export default RightSidebarLayout;
