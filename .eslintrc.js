module.exports = {
    plugins: ["@typescript-eslint", "import", "import", "jsx-a11y", "prettier", "react-hooks"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        sourceType: "module",
        project: ["./tsconfig.json"]
    },
    extends: [
        "eslint:recommended",
        "plugin:import/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/react",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:prettier/recommended",
        "prettier/react",
        "prettier/@typescript-eslint"
    ],
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx"]
            }
        }
    },
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
        jest: true,
        node: true
    },
    settings: {
        react: {
            version: "detect"
        }
    },
    rules: {
        "import/newline-after-import": "warn",
        "import/order": ["warn", { "newlines-between": "always", groups: ["builtin", "external"] }],
        "prettier/prettier": "error",
        "react/prop-types": "off"
    }
};
