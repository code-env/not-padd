import { apiClient } from "./api-client";
import type { Articles } from "@notpadd/db/types";

export const ARTICLES_QUERIES = {
  getArticles: async (page: number, limit: number, search: string) => {
    const response = await apiClient.get<Articles[]>(
      `/articles?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  },
  getArticleById: async (articleId: string) => {
    const response = await apiClient.get<Articles>(`/articles/${articleId}`);
    return response.data;
  },
};
