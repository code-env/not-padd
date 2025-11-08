import { notFound } from "next/navigation";
import React, { type ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  if (process.env.NODE_ENV === "production") return notFound();
  return <div>{children}</div>;
};

export default AuthLayout;
