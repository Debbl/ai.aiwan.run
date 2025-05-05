import { createNextHandler } from "@ts-rest/serverless/next";
import { contract } from "./contract";
import { router } from "./routes";

export const handler = createNextHandler(contract, router, {
  basePath: "/api",
  handlerType: "app-router",
});
