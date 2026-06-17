import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Multi-page site: the hub (index.html) and the load-testing landing
// (loadtests.html). Each HTML file is its own Rollup entry so they build
// into separate bundles + CSS chunks.
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        loadtests: resolve(__dirname, "loadtests.html"),
      },
    },
  },
});
