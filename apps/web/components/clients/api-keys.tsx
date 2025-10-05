"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { KEYS_QUERIES } from "@/lib/queries";
import { useOrganizationContext } from "@/contexts";
import { Keys } from "@/components/loading-uis";
import { KeySquare } from "lucide-react";
import useModal from "@/hooks/use-modal";
import { Button } from "@notpadd/ui/components/button";
import { CodeBlocks } from "./code-blocks";
import type { Key } from "@notpadd/db/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@notpadd/ui/components/card";

export const ApiKeys = () => {
  const { activeOrganization } = useOrganizationContext();
  const [selectedKey, setSelectedKey] = useState<Key | undefined>(undefined);
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.KEYS, activeOrganization?.id],
    queryFn: () =>
      KEYS_QUERIES.getKeys(activeOrganization?.id as string, {
        page: 1,
        limit: 10,
        search: "",
      }),
  });

  useEffect(() => {
    if (isLoading) return;

    if (data?.data && data?.data.length > 0) {
      setSelectedKey(data?.data[0]);
    }
  }, [selectedKey, isLoading, data]);

  if (isLoading) {
    return <Keys count={10} />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data?.data.length === 0 || !selectedKey) return <NoKeys />;

  const codeSnippet = `import { createNotpaddConfig } from "notpadd";

export const notpadd = async () =>
  await createNotpaddConfig({
    publicKey: process.env.NOTPADD_PUBLIC_KEY,
    secreteKey: process.env.NOTPADD_SECRET_KEY,
    outputDir: "content", // your output directory
    publishOnly: true,
    type: "mdx", || "json" || "html" // your output type if none provided, it will default to mdx
  });
`;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Publishable Key</CardTitle>
            <CardDescription>Safe to use in client-side code</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-none">
            <CodeBlocks
              code={selectedKey.pk}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Secret Key</CardTitle>
            <CardDescription>
              Keep this private and secure on for usage only in your
              organization/workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-none">
            <CodeBlocks
              code={selectedKey.sk}
              language="bash"
              showLineNumbers={false}
            />
          </CardContent>
        </Card>
      </div>
      <CodeBlocks
        code={codeSnippet}
        language="typescript"
        showLineNumbers={false}
      />
    </div>
  );
};

const NoKeys = () => {
  const { onOpen } = useModal();
  return (
    <div className="h-[calc(100vh_-_150px)] flex flex-col items-center justify-center gap-4">
      <KeySquare className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground max-w-sm text-center">
        No api keys found, Create one by clicking the button below
      </p>
      <Button onClick={() => onOpen("create-key")}>Create Key</Button>
    </div>
  );
};
