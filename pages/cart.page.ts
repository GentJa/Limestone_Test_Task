import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
  }

  /** Starts checkout from the cart. */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
  }
}
