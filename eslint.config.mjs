import { defineConfig } from 'eslint/config'
import { FlatCompat } from '@eslint/eslintrc'
import unusedImports from 'eslint-plugin-unused-imports'

const __dirname = new URL('.', import.meta.url).pathname

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

// https://nextjs.org/docs/app/api-reference/config/eslint#with-core-web-vitals
export default defineConfig([
  {
    ignores: [
      '.tmp',
      '**/.git',
      '**/.hg',
      '**/.pnp.*',
      '**/.svn',
      '**/.yarn/**',
      '**/build',
      '**/dist/**',
      '**/node_modules',
      '**/temp',
      '**/docs/**',
      'playwright.config.ts',
      'jest.config.js',
      '**/.next',
      '**/.vercel',
      'postcss.config.js',
      '**/payload-types.ts'
    ],
  },
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },


    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      /**
       * Just ignore this rule for now during the migration of shadcnblocks
       */
      '@next/next/no-img-element': 'off',

      // this rule is currently extreamly anoying. We should try to work towards to activate it, but for now we disable it.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      'unused-imports/no-unused-imports': 'warn',

      // some libs like shadcn/ui have empty interfaces, just to name them differently.
      '@typescript-eslint/no-empty-object-type': 'off',

    },
  },
  {
    files: ['eslint.config.mjs'],
    languageOptions: {
      parserOptions: {
        // Disable typed linting for this config file to avoid tsconfig inclusion errors
        project: null,
      },
    },
  },
])
