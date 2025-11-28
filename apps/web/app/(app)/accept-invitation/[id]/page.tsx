import { auth } from "@notpadd/auth/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@notpadd/db";
import { eq } from "drizzle-orm";
import schema from "@notpadd/db/schema";
import { headers } from "next/headers";
import { Card, CardContent, CardFooter } from "@notpadd/ui/components/card";
import { Button } from "@notpadd/ui/components/button";
import Link from "next/link";
import { AcceptInvitationForm } from "@/components/forms/accept-invitation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const AcceptInvitationPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const invitation = await db.query.invitation.findFirst({
    where: eq(schema.invitation.id, id),
    with: {
      organization: true,
    },
  });

  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user) {
    return redirect("/auth/login");
  }

  if (!invitation) {
    return notFound();
  }

  if (!invitation.organization) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="max-w-lg mx-auto w-full flex flex-col">
          <CardContent>
            <h1 className="text-2xl font-bold">Organization not found</h1>
            <p className="text-sm text-muted-foreground">
              The organization associated with this invitation no longer exists.
            </p>
            <CardFooter className="p-0">
              <Button className="mt-4 ml-auto" asChild>
                <Link href="/auth/login">Go back to home</Link>
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (invitation.expiresAt < new Date()) {
    return <InvitationExpired />;
  }

  if (invitation.email !== user.user.email) {
    return <EmailNotMatch />;
  }

  if (invitation.status === "pending") {
    return <AcceptInvitationForm invitation={invitation} />;
  }

  return redirect("/");
};

export default AcceptInvitationPage;

const EmailNotMatch = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="max-w-lg mx-auto w-full flex flex-col">
        <CardContent>
          <h1 className="text-2xl font-bold">Email not match</h1>
          <p className="text-sm text-muted-foreground">
            The email you are trying to use does not match the email on the
            invitation.
          </p>
          <CardFooter className="p-0">
            <Button className="mt-4 ml-auto" asChild>
              <Link href="/auth/login">Go back to home</Link>
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

const InvitationExpired = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <Card className="max-w-lg mx-auto w-full flex flex-col">
        <CardContent>
          <h1 className="text-2xl font-bold">Invitation expired</h1>
          <p className="text-sm text-muted-foreground">
            The invitation you are trying to use has expired.
          </p>
          <p className="text-sm text-muted-foreground">
            Please contact the administrator to get a new invitation.
          </p>
        </CardContent>
        <CardFooter className="p-0">
          <Button className="mt-4 ml-auto" asChild>
            <Link href="/auth/login">Go back to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
