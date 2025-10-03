"use client";

import React from "react";
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
  const { article } = useArticleContext();

  const methods = useForm<UpdateArticleSchema>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      title: article?.title ?? "",
      description: article?.description ?? "",
      slug: article?.slug ?? "",
      tags: [],
      authors: [],
    },
    mode: "onChange",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

export const useArticleForm = () => useFormContext<UpdateArticleSchema>();
