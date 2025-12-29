import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      // Add better error overlay
      overlay: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Bind to all interfaces for Render
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: false, // Allow fallback to another port
    allowedHosts: [
      "stellarforge.onrender.com",
      "localhost",
      "127.0.0.1",
      "0.0.0.0"
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          stellar: ["@stellar/stellar-sdk", "@stellar/freighter-api"],
          ui: ["framer-motion", "lucide-react"],
          routing: ["react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
    drop: ["console", "debugger"],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@stellar/stellar-sdk",
      "@stellar/freighter-api",
    ],
  },
  define: {
    global: "globalThis",
  },
});