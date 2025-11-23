import { useOrganizationContext } from "@/contexts";
import useModal from "@/hooks/use-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { ARTICLES_QUERIES } from "@/lib/queries";
import { createArticleSchema } from "@/lib/schemas";
import type { ArticlesResponse, CreateArticleSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@notpadd/auth/auth-client";
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
import { Textarea } from "@notpadd/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

const CreateArticle = () => {
  const { onClose, type } = useModal();
  const { activeOrganization } = useOrganizationContext();
  const queryClient = useQueryClient();
  const router = useRouter();
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
    onSuccess: (data: any) => {
      toast.success("Article created successfully");
      form.reset();
      queryClient.setQueryData(
        [QUERY_KEYS.ARTICLES, activeOrganization?.id],
        (old: ArticlesResponse | undefined) => {
          if (!old) {
            return {
              data: [data.data],
              pagination: { total: 1, page: 1, limit: 10 },
            } satisfies ArticlesResponse;
          }
          return {
            ...old,
            data: [data.data, ...old.data],
            pagination: {
              ...old.pagination,
              total: (old.pagination?.total || 0) + 1,
            },
          } satisfies ArticlesResponse;
        }
      );
      router.push(`/${activeOrganization?.slug}/articles/${data.data.id}`);
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
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
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Create Article</DialogTitle>
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
                    Create Article
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

export default CreateArticle;
