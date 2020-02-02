module.exports = {
    extends: [
        "@ryan-rushton/eslint-config",
        "@ryan-rushton/eslint-config/typescript-react-prettier"
    ],
    rules: {
        "import/named": "off",
        "import/namespace": "off",
        "import/order": ["warn", { "newlines-between": "always", groups: ["builtin", "external"] }],
        "import/newline-after-import": "warn"
    }
};
