import type { Metadata } from "next";
import React from "react";
import { GithubAppLogin } from "@/components/auth/github-app-login";

export const metadata: Metadata = {
  title: "General",
};

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <GithubAppLogin />
    </div>
  );
};

export default SettingsPage;
