"use client";

import React, { type ReactNode } from "react";
import { Toaster } from "sonner";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

export default Providers;
