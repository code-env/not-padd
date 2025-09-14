"use client";

import React, { type ReactNode } from "react";
import { Toaster } from "sonner";
import { OrganizationProvider } from "@/contexts";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <OrganizationProvider>
      {children}
      <Toaster />
    </OrganizationProvider>
  );
};

export default Providers;
