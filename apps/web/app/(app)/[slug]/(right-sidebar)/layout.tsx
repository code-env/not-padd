import { RightSidebar } from "@/components/sidebar/right-sidebar";
import { SidebarInset, SidebarProvider } from "@notpadd/ui/components/sidebar";
import React, { type ReactNode } from "react";

const RightSidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "24rem",
        } as React.CSSProperties
      }
    >
      <SidebarInset className="h-[calc(100vh-1rem)] min-h-[calc(100vh-1rem)] border bg-sidebar m-auto sticky top-2 overflow-auto no-scrollbar">
        {children}
      </SidebarInset>
      <RightSidebar />
    </SidebarProvider>
  );
};

export default RightSidebarLayout;
