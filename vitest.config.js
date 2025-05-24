import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.js"],
    exclude: ["tests/**/*.spec.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
