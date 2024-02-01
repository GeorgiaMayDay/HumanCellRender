import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "https://georgiamayday.github.io/HumanCellRender/",
});

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ?
        '/HumanCellRender/' :
        '/',
};