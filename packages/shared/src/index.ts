import { Temporal } from "@js-temporal/polyfill";
import { PORT, VERCEL_URL } from "@workspace/env";
import superjson from "superjson";

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDate =>
      v instanceof Temporal.PlainDate,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => Temporal.PlainDate.from(v),
  },
  "Temporal.PlainDate",
);

superjson.registerCustom(
  {
    isApplicable: (v): v is Temporal.PlainDateTime =>
      v instanceof Temporal.PlainDateTime,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => Temporal.PlainDateTime.from(v),
  },
  "Temporal.PlainDateTime",
);

export const transformer = superjson;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (VERCEL_URL) return `https://${VERCEL_URL}`;
  const port = PORT ?? 3000;
  return `http://localhost:${port}`;
}

export function getUrl() {
  return `${getBaseUrl()}/api/trpc`;
}
