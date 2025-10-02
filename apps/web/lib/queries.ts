import type { Articles } from "@notpadd/db/types";
import { apiClient } from "./api-client";
import type {
  APIResponse,
  ArticlesResponse,
  CreateArticleSchema,
  MediaResponse,
  ArticleWithRelations,
  TagsResponse,
  Tag,
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

export const TAGS_QUERIES = {
  getTags: async (
    organizationId: string,
    queries: { page: number; limit: number; search: string }
  ) => {
    const response = await apiClient.get<APIResponse<TagsResponse>>(
      `/tags/${organizationId}?page=${queries.page}&limit=${queries.limit}&search=${queries.search}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  getTagById: async (organizationId: string, id: string) => {
    const response = await apiClient.get<APIResponse<Tag>>(
      `/tags/${organizationId}/${id}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  createTag: async (organizationId: string, data: { name: string }) => {
    const response = await apiClient.post<APIResponse<{ data: Tag }>>(
      `/tags/${organizationId}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  updateTagBySlug: async (
    organizationId: string,
    slug: string,
    data: { name: string }
  ) => {
    const response = await apiClient.put<APIResponse<{ data: Tag }>>(
      `/tags/${organizationId}/${slug}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  deleteTag: async (organizationId: string, tagId: string) => {
    const response = await apiClient.delete<APIResponse<{ data: Tag }>>(
      `/tags/${organizationId}/${tagId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
};
