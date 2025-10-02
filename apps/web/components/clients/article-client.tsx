"use client";

import React from "react";

import type { Articles } from "@notpadd/db/types";
import { useArticleContext } from "@/contexts";

const ArticleClient = ({ article }: { article: Articles }) => {
  const {
    articleId,
    isId,
    article: articleState,
    setArticle,
  } = useArticleContext();

  return <div>ArticleClient</div>;
};

export default ArticleClient;
