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
    return <Keys count={3} />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data?.data.length === 0 || !selectedKey) return <NoKeys />;

  const items = [
    {
      title: "Organization ID",
      description: "The organization ID to use in the notpadd config",
      code: activeOrganization?.id || "",
    },
    {
      title: "Secret Key",
      description:
        "Keep this private and secure on for usage only in your organization/workspace",
      code: selectedKey.sk,
    },
    {
      title: "Publishable Key",
      description: "Safe to use in client-side code",
      code: selectedKey.pk,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <Card key={item.title + item.code}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-none">
              <CodeBlocks
                code={item.code}
                language="bash"
                secretKey={item.title === "Secret Key"}
                showLineNumbers={false}
                copyKey={item.code}
                copyMessage={`${item.title} copied to clipboard`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
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
