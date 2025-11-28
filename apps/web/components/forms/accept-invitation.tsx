"use client";

import { authClient } from "@notpadd/auth/auth-client";
import type { Invitation, Organization } from "@notpadd/db/types";
import { Button } from "@notpadd/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@notpadd/ui/components/card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@notpadd/ui/components/loading-button";

export const AcceptInvitationForm = ({
  invitation,
}: {
  invitation: Invitation & { organization: Organization };
}) => {
  const router = useRouter();

  const { mutate: acceptInvitation, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await authClient.organization.acceptInvitation({
        invitationId: invitation.id,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Invitation accepted successfully");
      router.push(`/`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="max-w-lg mx-auto w-full flex flex-col">
        <CardContent className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Accept Invitation</CardTitle>
            <CardDescription>
              Accept the invitation to join the{" "}
              <span className="font-bold text-primary first-letter:uppercase">
                {invitation.organization.name}
              </span>
            </CardDescription>
          </CardHeader>
          <div className="w-full  flex gap-2">
            <LoadingButton
              loading={isPending}
              disabled={isPending}
              onClick={() => acceptInvitation()}
              className="flex-1"
            >
              Accept Invitation
            </LoadingButton>
            <LoadingButton
              variant="destructive"
              onClick={() => acceptInvitation()}
              className="flex-1"
            >
              Reject Invitation
            </LoadingButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
