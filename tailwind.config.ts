import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                pop: "pop 100ms",
                push: "push 100ms",
            },
            keyframes: {
                pop: {
                    "from": { transform: "scale(0.8)", opacity: "0" },
                    "40%": { transform: "scale(1.1)", opacity: "1" },
                },
                push: {
                    "from": { transform: "scale(1.1)", opacity: "1" },
                    "40%": { transform: "scale(0.8)", opacity: "0" },
                }
            }
        },
    },
    plugins: [],
};
export default config;
