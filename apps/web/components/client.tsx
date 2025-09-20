"use client";

import { useOrganizationContext } from "@/contexts";
import { useSidebarRoutes } from "./sidebar/nav-main";
import { notFound, usePathname } from "next/navigation";

interface ClientProps {
  children: React.ReactNode;
  slug: string;
}

export const Client = ({ children, slug }: ClientProps) => {
  const { activeOrganization } = useOrganizationContext();
  const routes = useSidebarRoutes(activeOrganization?.slug ?? "");
  const pathname = usePathname();

  const flatRoutes = routes.flatMap((route) => route.items);

  if (!flatRoutes.some((route) => pathname.startsWith(route.path))) {
    return notFound();
  }

  return <>{children}</>;
};
