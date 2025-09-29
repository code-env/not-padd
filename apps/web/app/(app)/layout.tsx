import Providers from "@/components/providers";
import { auth } from "@notpadd/auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import React, { type ReactNode } from "react";
import { SessionProvider } from "@/contexts";

const AfterAuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  return (
    <SessionProvider value={session}>
      <Providers>{children}</Providers>
    </SessionProvider>
  );
};

export default AfterAuthLayout;
