"use client";

import { useOrganizationContext } from "@/contexts";

interface ClientProps {
  children: React.ReactNode;
  slug: string;
}

export const Client = ({ children, slug }: ClientProps) => {
  const { activeOrganization } = useOrganizationContext();

  if (!activeOrganization) {
    return <div>Loading...</div>;
  }

  if (activeOrganization.slug !== slug.toLowerCase()) {
    return <div>Not found</div>;
  }

  return (
    <div>
      {children} {slug}
    </div>
  );
};
