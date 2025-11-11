import React from "react";
import Image from "next/image";
import { Button } from "@notpadd/ui/components/button";
import notpaddImage from "@/public/not.png";
import { Icons } from "@notpadd/ui/components/icons";

const Hero = () => {
  return (
    <div className="relative flex flex-col gap-20 pt-32 sm:pt-44 w-full">
      <div className="flex flex-col gap-4 justify-center max-w-xl w-full mx-auto px-6 sm:px-0">
        <h1 className="text-4xl font-bold">
          build time content for runtime speed
        </h1>
        <p className="text-lg">
          Notpadd is a developer-first CMS for Next.js that generates content at
          build time.
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
      <div className="border-t" />
    </div>
  );
};

export default Hero;
