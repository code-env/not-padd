import { Button } from "@notpadd/ui/components/button";
import { Icons } from "@notpadd/ui/components/icons";
import React from "react";

const Cta = () => {
  return (
    <div className="border-t bg-background py-20 border-x">
      <div className="flex flex-col gap-4 justify-center max-w-xl w-full mx-auto px-6 sm:px-0 py-10">
        <h1 className="text-3xl font-bold">
          Publishing should feel like writing instant and effortless.
        </h1>
        <p className="text-lg text-muted-foreground">
          Join the waitlist today and be part of the next generation of
          developer-first publishing.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="default" className="w-fit">
            Join the waitlist
          </Button>
          <Button variant="outline" className="w-fit">
            <Icons.github className="size-4" />
            View on GitHub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cta;
