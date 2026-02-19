import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@common": resolve(__dirname, "../common"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "../common/tests/**/*.test.ts"],
  },
});
