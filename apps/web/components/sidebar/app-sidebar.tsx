"use client";

import * as React from "react";

import { NavFooter } from "@/components/sidebar/nav-footer";
import { NavMain } from "@/components/sidebar/nav-main";
import { OrganizationSwitcher } from "@/components/sidebar/org-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@notpadd/ui/components/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
