import { Skeleton } from "@notpadd/ui/components/skeleton";

export const MediaLoadingUI = ({ count }: { count: number }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col border">
          <div className="p-1">
            <Skeleton className="h-72 w-full bg-sidebar/50 border" />
          </div>
          <div className="bg-sidebar p-2 flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-full border" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-1/2 border" />
                <Skeleton className="h-4 w-1/2 border" />
              </div>
            </div>
            <Skeleton className="size-10 " />
          </div>
        </div>
      ))}
    </div>
  );
};
