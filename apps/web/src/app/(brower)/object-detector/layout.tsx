import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Object Detector",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
