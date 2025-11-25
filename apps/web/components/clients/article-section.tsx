"use client";

import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { Button } from "@notpadd/ui/components/button";
import { Input } from "@notpadd/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, File } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ArticlesLoading } from "@/components/loading-uis";
import { columns } from "./tables/article-column";
import { ArticleTable } from "./tables/article-table";

export const ArticleSection = () => {
  const { activeOrganization } = useOrganizationContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    const previous = pagination;
    const newPagination =
      typeof updaterOrValue === "function"
        ? updaterOrValue(previous)
        : updaterOrValue;

    const params = new URLSearchParams(searchParams);
    params.set("page", (newPagination.pageIndex + 1).toString());
    params.set("limit", newPagination.pageSize.toString());

    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1"); // Reset to page 1 on search
    } else {
      params.delete("search");
      params.set("page", "1");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      QUERY_KEYS.ARTICLES,
      activeOrganization?.id,
      page,
      limit,
      search,
    ],
    queryFn: () =>
      ARTICLES_QUERIES.getArticles(activeOrganization?.id as string, {
        page,
        limit,
        search,
      }),
  });

  const table = useReactTable({
    data: data?.data || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    onPaginationChange: handlePaginationChange,
    pageCount: data?.pagination ? Math.ceil(data.pagination.total / limit) : -1,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <ArticleHeader disabled={true} onSearch={() => {}} />
        <ArticlesLoading columns={10} />
      </div>
    );
  }

  if (isError) {
    return <div>Error</div>;
  }

  if (data?.data.length === 0 && pagination.pageIndex === 0 && !search)
    return <NoArticles />;

  return (
    <div className="flex flex-col gap-10">
      <ArticleHeader
        disabled={isLoading}
        defaultValue={search}
        onSearch={handleSearch}
      />
      <ArticleTable table={table} columns={columns} />
      <div className="flex items-center justify-end gap-10">
        <div className="text-sm text-muted-foreground">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ArticleHeaderProps {
  disabled: boolean;
  defaultValue?: string;
  onSearch: (search: string) => void;
}

const ArticleHeader = ({
  disabled,
  defaultValue,
  onSearch,
}: ArticleHeaderProps) => {
  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Search"
        className="w-full max-w-sm bg-sidebar"
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button disabled={disabled} onClick={() => onOpen("create-article")}>
        Create Article
      </Button>
    </div>
  );
};

const NoArticles = () => {
  const { onOpen } = useModal();
  return (
    <div className="h-[calc(100vh_-_150px)] flex flex-col items-center justify-center gap-4">
      <File className="size-10 text-muted-foreground" />
      <p className="text-muted-foreground max-w-sm text-center">
        No articles found, Create one by clicking the button below
      </p>
      <Button onClick={() => onOpen("create-article")}>Create Article</Button>
    </div>
  );
};
