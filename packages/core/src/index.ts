import { ConfigType, NotpaddArticleType, NotpaddContentType } from "@/types";
import { Articles } from "@notpadd/db/types";
import axios, { AxiosInstance } from "axios";
import fs from "fs";
import { BACKEND_SERVER, GITIGNORE_FILE } from "./constants";
import { generateContent } from "./generator";

export * from "./types";
export * from "./constants";
export * from "./generator";

/**
 * @description This file contains functions to fetch data from the Notpadd server and generate the necessary files for Notpadd.
 * @author Notpadd Team
 * @license MIT
 * @version 1.0.0
 */

export async function createNotpaddConfig(params: ConfigType) {
  let articles: Articles[] = [];
  if (params.all) {
    articles = await fetchNotpaddContentFromType(
      params.publicKey,
      params.secretKey,
      params.type,
      "all"
    );
  } else if (params.published) {
    articles = await fetchNotpaddContentFromType(
      params.publicKey,
      params.secretKey,
      params.type,
      "published"
    );
  } else if (params.draft) {
    articles = await fetchNotpaddContentFromType(
      params.publicKey,
      params.secretKey,
      params.type,
      "draft"
    );
  } else {
    throw new Error("Invalid type");
  }

  if (articles.length === 0) {
    throw new Error("No articles found");
  }

  generateContent(articles, params.type, params.outputDir);
  updateGitignore();
}

function updateGitignore() {
  if (fs.existsSync(GITIGNORE_FILE)) {
    const gitignoreContent = fs.readFileSync(GITIGNORE_FILE, "utf-8");

    if (!gitignoreContent.includes(".notpadd")) {
      fs.appendFileSync(GITIGNORE_FILE, "\n.notpadd/\n");
      console.log("✅ Updated .gitignore to exclude .notpadd/");
    }
  } else {
    fs.writeFileSync(GITIGNORE_FILE, ".notpadd/\n");
    console.log("✅ Created .gitignore and excluded .notpadd/");
  }
}

export const apiClient = (
  publicKey: string,
  secretKey: string
): AxiosInstance =>
  axios.create({
    baseURL: BACKEND_SERVER,
    headers: {
      "Content-Type": "application/json",
      "Notpadd-Public-Key": publicKey,
      "Notpadd-Secret-Key": secretKey,
    },
    withCredentials: true,
  });

const fetchNotpaddContentFromType = async (
  publicKey: string,
  secretKey: string,
  type: NotpaddContentType,
  query: NotpaddArticleType
): Promise<Articles[]> => {
  const response = await apiClient(publicKey, secretKey).get(
    `/articles?type=${type}&query=${query}`
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  if (response.data.data.length === 0) {
    return [];
  }
  return response.data;
};
