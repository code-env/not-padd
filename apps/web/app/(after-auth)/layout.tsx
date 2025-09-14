import Providers from "@/components/providers";
import React, { type ReactNode } from "react";

const AfterAuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Providers>{children}</Providers>
    </div>
  );
};

export default AfterAuthLayout;
