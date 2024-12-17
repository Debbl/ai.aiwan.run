import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-3xl font-bold">The client first AI apps</h1>

      <div className="mt-12">
        <Link href="/object-detector">Object Detector</Link>
      </div>
    </main>
  );
}
