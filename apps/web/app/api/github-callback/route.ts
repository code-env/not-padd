import { NextRequest, NextResponse } from "next/server";
import { handleInstallation } from "@/lib/github";
import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get("installation_id");
  const state = searchParams.get("state");

  if (!installationId || !state) {
    return NextResponse.redirect(
      new URL("/error?message=Missing installation data", request.url)
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.redirect(
      new URL(`/${state}/settings/general?error=Unauthorized`, request.url)
    );
  }

  try {
    const newIntegration = await handleInstallation(
      Number(installationId),
      session.user.id
    );

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
