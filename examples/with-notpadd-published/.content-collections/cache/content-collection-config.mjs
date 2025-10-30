// content-collections.ts
import { defineCollection, defineConfig } from "notpadd-core";

// shiki.mjs
import { visit } from "unist-util-visit";
function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, "element", (node, _nodeIndex, parentNode) => {
      if (node.tagName === "code" && node.properties?.className) {
        const language = node.properties.className[0]?.replace(/^language-/, "") || "text";
        const metastring = node.data?.meta || "";
        let title = null;
        if (metastring) {
          const excludeMatch = metastring.match(/\s+\/([^/]+)\//);
          if (excludeMatch) {
            const cleanMetastring = metastring.replace(excludeMatch[0], "");
            const titleMatch = cleanMetastring.match(/^([^{]+)/);
            if (titleMatch) {
              title = titleMatch[1].trim();
            }
          } else {
            const titleMatch = metastring.match(/^([^{]+)/);
            if (titleMatch) {
              title = titleMatch[1].trim();
            }
          }
        }
        parentNode.properties = parentNode.properties || {};
        parentNode.properties.language = language;
        parentNode.properties.title = title;
        parentNode.properties.meta = metastring;
        const codeContent = node.children[0]?.value || "";
        parentNode.properties.code = [
          "```" + language + (metastring ? " " + metastring : ""),
          codeContent.trimEnd(),
          "```"
        ].join("\n");
      }
    });
  };
}

// content-collections.ts
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
var posts = defineCollection({
  name: "posts",
  directory: "notpadd",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string()
  }),
  transform: async (post, ctx) => {
    const mdx = await compileMDX(ctx, post, {
      rehypePlugins: [rehypeParseCodeBlocks]
    });
    return {
      ...post,
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [posts],
  notpadd: {
    sk: "sk_5cK6E7pgXg8NdX9aoxPHMhuS",
    pk: "pk_IVBO4SqHQrRAKsz72PFhvqS7",
    orgID: "aclVCryKWOYY3P32px6gKBXmQHLeaEbe"
  }
});
export {
  content_collections_default as default
};
