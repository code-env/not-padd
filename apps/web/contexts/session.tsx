"use client";

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { type Session } from "@notpadd/auth/auth";
import { useRouter } from "next/navigation";

type SessionContextType = Session;

export const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: Session }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
