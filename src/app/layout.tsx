import { Toaster } from "sonner";
import { Providers } from "~/providers";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The client first ai apps",
  description: "A collection of client first ai apps",
  icons: ["favicon.svg"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
