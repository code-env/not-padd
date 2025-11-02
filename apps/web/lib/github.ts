import { db } from "@notpadd/db";
import { githubAppIntegration } from "@notpadd/db/schema";
import { env } from "@notpadd/env/server";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";

const NOTPADD_GITHUB_REBUILD_PATH = ".notpadd/rebuild.json";

function formatPrivateKey(key: string): string {
  if (!key) {
    throw new Error("GITHUB_APP_PRIVATE_KEY is not set");
  }

  if (!key.includes("BEGIN")) {
    try {
      key = Buffer.from(key, "base64").toString("utf-8");
    } catch {}
  }

  key = key.replace(/\\n/g, "\n");

  if (key.includes("BEGIN") && key.includes("END")) {
    return key.trim();
  }

  const originalKey = key;
  const cleanKey = key
    .replace(/-----BEGIN [A-Z ]+PRIVATE KEY-----/g, "")
    .replace(/-----END [A-Z ]+PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (!cleanKey) {
    throw new Error("Invalid private key format");
  }

  const isRSAFormat = originalKey.includes("RSA PRIVATE KEY");

  const header = isRSAFormat
    ? "-----BEGIN RSA PRIVATE KEY-----"
    : "-----BEGIN PRIVATE KEY-----";
  const footer = isRSAFormat
    ? "-----END RSA PRIVATE KEY-----"
    : "-----END PRIVATE KEY-----";

  const lines = cleanKey.match(/.{1,64}/g) || [];

  return [header, ...lines, footer].join("\n");
}

export function createOctokit(installationId?: number) {
  const privateKey = formatPrivateKey(env.GITHUB_APP_PRIVATE_KEY);

  return new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: env.GITHUB_APP_ID,
      privateKey: privateKey,
      ...(installationId && { installationId }),
    },
  });
}

export const handleInstallation = async (
  installationId: number,
  userId: string
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const octokit = createOctokit(installationId);

  try {
    await octokit.apps.getInstallation({
      installation_id: installationId,
    });
  } catch (error: any) {
    throw new Error(`Failed to verify GitHub installation: ${error.message}`);
  }

  const existingIntegration = await db
    .select({ id: githubAppIntegration.id })
    .from(githubAppIntegration)
    .where(eq(githubAppIntegration.installationId, String(installationId)))
    .limit(1);

  if (existingIntegration && existingIntegration[0]) {
    throw new Error("GitHub integration already exists");
  }

  const [newIntegration] = await db
    .insert(githubAppIntegration)
    .values({
      id: crypto.randomUUID(),
      installationId: String(installationId),
      userId: userId,
    })
    .returning();

  return newIntegration;
};

export async function getInstallationRepositories(
  installationId: number,
  options?: { perPage?: number; search?: string }
): Promise<{ repositories: any[]; total: number }> {
  const octokit = createOctokit(installationId);
  const perPage = options?.perPage || 10;
  const search = options?.search?.trim();

  if (search) {
    try {
      const installation = await octokit.apps.getInstallation({
        installation_id: installationId,
      });

      const account = installation.data.account;
      if (!account) {
        throw new Error("Unable to determine installation account");
      }

      let accountLogin: string;
      let accountQualifier: string;

      if ("login" in account && account.login) {
        accountLogin = account.login;
        accountQualifier = `user:${accountLogin}`;
      } else if ("slug" in account && account.slug) {
        accountLogin = account.slug;
        accountQualifier = `org:${accountLogin}`;
      } else {
        throw new Error("Unable to determine account login or slug");
      }

      const query = `${search} in:name ${accountQualifier} fork:true`;

      console.log({ query });

      const { data } = await octokit.search.repos({
        q: query,
        per_page: perPage,
        sort: "updated",
        order: "desc",
      });

      console.log({ data });

      const accessibleRepos = await octokit.paginate(
        octokit.apps.listReposAccessibleToInstallation,
        {
          installation_id: installationId,
        }
      );

      const accessibleRepoFullNames = new Set(
        accessibleRepos.map((repo) => repo.full_name)
      );

      const filteredRepos = data.items.filter((repo) =>
        accessibleRepoFullNames.has(repo.full_name)
      );

      filteredRepos.sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateB - dateA;
      });

      return {
        repositories: filteredRepos.slice(0, perPage),
        total: filteredRepos.length,
      };
    } catch (error: any) {
      console.error("GitHub search API error:", error);
      throw new Error(
        `Search failed: ${error.message || "Unable to search repositories"}`
      );
    }
  }

  const response = await octokit.apps.listReposAccessibleToInstallation({
    installation_id: installationId,
    per_page: perPage,
  });

  let repositories = response.data.repositories;

  if (search) {
    const searchLower = search.toLowerCase();
    repositories = repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(searchLower) ||
        repo.full_name.toLowerCase().includes(searchLower) ||
        repo.description?.toLowerCase().includes(searchLower)
    );
  }

  repositories.sort((a, b) => {
    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return dateB - dateA;
  });

  return {
    repositories,
    total: response.data.total_count || repositories.length,
  };
}

