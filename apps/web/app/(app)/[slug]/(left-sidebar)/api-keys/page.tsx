import React from "react";
import { ApiKeys } from "@/components/clients";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Api Keys",
};

const ApiKeysPage = () => {
  return <ApiKeys />;
};

export default ApiKeysPage;
