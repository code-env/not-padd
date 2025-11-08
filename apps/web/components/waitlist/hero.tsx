import React from "react";
import Image from "next/image";
import { Button } from "@notpadd/ui/components/button";
import notpaddImage from "@/public/not.png";

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
        <Button variant="default" className="w-fit">
          Join the waitlist
        </Button>
      </div>
      <div className="border-t" />
    </div>
  );
};

export default Hero;
