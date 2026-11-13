import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'blob-report/'] },
  ...tseslint.configs.recommended,
  {
    // Turns the wait, assertion and structure rules from CLAUDE.md into lint errors for specs.
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-raw-locators': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      // These functions assert internally: the shared checkout scenario, and loginAs (waits for the product page).
      'playwright/expect-expect': ['error', { assertFunctionNames: ['checkoutShowsCorrectTotals', 'loginAs'] }],
    },
  },
);
