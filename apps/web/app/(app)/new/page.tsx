import { CreateWorkspace } from "@/components/forms/create-workspace";
import React, { memo } from "react";

const Page = memo(() => {
  return (
    <div className="flex flex-col items-center relative min-h-screen justify-center p-20">
      <div className="flex flex-col gap-8 w-full max-w-md items-center">
        <h1 className="text-xl font-semibold">Create a workspace</h1>
        <CreateWorkspace />
      </div>
    </div>
  );
});

Page.displayName = "NewPage";

export default Page;
