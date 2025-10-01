import { Button } from "@notpadd/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@notpadd/ui/components/dropdown-menu";
import { cn } from "@notpadd/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useOrganizationContext } from "@/contexts";
import type { Post } from "./article-column";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import useModal from "@/hooks/use-modal";

type PostTableActionsProps = {
  post: Post;
  view?: "table" | "grid";
};

export default function PostActions({
  post,
  view = "table",
}: PostTableActionsProps) {
  const { onOpen } = useModal();

  const { activeOrganization } = useOrganizationContext();

  if (!activeOrganization) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={cn(
              "size-8 p-0",
              view === "grid" &&
                "rounded-full bg-sidebar hover:bg-primary/10 hover:text-primary dark:bg-accent/50 dark:hover:text-accent-foreground"
            )}
            variant="ghost"
          >
            <span className="sr-only">Open menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={view === "grid" ? "center" : "end"}
          className="text-muted-foreground shadow-sm"
        >
          <DropdownMenuItem>
            <Link
              className="flex w-full cursor-default items-center gap-2"
              href={`/${activeOrganization?.slug}/editor/a/${post.id}`}
            >
              <Pencil size={16} /> <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpen("delete-article");
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

const DeleteArticleModal = () => {
  return <div>DeleteArticleModal</div>;
};
