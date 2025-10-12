"use client";

import { useOrganizationContext } from "@/contexts";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@notpadd/ui/components/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@notpadd/ui/components/collapsible";

export function NavMain() {
  const { activeOrganization } = useOrganizationContext();
  const sections = useSidebarRoutes(activeOrganization?.slug as string);
  const pathname = usePathname();

  return (
    <>
      {sections.map((section, idx) => (
        <SidebarGroup key={idx}>
          <SidebarGroupLabel>{section.name}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Collapsible key={item.name} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.path}>
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.name}>
                              <SidebarMenuSubButton asChild isActive={isActive}>
                                <a href={item.path}>{item.name}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

export const useSidebarRoutes = (activeOrg: string) => {
  return [
    {
      name: "Workspaces",
      items: [
        { name: "Overview", path: `/${activeOrg}` },
        { name: "Articles", path: `/${activeOrg}/articles` },
        { name: "Media", path: `/${activeOrg}/media` },
        {
          name: "Settings",
          path: `/${activeOrg}/settings/general`,
          items: [
            {
              name: "General",
              path: `/${activeOrg}/settings/general`,
            },
            {
              name: "Members",
              path: `/${activeOrg}/settings/members`,
            },
          ],
        },
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
