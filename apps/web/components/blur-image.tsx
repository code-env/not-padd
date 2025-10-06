"use client";
import { cn } from "@notpadd/ui/lib/utils";
import Image from "next/image";
import React, { useState } from "react";

type BlurImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  blurDataURL?: string;
  alt: string;
};

export default function BlurImage({
  src,
  blurDataURL,
  alt,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const isExternalLink = !src?.startsWith("https://wqjxt2y032.ufs.sh");

  return (
    <div className="relative overflow-hidden size-full">
      {isExternalLink ? (
        <>
          {blurDataURL && isLoading && (
            <img
              src={blurDataURL}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover blur-xl scale-105 transition-opacity duration-500"
            />
          )}
          <img
            src={src as string}
            alt={alt}
            onLoad={() => setIsLoading(false)}
            className={cn("transition-all duration-700 ease-out size-full", {
              "opacity-0 scale-105": isLoading,
              "opacity-100 scale-100": !isLoading,
            })}
            {...props}
          />
        </>
      ) : (
        <Image
          fill
          src={src as string}
          alt={alt}
          className="object-cover"
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      )}
    </div>
  );
}
