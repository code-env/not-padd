"use client";

import { useOrganizationContext } from "@/contexts";

export const OrganizationInfo = () => {
  const {
    organizations,
    activeOrganization,
    activeMember,
    organizationsLoading,
    activeOrganizationLoading,
    isOwner,
    isAdmin,
    isMember,
  } = useOrganizationContext();

  if (organizationsLoading || activeOrganizationLoading) {
    return <div className="text-center">Loading organizations...</div>;
  }

  return (
    <div className="space-y-4 p-6 bg-background rounded-lg">
      <h2 className="text-xl font-semibold">Organization Information</h2>

      {/* Organizations List */}
      <div>
        <h3 className="text-lg font-medium mb-2">Your Organizations:</h3>
        {organizations && organizations.length > 0 ? (
          <ul className="space-y-2">
            {organizations.map((org) => (
              <li
                key={org.id}
                className="flex items-center justify-between p-2 bg-muted/50 rounded"
              >
                <div>
                  <span className="font-medium">{org.name}</span>
                  <span className="text-gray-400 ml-2">({org.slug})</span>
                </div>
                {activeOrganization?.id === org.id && (
                  <span className="text-green-400 text-sm">Active</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No organizations found</p>
        )}
      </div>

      {activeOrganization && (
        <div>
          <h3 className="text-lg font-medium mb-2">Active Organization:</h3>
          <div className="p-3 bg-muted/50 rounded">
            <p>
              <strong>Name:</strong> {activeOrganization.name}
            </p>
            <p>
              <strong>Slug:</strong> {activeOrganization.slug}
            </p>
            <p>
              <strong>Logo:</strong> {activeOrganization.logo || "No logo"}
            </p>
          </div>
        </div>
      )}

      {/* Active Member Info */}
      {activeMember && (
        <div>
          <h3 className="text-lg font-medium mb-2">Your Role:</h3>
          <div className="p-3 bg-muted/50 rounded">
            <p>
              <strong>Role:</strong> {activeMember.role}
            </p>
            <div className="flex gap-2 mt-2">
              {isOwner && (
                <span className="px-2 py-1 bg-red-600 rounded text-sm">
                  Owner
                </span>
              )}
              {isAdmin && (
                <span className="px-2 py-1 bg-blue-600 rounded text-sm">
                  Admin
                </span>
              )}
              {isMember && (
                <span className="px-2 py-1 bg-green-600 rounded text-sm">
                  Member
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
