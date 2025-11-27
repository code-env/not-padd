import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

type TeamInviteEmailProps = {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
};

const TeamInviteEmail = (props: TeamInviteEmailProps) => {
  const { email, invitedByUsername, invitedByEmail, teamName, inviteLink } =
    props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>You've been invited to join {teamName}</Preview>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[16px]">
                You're invited to join <strong>{teamName}</strong>
              </Heading>
              <Text className="text-[16px] text-gray-600 m-0">
                {invitedByUsername} has invited you to collaborate on{" "}
                <strong>{teamName}</strong>
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                Hi there,
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[16px]">
                {invitedByUsername} ({invitedByEmail}) has invited you to join{" "}
                <strong>{teamName}</strong>. You'll be able to collaborate with
                the team and access shared resources once you accept this
                invitation.
              </Text>
              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[24px]">
                Click the button below to accept your invitation and get
                started:
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="text-center mb-[32px]">
              <Button
                href={inviteLink}
                className="bg-blue-600 text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-semibold no-underline box-border inline-block"
              >
                Accept Invitation
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-[32px]">
              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[8px]">
                If the button doesn't work, you can also copy and paste this
                link into your browser:
              </Text>
              <Link
                href={inviteLink}
                className="text-[14px] text-blue-600 underline break-all"
              >
                {inviteLink}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="bg-gray-50 p-[16px] rounded-[6px] mb-[32px]">
              <Text className="text-[14px] text-gray-600 m-0 leading-[20px] font-semibold">
                Security note:
              </Text>
              <Text className="text-[14px] text-gray-600 m-0 leading-[20px]">
                This invitation was sent to {email}. If you weren't expecting
                this invitation or believe it was sent in error, you can safely
                ignore this email.
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-gray-200 pt-[24px]">
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                This invitation was sent by {invitedByUsername} from {teamName}.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0 mb-[8px]">
                © {new Date().getFullYear()} {teamName}. All rights reserved.
              </Text>
              <Text className="text-[12px] text-gray-500 leading-[16px] m-0">
                123 Business Street, Suite 100, Business City, BC 12345
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TeamInviteEmail;
