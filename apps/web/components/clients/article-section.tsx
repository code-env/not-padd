"use client";

import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { Button } from "@notpadd/ui/components/button";
import { Input } from "@notpadd/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import { File } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

export const ArticleSection = () => {
  const { activeOrganization } = useOrganizationContext();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ARTICLES, activeOrganization?.id],
    queryFn: () =>
      ARTICLES_QUERIES.getArticles(activeOrganization?.id as string, {
        page: 1,
        limit: 10,
        search: "",
      }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data?.data.length === 0) return <NoArticles />;

  return (
    <div className="flex flex-col gap-10">
      <ArticleHeader
        disabled={data?.data.length === 0 || isLoading}
        onSearch={setSearch}
      />
    </div>
  );
};

interface ArticleHeaderProps {
  disabled: boolean;
  onSearch: Dispatch<SetStateAction<string>>;
}

const ArticleHeader = ({ disabled, onSearch }: ArticleHeaderProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Search"
        className="w-full max-w-sm bg-sidebar/50"
        disabled={disabled}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button disabled={disabled} onClick={() => onOpen("create-article")}>
        Create Article
      </Button>
    </div>
  );
};

const NoArticles = () => {
  const { onOpen } = useModal();
  return (
    <div className="h-[calc(100vh_-_150px)] flex flex-col items-center justify-center gap-4">
      <File className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground max-w-sm text-center">
        No articles found, Create one by clicking the button below
      </p>
      <Button onClick={() => onOpen("create-article")}>Create Article</Button>
    </div>
  );
};
