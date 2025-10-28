import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type CodeProps = {
  code: string;
};

export async function Code({ code }: CodeProps) {
  const highlightedCode = await highlightCode(code);
  return (
    <div className="border border-gray-200 rounded-md">
      <div className="relative py-4 bg-background w-full  rounded-md antialiased overflow-x-auto">
        <section
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
        />
      </div>
    </div>
  );
}

async function highlightCode(code: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "vitesse-light",
    })
    .use(rehypeStringify)
    .process(code);

  return String(file);
}
