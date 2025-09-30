import type { Articles, File as Media } from "@notpadd/db/types";

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
