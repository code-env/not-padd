import { useConfirmationModal } from "@/hooks/use-confirmation";
import { useOrganization } from "@/hooks/use-organization";
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
import axios from "axios";
import { MoreVertical, Pencil, Plus, Trash } from "lucide-react";
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

  const { activeOrganization, isOwner } = useOrganization();

  const { mutateAsync: publishArticle, isPending: isPublishing } = useMutation({
    mutationFn: async () => {
      if (!activeOrganization?.id) {
        throw new Error("Workspace not found");
      }

      const { data } = await axios.post("/api/publish/article", {
        slug: article.slug,
        organizationId: activeOrganization.id,
      });

      if (!data.success) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      toast.success("Article published successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLES, activeOrganization?.id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to publish article");
    },
  });

  if (!activeOrganization) {
    return null;
  }

  const handleDelete = () => {
    deleteArticle(article.id);
  };

  const handlePublish = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!activeOrganization) {
      return toast.error("Workspace not found");
    }
    const { repoUrl, repoPath } = activeOrganization;
    if (!repoUrl || repoUrl.trim() === "") {
      return toast.error("Repository not connected");
    }
    if (!repoPath || repoPath.trim() === "") {
      return toast.error("Repository path not set");
    }

    try {
      await publishArticle();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      const trigger = document.querySelector(
        '[data-state="open"][data-slot="dropdown-menu-trigger"]'
      );
      if (trigger) {
        trigger.dispatchEvent(
          new PointerEvent("pointerdown", { bubbles: true, cancelable: true })
        );
        trigger.dispatchEvent(
          new PointerEvent("pointerup", { bubbles: true, cancelable: true })
        );
      }
    }
  };

  const isDisabled = !isOwner || isPublishing;

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
          className="text-muted-foreground flex flex-col gap-1 shadow-sm"
        >
          <DropdownMenuItem disabled={isDisabled} asChild>
            <Link
              className="flex w-full items-center gap-2 cursor-pointer"
              href={`/${activeOrganization?.slug}/articles/${article.id}`}
            >
              <Pencil size={16} /> <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handlePublish(e)}
            disabled={isDisabled}
          >
            <Plus size={16} />{" "}
            <span>{isPublishing ? "Publishing..." : "Publish"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 bg-red-500/10 hover:bg-red-500/20! hover:text-red-500!"
            onClick={() => {
              onOpen(
                "delete-article",
                "Delete Article",
                "Confirm Delete",
                article.title,
                handleDelete
              );
            }}
            disabled={isDisabled}
          >
            <Trash className="size-4 text-red-500" /> <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
