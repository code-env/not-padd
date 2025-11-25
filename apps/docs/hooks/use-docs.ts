"use client";

import { allDocs } from "content-collections";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BookOpen, Code, FileText, Settings } from "lucide-react";

type NavigationItem = {
  title: string;
  url: string;
  icon: typeof BookOpen;
};

type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

type UseDocsReturn = {
  navigation: NavigationGroup[];
  currentDoc: (typeof allDocs)[number] | undefined;
  currentIndex: number;
  previousDoc: (typeof allDocs)[number] | null;
  nextDoc: (typeof allDocs)[number] | null;
  sortedDocs: typeof allDocs;
};

const getIconForTitle = (title: string): typeof BookOpen => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("overview") || lowerTitle.includes("introduction")) {
    return BookOpen;
  }
  if (lowerTitle.includes("configuration") || lowerTitle.includes("config")) {
    return Settings;
  }
  if (
    lowerTitle.includes("api") ||
    lowerTitle.includes("reference") ||
    lowerTitle.includes("parser") ||
    lowerTitle.includes("transformer") ||
    lowerTitle.includes("builder")
  ) {
    return Code;
  }
  return FileText;
};

const groupNavigation = (docs: typeof allDocs): NavigationGroup[] => {
  const grouped = new Map<string, typeof allDocs>();

  docs.forEach((doc) => {
    const path = doc._meta.path.replace(/^content\//, "");
    const parts = path.split("/");
    const groupKey = parts.length > 1 ? parts[0] : "index";

    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey)!.push(doc);
  });

  const navigation = Array.from(grouped.entries())
    .map(([groupKey, groupDocs]) => {
      const groupTitle =
        groupKey === "index"
          ? "Getting Started"
          : groupKey.charAt(0).toUpperCase() + groupKey.slice(1);

      const sortedDocs = [...groupDocs].sort((a, b) => {
        const pathA = a._meta.path.replace(/^content\//, "");
        const pathB = b._meta.path.replace(/^content\//, "");
        return pathA.localeCompare(pathB);
      });

      const items: NavigationItem[] = sortedDocs.map((doc) => {
        const path = doc._meta.path.replace(/^content\//, "");
        const url = `/docs/${path}`;

        return {
          title: doc.title,
          url,
          icon: getIconForTitle(doc.title),
        };
      });

      return {
        title: groupTitle,
        items,
      };
    })
    .sort((a, b) => {
      if (a.title === "Getting Started") return -1;
      if (b.title === "Getting Started") return 1;
      return a.title.localeCompare(b.title);
    });

  return navigation;
};

export const useDocs = (): UseDocsReturn => {
  const pathname = usePathname();

  const sortedDocs = useMemo(() => {
    return [...allDocs].sort((a, b) => {
      const pathA = a._meta.path.replace(/^content\//, "");
      const pathB = b._meta.path.replace(/^content\//, "");

      // Always put "index" first
      if (pathA === "index") return -1;
      if (pathB === "index") return 1;

      return pathA.localeCompare(pathB);
    });
  }, []);

  const navigation = useMemo(() => groupNavigation(allDocs), []);

  const currentIndex = useMemo(() => {
    return sortedDocs.findIndex((doc) => {
      const docPath = doc._meta.path.replace(/^content\//, "");
      const expectedPath = `/docs/${docPath}`;
      return pathname === expectedPath || pathname.endsWith(docPath);
    });
  }, [pathname, sortedDocs]);

  const currentDoc = useMemo(() => {
    return currentIndex >= 0 ? sortedDocs[currentIndex] : undefined;
  }, [currentIndex, sortedDocs]);

  const previousDoc = useMemo(() => {
    return currentIndex > 0 ? sortedDocs[currentIndex - 1] : null;
  }, [currentIndex, sortedDocs]);

  const nextDoc = useMemo(() => {
    return currentIndex < sortedDocs.length - 1 && currentIndex >= 0
      ? sortedDocs[currentIndex + 1]
      : null;
  }, [currentIndex, sortedDocs]);

  return {
    navigation,
    currentDoc,
    currentIndex,
    previousDoc,
    nextDoc,
    sortedDocs,
  };
};
