import { ArticleSection } from "@/components/clients";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles",
};

const ArticlesPage = () => {
  return <ArticleSection />;
};

export default ArticlesPage;
