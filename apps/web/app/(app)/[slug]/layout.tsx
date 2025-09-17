import { Client } from "@/components/client";
import { type ReactNode } from "react";

interface SlugParams {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

const ActiveLayoutSlug = async ({ children, params }: SlugParams) => {
  const { slug } = await params;

  return <Client slug={slug}>{children}</Client>;
};

export default ActiveLayoutSlug;
