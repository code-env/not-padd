"use client";

import Editor from "@/components/editor";

export const defaultValue = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Type something...",
        },
      ],
    },
  ],
};

const CreateNewArticle = () => {
  return <Editor initialValue={defaultValue} onChange={() => {}} />;
};

export default CreateNewArticle;
