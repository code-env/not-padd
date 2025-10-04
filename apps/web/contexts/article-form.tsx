"use client";

import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateArticleSchema } from "@/lib/schemas";
import type { UpdateArticleSchema } from "@/lib/types";
import { useArticleContext } from ".";

export const ArticleFormProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { article, isLoading } = useArticleContext();

  const defaultTags = useMemo(() => {
    if (isLoading) return [];
    return article?.tags?.map((tag) => tag) ?? [];
  }, [article, isLoading]);

  const defaultAuthors = useMemo(() => {
    if (isLoading) return [];
    return article?.authors?.map((author) => author.id) ?? [];
  }, [article, isLoading]);

  const methods = useForm<UpdateArticleSchema, any, UpdateArticleSchema>({
    resolver: zodResolver(updateArticleSchema) as any,
    defaultValues: {
      title: article?.title ?? undefined,
      description: article?.description ?? undefined,
      slug: article?.slug ?? undefined,
      tags: defaultTags,
      authors: defaultAuthors,
      content: article?.content ?? "",
      markdown: article?.markdown ?? "",
      json: (article?.json as string) ?? "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    methods.reset(
      {
        title: article?.title ?? "",
        description: article?.description ?? "",
        slug: article?.slug ?? "",
        tags: defaultTags,
        authors: defaultAuthors,
        content: article?.content ?? "",
        markdown: article?.markdown ?? "",
        json: JSON.stringify(article?.json) ?? "",
      },
      { keepDirty: false }
    );
  }, [article, isLoading]);

  const title = methods.watch("title");

  useEffect(() => {
    if (!title) return;
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    methods.setValue("slug", slug, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [methods.watch("title")]);

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const useArticleForm = () => useFormContext<UpdateArticleSchema>();
