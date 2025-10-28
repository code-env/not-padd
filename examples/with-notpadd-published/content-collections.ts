import { defineCollection, defineConfig } from "notpadd-core";

import { rehypeParseCodeBlocks } from "./shiki.mjs";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "notpadd",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string(),
  }),
  transform: async (post, ctx) => {
    const mdx = await compileMDX(ctx, post, {
      rehypePlugins: [rehypeParseCodeBlocks],
    });
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
  },
});
