import type { Metadata } from "next";
import React from "react";
import Editor from "@/components/editor";

export const metadata: Metadata = {
  title: "Create New Article",
  description: "Create a new article",
};

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

const CreateNewArticle = () => {
  return <Editor initialValue={defaultValue} onChange={() => {}} />;
};

export default CreateNewArticle;
