import fs from "node:fs/promises";
import path from "node:path";
import { NotpaddConfig } from "./config";
import type { NotpaddAuthorSchema } from "./schemas";

const BACKEND_SERVER = "https://api.notpadd.com/api/v1";

export interface NotpaddData {
  slug: string;
  title: string;
  description: string;
  published: boolean | null;
  markdown: string;
  createdAt: string;
  updatedAt: string;
  image: string | null;
  imageBlurhash: string | null;
  authors: NotpaddAuthorSchema[];
  tags: string[] | null;
}

export interface NotpaddApiResponse {
  data: NotpaddData[];
  success: boolean;
  message?: string;
}

export class NotpaddError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "NotpaddError";
  }
}

export async function fetchNotpaddData(
  config: NotpaddConfig
): Promise<NotpaddData[]> {
  const { sk, pk, orgID, query } = config;

  try {
    const response = await fetch(
      `${BACKEND_SERVER}/articles?type=mdx&organizationId=${orgID}&query=${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Notpadd-Public-Key": pk,
          "Notpadd-Secret-Key": sk,
        },
      }
    );

    if (!response.ok) {
      throw new NotpaddError(
        `Failed to fetch data from Notpadd API: ${response.statusText}`,
        response.status
      );
    }

    const data: { message: string; articles: NotpaddData[] } =
      (await response.json()) as { message: string; articles: NotpaddData[] };

    if (!Array.isArray(data.articles)) {
      throw new NotpaddError(
        "Invalid response from Notpadd API: articles is not an array"
      );
    }

    if (data.articles.length === 0) {
      console.log("You have no articles in your Notpadd organization");
      return [];
    }

    return data.articles;
  } catch (error) {
    if (error instanceof NotpaddError) {
      throw error;
    }
    throw new NotpaddError(
      `Network error while fetching Notpadd data: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function generateMdxFiles(
  data: NotpaddData[],
  outputDirectory: string,
  baseDirectory: string
): Promise<void> {
  const notpaddDir = path.join(baseDirectory, outputDirectory);

  await fs.mkdir(notpaddDir, { recursive: true });

  const newSlugs = new Set(
    data.map(
      (item) =>
        item.slug ||
        item.title?.toLowerCase().replace(/\s+/g, "-") ||
        "untitled"
    )
  );

  try {
    const existingFiles = await fs.readdir(notpaddDir);
    const filesToRemove: string[] = [];

    for (const file of existingFiles) {
      if (file.endsWith(".mdx")) {
        const slug = file.replace(/\.mdx$/, "");
        if (!newSlugs.has(slug)) {
          filesToRemove.push(path.join(notpaddDir, file));
        }
      }
    }

    if (filesToRemove.length > 0) {
      await Promise.all(filesToRemove.map((filePath) => fs.unlink(filePath)));
      console.log(
        `Removed ${filesToRemove.length} outdated file(s) from ${outputDirectory}/`
      );
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn(`Could not read directory ${notpaddDir}:`, error);
    }
  }

  const mdxPromises = data.map(async (item) => {
    const fileName = `${item.slug || item.title?.toLowerCase().replace(/\s+/g, "-") || "untitled"}.mdx`;
    const filePath = path.join(notpaddDir, fileName);

    const mdxContent = `---
title: "${item.title || "Untitled"}"
slug: "${item.slug || ""}"
description: "${item.description || ""}"
published: ${item.published || false}
createdAt: "${item.createdAt || ""}"
updatedAt: "${item.updatedAt || ""}"
image: "${item.image || ""}"
imageBlurhash: "${item.imageBlurhash || ""}"
authors: ${item.authors && item.authors.length > 0 ? JSON.stringify(item.authors) : "[]"}
tags: ${item.tags ? JSON.stringify(item.tags) : "null"}
---

${item.markdown || ""}
`;

    await fs.writeFile(filePath, mdxContent, "utf-8");
    return filePath;
  });

  await Promise.all(mdxPromises);
}

export function validateNotpaddConfig(config: NotpaddConfig): void {
  if (!config.sk || typeof config.sk !== "string") {
    throw new NotpaddError(
      "Notpadd configuration requires a valid 'sk' (secret key)"
    );
  }

  if (!config.pk || typeof config.pk !== "string") {
    throw new NotpaddError(
      "Notpadd configuration requires a valid 'pk' (public key)"
    );
  }

  if (!config.orgID || typeof config.orgID !== "string") {
    throw new NotpaddError(
      "Notpadd configuration requires a valid 'orgID' (organization ID)"
    );
  }

  if (config.directory && typeof config.directory !== "string") {
    throw new NotpaddError("Notpadd 'directory' must be a string if provided");
  }
}

export async function processNotpaddData(
  config: NotpaddConfig,
  baseDirectory: string
): Promise<void> {
  if (!config) {
    return;
  }

  validateNotpaddConfig(config);

  const { directory = "notpadd" } = config;

  try {
    const data = await fetchNotpaddData(config);

    if (data.length === 0) {
      console.log("No data received from Notpadd API");
      return;
    }

    await generateMdxFiles(data, directory, baseDirectory);

    console.log(
      `Successfully generated ${data.length} MDX files from Notpadd data in ${directory}/`
    );
  } catch (error) {
    console.error("Error processing Notpadd data:", error);
    throw error;
  }
}
