import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Ghibli Generator",
  description: "AI Ghibli Generator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
