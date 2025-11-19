import {
  defineCollection,
  defineConfig,
  notpaddSchemaOptional,
} from "notpadd-core";

import { compileMDX } from "@content-collections/mdx";
import { rehypeParseCodeBlocks } from "./shiki.mjs";

const posts = defineCollection({
  name: "posts",
  directory: "notpadd",
  include: "**/*.mdx",
  schema: notpaddSchemaOptional,
  transform: async (post, ctx) => {
    const content = post.content.replace(
      /(!\[.*?\]\(.*?\))\s*```/g,
      "$1\n\n```"
    );

    const mdx = await compileMDX(
      ctx,
      { ...post, content },
      {
        rehypePlugins: [rehypeParseCodeBlocks],
      }
    );
    return {
      ...post,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [posts],
  notpadd: {
    sk: "sk_moPAFG7fKmMoZIz0duW43dXH",
    pk: "pk_QpwKIDbySr1VLRNomGna2Zgy",
    orgID: "YpJ3jpNRTK0etehQYdEu0ozlZzmtOlr0",
    query: "published",
  },
});
