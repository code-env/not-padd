import type { Metadata } from "next";
import React from "react";
import { MembersSection } from "@/components/clients";

export const metadata: Metadata = {
  title: "Members",
};

const Page = () => {
  return <MembersSection />;
};

export default Page;
