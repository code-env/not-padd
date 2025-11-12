"use client";

import useWaitlistModal from "@/hooks/use-waitlist-modal";
import { WAITLIST_QUERIES } from "@/lib/queries";
import { joinWaitlistEmailSchema } from "@/lib/schemas";
import type { JoinWaitlistEmailSchema } from "@/lib/types";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    console.error("Failed to set localStorage item", key, value);
  }
};

function useWaitlistCount() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const query = useQuery({
    queryKey: ["waitlist", "count"],
    queryFn: WAITLIST_QUERIES.getWaitlistCount,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    enabled: isClient,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: JoinWaitlistEmailSchema) =>
      WAITLIST_QUERIES.joinWaitlist(data),
    onSuccess: () => {
      setSuccess(true);

      queryClient.invalidateQueries({ queryKey: ["waitlist", "count"] });

      const newCount = (query.data?.data?.count ?? 0) + 1;
      queryClient.setQueryData(["waitlist", "count"], { count: newCount });

      setLocalStorageItem("waitlist_success", "true");

      toast.success("You're on the waitlist! 🎉");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    },
  });

  return {
    count: query.data?.data?.count ?? 0,
    mutate,
    success,
    isPending,
  };
}

const JoinWaitlistEmail = () => {
  const { onClose, isOpen } = useWaitlistModal();
  const waitlist = useWaitlistCount();
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const form = useForm<JoinWaitlistEmailSchema>({
    resolver: zodResolver(joinWaitlistEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (waitlist.success) {
      setLocalStorageItem("waitlist_success", "true");
      setLocalSuccess(true);
    } else {
      const stored = getLocalStorageItem("waitlist_success");
      if (stored === "true") {
        setLocalSuccess(true);
      }
    }
  }, [waitlist.success, isClient]);

  const onSubmit = (data: JoinWaitlistEmailSchema) => {
    waitlist.mutate(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Join the waitlist</DialogTitle>
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

                <div className="flex justify-end">
                  <LoadingButton
                    type="submit"
                    loading={waitlist.isPending}
                    disabled={waitlist.isPending || !form.formState.isValid}
                  >
                    Join the waitlist
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

export default JoinWaitlistEmail;
