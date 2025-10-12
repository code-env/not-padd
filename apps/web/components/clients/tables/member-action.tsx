import { useOrganizationContext } from "@/contexts";
import { useConfirmationModal } from "@/hooks/use-confirmation";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import type { MembersResponse } from "@/lib/types";
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

type MemberActionProps = {
  member: MembersResponse;
};

export default function MemberAction({ member }: MemberActionProps) {
  const { onOpen, onClose } = useConfirmationModal();
  const queryClient = useQueryClient();
  const { mutate: deleteMember } = useMutation({
    mutationFn: (articleId: string) =>
      ARTICLES_QUERIES.deleteArticle(activeOrganization?.id ?? "", articleId),
    onSuccess: (data: any) => {
      onClose();
      queryClient.setQueryData(
        [QUERY_KEYS.MEMBERS, activeOrganization?.id],
        (oldData: MembersResponse[]) => {
          return {
            ...oldData,
            data: oldData.filter(
              (item: MembersResponse) => item.id !== data.data.id
            ),
          };
        }
      );
      toast("Member deleted successfully");
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
    deleteMember(member.id);
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
          align="center"
          className="text-muted-foreground flex flex-col gap-1 shadow-sm"
        >
          <DropdownMenuItem>
            <Link
              className="flex w-full items-center gap-2 cursor-pointer"
              href={`/${activeOrganization?.slug}/members/${member.id}`}
            >
              <Pencil size={16} /> <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 bg-red-500/10 hover:bg-red-500/20! hover:text-red-500!"
            onClick={() => {
              onOpen(
                "delete-article",
                "Delete Article",
                "Confirm Delete",
                member.user.name,
                handleDelete
              );
            }}
          >
            <Trash className="size-4 text-red-500" /> <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
