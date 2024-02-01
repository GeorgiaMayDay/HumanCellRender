import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "https://georgiamayday.github.io/HumanCellRender/",
    publicPath: process.env.NODE_ENV === 'production' ?
        '/HumanCellRender/' : '/'
});