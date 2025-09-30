import { apiClient } from "./api-client";
import type { Articles, File as Media } from "@notpadd/db/types";
import type { APIResponse, ArticlesResponse, MediaResponse } from "./types";

export const ARTICLES_QUERIES = {
  getArticles: async (
    organizationId: string,
    queries: { page: number; limit: number; search: string }
  ) => {
    const response = await apiClient.get<APIResponse<ArticlesResponse>>(
      `/articles/${organizationId}?page=${queries.page}&limit=${queries.limit}&search=${queries.search}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    return response.data.data;
  },
  getArticleById: async (articleId: string) => {
    const response = await apiClient.get<Articles>(`/articles/${articleId}`);
    return response.data;
  },
};

export const MEDIA_QUERIES = {
  getMedia: async (
    organizationId: string,
    queries: { page: number; limit: number; search: string }
  ) => {
    const response = await apiClient.get<APIResponse<MediaResponse>>(
      `/media/${organizationId}?page=${queries.page}&limit=${queries.limit}&search=${queries.search}`
    );
    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
};
