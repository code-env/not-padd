import { Articles } from "@notpadd/db/types";
import { NOTPADD_DIR, ensureDirectoryExists } from "./constants";
import { NotpaddContentType } from "./types";

import fs from "fs";
import path from "path";

export const generateContent = (
  articles: Articles[],
  type: NotpaddContentType,
  outputDir: string
) => {
  switch (type) {
    case "mdx":
      return generateMdx(articles, outputDir);
    case "json":
      return generateJson(articles, outputDir);
    case "html":
      return generateHtml(articles, outputDir);
  }
};

export const generateMdx = (articles: Articles[], outputDir: string) => {
  ensureDirectoryExists(NOTPADD_DIR);
  articles.forEach((article) => {
    const fileName = `${article.slug.toLowerCase()}.mdx`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(
      filePath,
      `${returnFrontMatter(article)}\n\n${article.markdown}`,
      "utf-8"
    );
  });
};

const returnFrontMatter = (article: Articles) => {
  return `---
  title: ${article.title} \n
  description: ${article.description} \n
  published: ${article.published} \n
  publishedAt: ${article.publishedAt} \n
  createdAt: ${article.createdAt} \n
  updatedAt: ${article.updatedAt} \n
  slug: ${article.slug} \n
  image: ${article.image} \n
  ---`;
};

export const generateJson = (articles: Articles[], outputDir: string) => {
  const filePath = path.join(outputDir, "allContent.json");
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
};

export const generateHtml = (articles: Articles[], outputDir: string) => {
  const filePath = path.join(outputDir, "allContent.html");
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), "utf-8");
};
