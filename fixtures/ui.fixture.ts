import { test as base, type Browser } from '@playwright/test';
import { storageStatePath, type SauceUserKey } from '../helpers/env.helper';
import { CartPage } from '../pages/cart.page';
import { CheckoutInfoPage } from '../pages/checkout-info.page';
import { CheckoutOverviewPage } from '../pages/checkout-overview.page';
import { InventoryPage } from '../pages/inventory.page';
import { LoginPage } from '../pages/login.page';

/** The page objects of one logged-in SauceDemo user, all bound to that user's own browser context. */
export interface SauceSession {
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
}

interface UiFixtures {
  loginPage: LoginPage;
  standardUser: SauceSession;
  problemUser: SauceSession;
}

// Each user gets a fresh context from its saved session, so no test logs in through the UI and no state leaks.
async function sessionFor(
  browser: Browser,
  user: SauceUserKey,
  use: (session: SauceSession) => Promise<void>,
): Promise<void> {
  const context = await browser.newContext({ storageState: storageStatePath(user) });
  const page = await context.newPage();
  await use({
    inventoryPage: new InventoryPage(page),
    cartPage: new CartPage(page),
    checkoutInfoPage: new CheckoutInfoPage(page),
    checkoutOverviewPage: new CheckoutOverviewPage(page),
  });
  await context.close();
}

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  standardUser: async ({ browser }, use) => sessionFor(browser, 'standard', use),
  problemUser: async ({ browser }, use) => sessionFor(browser, 'problem', use),
});
