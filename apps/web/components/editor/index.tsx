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
import { TextareaAutosize } from "@notpadd/ui/components/resizable-textarea";
import { Separator } from "@notpadd/ui/components/separator";

import UploadImage from "@/components/modals/upload-image";
import {
  useArticleContext,
  useArticleForm,
  useOrganizationContext,
} from "@/contexts";
import { Button } from "@notpadd/ui/components/button";
import { SidebarTrigger } from "@notpadd/ui/components/sidebar";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import EditorMenu from "./menu";
import SlashCommands from "./slash-commands";

import {
  getLocalStorageKey,
  getStoredContent,
  highlightCodeblocks,
} from "@/lib/localstorage";

const extensions = [...defaultExtensions, slashCommand];

const defaultValue = {
  type: "doc",
};

export default function Editor() {
  const [initialContent, setInitialContent] = useState<null | JSONContent>(
    null
  );
  const router = useRouter();
  const { articleId, localArticle, article, isLoading, setIsDirty, isDirty } =
    useArticleContext();
  const { activeOrganization } = useOrganizationContext();
  const editorRef = useRef<EditorInstance | null>(null);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const uploadFn = useUploadFn();

  const form = useArticleForm();

  const setFormValue = (
    field: "json" | "markdown" | "content",
    value: string
  ) => {
    form.setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const updateFormFromEditor = (editor: EditorInstance) => {
    const json = editor.getJSON();
    const html = editor.getHTML();
    const markdown = editor.storage.markdown.getMarkdown();

    setFormValue("json", JSON.stringify(json));
    setFormValue("markdown", markdown);
    setFormValue("content", highlightCodeblocks(html));
  };

  const updateFormFromLocalStorage = () => {
    const localJson = JSON.parse(localArticle ?? "{}");

    setFormValue("json", JSON.stringify(localJson));
    setFormValue(
      "markdown",
      getStoredContent("-markdown", false, articleId as string)
    );
    setFormValue(
      "content",
      getStoredContent("-html-content", true, articleId as string)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      editorRef.current?.commands.focus();
    }
  };

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      const html = editor.getHTML();
      const markdown = editor.storage.markdown.getMarkdown();

      window.localStorage.setItem(
        getLocalStorageKey("-html-content", articleId as string),
        highlightCodeblocks(html)
      );
      window.localStorage.setItem(
        getLocalStorageKey("", articleId as string),
        JSON.stringify(json)
      );
      window.localStorage.setItem(
        getLocalStorageKey("-markdown", articleId as string),
        markdown
      );

      updateFormFromEditor(editor);
    },
    500
  );

  useEffect(() => {
    if (isLoading) return;

    if (article?.json && article.json !== null && !isDirty) {
      setInitialContent(article.json);
      return;
    }

    if (localArticle !== undefined) {
      setInitialContent(JSON.parse(localArticle));
      return;
    }

    setInitialContent(defaultValue);
  }, [isLoading, article, localArticle]);

  useEffect(() => {
    if (isLoading) return;
    const localJson = JSON.parse(localArticle ?? "{}");
    if (JSON.stringify(localJson) === JSON.stringify(article?.json)) {
      setIsDirty(false);
      return;
    } else {
      setIsDirty(true);
    }
  }, [isLoading, localArticle]);

  useEffect(() => {
    if (!isDirty && isLoading) return;

    if (isDirty) {
      updateFormFromLocalStorage();
      setIsDirty(false);
    }
  }, [isDirty, isLoading, localArticle]);

  if (!initialContent) return null;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="mb-4 flex items-center justify-between px-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => router.push(`/${activeOrganization?.slug}/articles`)}
        >
          <X className="cursor-pointer size-4 text-muted-foreground" />
        </Button>
        <SidebarTrigger className="text-muted-foreground hover:text-accent-foreground!" />
      </div>
      <div className="relative w-full max-w-6xl mx-auto">
        <EditorRoot>
          <TextareaAutosize
            id="title"
            autoFocus
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
    </>
  );
}
