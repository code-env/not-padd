import { Skeleton } from "@notpadd/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@notpadd/ui/components/table";

export const ArticlesLoading = ({ columns }: { columns: number }) => {
  return (
    <div className="flex flex-col gap-10">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-md max-w-md!">Title</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Published At</TableHead>
            <TableHead className="w-[150px]">Last Updated</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: columns }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell className="flex items-center justify-end">
                <Skeleton className="size-10" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
