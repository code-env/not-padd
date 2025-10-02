import type { Articles } from "@notpadd/db/types";
import { apiClient } from "./api-client";
import type {
  APIResponse,
  ArticlesResponse,
  CreateArticleSchema,
  MediaResponse,
  ArticleWithRelations,
} from "./types";

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
  getArticleById: async (organizationId: string, articleId: string) => {
    const response = await apiClient.get<APIResponse<ArticleWithRelations>>(
      `/articles/${organizationId}/${articleId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  createArticle: async (organizationId: string, data: CreateArticleSchema) => {
    const response = await apiClient.post<APIResponse<Articles>>(
      `/articles/${organizationId}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  deleteArticle: async (organizationId: string, articleId: string) => {
    const response = await apiClient.delete<APIResponse<Articles>>(
      `/articles/${organizationId}/${articleId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
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
