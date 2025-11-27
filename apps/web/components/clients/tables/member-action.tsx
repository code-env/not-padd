import { useOrganizationContext } from "@/contexts";
import { useConfirmationModal } from "@/hooks/use-confirmation";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import type { MembersResponse } from "@/lib/types";
import { authClient } from "@notpadd/auth/auth-client";
import { Button } from "@notpadd/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type MemberActionProps = {
  memberId: string;
  memberName: string;
};

export default function MemberAction({
  memberId,
  memberName,
}: MemberActionProps) {
  const { onOpen, onClose } = useConfirmationModal();
  const queryClient = useQueryClient();
  const { mutate: deleteMember } = useMutation({
    mutationFn: async (memberId: string) => {
      const { data, error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
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
    deleteMember(memberId);
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      className="cursor-pointer text-red-500 bg-red-500/10 hover:bg-red-500/20! hover:text-red-500!"
      onClick={() => {
        onOpen(
          "delete-member",
          "Delete Member",
          "Confirm Delete",
          memberName,
          handleDelete
        );
      }}
    >
      <Trash className="size-4 text-red-500" />
    </Button>
  );
}
