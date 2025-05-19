import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/generated/**',
      '**/prisma/generated/**'
    ],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-prototype-builtins': 'off',
      'no-this-alias': 'off',
      'no-constant-binary-expression': 'off',
      'no-empty': 'off',
      'no-cond-assign': 'off',
      'no-redeclare': 'off',
      'no-unreachable': 'off',
      'no-undef': 'off'
    }
  }
) 