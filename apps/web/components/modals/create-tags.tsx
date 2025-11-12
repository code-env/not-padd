import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { TAGS_QUERIES } from "@/lib/queries";
import { createTagSchema } from "@/lib/schemas";
import type { CreateTagSchema, TagsResponse } from "@/lib/types";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateTags = () => {
  const { onClose, type } = useModal();
  const { activeOrganization } = useOrganizationContext();
  const queryClient = useQueryClient();
  const [slug, setSlug] = useState("");

  const isCreateModalOpen = type === "create-tag";

  const form = useForm<CreateTagSchema>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createTag, isPending } = useMutation({
    mutationFn: (data: CreateTagSchema) =>
      TAGS_QUERIES.createTag(activeOrganization?.id as string, data),
    onSuccess: (createdTag) => {
      toast.success("Tag created successfully");
      form.reset();
      onClose();
      queryClient.setQueryData(
        [QUERY_KEYS.TAGS, activeOrganization?.id],
        (old: TagsResponse | undefined) => {
          if (!old) {
            return {
              data: [createdTag],
              pagination: { total: 1, page: 1, limit: 10 },
            } satisfies TagsResponse;
          }
          return {
            ...old,
            data: [createdTag, ...old.data],
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) + 1,
            },
          } satisfies TagsResponse;
        }
      );
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TAGS, activeOrganization?.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const name = form.watch("name");
    const slug = name
      .toLowerCase()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(slug);
  }, [form.watch("name")]);

  const onSubmit = (data: CreateTagSchema) => {
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
          <DialogTitle>Create Tag</DialogTitle>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Name" {...field} />
                      </FormControl>
                      <FormMessage />

                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <ArrowRightIcon className="w-4 h-4" />
                        <p className="text-xs truncate max-w-sm">
                          {slug.length > 0 ? slug : "Slug will be generated"}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    loading={isPending}
                    disabled={isPending || !form.formState.isValid}
                  >
                    Create Tag
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

export default CreateTags;
