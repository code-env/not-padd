"use client";

import { createContext, useContext, useState } from "react";
import type { Articles } from "@notpadd/db/types";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { QUERY_KEYS } from "@/lib/constants";

interface ArticleContextType {
  articleId: string | undefined;
  isId: boolean;
  article: Articles | null;
  setArticle: (article: Articles | null) => void;
}

const ArticleContext = createContext<ArticleContextType>({
  articleId: "",
  isId: false,
  article: null,
  setArticle: (article: Articles | null) => {},
});

export const ArticleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const paths = pathname.split("/");
  const articleId = paths[3];
  const isId =
    paths[2] === "articles" &&
    !!articleId &&
    (articleId === "new" || !articleId.startsWith("new"));

  console.log({ isId });

  const { data: article } = useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, articleId],
    queryFn: () => ARTICLES_QUERIES.getArticleById(articleId ?? ""),
    enabled: isId,
  });

  const setArticle = (article: Articles | null) => {
    setArticle(article);
  };

  return (
    <ArticleContext.Provider
      value={{ articleId, isId, article: article ?? null, setArticle }}
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
