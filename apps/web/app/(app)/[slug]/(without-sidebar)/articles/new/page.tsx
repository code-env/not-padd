"use client";

import Editor from "@/components/editor";

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
