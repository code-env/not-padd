"use client";

import { useOrganizationContext } from "@/contexts";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { Button } from "@notpadd/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";
import React from "react";

export const ArticleSection = () => {
  const { activeOrganization } = useOrganizationContext();
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ARTICLES, activeOrganization?.id],
    queryFn: () =>
      ARTICLES_QUERIES.getArticles(activeOrganization?.id as string, {
        page: 1,
        limit: 10,
        search: "",
      }),
  });

  console.log(data);

  return (
    <div>
      <NoArticles />
    </div>
  );
};

const NoArticles = () => {
  return (
    <div className="h-[calc(100vh_-_150px)] flex flex-col items-center justify-center gap-4">
      <File className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground max-w-sm text-center">
        No articles found, Create one by clicking the button below
      </p>
      <Button>Create Article</Button>
    </div>
  );
};
