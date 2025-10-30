import { GITHUB_APP_QUERIES } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const installationId = searchParams.get("installation_id");
    const setupAction = searchParams.get("setup_action");
    const state = searchParams.get("state"); // This should contain organizationId

    if (!installationId || !state) {
      return NextResponse.redirect(
        new URL("/error?message=Missing installation data", request.url)
      );
    }

    // The state parameter should contain the organizationId
    const organizationId = state;

    // Exchange code for installation details if needed
    // For now, we'll create a basic integration record
    // You'll need to enhance this with actual GitHub API calls

    try {
      // Fetch installation details from GitHub API
      // This is a placeholder - you'll need to implement actual GitHub API calls
      const installationData = {
        installationId,
        githubAccountName: "temp-account", // Fetch from GitHub API
        githubAccountId: "temp-id", // Fetch from GitHub API
        githubAccountType: "User", // or "Organization"
        accessTokensUrl: `https://api.github.com/app/installations/${installationId}/access_tokens`,
        repositoriesUrl: `https://api.github.com/installation/repositories`,
        metadata: {
          setupAction,
          installedAt: new Date().toISOString(),
        },
      };

      await GITHUB_APP_QUERIES.createIntegration(
        organizationId,
        installationData
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
