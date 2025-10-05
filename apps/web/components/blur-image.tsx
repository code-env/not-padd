"use client";
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

  return (
    <div className="relative overflow-hidden">
      {blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-105 transition-opacity duration-500"
        />
      )}

      <img
        src={src as string}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        className={`transition-all duration-700 ease-out ${
          isLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
        } w-full h-full object-cover`}
        {...props}
      />
    </div>
  );
}
