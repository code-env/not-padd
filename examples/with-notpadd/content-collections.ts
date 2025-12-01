import {
  defineCollection,
  defineConfig,
  notpaddSchemaOptional,
} from "notpadd-core";

import { compileMDX } from "notpadd-mdx";
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
    sk: "sk_TqyuOYS84ZpUjup2ecxOf3WT",
    pk: "pk_xdenOc15LgVopojck2UyxoHq",
    orgID: "g0nkLQy8wBYndPGkW5IE0hzWJD6P9Ecp",
    query: "all",
  },
});
