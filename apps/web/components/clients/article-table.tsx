"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@notpadd/ui/components/table";
import {
  type ColumnDef,
  flexRender,
  type Table as TableType,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useOrganizationContext } from "@/contexts";
import type { Articles } from "@notpadd/db/types";

type ArticleTableProps<TData, TValue> = {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
};

export function ArticleTable<TData, TValue>({
  table,
  columns,
}: ArticleTableProps<TData, TValue>) {
  const router = useRouter();
  const { activeOrganization } = useOrganizationContext();

  const handleRowClick = (article: Articles, event: React.MouseEvent) => {
    if (
      (event.target as HTMLElement).closest('[data-actions-cell="true"]') ||
      (event.target as HTMLElement).closest("button") ||
      (event.target as HTMLElement).closest("a") ||
      (event.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      return;
    }
    router.push(`/${activeOrganization?.slug}/editor/a/${article.id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className="cursor-pointer hover:bg-muted/50"
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
                onClick={(event) =>
                  handleRowClick(row.original as Articles, event)
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    {...(cell.column.id === "actions" && {
                      "data-actions-cell": "true",
                      onClick: (e: React.MouseEvent) => e.stopPropagation(),
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-96 text-center" colSpan={columns.length}>
                No posts results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
