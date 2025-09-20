"use client";

import React, { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { OrganizationProvider } from "@/contexts";
import { authClient } from "@notpadd/auth/auth-client";
import { usePathname, useRouter } from "next/navigation";

const Providers = ({ children }: { children: ReactNode }) => {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push(`/${activeOrganization?.slug}`);
    }
  }, [activeOrganization]);

  return (
    <OrganizationProvider>
      {children}
      <Toaster />
    </OrganizationProvider>
  );
};

export default Providers;
