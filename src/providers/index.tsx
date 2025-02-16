import { HeroUIProvider } from "@heroui/system";
import { domMax, LazyMotion } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider locale="zh-CN">
      <LazyMotion features={domMax}>{children}</LazyMotion>
    </HeroUIProvider>
  );
}
