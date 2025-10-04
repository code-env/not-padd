"use client";

import * as React from "react";

import { Sidebar, SidebarFooter } from "@notpadd/ui/components/sidebar";
import { RightSidebarLoading } from "@/components/loading-uis";
import { useArticleContext, useOrganizationContext } from "@/contexts";
import { cn } from "@notpadd/ui/lib/utils";
import { Input } from "@notpadd/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@notpadd/ui/components/tooltip";
import { Textarea } from "@notpadd/ui/components/textarea";
import {
  AuthorSelector,
  TagSelector,
  CoverImage,
} from "@/components/editor/fields";

import { CircleAlert, X } from "lucide-react";
import { Button } from "@notpadd/ui/components/button";
import Image from "next/image";
import type { ArticleWithRelations, UpdateArticleSchema } from "@/lib/types";
import { useArticleForm } from "@/contexts";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoadingButton } from "@notpadd/ui/components/loading-button";

export function RightSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { article, setArticle, isLoading, isDirty } = useArticleContext();
  const { activeOrganization } = useOrganizationContext();

  const { mutate: updateArticle, isPending } = useMutation({
    mutationFn: (data: UpdateArticleSchema) =>
      ARTICLES_QUERIES.updateArticle(
        activeOrganization?.id as string,
        article?.id as string,
        data
      ),
    onSuccess: (data: any) => {
      setArticle(data);
      toast.success("Article updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useArticleForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (isLoading) return <RightSidebarLoading />;

  const removeImage = () => {
    if (!article) return;
    setArticle({
      ...article,
      image: null,
      imageBlurhash: null,
    });
  };

  const onSubmit = (data: UpdateArticleSchema) => {
    // console.log("Submitting update with:", data);
    updateArticle(data);
  };

  const onInvalid: import("react-hook-form").SubmitErrorHandler<
    UpdateArticleSchema
  > = (errors) => {
    console.log("Validation errors:", errors);
    toast.error("Please fix the validation errors before saving.");
  };

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
            {article?.image ? (
              <div className="h-48 border relative group/image overflow-hidden">
                <Image
                  placeholder="blur"
                  blurDataURL={article?.imageBlurhash as string}
                  src={article?.image as string}
                  alt={article?.title as string}
                  className="object-cover"
                  fill
                />
                <div className="absolute inset-0 flex items-center justify-center bg-muted/40 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X />
                  </Button>
                </div>
              </div>
            ) : (
              <CoverImage />
            )}
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
              {...register("description")}
              aria-invalid={!!errors?.description}
            />
            {errors?.description?.message && (
              <p className="text-destructive text-xs">
                {errors.description.message as string}
              </p>
            )}
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
              {...register("slug")}
              defaultValue={article?.slug}
              disabled
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
              <TagSelector
                control={form.control}
                defaultTags={(article as ArticleWithRelations)?.tags ?? []}
              />
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
              <AuthorSelector control={form.control} />
            </div>
          </SidebarSection>
        </div>
      </div>
      <SidebarFooter>
        {isDirty && (
          <div className="mb-2 text-xs text-muted-foreground bg-amber-50/10 dark:bg-amber-900/20 border border-amber-500/10 dark:border-amber-800 rounded-md p-2">
            <div className="flex items-center gap-1">
              <div className="h-lh">
                <CircleAlert className="size-3 text-amber-600 dark:text-amber-400 h-lh " />
              </div>
              Local content has been modified and needs to be saved.
            </div>
          </div>
        )}
        <LoadingButton
          className="w-full"
          loading={isPending}
          disabled={
            !(
              form.formState.isDirty ||
              Object.keys(form.formState.dirtyFields || {}).length > 0 ||
              isDirty
            ) || isPending
          }
          onClick={handleSubmit(onSubmit, onInvalid)}
        >
          Save
        </LoadingButton>
      </SidebarFooter>
    </Sidebar>
  );
}

export const SidebarSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
};

export const SidebarSectionTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <h1 className="text-muted-foreground text-sm flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
      {children}
    </h1>
  );
};

export const SidebarTooltip = ({
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
