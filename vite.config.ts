import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/', // <-- this is important!
    optimizeDeps: {
        include: ["@babylonjs/core", "@babylonjs/gui", "babylonjs", "babylonjs-charactercontroller"],
        // exclude: ['../libs/CharacterController.mjs'], // don't prebundle this
    },
    build: {
        // commonjsOptions: {
        //     transformMixedEsModules: true, // 👈 force-transform .mjs with require()
        // },
        // rollupOptions: {
        //     external: ['../libs/CharacterController.mjs'], // keep it as a separate request
        // },
    }
});

