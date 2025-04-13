import { HeroUIProvider } from "@heroui/system";
import { domMax, LazyMotion } from "motion/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeroUIProvider locale="zh-CN">
        <LazyMotion features={domMax}>{children}</LazyMotion>
      </HeroUIProvider>
    </ThemeProvider>
  );
}
