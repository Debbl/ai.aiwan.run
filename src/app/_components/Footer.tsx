import Link from "next/link";
import { SiBluesky, SiGithub, SiX } from "react-icons/si";
import { Separator } from "~/components/ui/Separator";

export default function Footer() {
  return (
    <footer className="border-t border-border px-8 py-10 text-center text-sm">
      <div className="flex h-5 items-center space-x-4 text-sm">
        <Link
          href="https://github.com/Debbl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiGithub className="size-4" />
          <span className="sr-only">Github</span>
        </Link>
        <Separator orientation="vertical" />
        <Link
          href="https://x.com/Debbl66"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiX className="size-4" />
          <span className="sr-only">X</span>
        </Link>
        <Separator orientation="vertical" />
        <Link
          href="https://bsky.app/profile/debbl.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SiBluesky className="size-4" />
          <span className="sr-only">Bluesky</span>
        </Link>
      </div>
      <p>
        Made with ❤️ by{" "}
        <Link
          href="https://aiwan.run"
          target="_blank"
          rel="noopener noreferrer"
        >
          Brendan Dash
        </Link>
      </p>
    </footer>
  );
}
