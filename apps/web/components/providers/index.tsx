"use client";

import { OrganizationProvider } from "@/contexts";
import { useMounted } from "@/hooks/use-mouted";
import { authClient } from "@notpadd/auth/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

const Providers = ({ children }: { children: ReactNode }) => {
  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();
  const { data: user, isPending: isUserPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OrganizationProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            toastOptions={{
              style: {
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                boxShadow: "0 0 0 1px var(--border)",
              },
            }}
          />
        </QueryClientProvider>
      </OrganizationProvider>
    </ThemeProvider>
  );
};

export default Providers;
