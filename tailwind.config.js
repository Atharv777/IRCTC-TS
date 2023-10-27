const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // ...
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {},
    darkMode: "class",
    plugins: [nextui({
        themes: {
            light: {
                colors: {
                    primary: {
                        DEFAULT: "#2E8A99",
                        foreground: "#000000"
                    }
                }
            }
        }
    })],
};