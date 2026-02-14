import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        '.next/**',
        'out/**',
        'build/**',
        'next-env.d.ts',
        'eslint.config.mjs',
    ]),
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/require-await': 'warn',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unused-vars': ['off'], // TS-aware unused vars check
            '@typescript-eslint/no-explicit-any': 'warn', // warn on use of any type
            '@typescript-eslint/no-inferrable-types': 'warn', // warn on redundant type annotations
            '@typescript-eslint/no-unsafe-member-access': 'error',
            '@typescript-eslint/no-unsafe-argument': 'warn',
        },
    },
    {
        rules: {
            eqeqeq: 'error', // enforce === instead of ==
            'no-console': 'warn', // warn on console.log usage
            'no-debugger': 'error', // disallow debugger statements
            'no-unused-vars': 'off', // disable JS version; use TS version instead
            curly: 'off', // require braces for all control statements
            'no-undef': 'error', // disallow use of undeclared variables
            'no-redeclare': 'error', // disallow variable redeclaration
            'no-unreachable': 'error', // disallow unreachable code after return/throw
            semi: ['error', 'always'], // require semicolons
            quotes: 'off', // enforce single quotes for strings
            indent: ['off', 4], // enforce 4-space indentation
            'require-await': 'off',
            'comma-dangle': ['off', 'never'], // require trailing commas in multiline
        },
    },
]);

export default eslintConfig;
