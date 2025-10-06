import { ConfigType, NotpaddArticleType, NotpaddContentType } from "@/types";
import { Articles } from "@notpadd/db/types";
import axios, { AxiosInstance } from "axios";
import fs from "fs";
import { BACKEND_SERVER, GITIGNORE_FILE } from "./constants";
import { generateContent } from "./generator";

export * from "./types";
export * from "./constants";

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
      params.organizationId,
      params.type,
      "all"
    );
  } else if (params.published) {
    articles = await fetchNotpaddContentFromType(
      params.publicKey,
      params.secretKey,
      params.organizationId,
      params.type,
      "published"
    );
  } else if (params.draft) {
    articles = await fetchNotpaddContentFromType(
      params.publicKey,
      params.secretKey,
      params.organizationId,
      params.type,
      "draft"
    );
  } else {
    throw new Error("Invalid type");
  }

  if (articles.length === 0) {
    console.log("No articles found");
    return;
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

const apiClient = (publicKey: string, secretKey: string): AxiosInstance =>
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
  organizationId: string,
  type: NotpaddContentType,
  query: NotpaddArticleType = "all"
) => {
  try {
    const response = await apiClient(publicKey, secretKey).get(
      `/articles?type=${type}&query=${query}&organizationId=${organizationId}`
    );
    if (response.data.articles.length === 0) {
      return [];
    }
    return response.data.articles;
  } catch (error: any) {
    if (error.response.data.error) {
      console.log(error.response.data.error);
      throw new Error();
    }
    throw new Error(JSON.stringify(error));
  }
};
