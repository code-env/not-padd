import { visit } from "unist-util-visit";

export function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, "element", (node, _nodeIndex, parentNode) => {
      if (
        node.tagName === "code" &&
        parentNode?.tagName === "pre" &&
        node.properties?.className
      ) {
        const className = node.properties.className;
        const languageClass = Array.isArray(className)
          ? className[0]
          : typeof className === "string"
            ? className.split(" ")[0]
            : "";
        const language = languageClass?.replace(/^language-/, "") || "text";
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

        let codeContent = "";
        if (node.children && Array.isArray(node.children)) {
          codeContent = node.children
            .map((child) => {
              if (child.type === "text") {
                return child.value || "";
              }
              return "";
            })
            .join("");
        }

        parentNode.properties = parentNode.properties || {};

        parentNode.properties.language = language;
        parentNode.properties.title = title;
        parentNode.properties.meta = metastring;

        parentNode.properties.code = [
          "```" + language + (metastring ? " " + metastring : ""),
          codeContent.trimEnd(),
          "```",
        ].join("\n");
      }
    });
  };
}
