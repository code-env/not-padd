import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { createArticleSchema } from "@/lib/schemas";
import type { CreateArticleSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
import { Textarea } from "@notpadd/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateArticle = () => {
  const { onClose, type } = useModal();
  const { activeOrganization } = useOrganizationContext();
  const queryClient = useQueryClient();
  const isCreateModalOpen = type === "create-article";

  const form = useForm<CreateArticleSchema>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      title: "",
      description: "",
      slug: "",
    },
  });

  const { mutate: createArticle, isPending } = useMutation({
    mutationFn: (data: CreateArticleSchema) =>
      ARTICLES_QUERIES.createArticle(activeOrganization?.id as string, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLES, activeOrganization?.id],
      });
      toast.success("Article created successfully");
      form.reset();

      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    const title = form.watch("title");
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug);
  }, [form.watch("title")]);

  const slug = form.watch("slug");

  const onSubmit = (data: CreateArticleSchema) => {
    createArticle(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 gap-0" showCloseButton>
        <DialogHeader className="p-4 bg-background">
          <DialogTitle>Create Article</DialogTitle>
        </DialogHeader>
        <div className="p-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={handleKeyDown}
              className="space-y-4 p-4 bg-sidebar"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
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
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
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
                  {isPending ? "Creating..." : "Create Article"}
                </LoadingButton>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArticle;
