import { GITHUB_APP_QUERIES } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

/**
 * Fetches GitHub installation data from GitHub API
 * TODO: Implement actual GitHub API call using GitHub App credentials
 * This requires GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY to generate a JWT token
 */
async function fetchGitHubInstallation(installationId: string) {
  // TODO: Implement actual GitHub API call
  // For now, return placeholder data structure
  // When implementing, use:
  // 1. Generate JWT token using GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY
  // 2. Fetch installation: GET https://api.github.com/app/installations/{installation_id}
  // 3. Extract account information from the response

  return {
    account: {
      login: "temp-account", // Should come from GitHub API
      id: "temp-id", // Should come from GitHub API
      type: "User", // Should come from GitHub API (User or Organization)
    },
    access_tokens_url: `https://api.github.com/app/installations/${installationId}/access_tokens`,
    repositories_url: `https://api.github.com/installation/repositories`,
  };
}

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const installationId = searchParams.get("installation_id");
    const setupAction = searchParams.get("setup_action");
    const state = searchParams.get("state");

    if (!installationId || !state) {
      return NextResponse.redirect(
        new URL("/error?message=Missing installation data", request.url)
      );
    }

    const organizationId = state;

    try {
      // Fetch GitHub installation data
      const installationData = await fetchGitHubInstallation(installationId);

      const integrationData = {
        installationId,
        githubAccountName: installationData.account.login,
        githubAccountId: String(installationData.account.id),
        githubAccountType: installationData.account.type,
        accessTokensUrl: installationData.access_tokens_url,
        repositoriesUrl: installationData.repositories_url,
        metadata: {
          setupAction,
          installedAt: new Date().toISOString(),
        },
      };

      await GITHUB_APP_QUERIES.createIntegration(
        organizationId,
        integrationData
      );

      return NextResponse.redirect(
        new URL(
          `/${organizationId}/settings/general?success=GitHub App connected successfully`,
          request.url
        )
      );
    } catch (error: any) {
      console.error("Error creating GitHub integration:", error);
      return NextResponse.redirect(
        new URL(
          `/${organizationId}/settings/general?error=${encodeURIComponent(error.message)}`,
          request.url
        )
      );
    }
  } catch (error: any) {
    console.error("GitHub callback error:", error);
    return NextResponse.redirect(
      new URL(
        `/error?message=${encodeURIComponent(error.message)}`,
        request.url
      )
    );
  }
};
