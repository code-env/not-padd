import { Client } from "@/components/client";
import { type ReactNode } from "react";
import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface SlugParams extends PageProps {
  children: ReactNode;
}

async function getWorkspaceFromSlug({ params }: PageProps) {
  const { slug } = await params;

  const organization = await auth.api.getFullOrganization({
    query: { organizationSlug: slug },
    headers: await headers(),
  });

  // no-op removed

  return organization;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const organization = await getWorkspaceFromSlug({ params });

  if (!organization) {
    return {};
  }

  return {
    title: {
      default: organization.name,
      template: `%s | ${organization.name}`,
    },
    description: `Notpadd workspace for ${organization.name}`,
    openGraph: {
      title: organization.name,
      type: "article",
      description: `Notpadd workspace for ${organization.name}`,
      url: organization?.logo,
      images: [
        {
          url: organization?.logo,
          width: 1200,
          height: 630,
          alt: organization.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: organization.name,
      description: `Notpadd workspace for ${organization.name}`,
      images: [organization?.logo],
      creator: "@bossadizenith",
    },
  };
}

const ActiveLayoutSlug = async ({ children, params }: SlugParams) => {
  const organization = await getWorkspaceFromSlug({ params });

  if (!organization) {
    return notFound();
  }

  return <Client slug={organization.slug}>{children}</Client>;
};

export default ActiveLayoutSlug;
