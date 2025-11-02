"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@notpadd/ui/components/button";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlocksProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  copyKey?: string;
  copyMessage?: string;
  secretKey?: boolean;
  disableCopy?: boolean;
}

const copyVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
};

export const CodeBlocks = ({
  code,
  language,
  showLineNumbers = true,
  copyKey,
  copyMessage,
  secretKey,
  disableCopy = false,
}: CodeBlocksProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (copyKey) {
      navigator.clipboard.writeText(copyKey);
      toast(copyMessage || "Copied to clipboard", {
        key: copyKey,
      });
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
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
        {secretKey && !showSecretKey
          ? code.replace(/([a-zA-Z0-9]{8,})/g, (match) =>
              "*".repeat(match.length)
            )
          : code}
      </SyntaxHighlighter>
      <div className="absolute right-2 top-2.5 flex items-center gap-2">
        {secretKey && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSecretKey(!showSecretKey)}
          >
            {" "}
            {showSecretKey ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopy}
          disabled={disableCopy}
        >
          <AnimatePresence initial={false} mode="wait">
            {isCopied ? (
              <motion.span
                variants={copyVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
                exit="hidden"
              >
                <Check className="size-4" />
              </motion.span>
            ) : (
              <motion.span
                variants={copyVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <Copy className="size-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </div>
  );
};
