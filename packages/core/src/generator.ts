import { Articles } from "@notpadd/db/types";
import { NOTPADD_DIR, ensureDirectoryExists } from "./constants";
import { NotpaddArticle, NotpaddContentType } from "./types";

import fs from "fs";
import path from "path";

export const generateContent = (
  articles: Articles[],
  type: NotpaddContentType,
  outputDir: string
) => {
  switch (type) {
    case "mdx":
      articles.forEach((article) => generateMdx("mdx", article, outputDir));
      return;
    case "json":
      return generateJson(articles, outputDir);
    case "html":
      return generateHtml(articles, outputDir);
  }
};

export const generateMdx = (
  type: NotpaddArticle["type"],
  article: Articles,
  outputDir: string
) => {
  ensureDirectoryExists(NOTPADD_DIR);
  ensureDirectoryExists(outputDir);
  if (type !== "mdx") {
    throw new Error("Type must be mdx");
  }
  const fileName = `${article.slug.toLowerCase()}.mdx`;
  const filePath = path.join(outputDir, fileName);
  const content = `${returnFrontMatter(article)}\n\n${article.markdown}`;
  const exists = fs.existsSync(filePath);
  fs.writeFileSync(filePath, content, "utf-8");
  if (!exists) {
  } else {
  }
};

const returnFrontMatter = (article: NotpaddArticle["data"]) => {
  return `---
  title: ${article.title}
  description: ${article.description}
  published: ${article.published}
  publishedAt: ${article.publishedAt}
  createdAt: ${article.createdAt}
  updatedAt: ${article.updatedAt}
  slug: ${article.slug}
  image: ${article.image}
  ---`;
};

export const generateJson = (
  articles: NotpaddArticle["data"][],
  outputDir: string
) => {
  ensureDirectoryExists(outputDir);
  const filePath = path.join(outputDir, "allContent.json");
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
};

export const generateHtml = (
  articles: NotpaddArticle["data"][],
  outputDir: string
) => {
  ensureDirectoryExists(outputDir);
  const filePath = path.join(outputDir, "allContent.html");
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
};
