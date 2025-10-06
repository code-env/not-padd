import { Articles } from "@notpadd/db/types";

export type NotpaddContentType = "mdx" | "json" | "html";
export type NotpaddArticleType = "all" | "published" | "draft";

export type ConfigType =
  | ({
      publicKey: string;
      secretKey: string;
      organizationId: string;
      outputDir: string;
      type: NotpaddContentType;
      all: true;
    } & { published?: never; draft?: never })
  | ({
      publicKey: string;
      secretKey: string;
      organizationId: string;
      outputDir: string;
      type: NotpaddContentType;
      published: true;
    } & { all?: never; draft?: never })
  | ({
      publicKey: string;
      secretKey: string;
      organizationId: string;
      outputDir: string;
      type: NotpaddContentType;
      draft: true;
    } & { all?: never; published?: never });

export type Options = {
  configPath: string;
};

export type NotpaddMarkdownArticle = Omit<
  Articles,
  "json" | "html" | "content" | "organizationId"
>;
export type NotpaddHtmlArticle = Omit<
  Articles,
  "json" | "content" | "organizationId" | "markdown"
>;

export type NotpaddJsonArticle = Omit<
  Articles,
  "html" | "content" | "organizationId" | "markdown"
>;

export type NotpaddArticle = {
  type: NotpaddContentType;
} & (
  | { type: "mdx"; data: NotpaddMarkdownArticle }
  | { type: "html"; data: NotpaddHtmlArticle }
  | { type: "json"; data: NotpaddJsonArticle }
);
