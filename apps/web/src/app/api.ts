import { initClient } from "@ts-rest/core";
import { router } from "@workspace/server/router";
import type { ValueOf } from "type-fest";

export const baseUrl = "/api";

export const api = initClient(router, {
  baseUrl,
  baseHeaders: {},
  throwOnUnknownStatus: true,
});

export function getApiUrl(route: ValueOf<typeof router>) {
  return `${baseUrl}${route.path}`;
}
