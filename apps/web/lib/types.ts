import type { Articles, File as Media } from "@notpadd/db/types";
import { createArticleSchema } from "./schemas";
import { z } from "zod";

export type ModalTypes = "upload-image" | "upload-youtube" | "create-article";

export type ConfirmationModalTypes = "delete-article";

export type Pagination = {
  total: number;
  page: number;
  limit: number;
};

export type APIResponse<T> = {
  message: string;
} & ({ success: true; data: T } | { success: false; error: string });

export type MediaResponse = {
  data: Media[];
  pagination: Pagination;
};

export type ArticlesResponse = {
  data: Articles[];
  pagination: Pagination;
};

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
