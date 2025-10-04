"use client";

import type { Articles } from "@notpadd/db/types";

const ArticleClient = ({ article }: { article: Articles }) => {
  console.log(article);
  return <div>ArticleClient</div>;
};

export default ArticleClient;
