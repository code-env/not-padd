"use client";

import * as React from "react";

import { Sidebar, SidebarFooter } from "@notpadd/ui/components/sidebar";
import { useArticleContext } from "@/contexts";
import { cn } from "@notpadd/ui/lib/utils";
import { Input } from "@notpadd/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@notpadd/ui/components/tooltip";
import { Textarea } from "@notpadd/ui/components/textarea";
import { AuthorSelector, TagSelector } from "@/components/editor/fields";

import { CircleAlert } from "lucide-react";
import { Button } from "@notpadd/ui/components/button";

export function RightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const {
    articleId,
    isId,
    article,
    setArticle,
    isLoading,
    isError,
    localArticle,
    setLocalArticle,
    isDirty,
    setIsDirty,
  } = useArticleContext();

  return (
    <Sidebar {...props} side="right" variant="floating">
      <div className="size-full p-4 flex flex-col gap-6">
        <h1 className="text-muted-foreground">Article Metadata</h1>
        <div className="flex flex-col gap-4">
          <SidebarSection>
            <SidebarSectionTitle>
              Cover image
              <SidebarTooltip content="The cover image is the image that will be displayed on the article page.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <div className="h-40 w-full bg-muted/50 border flex items-center justify-center flex-col gap-2"></div>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Description{" "}
              <SidebarTooltip content="The description is the text that will be displayed on the article page.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <Textarea
              placeholder="Description"
              className="resize-none bg-muted/50"
              rows={3}
            />
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Slug{" "}
              <SidebarTooltip content="The slug is the URL of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <Input
              placeholder="Slug"
              className="bg-muted/50"
              value={article?.slug}
            />
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Tags{" "}
              <SidebarTooltip content="The tags are the tags of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <div className="flex flex-wrap gap-2">
              <TagSelector />
            </div>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>
              Authors{" "}
              <SidebarTooltip content="The authors are the authors of the article.">
                <CircleAlert />
              </SidebarTooltip>
            </SidebarSectionTitle>
            <div className="flex flex-wrap gap-2">
              <AuthorSelector />
            </div>
          </SidebarSection>
        </div>
      </div>
      <SidebarFooter>
        <Button disabled={isDirty} className="w-full">
          Save
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

const SidebarSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const num1 = 10;
  const num2 = 20;
  const sum = eval;
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

const SidebarSectionTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-muted-foreground text-sm flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
      {children}
    </h1>
  );
};

const SidebarTooltip = ({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
