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
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        aria-disabled={
                          process.env.NODE_ENV === "production" &&
                          !item.finished
                        }
                      >
                        <Link href={item.path}>
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items && item.items.length > 0 ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.name}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive}
                                aria-disabled={
                                  process.env.NODE_ENV === "production" &&
                                  !item.finished
                                }
                              >
                                <Link href={item.path}>{item.name}</Link>
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
        { name: "Overview", path: `/${activeOrg}`, finished: true },
        { name: "Articles", path: `/${activeOrg}/articles`, finished: true },
        { name: "Media", path: `/${activeOrg}/media`, finished: false },
        {
          name: "Settings",
          finished: true,
          path: `/${activeOrg}/settings/general`,
          items: [
            {
              name: "General",
              path: `/${activeOrg}/settings/general`,
              finished: true,
            },
            {
              name: "Members",
              path: `/${activeOrg}/settings/members`,
              finished: false,
            },
          ],
        },
      ],
    },
    {
      name: "Developers",
      items: [
        { name: "Api keys", path: `/${activeOrg}/api-keys`, finished: false },
        { name: "Webhooks", path: `/${activeOrg}/webhooks`, finished: false },
      ],
    },
  ];
};
