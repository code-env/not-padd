import { env } from "@notpadd/env/server";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { db } from "@notpadd/db";
import { githubAppIntegration, user } from "@notpadd/db/schema";
import { auth } from "@notpadd/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

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

export const handleInstallation = async (installationId: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("User session not found");
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
      userId: session.user.id,
    })
    .returning();

  return newIntegration;
};
