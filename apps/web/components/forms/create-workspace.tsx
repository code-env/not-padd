"use client";

import { KEYS_QUERIES } from "@/lib/queries";
import {
  generateOrganizationAvatar,
  replaceOrganizationWithWorkspace,
  REQUIRED_STRING,
} from "@/lib/utils";
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
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  // const { createOrganization } = useOrganizationContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const name = useWatch({ control: form.control, name: "name" });
  const formSlug = useWatch({ control: form.control, name: "slug" });
  const previousNameRef = useRef<string>("");

  useEffect(() => {
    if (!name) return;

    if (name.length >= 5 && name !== previousNameRef.current) {
      const slug = name
        .toLocaleLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");

      const currentSlug = form.getValues("slug");
      if (slug !== currentSlug) {
        form.setValue("slug", slug, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      }
      previousNameRef.current = name;
    } else if (name.length < 5) {
      previousNameRef.current = "";
      if (form.getValues("slug")) {
        form.setValue("slug", "", {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    }
  }, [name, form]);

  const [debouncedSlug] = useDebounce(formSlug || "", 500);

  const {
    data: slugData,
    error: slugError,
    isPending: isCheckingSlug,
  } = useQuery({
    queryKey: ["nothing is checking the slug", debouncedSlug],
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

  const slugErrorSetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!debouncedSlug || debouncedSlug.length === 0) {
      slugErrorSetRef.current = null;
      return;
    }

    const fieldState = form.getFieldState("name");
    const currentError = fieldState.error?.message;
    const isSlugTakenError = currentError?.includes("already taken");

    if (isSlugTaken && debouncedSlug.length > 0) {
      const newError = "-> Org with name '" + debouncedSlug + "' already taken";
      if (currentError !== newError) {
        form.setError(
          "name",
          {
            message: newError,
            type: "manual",
          },
          { shouldFocus: false }
        );
        slugErrorSetRef.current = debouncedSlug;
      }
    } else if (
      isSlugTaken === false &&
      isSlugTakenError &&
      slugErrorSetRef.current === debouncedSlug
    ) {
      const nameToPreserve = name || form.getValues("name");

      form.clearErrors("name");
      slugErrorSetRef.current = null;

      if (nameToPreserve) {
        const currentValue = form.getValues("name");
        if (currentValue !== nameToPreserve) {
          form.setValue("name", nameToPreserve, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          });
        }
      }
    }
  }, [isSlugTaken, debouncedSlug, name]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const logo = generateOrganizationAvatar(values.slug);
      const { data, error } = await authClient.organization.create({
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
