import { test as setup } from '../fixtures';
import { env, storageStatePath, type SauceUserKey } from '../helpers/env.helper';

// Logs every configured user in once and saves the session; UI fixtures reuse it via storageState.
for (const user of Object.keys(env.users) as SauceUserKey[]) {
  setup(`authenticate ${user} user`, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.loginAs(env.users[user], env.password);
    await page.context().storageState({ path: storageStatePath(user) });
  });
}
