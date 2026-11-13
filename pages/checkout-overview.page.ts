import { type Locator, type Page } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemTotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
  }
}
