"use client";

import { useEffect, useState } from "react";

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorContent,
  EditorInstance,
  EditorRoot,
  type JSONContent,
} from "novel";

import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { useDebouncedCallback } from "use-debounce";

import { defaultExtensions } from "@/components/editor/extensions";
import { useUploadFn } from "@/components/editor/image-upload";
import { ColorSelector } from "@/components/editor/selector/color";
import { LinkSelector } from "@/components/editor/selector/link";
import { NodeSelector } from "@/components/editor/selector/node";
import { TextButtons } from "@/components/editor/selector/text-button";
import { slashCommand } from "@/components/editor/slash-command";

import UploadImage from "@/components/modals/upload-image";
import { Separator } from "@notpadd/ui/components/separator";
import EditorMenu from "./menu";
import SlashCommands from "./slash-commands";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

interface EditorProps {
  initialValue?: JSONContent;
  onChange: (content: string) => void;
}

export default function Editor({ initialValue, onChange }: EditorProps) {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const uploadFn = useUploadFn();

  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem("novel-content", JSON.stringify(json));
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown()
      );
    },
    500
  );

  useEffect(() => {
    const content = window.localStorage.getItem("novel-content");
    if (content) setInitialContent(JSON.parse(content));
  }, []);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialContent ?? undefined}
          extensions={extensions}
          className="min-h-96 rounded-xl p-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            onChange(editor.getHTML());
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-full max-h-[330px] overflow-y-auto no-scrollbar rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <SlashCommands />
          </EditorCommand>

          <UploadImage />

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />

            <Separator orientation="vertical" />
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />

            <Separator orientation="vertical" />

            <Separator orientation="vertical" />
            <TextButtons />

            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
