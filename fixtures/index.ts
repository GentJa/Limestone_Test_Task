import { mergeTests } from '@playwright/test';
import { test as apiTest } from './api.fixture';
import { test as uiTest } from './ui.fixture';

// Single entry point: every spec imports `test` and `expect` from here, never from @playwright/test.
export const test = mergeTests(uiTest, apiTest);
export { expect } from '@playwright/test';
