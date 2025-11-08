import React from "react";
import Image from "next/image";
import notpaddImage from "@/public/not.png";

const Preview = () => {
  return (
    <div className="w-full mx-auto ring-foreground/5 border-x">
      <div className="aspect-3/2 relative overflow-hidden">
        <Image
          alt="Notpadd demo"
          fill
          className="object-cover object-top"
          src={notpaddImage}
          placeholder="blur"
        />
      </div>
    </div>
  );
};

export default Preview;
