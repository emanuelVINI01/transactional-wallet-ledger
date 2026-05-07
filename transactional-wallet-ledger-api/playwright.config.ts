import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  reporter: "list",
  fullyParallel: false,
  workers: 1,
  use: {
    extraHTTPHeaders: {
      "content-type": "application/json",
    },
  },
});
