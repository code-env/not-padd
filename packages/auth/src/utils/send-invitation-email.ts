import { Resend } from "resend";
import React from "react";
import { env } from "@notpadd/env/server";
import TeamInviteEmail from "../emails/invitation";

const resend = new Resend(env.RESEND_API_KEY);

type SendInvitationEmailParams = {
  id: string;
  email: string;
  inviter: {
    user: {
      name: string;
      email: string;
    };
  };
  organization: {
    name: string;
  };
};

export const sendInvitationEmail = async (data: SendInvitationEmailParams) => {
  const inviteLink = `${env.FRONTEND_URL}/accept-invitation/${data.id}`;

  try {
    await resend.emails.send({
      from: env.EMAIL_FROM,
      to: data.email,
      subject: `You've been invited to join ${data.organization.name}`,
      react: React.createElement(TeamInviteEmail, {
        email: data.email,
        invitedByUsername: data.inviter.user.name,
        invitedByEmail: data.inviter.user.email,
        teamName: data.organization.name,
        inviteLink: inviteLink,
      }),
    });
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw error;
  }
};
