"use client";

import React, { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { OrganizationProvider } from "@/contexts";
import { authClient } from "@notpadd/auth/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useMounted } from "@/hooks/use-mouted";
import Modals from "@/components/modals";

const Providers = ({ children }: { children: ReactNode }) => {
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();
  const { data: user, isPending: isUserPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted) return;

    if (pathname === "/" && activeOrganization) {
      router.push(`/${activeOrganization?.slug}`);
    } else if (pathname === "/" && !activeOrganization && user) {
      router.push("/new");
    }
  }, [activeOrganization, mounted, user]);

  if (!mounted || isPending || isUserPending) return null;
  return (
    <OrganizationProvider>
      {children}
      <Toaster />
      <Modals />
    </OrganizationProvider>
  );
};

export default Providers;
