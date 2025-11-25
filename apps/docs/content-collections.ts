import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeParseCodeBlocks } from "./shiki.mjs";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const docs = defineCollection({
  name: "docs",
  directory: "content",
  include: ["**/*.md", "**/*.mdx"],
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      rehypePlugins: [
        rehypeParseCodeBlocks,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ],
    });

    const regXHeader = /^(?:[\n\r]|)(#{1,6})\s+(.+)/gm;

    const headings = Array.from(document.content.matchAll(regXHeader)).map(
      (match) => {
        const flag = match[1];
        const content = match[2];
        return {
          level: flag?.length,
          text: content,
          slug: slugify(content ?? "#"),
        };
      }
    );

    return {
      ...document,
      headings,
      mdx,
    };
  },
});

export default defineConfig({
  collections: [docs],
}) as ReturnType<typeof defineConfig>;
