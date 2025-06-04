import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser"; // Import the TypeScript parser

export default defineConfig([
  {
    files: ["src/**/*.{ts,tsx}"],
    // Configure language options for TypeScript files
    languageOptions: {
      parser: tsParser, // Specify the TypeScript parser
      parserOptions: {
        ecmaVersion: "latest", // Use the latest ECMAScript version
        sourceType: "module", // Indicate that the code uses ES modules
        project: "./tsconfig.json", // Crucial for type-aware linting; ensures ESLint understands your project's types
        EXPERIMENTAL_useProjectService: true, // Recommended for performance with the 'project' option
        // If your Medusa.js project uses experimental decorators (common in older TS setups),
        // you might need to explicitly enable them here. However, with `project` set,
        // the parser often infers this from your `tsconfig.json`.
        // If issues persist, uncomment the line below:
        // experimentalDecorators: true,
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing for .tsx files
        },
      },
    },
    rules: {
      "prefer-const": "warn",
      "no-constant-binary-expression": "error",
      // Add any other TypeScript-specific rules or overrides here if needed
    },
  },
  {
    // These files will be ignored by ESLint
    ignores: [
      "src/api/admin/custom/route.ts",
      "src/api/store/custom/route.ts",
      "src/scripts/seed.ts",
    ],
  },
]);
