import { expect, test } from '../../fixtures';
import { credentialsFor, type LoginCase } from '../../helpers/login.helper';
import loginCases from '../../test-data/login.json';

test.describe('Login form validation', { tag: '@regression' }, () => {
  // The login form itself is under test, so these tests start logged out instead of from a saved session.
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  for (const loginCase of loginCases as LoginCase[]) {
    test(loginCase.behaviour, async ({ loginPage }) => {
      const { username, password } = credentialsFor(loginCase);

      await loginPage.submit(username, password);

      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText(loginCase.error);
      await expect(loginPage.loginButton, 'user stays on the login form').toBeVisible();
    });
  }
});
