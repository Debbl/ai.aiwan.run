import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const contract = c.router({
  aiFortuneTeller: {
    method: "POST",
    path: `/ai-fortune-teller`,
    body: z.any(),
    responses: {
      200: c.otherResponse({
        contentType: "text/plain; charset=utf-8",
        body: z.any(),
      }),
    },
  },
  aiGhibliGenerator: {
    method: "POST",
    path: `/ai-ghibli-generator`,
    body: z.object({
      image: z.string(),
      ratio: z.string(),
    }),
    responses: {
      200: c.otherResponse({
        contentType: "text/plain; charset=utf-8",
        body: z.any(),
      }),
    },
  },
});
