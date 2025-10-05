import { Skeleton } from "@notpadd/ui/components/skeleton";

export const Keys = ({ count }: { count: number }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col border">
          <Skeleton className="h-48 w-full bg-sidebar/50 border" />
          <Skeleton className="h-4 w-full bg-sidebar/50 border" />
          <Skeleton className="h-4 w-full bg-sidebar/50 border" />
          <Skeleton className="h-4 w-full bg-sidebar/50 border" />
          <Skeleton className="h-4 w-full bg-sidebar/50 border" />
        </div>
      ))}
    </div>
  );
};
