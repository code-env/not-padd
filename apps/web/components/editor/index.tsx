"use client";

import { EditorContent, EditorRoot, type JSONContent } from "novel";
import { useState } from "react";
import { defaultExtensions } from "./extensions";
import { NodeSelector } from "./selector/node";
import { ColorSelector } from "./selector/color";
import { TextButtons } from "./selector/text-button";

const Editor = () => {
  const [content, setContent] = useState<JSONContent>();
  const extensions = [...defaultExtensions];

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          setContent(json);
        }}
      >
        <NodeSelector open={true} onOpenChange={() => {}} />
        <ColorSelector
          isOpen={true}
          setIsOpen={() => {}}
          open={true}
          onOpenChange={() => {}}
        />
        <TextButtons />
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;
