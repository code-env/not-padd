"use client";

import { useEffect, useRef, useState } from "react";

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
import { Separator } from "@notpadd/ui/components/separator";
import { TextareaAutosize } from "@notpadd/ui/components/resizable-textarea";

import UploadImage from "@/components/modals/upload-image";
import EditorMenu from "./menu";
import SlashCommands from "./slash-commands";
import { QUERY_KEYS } from "@/lib/constants";
import { useArticleContext } from "@/contexts";
import { useArticleForm } from "@/contexts";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

const defaultValue = {
  type: "doc",
};

export default function Editor() {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const { articleId, localArticle, article } = useArticleContext();
  const editorRef = useRef<EditorInstance | null>(null);
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

  const form = useArticleForm();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editorRef.current?.commands.focus();
    }
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      window.localStorage.setItem(
        "html-content",
        highlightCodeblocks(editor.getHTML())
      );
      window.localStorage.setItem(
        `${QUERY_KEYS.ARTICLE_LOCAL_KEY}${articleId}`,
        JSON.stringify(json)
      );
      window.localStorage.setItem(
        "markdown",
        editor.storage.markdown.getMarkdown()
      );
    },
    500
  );

  useEffect(() => {
    if (localArticle !== undefined) {
      setInitialContent(JSON.parse(localArticle));
    } else if (article) {
      if (article.content && article.content !== "") {
        console.log("article.content", article.content);
        setInitialContent(JSON.parse(article.content));
      } else {
        setInitialContent(defaultValue);
      }
    }
  }, [article, localArticle]);

  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <EditorRoot>
        <div className="h-14 mb-4 flex items-center justify-between"></div>
        <TextareaAutosize
          id="title"
          placeholder="Article Title"
          {...form.register("title")}
          className="scrollbar-hide mb-2 w-full resize-none bg-transparent font-semibold prose-headings:font-semibold text-4xl focus:outline-hidden focus:ring-0 sm:px-4"
          onKeyDown={handleKeyDown}
        />
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
          onCreate={({ editor }) => {
            editorRef.current = editor;
          }}
          onUpdate={({ editor }) => {
            editorRef.current = editor;
            debouncedUpdates(editor);
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
