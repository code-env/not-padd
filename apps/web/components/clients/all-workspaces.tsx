"use client";

import { useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { ORGANIZATION_QUERIES } from "@/lib/queries";
import { Badge } from "@notpadd/ui/components/badge";
import { Button } from "@notpadd/ui/components/button";
import { Card, CardContent } from "@notpadd/ui/components/card";
import { UserProfile } from "@notpadd/ui/components/user-profile";
import { useQueries } from "@tanstack/react-query";

export const AllWorkspaces = () => {
  const { activeOrganization, organizations, setActiveOrganization } =
    useOrganizationContext();

  const membersQueries = useQueries({
    queries:
      organizations?.map((org) => ({
        queryKey: [QUERY_KEYS.MEMBERS, org.id],
        queryFn: () =>
          ORGANIZATION_QUERIES.getMembers(org.id, {
            limit: 100,
            offset: 0,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
        enabled: !!org.id,
      })) ?? [],
  });

  const membersMap = new Map(
    membersQueries.map((query, index) => [
      organizations?.[index]?.id,
      query.data?.members ?? [],
    ])
  );

  return (
    <div className="flex flex-col gap-10 w-full max-w-3xl mx-auto p-4 items-center">
      <h1 className="text-2xl font-bold">All Workspaces</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full ">
        {organizations?.map((organization) => {
          const members = membersMap.get(organization.id) ?? [];
          const isLoading = membersQueries.find(
            (q, idx) => organizations?.[idx]?.id === organization.id
          )?.isLoading;

          return (
            <Card key={organization.id} className="relative">
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <UserProfile
                    url={organization.logo}
                    name={organization.name}
                    size="sm"
                  />
                  <p className="text-sm font-medium first-letter:capitalize">
                    {organization.name}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {isLoading
                        ? "Loading..."
                        : `${members.length} ${members.length === 1 ? "member" : "members"}`}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setActiveOrganization(organization.id);
                        window.location.href = `/${organization.slug}`;
                      }}
                      size="sm"
                      className="text-xs hover:border-border border-transparent border"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
              {activeOrganization?.id === organization.id && (
                <Badge className="absolute -top-2 -right-2">Active</Badge>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
