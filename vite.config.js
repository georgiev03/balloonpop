import { defineConfig } from 'vite';

export default defineConfig({
    base: '/balloonpop/',
    publicDir: 'public',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true
    }
}); 