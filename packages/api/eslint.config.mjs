import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-case-declarations": "off",
        },
    },
];
