import { NextUIProvider } from "@nextui-org/system";
import { domMax, LazyMotion } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <LazyMotion features={domMax}>{children}</LazyMotion>
    </NextUIProvider>
  );
}
