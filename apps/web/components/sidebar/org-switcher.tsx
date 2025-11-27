"use client";

import { ChevronsUpDown } from "lucide-react";

import { useOrganizationContext } from "@/contexts";
import type { Organization } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@notpadd/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@notpadd/ui/components/sidebar";
import { UserProfile } from "@notpadd/ui/components/user-profile";
import { cn } from "@notpadd/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TO_SHOW = 5;

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const { activeOrganization, organizations, setActiveOrganization } =
    useOrganizationContext();

  const pathname = usePathname();
  const pathWithoutCurrentSlug = pathname.split("/").slice(2).join("/");

  let organizationsToShow = organizations?.slice(0, TO_SHOW) ?? [];
  const remainingOrganizations = organizations?.slice(TO_SHOW) ?? [];

  if (remainingOrganizations?.length && remainingOrganizations.length === 1) {
    organizationsToShow = [
      ...organizationsToShow,
      remainingOrganizations[0] as Organization,
    ];
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserProfile
                url={activeOrganization?.logo as string}
                name={activeOrganization?.name as string}
                size="lg"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-medium text-xs">Workspaces</span>
              <Link
                href="/new"
                className="size-6 border flex items-center justify-center"
              >
                +
              </Link>
            </DropdownMenuLabel>
            {organizationsToShow?.map((org, index) => (
              <DropdownMenuItem
                key={org.name}
                onClick={() => {
                  window.location.href = `/${org.slug}/${pathWithoutCurrentSlug}`;
                  setActiveOrganization(org.id, org.slug);
                }}
                className={cn("gap-2 p-2 cursor-pointer", {
                  "bg-sidebar-accent text-sidebar-accent-foreground":
                    activeOrganization?.id === org.id,
                })}
              >
                <UserProfile url={org.logo} name={org.name} size="sm" />
                <span className="truncate first-letter:capitalize">
                  {org.name}
                </span>
              </DropdownMenuItem>
            ))}
            {remainingOrganizations && remainingOrganizations.length > 1 && (
              <DropdownMenuItem className="gap-2 p-2" asChild>
                <Link href="/workspaces" className="flex items-center gap-2">
                  {remainingOrganizations.slice(0, 3).map((org) => (
                    <UserProfile
                      key={org.id}
                      url={org.logo}
                      name={org.name}
                      size="xs"
                    />
                  ))}

                  {remainingOrganizations.length > 3 && (
                    <span className="text-muted-foreground font-medium ">
                      +{remainingOrganizations.length - 3} more
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
