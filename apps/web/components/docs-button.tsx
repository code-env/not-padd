"use client";

import { Button } from "@notpadd/ui/components/button";
import { Book } from "lucide-react";

export const DocsButton = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        window.open("https://docs.notpadd.com", "_blank");
      }}
    >
      <Book className="size-4" />
      Docs
    </Button>
  );
};
