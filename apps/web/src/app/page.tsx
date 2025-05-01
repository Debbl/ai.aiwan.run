"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "../trpc/context";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.greeting.queryOptions({ text: "world" }));

  // eslint-disable-next-line no-console
  console.log("🚀 ~ Home ~ data:", data);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-12">
      <h1 className="text-3xl font-bold">The client first AI apps</h1>

      <div className="mt-12 flex flex-col gap-y-2">
        <Link className="hover:text-blue-400" href="/object-detector">
          Object Detector
        </Link>
        <Link className="hover:text-blue-400" href="/segment-anything">
          Segment Anything
        </Link>
        <Link className="hover:text-blue-400" href="/ai-fortune-teller">
          AI Fortune Teller
        </Link>
        <Link className="hover:text-blue-400" href="/ai-ghibli-generator">
          AI Ghibli Generator
        </Link>
      </div>
    </main>
  );
}
