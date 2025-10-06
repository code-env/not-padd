export type NotpaddContentType = "mdx" | "json" | "html";
export type NotpaddArticleType = "all" | "published" | "draft";

export type ConfigType =
  | ({
      publicKey: string;
      secretKey: string;
      outputDir: string;
      type: NotpaddContentType;
      all: true;
    } & { published?: never; draft?: never })
  | ({
      publicKey: string;
      secretKey: string;
      outputDir: string;
      type: NotpaddContentType;
      published: true;
    } & { all?: never; draft?: never })
  | ({
      publicKey: string;
      secretKey: string;
      outputDir: string;
      type: NotpaddContentType;
      draft: true;
    } & { all?: never; published?: never });

export type Options = {
  configPath: string;
};
