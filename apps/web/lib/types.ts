import type { Articles, File as Media, Tag } from "@notpadd/db/types";
import {
  createArticleSchema,
  createTagSchema,
  updateArticleSchema,
  updateCoverImageSchema,
} from "./schemas";
import { z } from "zod";

export type ModalTypes =
  | "upload-image"
  | "upload-youtube"
  | "create-article"
  | "create-tag";

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
  data: (Articles & {
    tags?: string[];
    authors?: { id: string; name: string; email: string; image: string }[];
  })[];
  pagination: Pagination;
};

export type ArticleWithRelations = Articles & {
  tags?: string[];
  authors?: { id: string; name: string; email: string; image: string }[];
};

export type CreateArticleSchema = z.infer<typeof createArticleSchema>;
export type UpdateArticleSchema = z.infer<typeof updateArticleSchema>;
export type UpdateCoverImageSchema = z.infer<typeof updateCoverImageSchema>;

export type TagsResponse = {
  data: Tag[];
  pagination: Pagination;
};

export type CreateTagSchema = z.infer<typeof createTagSchema>;

export type AuthorsListItem = {
  id: string;
  name: string;
  userId: string;
  image: string | null;
};

export type AuthorsResponse = {
  data: AuthorsListItem[];
  pagination: Pagination;
};
