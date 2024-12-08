import { domMax, LazyMotion } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
