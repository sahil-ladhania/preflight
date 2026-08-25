import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@preflight/schemas": path.resolve(
        __dirname,
        "../../packages/schemas/src/index.ts",
      ),
    },
  },
  test: {
    environment: "node",
  },
});
