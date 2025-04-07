import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Ghibli Generator",
  description: "AI Ghibli Generator",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <footer className="flex items-center justify-center gap-x-2 border-t border-gray-200 bg-background/50 py-4 backdrop-blur-sm">
        <Link
          href="https://aiwan.run"
          target="_blank"
          data-umami-event="click-aiwan-run"
        >
          me
        </Link>
      </footer>
    </>
  );
}
