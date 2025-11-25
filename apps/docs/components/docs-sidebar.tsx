"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@notpadd/ui/components/sidebar";
import { BookOpen, Laptop, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@notpadd/ui/components/icons";
import { useTheme } from "next-themes";
import { cn } from "@notpadd/ui/lib/utils";
import { useMounted } from "@notpadd/ui/hooks/use-mounted";
import { motion } from "motion/react";
import { useDocs } from "@/hooks/use-docs";

export function DocsSidebar() {
  const pathname = usePathname();
  const { navigation } = useDocs();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className=" border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <BookOpen className="size-5" />
          <span className="font-semibold">Notpadd Docs</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.url || pathname.endsWith(item.url);
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex items-center flex-row justify-between">
        <SidebarMenuButton asChild className="w-fit">
          <Link href="https://notpadd.com/github">
            <Icons.github className="size-4" />
            <span>GitHub</span>
          </Link>
        </SidebarMenuButton>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}

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
