"use client";

import { useOrganizationContext } from "@/contexts";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@notpadd/ui/components/sidebar";
import Link from "next/link";

export function NavMain() {
  const { activeOrganization } = useOrganizationContext();
  const sections = useSidebarRoutes(activeOrganization?.slug as string);

  return (
    <>
      {sections.map((section, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupLabel>{section.name}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link href={item.path}>
                    {/* <item.icon /> */}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

const useSidebarRoutes = (activeOrg: string) => {
  return [
    {
      name: "Workspaces",
      items: [
        { name: "Overview", path: `/${activeOrg}` },
        { name: "Articles", path: `/${activeOrg}/articles` },
        { name: "Media", path: `/${activeOrg}/media` },
        { name: "Mettings", path: `/${activeOrg}/settings` },
      ],
    },
    {
      name: "Developers",
      items: [
        { name: "Api keys", path: `/${activeOrg}/api-keys` },
        { name: "Webhooks", path: `/${activeOrg}/webhooks` },
      ],
    },
  ];
};
