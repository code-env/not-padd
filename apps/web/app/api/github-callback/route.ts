import { NextRequest, NextResponse } from "next/server";
import { handleInstallation } from "@/lib/github";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get("installation_id");
  const state = searchParams.get("state");

  if (!installationId || !state) {
    return NextResponse.redirect(
      new URL("/error?message=Missing installation data", request.url)
    );
  }
  try {
    const newIntegration = await handleInstallation(Number(installationId));

    if (!newIntegration) {
      return NextResponse.redirect(
        new URL(
          `/${state}/settings/general?error=Failed to create GitHub integration`,
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(`/${state}/settings/general`, request.url)
    );
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/${state}/settings/general?error=${error.message}`, request.url)
    );
  }
};
