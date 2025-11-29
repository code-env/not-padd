import { NextRequest, NextResponse } from "next/server";
import { getRepositoryContents } from "@/lib/github";
import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";
import { getCache, setCache, cacheKeys } from "@notpadd/cache";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const installationId = searchParams.get("installation_id");
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const path = searchParams.get("path") || "";

  if (!installationId || !owner || !repo) {
    return NextResponse.json(
      {
        error: "Installation ID, owner, and repo are required",
        success: false,
      },
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
    const cacheKey = cacheKeys.githubContents(
      Number(installationId),
      owner,
      repo,
      path
    );
    const cached = await getCache<{
      success: boolean;
      data: unknown;
    }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const contents = await getRepositoryContents(
      Number(installationId),
      owner,
      repo,
      path
    );

    const response = {
      success: true,
      data: contents,
    };

    await setCache(cacheKey, response, 300);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch repository contents",
        success: false,
      },
      { status: 500 }
    );
  }
};
