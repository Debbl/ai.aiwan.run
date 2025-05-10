/* eslint-disable n/prefer-global/process */
import dotenv from "dotenv";

dotenv.config({
  path: ["../../apps/web/.env.local"],
});

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const VERCEL_URL = process.env.VERCEL_URL;
export const TU_ZI_API_KEY = process.env.TU_ZI_API_KEY;
export const TU_ZI_BASE_URL = process.env.TU_ZI_BASE_URL;
export const ANALYZE = process.env.ANALYZE;
export const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
export const CLOUDFLARE_D1_TOKEN = process.env.CLOUDFLARE_D1_TOKEN || "";
export const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || "";
