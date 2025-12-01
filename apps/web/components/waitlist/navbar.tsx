"use client";

import useWaitlistModal from "@/hooks/use-waitlist-modal";
import { siteConfig } from "@notpadd/ui/lib/utils";
import { Button } from "@notpadd/ui/components/button";
import { Icons } from "@notpadd/ui/components/icons";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { onOpen } = useWaitlistModal();
  return (
    <header className="h-16 flex items-center sticky top-0 bg-background z-50">
      <nav className="flex max-w-6xl px-6 mx-auto w-full h-full border-b border-dashed items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold flex items-center gap-2"
        >
          <Icons.icon className="size-10 hidden dark:block" />
          <Icons.iconsDark className="size-10 block dark:hidden" />
          Notpadd
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={siteConfig.links.github} target="_blank">
              <Icons.github className="size-4" />
              GitHub
            </Link>
          </Button>
          <Button onClick={onOpen}>
            <Icons.iconsDark className="size-5" />
            Join Waitlist
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
