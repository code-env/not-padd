import { type ReactNode } from "react";

import Header from "@/components/header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@notpadd/ui/components/sidebar";

const LeftSidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative z-0">
        <Header />
        <div className="max-w-4xl w-full mx-auto p-10 z-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LeftSidebarLayout;
