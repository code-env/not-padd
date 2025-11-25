"use client";

import { useOrganizationContext } from "@/contexts";
import {
  generateOrganizationAvatar,
  replaceOrganizationWithWorkspace,
  REQUIRED_STRING,
} from "@/lib/utils";
import { KEYS_QUERIES } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@notpadd/auth/auth-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@notpadd/ui/components/form";
import { Input } from "@notpadd/ui/components/input";
import { LoadingButton } from "@notpadd/ui/components/loading-button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .trim(),
  slug: REQUIRED_STRING,
});

export function CreateWorkspace() {
  const [isLoading, setIsLoading] = useState(false);
  const { createOrganization } = useOrganizationContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const name = form.watch("name");
  const formSlug = form.watch("slug");

  useEffect(() => {
    if (name.length >= 5) {
      const slug = name
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      form.setValue("slug", slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const [debouncedSlug] = useDebounce(formSlug, 500);

  const {
    data: slugData,
    error: slugError,
    isPending: isCheckingSlug,
  } = useQuery({
    queryKey: ["checkSlug", debouncedSlug],
    queryFn: async () => {
      if (!debouncedSlug || debouncedSlug.length === 0) {
        return null;
      }
      const { data, error } = await authClient.organization.checkSlug({
        slug: debouncedSlug,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!debouncedSlug && debouncedSlug.length > 0,
    retry: false,
  });

  const isSlugTaken = Boolean(
    slugError || (slugData && slugData.status === false)
  );

  useEffect(() => {
    if (isSlugTaken && debouncedSlug.length > 0) {
      form.setError("name", {
        message: "-> Org with name '" + debouncedSlug + "' already taken",
      });
    } else {
      form.clearErrors("name");
    }
  }, [isSlugTaken, debouncedSlug]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const logo = generateOrganizationAvatar(values.slug);
      const { data, error } = await createOrganization({
        ...values,
        logo,
      });
      if (error) throw error;

      if (data) {
        try {
          await KEYS_QUERIES.createKey(data.id, { name: "Default API Key" });
        } catch (keyError: any) {
          console.warn("Failed to create default API key:", keyError.message);
        }

        toast.success(`${data.name} was created`);
        window.location.href = `/${data.slug}`;
      }
    } catch (error: any) {
      const message = replaceOrganizationWithWorkspace(error.message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Workspace name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading || isSlugTaken || isCheckingSlug}
        >
          Create Workspace
        </LoadingButton>
      </form>
    </Form>
  );
}
