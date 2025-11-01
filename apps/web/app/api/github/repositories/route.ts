import { NextRequest, NextResponse } from "next/server";
import { getInstallationRepositories } from "@/lib/github";
import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get("installation_id");
  const search = searchParams.get("search") || "";
  const perPage = parseInt(searchParams.get("per_page") || "10", 10);

  if (!installationId) {
    return NextResponse.json(
      { error: "Installation ID is required", success: false },
      { status: 400 }
    );
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 }
    );
  }

  try {
    const result = await getInstallationRepositories(Number(installationId), {
      perPage,
      search: search || undefined,
    });

    return NextResponse.json({
      success: true,
      data: result.repositories,
      total: result.total,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch repositories",
        success: false,
      },
      { status: 500 }
    );
  }
};
