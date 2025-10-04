"use client";

import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import type { ArticleWithRelations } from "@/lib/types";
import type { Articles } from "@notpadd/db/types";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useOrganizationContext } from "./organization-context";

interface ArticleContextType {
  articleId: string | undefined;
  isId: boolean;
  article: ArticleWithRelations | undefined;
  setArticle: (article: ArticleWithRelations | undefined) => void;
  isLoading: boolean;
  isError: boolean;
  localArticle: Articles["content"] | undefined;
  setLocalArticle: (article: Articles["content"] | undefined) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

const ArticleContext = createContext<ArticleContextType>({
  articleId: "",
  isId: false,
  article: undefined,
  setArticle: (article: Articles | undefined) => {},
  isLoading: false,
  isError: false,
  localArticle: undefined,
  setLocalArticle: (article: Articles["content"] | undefined) => {},
  isDirty: false,
  setIsDirty: (isDirty: boolean) => {},
});

export const ArticleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const { activeOrganization } = useOrganizationContext();
  const paths = pathname.split("/");
  const articleId = paths[3];
  const isId =
    paths[2] === "articles" &&
    !!articleId &&
    !articleId.slice(0, 3).startsWith("new");

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, articleId],
    queryFn: () =>
      ARTICLES_QUERIES.getArticleById(
        activeOrganization?.id ?? "",
        articleId ?? ""
      ),
    enabled: isId,
  });

  const [articleState, setArticleState] = useState<Articles | undefined>(
    undefined
  );
  const [localArticle, setLocalArticle] = useState<
    Articles["content"] | undefined
  >(undefined);

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isId) {
      setArticleState(article);
    }
  }, [isId, article]);

  useEffect(() => {
    const localArticle = localStorage.getItem(
      `${QUERY_KEYS.ARTICLE_LOCAL_KEY}${articleId}`
    );
    if (localArticle) {
      setLocalArticle(localArticle);
      setIsDirty(true);
      return;
    }
  }, [articleId, articleState]);

  const setArticle = (value: Articles | undefined) => setArticleState(value);

  return (
    <ArticleContext.Provider
      value={{
        articleId,
        isId,
        article: articleState ?? article ?? undefined,
        setArticle,
        isLoading: isLoading,
        isError: isError,
        localArticle: localArticle,
        setLocalArticle: setLocalArticle,
        isDirty: isDirty,
        setIsDirty: setIsDirty,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleContext = () => {
  const context = useContext(ArticleContext);

  if (!context) {
    throw new Error("useArticleContext must be used within an ArticleProvider");
  }

  return context;
};
