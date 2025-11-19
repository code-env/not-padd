"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type CodeProps = {
  code: string;
};

export function Code({ code }: CodeProps) {
  const { theme, resolvedTheme } = useTheme();
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    const currentTheme = resolvedTheme || theme || "light";
    const codeTheme =
      currentTheme === "dark" ? "vitesse-black" : "vitesse-light";

    const highlightCode = async () => {
      const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
          theme: codeTheme,
        })
        .use(rehypeStringify)
        .process(code);

      setHighlightedCode(String(file));
    };

    highlightCode();
  }, [code, theme, resolvedTheme]);

  return (
    <div className="border border-border rounded-md overflow-x-auto no-scrollbar bg-background">
      <div className="relative py-4 w-full rounded-md antialiased">
        <section
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
        />
      </div>
    </div>
  );
}
