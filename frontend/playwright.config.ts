import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // The target app runs via `next dev` (Turbopack), which lazily compiles each
  // route on first request. Running specs fully in parallel causes concurrent
  // first-hits on different routes to serialize/slow down enough to blow past
  // the default 5s expect timeout, causing flaky failures that aren't real bugs.
  fullyParallel: false,
  // Different spec files would otherwise still run concurrently across workers;
  // force full serialization since all specs share one `next dev` instance.
  workers: 1,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost",
    trace: "on-first-retry",
  },
});
