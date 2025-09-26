import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        // Disable Workbox/PWA features
        __WORKBOX_ENABLED__: false,
        'process.env.WORKBOX_DEBUG': false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        host: true, // Allow external connections
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor libraries into separate chunks
                    react: ['react', 'react-dom'],
                    router: ['react-router', 'react-router-dom'],
                    ui: ['@untitledui/icons', 'lucide-react', 'react-icons'],
                    forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
                    charts: ['recharts'],
                    carousel: ['embla-carousel-react', 'embla-carousel-autoplay'],
                    intl: ['next-intl'],
                    oauth: ['@react-oauth/google']
                }
            }
        },
        chunkSizeWarningLimit: 1000 // Increase limit to 1000kb
    }
});
