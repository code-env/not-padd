import type { Metadata } from "next";
import React from "react";
import Editor from "@/components/editor";

export const metadata: Metadata = {
  title: "Create New Article",
  description: "Create a new article",
};

const CreateNewArticle = () => {
  return <Editor />;
};

export default CreateNewArticle;
