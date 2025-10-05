"use client";

import { useOrganizationContext } from "@/contexts";
import { replaceOrganizationWithWorkspace, REQUIRED_STRING } from "@/lib/utils";
import { KEYS_QUERIES } from "@/lib/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@notpadd/ui/components/form";
import { Input } from "@notpadd/ui/components/input";
import { LoadingButton } from "@notpadd/ui/components/loading-button";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: REQUIRED_STRING,
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

  const slug = name.toLocaleLowerCase().split(" ").join("-");

  useEffect(() => {
    if (name.length >= 5) form.setValue("slug", slug);
  }, [name]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const { data, error } = await createOrganization({ ...values });
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
        <LoadingButton type="submit" className="w-full" loading={isLoading}>
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
