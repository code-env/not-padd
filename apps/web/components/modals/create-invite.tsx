import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { ORGANIZATION_QUERIES } from "@/lib/queries";
import { createInviteSchema } from "@/lib/schemas";
import type { CreateInviteSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogContentWrapper,
  DialogHeader,
  DialogMiniPadding,
  DialogTitle,
} from "@notpadd/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@notpadd/ui/components/form";
import { Input } from "@notpadd/ui/components/input";
import { LoadingButton } from "@notpadd/ui/components/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@notpadd/ui/components/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateInvite = () => {
  const { onClose, type } = useModal();
  const { activeOrganization } = useOrganizationContext();
  const queryClient = useQueryClient();

  const isCreateModalOpen = type === "invite-member";

  const form = useForm<CreateInviteSchema>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: createTag, isPending } = useMutation({
    mutationFn: (data: CreateInviteSchema) =>
      ORGANIZATION_QUERIES.createInvite(activeOrganization?.id as string, data),
    onSuccess: () => {
      toast.success("Invite created successfully");
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateInviteSchema) => {
    createTag(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Create Invite</DialogTitle>
        </DialogHeader>
        <DialogMiniPadding>
          <DialogContentWrapper>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onKeyDown={handleKeyDown}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select {...field}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    loading={isPending}
                    disabled={isPending || !form.formState.isValid}
                  >
                    Create Invite
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </DialogContentWrapper>
        </DialogMiniPadding>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvite;
