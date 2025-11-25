import Mdx from "./mdx";

type MDXContentProps = {
  code: string;
};

export function MDXContent({ code }: MDXContentProps) {
  return <Mdx code={code} />;
}
