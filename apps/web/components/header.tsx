"use client";

import React from "react";

import { useOrganizationContext } from "@/contexts";
import { DocsButton } from "./docs-button";

const Header = () => {
  const { activeOrganization } = useOrganizationContext();
  return (
    <div className="h-16 border-b flex items-center px-10 sticky top-0 bg-background z-50 justify-between">
      <h1 className="text-lg font-semibold first-letter:capitalize">
        {activeOrganization?.name}
      </h1>
      <DocsButton />
    </div>
  );
};

export default Header;
