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

type MemberTableProps<TData, TValue> = {
  table: TableType<TData>;
  columns: ColumnDef<TData, TValue>[];
};

export function MemberTable<TData, TValue>({
  table,
  columns,
}: MemberTableProps<TData, TValue>) {
  return (
    <div className="border bg-background">
      <Table>
        <TableHeader className="bg-sidebar hover:bg-sidebar/90!">
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
                className="cursor-pointer hover:bg-sidebar/10!"
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
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
