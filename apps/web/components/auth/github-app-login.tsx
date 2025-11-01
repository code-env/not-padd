"use client";

import { Icons } from "@notpadd/ui/components/icons";
import { Button } from "@notpadd/ui/components/button";
import { useOrganization } from "@/hooks/use-organization";
import { GITHUB_APP_QUERIES } from "@/lib/queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@notpadd/env/client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@notpadd/ui/components/input";

export const GithubAppLogin = () => {
  const { activeOrganization, isOwner } = useOrganization();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data: integration,
    isLoading: isLoadingIntegration,
    isError: isErrorIntegration,
  } = useQuery({
    queryKey: ["github-integrations", activeOrganization?.id],
    queryFn: () =>
      GITHUB_APP_QUERIES.getUserIntegration(activeOrganization!.id),
    enabled: !!activeOrganization?.id && isOwner,
  });

  const { data: repositoriesData } = useQuery({
    queryKey: ["github-repositories", integration?.installationId, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        installation_id: String(integration?.installationId),
        per_page: "10",
      });
      if (search) {
        params.append("search", search);
      }

      const { data } = await axios.get(
        `/api/github/repositories?${params.toString()}`
      );

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    },
    enabled: !!integration?.installationId && isOwner,
  });

  const { mutate: connectRepository, isPending: isConnectingRepository } =
    useMutation({
      mutationFn: (repositoryId: string) =>
        GITHUB_APP_QUERIES.connectRepository(
          activeOrganization!.id,
          repositoryId
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "github-repositories",
            integration?.installationId,
            search,
          ],
        });
      },
    });

  const repositories = repositoriesData?.data || [];
  // const deleteMutation = useMutation({
  //   mutationFn: (integrationId: string) =>
  //     GITHUB_APP_QUERIES.deleteIntegration(
  //       activeOrganization!.id,
  //       integrationId
  //     ),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["github-integrations", activeOrganization?.id],
  //     });
  //   },
  // });

  // const hasIntegration = integrations?.data && integrations.data.length > 0;
  // const integration = hasIntegration ? integrations.data[0] : null;

  const handleConnect = () => {
    if (!activeOrganization?.id) return;

    const githubAppName = (env as any).NEXT_PUBLIC_GITHUB_APP_NAME;
    if (!githubAppName) {
      alert("GitHub App name is not configured");
      return;
    }

    setIsConnecting(true);
    const state = activeOrganization.slug;
    const githubInstallUrl = `https://github.com/apps/${githubAppName}/installations/new?state=${state}`;

    window.location.href = githubInstallUrl;
  };

  if (integration && !activeOrganization?.repoUrl) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-col">
          <h2 className="text-lg font-bold">GitHub Integration</h2>
          <p className="text-sm text-muted-foreground">
            Connect your Workspace to a GitHub repository
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="mb-2">
            <Input
              type="text"
              placeholder="Search for a repository"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="divide-y border">
            {repositories.length > 0 ? (
              repositories.map((repository: any) => (
                <div
                  key={repository.id}
                  className="p-2 hover:bg-sidebar cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h2 className="font-medium">{repository.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {repository.full_name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => connectRepository(repository.name)}
                    disabled={isConnectingRepository}
                  >
                    Connect
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                {search ? "No repositories found" : "No repositories available"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // const handleDisconnect = () => {
  //   if (!integration) return;

  //   if (confirm("Are you sure you want to disconnect GitHub?")) {
  //     deleteMutation.mutate(integration.id);
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <div className="border p-4 flex items-center justify-between gap-4 rounded-lg">
  //       <div className="flex items-center gap-4">
  //         <div className="size-10 border bg-sidebar flex items-center justify-center rounded-md">
  //           <Icons.github className="size-5" />
  //         </div>
  //         <div>
  //           <h2 className="text-lg font-bold">GitHub Integration</h2>
  //           <p className="text-sm text-muted-foreground">Loading...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!isOwner) {
    return (
      <div className="border p-4 flex items-center justify-between gap-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="size-10 border bg-sidebar flex items-center justify-center rounded-md">
            <Icons.github className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">GitHub Integration</h2>
            <p className="text-sm text-muted-foreground">
              Only organization owners can connect GitHub App
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border p-4 flex items-center justify-between gap-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="size-10 border bg-sidebar flex items-center justify-center rounded-md">
          <Icons.github className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold">GitHub Integration</h2>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to your workspace
          </p>
        </div>
      </div>
      <Button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect"}
      </Button>
    </div>
  );
};
