import { expect, test } from '../../fixtures';
import { type SauceSession } from '../../fixtures/ui.fixture';
import { expectedTotals, formatPrice } from '../../helpers/price.helper';
import checkoutData from '../../test-data/checkout.json';

const PROBLEM_USER_DEFECT =
  'DEFECT: problem_user, checkout step one - typing into Last Name overwrites First Name, so checkout cannot continue.';

/** The same checkout scenario for every user: buy the test products and check the overview totals. */
async function checkoutShowsCorrectTotals(session: SauceSession): Promise<void> {
  const { inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage } = session;
  const { products, customer } = checkoutData;

  const prices = await test.step('add products to the cart', async () => {
    const added = await inventoryPage.addProducts(products);
    await expect(inventoryPage.cartBadge).toHaveText(String(products.length));
    return added;
  });

  await test.step('go through cart and customer info', async () => {
    await inventoryPage.openCart();
    await expect(cartPage.itemNames).toHaveText(products);
    await cartPage.checkout();
    await checkoutInfoPage.submit(customer);
  });

  await test.step('overview totals match the selected item prices', async () => {
    const expected = expectedTotals(prices);
    await expect(checkoutOverviewPage.itemNames).toHaveText(products);
    await expect(checkoutOverviewPage.itemPrices).toHaveText(prices.map(formatPrice));
    await expect(checkoutOverviewPage.itemTotal).toBeVisible();
    await expect(checkoutOverviewPage.itemTotal).toHaveText(`Item total: ${formatPrice(expected.itemTotal)}`);
    await expect(checkoutOverviewPage.tax).toHaveText(`Tax: ${formatPrice(expected.tax)}`);
    await expect(checkoutOverviewPage.total).toHaveText(`Total: ${formatPrice(expected.total)}`);
  });
}

test.describe('Checkout overview totals', { tag: '@regression' }, () => {
  test.describe('as standard_user', () => {
    test.beforeEach(async ({ standardUser }) => {
      await standardUser.inventoryPage.open();
    });

    test(
      'shows item total, tax and total that match the prices of the selected items',
      { tag: '@smoke' },
      async ({ standardUser }) => {
        await checkoutShowsCorrectTotals(standardUser);
      },
    );
  });

  test.describe('as problem_user', () => {
    test.beforeEach(async ({ problemUser }) => {
      await problemUser.inventoryPage.open();
    });

    test(
      'shows item total, tax and total that match the prices of the selected items',
      { tag: '@defect', annotation: { type: 'defect', description: PROBLEM_USER_DEFECT } },
      async ({ problemUser }) => {
        // Reported as "expected to fail"; once the defect is fixed the test unexpectedly passes and goes red.
        test.fail(true, PROBLEM_USER_DEFECT);
        await checkoutShowsCorrectTotals(problemUser);
      },
    );
  });
});
