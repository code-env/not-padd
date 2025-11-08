import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="h-16 flex items-center sticky top-0 bg-background z-50">
      <nav className="flex max-w-6xl px-6 mx-auto w-full h-full bg-red-500 border-b items-center justify-between">
        <p className="text-lg font-semibold">Notpadd</p>
      </nav>
    </header>
  );
};

export default Navbar;
