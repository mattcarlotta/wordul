import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
                reveal: "reveal 1250ms both",
            },
            keyframes: {
                pop: {
                    "from": { transform: "scale(0.8)", opacity: "0" },
                    "40%": { transform: "scale(1.1)", opacity: "1" },
                },
                push: {
                    "from": { transform: "scale(1.1)", opacity: "1" },
                    "40%": { transform: "scale(0.8)", opacity: "0" },
                },
                reveal: {
                    "0%": { transform: "rotateX(-180deg)", border: "2px solid #374151", color: "rgba(0, 0, 0, 0.0)", background: "transparent" },
                    "30%": { color: "rgba(0,0,0,0.0)", background: "transparent" },
                    "100%": { transform: "rotateX(0)", border: "none" },
                }
            },
            animationDelay: {
                "400": "400ms",
            },
            transitionDelay: {
                "400": "400ms",
            }
        },
    },
    plugins: [
        plugin(({ matchUtilities, theme }) => {
            matchUtilities(
                {
                    "animation-delay": (value) => {
                        return {
                            "animation-delay": value,
                        };
                    },
                },
                {
                    values: theme("transitionDelay"),
                }
            );
        }),
    ],
};
export default config;
