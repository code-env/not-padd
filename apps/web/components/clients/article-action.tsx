import { useOrganizationContext } from "@/contexts";
import { useConfirmationModal } from "@/hooks/use-confirmation";
import { Button } from "@notpadd/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@notpadd/ui/components/dropdown-menu";
import { cn } from "@notpadd/ui/lib/utils";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import type { Articles } from "@notpadd/db/types";

type ArticleActionProps = {
  article: Articles;
};

export default function ArticleAction({ article }: ArticleActionProps) {
  const { onOpen } = useConfirmationModal();

  const { activeOrganization } = useOrganizationContext();

  if (!activeOrganization) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn("size-8 p-0")} variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="text-muted-foreground shadow-sm"
        >
          <DropdownMenuItem>
            <Link
              className="flex w-full cursor-default items-center gap-2"
              href={`/${activeOrganization?.slug}/editor/article/${article.id}`}
            >
              <Pencil size={16} /> <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen(
                "delete-article",
                "Delete Article",
                "Are you sure you want to delete this article?",
                "Delete"
              );
            }}
            variant="destructive"
          >
            <Trash size={16} /> <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
