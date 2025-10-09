import { defineConfig } from "srvx";

export default defineConfig({
  experimental: {
    stripTypes: true,
  },
  server: {
    port: 3000,
  },
});
