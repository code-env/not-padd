import { Skeleton } from "@notpadd/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@notpadd/ui/components/table";

export const MembersLoading = ({ columns }: { columns: number }) => {
  return (
    <div className="flex flex-col gap-10">
      <Table className="border">
        <TableHeader className="bg-sidebar hover:bg-sidebar/90! h-12">
          <TableRow>
            <TableHead className="lg:min-w-sm">User</TableHead>
            <TableHead className="min-w-[200px]">Role</TableHead>
            <TableHead className="lg:min-w-[200px] text-center">
              Action
            </TableHead>
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

              <TableCell className="flex items-center justify-center">
                <Skeleton className="size-10" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
