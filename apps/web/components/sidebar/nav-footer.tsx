"use client";

import { useSession } from "@/contexts";
import { useMounted } from "@/hooks/use-mouted";
import { authClient } from "@notpadd/auth/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { Laptop, LogOut, Moon, Sun, User } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Theme = "light" | "dark" | "system";

type ThemeType = {
  name: Theme;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const themes: ThemeType[] = [
  {
    name: "light",
    icon: Sun,
  },
  {
    name: "dark",
    icon: Moon,
  },
  {
    name: "system",
    icon: Laptop,
  },
];

export function NavFooter() {
  const { isMobile } = useSidebar();
  const { user } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const { data, error } = await authClient.signOut();

    if (data?.success) {
      toast.success("Logged out successful");
      router.push("/auth/login");

      return;
    }
    return toast.error(error?.message);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent size-fit rounded-full data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserProfile name={user.name} url={user.image} size="sm" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserProfile name={user.name} url={user.image} size="sm" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User />
                Account
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 hover:bg-red-500/10! hover:text-red-500!"
              onClick={handleLogout}
            >
              <LogOut className="text-red-500" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const ModeToggle = () => {
  const { setTheme, theme: justTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="flex border bottom-0 left-0 p-0.5 bg-muted/50 rounded-full items-center">
      {themes.map((theme, index) => {
        return (
          <button
            key={index + theme.name}
            className={cn(
              "size-6 flex items-center justify-center relative outline-none ring-0 z-0"
            )}
            onClick={() => setTheme(theme.name)}
          >
            <span className="sr-only">{theme.name}</span>
            <theme.icon className="size-3" />
            {justTheme === theme.name && (
              <motion.div
                layoutId="selected-theme"
                className="absolute size-full bg-background  rounded-full -z-10 border"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
