"use client";

import useWaitlistModal from "@/hooks/use-waitlist-modal";
import { siteConfig } from "@notpadd/ui/lib/utils";
import { Button } from "@notpadd/ui/components/button";
import { Icons } from "@notpadd/ui/components/icons";
import Link from "next/link";
import React from "react";

const Cta = () => {
  const { onOpen } = useWaitlistModal();
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
          <Button variant="default" className="w-fit" onClick={onOpen}>
            Join the waitlist
          </Button>
          <Button variant="outline" className="w-fit" asChild>
            <Link href={siteConfig.links.github} target="_blank">
              <Icons.github className="size-4" />
              View on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cta;
