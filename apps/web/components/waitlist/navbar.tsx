import { Button } from "@notpadd/ui/components/button";
import { Icons } from "@notpadd/ui/components/icons";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="h-16 flex items-center sticky top-0 bg-background z-50">
      <nav className="flex max-w-6xl px-6 mx-auto w-full h-full border-b border-dashed items-center justify-between">
        <Link
          href="/"
          className="text-lg font-semibold flex items-center gap-2"
        >
          <Icons.icon className="size-10" /> Notpadd
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Icons.github className="size-4" />
            GitHub
          </Button>
          <Button>
            <Icons.iconsDark className="size-5" />
            Join Waitlist
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