export async function getRepositoryContents(
  installationId: number,
  owner: string,
  repo: string,
  path: string = ""
): Promise<Array<{ name: string; type: "dir" | "file"; path: string }>> {
  const octokit = createOctokit(installationId);

  console.log({
    installationId,
    owner,
    repo,
    path,
  });

  const normalizedPath = path.replace(/^\/+/, "").replace(/\/+$/, "").trim();

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    if (Array.isArray(data)) {
      return data
        .filter((item) => item.type === "dir")
        .map((item) => ({
          name: item.name,
          type: item.type as "dir" | "file",
          path: item.path,
        }));
    }

    return [];
  } catch (error: any) {
    console.error("Failed to fetch repository contents:", {
      error,
      owner,
      repo,
      path: normalizedPath,
      originalPath: path,
      status: error.status,
      message: error.message,
    });

    const errorMessage = error.message || "Unknown error";
    const status = error.status;

    if (status === 404) {
      throw new Error(
        `Path "${normalizedPath || "root"}" not found in repository ${owner}/${repo}. Please verify the path exists.`
      );
    }

    if (status === 403) {
      throw new Error(
        `Access denied to repository ${owner}/${repo}. Please check installation permissions.`
      );
    }

    throw new Error(`Failed to fetch repository contents: ${errorMessage}`);
  }
}

export async function publishArticle(
  installationId: number,
  owner: string,
  repo: string,
  path: string,
  slug: string,
  by: string
): Promise<boolean> {
  const octokit = createOctokit(installationId);
  const normalizedPath = path.replace(/^\/+/, "").replace(/\/+$/, "").trim();
  const newPath = normalizedPath
    ? `${normalizedPath}/${NOTPADD_GITHUB_REBUILD_PATH}`
    : NOTPADD_GITHUB_REBUILD_PATH;
  let sha: string | undefined;
  let data: { slug: string; updatedAt: string }[] = [];

  try {
    const res = await octokit.repos.getContent({ owner, repo, path: newPath });
    const file = res.data as any;

    sha = file.sha;
    const decoded = Buffer.from(file.content, "base64").toString("utf8");
    data = JSON.parse(decoded);
  } catch (error: any) {
    if (error.status !== 404) throw error;
    data = [];
    sha = undefined;
  }

  const existingEntry = data.find(
    (entry: { slug: string }) => entry.slug === slug
  );

  const now = new Date().toISOString();

  if (existingEntry) {
    existingEntry.updatedAt = now;
  } else {
    data.push({ slug, updatedAt: now });
  }

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  try {
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: newPath,
      message: `Update rebuild list for ${slug} on ${now} by ${by} [Notpadd]`,
      content,
      sha,
    });
  } catch (error: any) {
    console.error("Failed to create or update file contents:", {
      error,
      owner,
      repo,
      path: newPath,
    });
    throw new Error(
      `Failed to create or update file contents: ${error.message}`
    );
  }

  return true;
}
