"use client";
import { TRPCReactProvider } from "../../trpc/provider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
