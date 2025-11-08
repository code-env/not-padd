import { RightSidebar } from "@/components/sidebar/right-sidebar";
import { ArticleProvider, ArticleFormProvider } from "@/contexts";
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
        <ArticleFormProvider>
          <SidebarInset className="h-[calc(100vh-1rem)] min-h-[calc(100vh-1rem)] border bg-sidebar m-auto sticky top-2 overflow-auto no-scrollbar py-4 ml-2">
            {children}
          </SidebarInset>
          <RightSidebar />
        </ArticleFormProvider>
      </SidebarProvider>
    </ArticleProvider>
  );
};

export default RightSidebarLayout;
