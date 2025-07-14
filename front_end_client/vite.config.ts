import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Cấu hình @ trỏ tới thư mục src
    },
  },
  optimizeDeps: {
    include: ["react-froala-wysiwyg", "froala-editor"],
  },
  server: {
    port: 3000,
  },
  define: {
    global: 'globalThis'
  }
});
