"use client";
import { useOrganizationContext } from "@/contexts";

export default function MyPage() {
  const { organizations, activeOrganization, isOwner, createOrganization } =
    useOrganizationContext();

  return (
    <div className="flex flex-col gap-2">
      {organizations?.map((org) => (
        <li key={org.id}>{org.name}</li>
      ))}
    </div>
  );
}
