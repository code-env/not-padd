import { notFound } from "next/navigation";
import React, { type ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
