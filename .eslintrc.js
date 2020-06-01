module.exports = {
    plugins: ['@typescript-eslint', 'import', 'jsx-a11y', 'prettier', 'react-hooks'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
        project: ['./tsconfig.json'],
    },
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/react',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier/react',
        'prettier/@typescript-eslint',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx'],
            },
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es2020: true,
        jest: true,
        node: true,
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
        react: {
            version: 'detect',
        },
    },
    rules: {
        'import/default': 'off',
        'import/named': 'off',
        'import/newline-after-import': 'warn',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/order': ['warn', { 'newlines-between': 'always', groups: ['builtin', 'external'] }],
        'no-undef': 'warn',
        'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
        'prettier/prettier': 'error',
        'react/prop-types': 'off',
        'react/self-closing-comp': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
    },
};
