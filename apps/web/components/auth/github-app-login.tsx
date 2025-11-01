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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReposLoadingUI } from "@/components/loading-uis";
import { authClient } from "@notpadd/auth/auth-client";
import { toast } from "sonner";
import { replaceOrganizationWithWorkspace } from "@/lib/utils";

export const GithubAppLogin = () => {
  const { activeOrganization, isOwner, setActiveOrganization } =
    useOrganization();
  const router = useRouter();
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

  const { data: repositoriesData, isLoading: isLoadingRepositories } = useQuery(
    {
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
    }
  );

  const { mutate: connectRepository, isPending: isConnectingRepository } =
    useMutation({
      mutationFn: async (repositoryId: string) => {
        if (!activeOrganization?.id) {
          throw new Error("Active organization not found");
        }
        const { data, error } = await authClient.organization.update({
          data: {
            repoUrl: repositoryId,
          },
          organizationId: activeOrganization.id,
        });

        if (error) {
          throw new Error(error.message);
        }
        return data;
      },
      onSuccess: (data) => {
        setActiveOrganization(data.id, data.slug);
        router.refresh();
      },
      onError: (error) => {
        toast.error(replaceOrganizationWithWorkspace(error.message));
      },
    });

  const repositories = repositoriesData?.data || [];

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
            {isLoadingRepositories ? (
              <ReposLoadingUI count={10} />
            ) : repositories.length > 0 ? (
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
                    onClick={() => connectRepository(repository.full_name)}
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

  if (!isOwner && activeOrganization?.repoUrl) {
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

  if (isOwner && !integration)
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-col">
        <h2 className="text-lg font-bold">GitHub Integration</h2>
        <p className="text-sm text-muted-foreground">
          You are connected to a GitHub repository
        </p>
      </div>
      <div className="border p-4 flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="size-10 flex item-center justify-center">
            <Icons.github className="size-8" />
          </div>
          <div>
            <Link href={`https://github.com/${activeOrganization?.repoUrl}`}>
              {activeOrganization?.repoUrl}
            </Link>
            <p className="text-sm text-muted-foreground">
              {activeOrganization?.repoPath}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => connectRepository("")}>
          Disconnect
        </Button>
      </div>
    </div>
  );
};
