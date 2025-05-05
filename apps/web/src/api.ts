import { initClient } from "@ts-rest/core";
import { contract } from "@workspace/server/contract";
import type { ValueOf } from "type-fest";

export const baseUrl = "/api";

export const api = initClient(contract, {
  baseUrl,
  baseHeaders: {},
  throwOnUnknownStatus: true,
});

export function getApiUrl(route: ValueOf<typeof contract>) {
  return `${baseUrl}${route.path}`;
}
