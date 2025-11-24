"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import { useOrganizationContext } from "@/contexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export function OrganizationSwitcher() {
  const { isMobile } = useSidebar();
  const { activeOrganization, organizations, setActiveOrganization } =
    useOrganizationContext();

  const pathname = usePathname();
  const pathWithoutCurrentSlug = pathname.split("/").slice(2).join("/");

  console.log(pathWithoutCurrentSlug);

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
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {organizations?.map((org, index) => (
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
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href="/new">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add team
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
