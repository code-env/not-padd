import { Button } from "@notpadd/ui/components/button";
import { Skeleton } from "@notpadd/ui/components/skeleton";

export const ReposLoadingUI = ({ count }: { count: number }) => {
  return (
    <div className="divide-y">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-2 hover:bg-sidebar cursor-pointer flex items-center justify-between"
        >
          <div className="flex flex-col gap-2 w-1/2">
            <Skeleton className="h-4 w-full border" />

            <Skeleton className="h-2 w-full bg-sidebar w-1/2" />
          </div>
          <Button size="sm" disabled={true}>
            Connect
          </Button>
        </div>
      ))}
    </div>
  );
};
