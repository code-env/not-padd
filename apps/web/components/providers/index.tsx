"use client";

import React, { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { OrganizationProvider } from "@/contexts";
import { authClient } from "@notpadd/auth/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useMounted } from "@/hooks/use-mouted";
import Modals from "@/components/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Providers = ({ children }: { children: ReactNode }) => {
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();
  const { data: user, isPending: isUserPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <OrganizationProvider>
        {children}
        <Toaster />
        <Modals />
      </OrganizationProvider>
    </QueryClientProvider>
  );
};

export default Providers;
