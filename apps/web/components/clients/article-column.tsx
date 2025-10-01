"use client";

import { Badge } from "@notpadd/ui/components/badge";
import { Button } from "@notpadd/ui/components/button";
import { ChevronsUpDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ArticleAction from "./article-action";
import type { Articles } from "@notpadd/db/types";

export const columns: ColumnDef<Articles>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title;
      return (
        <div className="max-w-72 overflow-x-auto">
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
          className="rounded-[6px]"
          variant={status === "published" ? "default" : "secondary"}
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
          Published
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.publishedAt
        ? format(row.original.publishedAt, "MMM dd, yyyy")
        : "N/A",
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
    cell: ({ row }) => format(row.original.updatedAt, "MMM dd, yyyy"),
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
