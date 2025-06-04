import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
    },
  },
  {
    ignores: [
      "src/api/admin/custom/route.ts",
      "src/api/store/custom/route.ts",
      "src/scripts/seed.ts",
    ],
  },
]);
