/**
 * Cache key generators for consistent cache key naming
 * Format: {resource}:{action}:{params}
 */

export const cacheKeys = {
  // Articles
  article: (orgId: string, id: string) => `article:${orgId}:${id}`,
  articlesList: (
    orgId: string,
    page?: string,
    limit?: string,
    search?: string
  ) => {
    const params = [orgId, page || "1", limit || "10", search || ""].join(":");
    return `articles:list:${params}`;
  },
  v1Articles: (orgId: string, query: string) => `v1:articles:${orgId}:${query}`,

  // Tags
  tag: (orgId: string, id: string) => `tag:${orgId}:${id}`,
  tagsList: (orgId: string, page?: string, limit?: string, search?: string) => {
    const params = [orgId, page || "1", limit || "10", search || ""].join(":");
    return `tags:list:${params}`;
  },

  // Authors
  authorsList: (
    orgId: string,
    page?: string,
    limit?: string,
    articleId?: string
  ) => {
    const params = [orgId, page || "1", limit || "10", articleId || ""].join(
      ":"
    );
    return `authors:list:${params}`;
  },
  authorsByArticle: (orgId: string, articleId: string) =>
    `authors:article:${orgId}:${articleId}`,

  // Media
  mediaList: (
    orgId: string,
    page?: string,
    limit?: string,
    search?: string
  ) => {
    const params = [orgId, page || "1", limit || "10", search || ""].join(":");
    return `media:list:${params}`;
  },

  // Waitlist
  waitlistCount: () => "waitlist:count",

  // GitHub
  githubRepositories: (
    installationId: number,
    perPage?: number,
    search?: string
  ) => {
    const params = [
      installationId.toString(),
      perPage?.toString() || "10",
      search || "",
    ].join(":");
    return `github:repositories:${params}`;
  },
  githubContents: (
    installationId: number,
    owner: string,
    repo: string,
    path?: string
  ) => {
    const params = [installationId.toString(), owner, repo, path || ""].join(
      ":"
    );
    return `github:contents:${params}`;
  },
};
