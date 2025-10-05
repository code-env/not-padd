"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlocksProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export const CodeBlocks = ({
  code,
  language,
  showLineNumbers = true,
}: CodeBlocksProps) => {
  return (
    <div className="code-block relative">
      <SyntaxHighlighter
        language={language}
        style={dracula}
        customStyle={{
          borderRadius: "0px",
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
