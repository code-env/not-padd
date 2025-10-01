"use client";

import { Badge } from "@notpadd/ui/components/badge";
import { Button } from "@notpadd/ui/components/button";
import { ChevronsUpDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ArticleAction from "./article-action";
import type { Articles } from "@notpadd/db/types";
import { cn } from "@notpadd/ui/lib/utils";

export const columns: ColumnDef<Articles>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title;
      return (
        <div className="max-w-md min-w-md overflow-x-auto">
          <p className="truncate">{title}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.publishedAt ? "published" : "draft";
      return (
        <Badge
          className={cn(
            status === "published"
              ? "bg-green-500/10 border border-green-500/20 text-green-800"
              : "bg-yellow-500/10 border border-yellow-500/20 text-yellow-500"
          )}
        >
          {status === "published" ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => {
      return (
        <Button
          className="h-auto p-0 font-medium hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Published At
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt;
      return (
        <p className="px-4 text-red-200">
          {publishedAt ? format(publishedAt, "MMM dd, yyyy") : "Not Published"}
        </p>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          className="h-auto p-0 font-medium hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Last Updated
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;
      return (
        <p className="px-4">
          {updatedAt ? format(updatedAt, "MMM dd, yyyy") : "N/A"}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="flex justify-end pr-10">Actions</div>,
    cell: ({ row }) => {
      const article = row.original;

      return (
        <div className="flex justify-end pr-10">
          <ArticleAction article={article} />
        </div>
      );
    },
  },
];
