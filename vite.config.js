import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    publicDir: 'public',
    server: {
        port: 5173,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            input: {
                main: 'index.html',
                mobile: 'mobile.html'
            }
        }
    }
}); 