import type { Articles, Tag } from "@notpadd/db/types";
import { apiClient } from "./api-client";
import type {
  APIResponse,
  ArticlesResponse,
  CreateArticleSchema,
  MediaResponse,
  ArticleWithRelations,
  TagsResponse,
  AuthorsResponse,
  AuthorsListItem,
  UpdateArticleSchema,
} from "./types";

export const ARTICLES_QUERIES = {
  updateArticle: async (
    organizationId: string,
    articleId: string,
    data: UpdateArticleSchema
  ) => {
    console.log(data);
    const response = await apiClient.put<APIResponse<{ data: Articles }>>(
      `/articles/${organizationId}/${articleId}`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data;
  },
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

    return response.data.data.data; // unwrap to Tag
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

    return response.data.data.data; // unwrap to Tag
  },
  deleteTag: async (organizationId: string, tagId: string) => {
    const response = await apiClient.delete<APIResponse<{ data: Tag }>>(
      `/tags/${organizationId}/${tagId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data; // unwrap to Tag
  },
};

export const AUTHORS_QUERIES = {
  getAuthors: async (
    organizationId: string,
    articleId: string,
    queries: { page: number; limit: number }
  ) => {
    const searchParams = new URLSearchParams({
      page: String(queries.page),
      limit: String(queries.limit),
    });

    const response = await apiClient.get<APIResponse<AuthorsResponse>>(
      `/authors/${organizationId}/${articleId}?${searchParams.toString()}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  getAuthor: async (
    organizationId: string,
    articleId: string,
    memberId: string
  ) => {
    const response = await apiClient.get<APIResponse<AuthorsListItem>>(
      `/authors/${organizationId}/${articleId}/${memberId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data;
  },
  addAuthor: async (
    organizationId: string,
    data: { articleId: string; memberId: string }
  ) => {
    const response = await apiClient.post<
      APIResponse<{ data: AuthorsListItem }>
    >(`/authors/${organizationId}`, data);

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data;
  },
  updateAuthor: async (
    organizationId: string,
    articleId: string,
    memberId: string,
    data: { memberId: string }
  ) => {
    const response = await apiClient.put<
      APIResponse<{ data: AuthorsListItem }>
    >(`/authors/${organizationId}/${articleId}/${memberId}`, data);

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data;
  },
  deleteAuthor: async (
    organizationId: string,
    articleId: string,
    memberId: string
  ) => {
    const response = await apiClient.delete<
      APIResponse<{ data: AuthorsListItem }>
    >(`/authors/${organizationId}/${articleId}/${memberId}`);

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data;
  },
  updateCoverImage: async (articleId: string, data: { url: string }) => {
    const response = await apiClient.post<APIResponse<{ data: Articles }>>(
      `/articles/${articleId}/cover-image`,
      data
    );

    if (!response.data.success) {
      throw new Error(response.data.error);
    }

    return response.data.data.data;
  },
};
