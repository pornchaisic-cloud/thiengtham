import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://thiengtham-development.pages.dev",
  output: "static",
  build: {
    format: "directory",
  },
});
