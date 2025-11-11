"use client";

import useWaitlistModal from "@/hooks/use-waitlist-modal";
import { marketingLinks } from "@/lib/constants";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@notpadd/ui/components/button";
import { Icons } from "@notpadd/ui/components/icons";
import { cn } from "@notpadd/ui/lib/utils";
import Link from "next/link";

const Footer = () => {
  const { onOpen } = useWaitlistModal();
  return (
    <footer className="border-t border-border/50 font-inter flex flex-col gap-10 relative">
      <div className=" max-w-6xl px-6 mx-auto w-full pb-20">
        <div className="flex flex-col md:flex-row  gap-x-20 w-full">
          <div className="pt-20 md flex-1 flex flex-col gap-20 md:w-1/2">
            <div className="flex flex-col gap-4 md:max-w-md w-full">
              <h1>
                <Icons.icon className="size-10" /> Notpadd
              </h1>
              <p className="text-lg text-muted-foreground">
                {siteConfig.description}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                className={cn(buttonVariants({ variant: "default" }), "w-fit")}
              >
                Join waitlist
              </Link>
            </div>
          </div>
          <div className="pt-20 flex-1 flex flex-col gap-20 lg:!w-1/2 md:pl-20 w-full">
            <div className="flex gap-40">
              <ul className="flex flex-col gap-4">
                {marketingLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      className="text-lg font-medium capitalize text-muted-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Made with 🩶 by {siteConfig.links.author} with some components
                from{" "}
                <Link
                  href={siteConfig.links.tailark}
                  target="_blank"
                  className="hover:text-black font-medium underline"
                >
                  Tailark
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
