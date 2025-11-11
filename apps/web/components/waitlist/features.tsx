import React from "react";
import Image from "next/image";
import zenithImage from "@/public/zenith.png";
import Link from "next/link";

const Features = () => {
  return (
    <div className="border-t border-x">
      <Message />
      <FeaturesList />
    </div>
  );
};

const Message = () => {
  return (
    <div className="text-muted-foreground space-y-4 text-xl *:leading-relaxed md:text-2xl  py-20 bg-background">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
        <p>
          “I built Notpadd out of frustration. Every CMS I used tried too hard
          to do everything for me instead of with me. I just wanted something
          that respected my workflow, lived in my repo, and spoke TypeScript
          natively. So I built Notpadd. A CMS that doesn&apos;t get in your way,
          but builds right beside you.”
        </p>

        <Link
          href="https://bossadizenith.me"
          target="_blank"
          className="flex items-center gap-4"
        >
          <div className="size-10 relative">
            <Image
              src={zenithImage}
              alt="Zenith"
              fill
              placeholder="blur"
              className="object-cover rounded-full"
            />
          </div>
          <p className="flex flex-col">
            <span className="text-sm font-semibold text-primary">Zenith</span>
            <span className="text-xs text-muted-foreground">
              @bossadizenith
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
};

const FeaturesList = () => {
  return (
    <div className="border-t flex-col flex">
      <div></div>
      <div className="bg-sidebar"></div>
    </div>
  );
};

export default Features;
