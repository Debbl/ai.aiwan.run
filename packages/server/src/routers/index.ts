import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  greeting: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      return `hello ${opts.input.text} - ${Math.random()}`;
    }),
});

export type AppRouter = typeof appRouter;
