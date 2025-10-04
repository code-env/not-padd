import { useOrganizationContext } from "@/contexts";
import { useConfirmationModal } from "@/hooks/use-confirmation";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import type { ArticlesResponse } from "@/lib/types";
import type { Articles } from "@notpadd/db/types";
import { Button } from "@notpadd/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@notpadd/ui/components/dropdown-menu";
import { cn } from "@notpadd/ui/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type ArticleActionProps = {
  article: Articles;
};

export default function ArticleAction({ article }: ArticleActionProps) {
  const { onOpen, onClose } = useConfirmationModal();
  const queryClient = useQueryClient();
  const { mutate: deleteArticle } = useMutation({
    mutationFn: (articleId: string) =>
      ARTICLES_QUERIES.deleteArticle(activeOrganization?.id ?? "", articleId),
    onSuccess: (data: any) => {
      onClose();
      queryClient.setQueryData(
        [QUERY_KEYS.ARTICLES, activeOrganization?.id],
        (oldData: ArticlesResponse) => {
          return {
            ...oldData,
            data: oldData.data.filter(
              (item: Articles) => item.id !== data.data.id
            ),
          };
        }
      );
      toast("Article deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { activeOrganization } = useOrganizationContext();

  if (!activeOrganization) {
    return null;
  }

  const handleDelete = () => {
    deleteArticle(article.id);
  };

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
              href={`/${activeOrganization?.slug}/articles/${article.id}`}
            >
              <Pencil size={16} /> <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onOpen(
                "delete-article",
                "Delete Article",
                "Confirm Delete",
                article.title,
                handleDelete
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
