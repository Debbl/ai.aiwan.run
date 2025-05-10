// @ts-check
import { defineConfig } from "@debbl/eslint-config";

export default defineConfig({
  ignores: {
    files: ["**/drizzle/*"],
  },
  typescript: {
    overrides: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "motion/react",
              importNames: ["motion"],
              message:
                "Please use the import from 'motion/react-m' instead and it is auto-imported.",
            },
          ],
        },
      ],
    },
  },
  react: {
    next: true,
    compiler: true,
  },
  tailwindcss: "prettier",
});
