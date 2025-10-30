"use client";

import { Icons } from "@notpadd/ui/components/icons";
import { Button } from "@notpadd/ui/components/button";
import { useOrganization } from "@/hooks/use-organization";
import { GITHUB_APP_QUERIES } from "@/lib/queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@notpadd/env/client";
import { useState } from "react";

export const GithubAppLogin = () => {
  const { activeOrganization } = useOrganization();
  const queryClient = useQueryClient();
  const [isConnecting, setIsConnecting] = useState(false);

  const { data: integrations, isLoading } = useQuery({
    queryKey: ["github-integrations", activeOrganization?.id],
    queryFn: () =>
      activeOrganization?.id
        ? GITHUB_APP_QUERIES.getIntegrations(activeOrganization.id, {
            page: 1,
            limit: 1,
          })
        : null,
    enabled: !!activeOrganization?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (integrationId: string) =>
      GITHUB_APP_QUERIES.deleteIntegration(
        activeOrganization!.id,
        integrationId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["github-integrations", activeOrganization?.id],
      });
    },
  });

  const hasIntegration = integrations?.data && integrations.data.length > 0;
  const integration = hasIntegration ? integrations.data[0] : null;

  const handleConnect = () => {
    if (!activeOrganization?.id) return;

    const githubAppName = (env as any).NEXT_PUBLIC_GITHUB_APP_NAME;
    if (!githubAppName) {
      alert("GitHub App name is not configured");
      return;
    }

    setIsConnecting(true);
    const state = activeOrganization.id;
    const githubInstallUrl = `https://github.com/apps/${githubAppName}/installations/new?state=${state}`;

    window.location.href = githubInstallUrl;
  };

  const handleDisconnect = () => {
    if (!integration) return;

    if (confirm("Are you sure you want to disconnect GitHub?")) {
      deleteMutation.mutate(integration.id);
    }
  };

  if (isLoading) {
    return (
      <div className="border p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-10 border bg-sidebar flex items-center justify-center">
            <Icons.github className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">GitHub Integration</h2>
            <p className="text-sm text-muted-foreground">Loading...</p>
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
            {hasIntegration
              ? `Connected as ${integration?.githubAccountName ?? "Unknown"}`
              : "Connect your GitHub account to your workspace"}
          </p>
        </div>
      </div>
      {hasIntegration ? (
        <Button
          variant="destructive"
          onClick={handleDisconnect}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Disconnecting..." : "Disconnect"}
        </Button>
      ) : (
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect"}
        </Button>
      )}
    </div>
  );
};
