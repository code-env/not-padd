import { QUERY_KEYS } from "./constants";
import hljs from "highlight.js";

export const highlightCodeblocks = (content: string) => {
  const doc = new DOMParser().parseFromString(content, "text/html");
  doc.querySelectorAll<HTMLElement>("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });
  return new XMLSerializer().serializeToString(doc);
};

export const getLocalStorageKey = (suffix: string, articleId: string) => {
  return `${QUERY_KEYS.ARTICLE_LOCAL_KEY}${articleId}${suffix}`;
};

export const removeFromStorage = (articleId: string) => {
  window.localStorage.removeItem(getLocalStorageKey("", articleId));
  window.localStorage.removeItem(getLocalStorageKey("-markdown", articleId));
  window.localStorage.removeItem(
    getLocalStorageKey("-html-content", articleId)
  );
};

export const getStoredContent = (
  suffix: string,
  shouldHighlight = false,
  articleId: string
) => {
  const content =
    localStorage.getItem(getLocalStorageKey(suffix, articleId as string)) ?? "";
  return shouldHighlight ? highlightCodeblocks(content) : content;
};
