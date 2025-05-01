import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@workspace/server/routers";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
