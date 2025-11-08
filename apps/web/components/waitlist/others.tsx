import React from "react";

const Others = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-6xl mx-auto w-full px-2 border-x bg-[repeating-linear-gradient(-45deg,var(--border),var(--border)_1px,transparent_1px,transparent_6px)]">
      {children}
    </div>
  );
};

export default Others;
