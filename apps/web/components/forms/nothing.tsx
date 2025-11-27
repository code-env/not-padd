"use client";

import { OrganizationProvider } from "@/contexts";
import { useMounted } from "@/hooks/use-mouted";
import { authClient } from "@notpadd/auth/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";

const NavigationHandler = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: user } = authClient.useSession();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOrganization?.slug, mounted, !!user, pathname]);

  return null;
};

const LoadingOverlay = () => {
  const { isPending } = authClient.useActiveOrganization();
  const { isPending: isUserPending } = authClient.useSession();
  const mounted = useMounted();

  if (!mounted || isPending || isUserPending) {
    return (
      <div className="flex items-center justify-center min-h-screen fixed inset-0 z-50 bg-background"></div>
    );
  }

  return null;
};

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <OrganizationProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationHandler />
          <LoadingOverlay />
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

// export default Providers;

// import { CreateWorkspace } from "@/components/forms/create-workspace";
// import React, { memo } from "react";

// const Page = memo(() => {
//   return (
//     <div className="flex flex-col items-center relative min-h-screen justify-center p-20">
//       <div className="flex flex-col gap-8 w-full max-w-md items-center">
//         <h1 className="text-xl font-semibold">Create a workspace</h1>
//         <CreateWorkspace />
//       </div>
//     </div>
//   );
// });

// Page.displayName = "NewPage";

// export default Page;
