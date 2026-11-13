import { expect, type Locator, type Page } from '@playwright/test';
import { parsePrice } from '../helpers/price.helper';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  private item(name: string): Locator {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  /** Opens the product list using the session from storageState (no UI login). */
  async open(): Promise<void> {
    await this.page.goto('/inventory.html');
    await expect(this.title).toHaveText('Products');
  }

  // Reading the text is intentional: the test needs the price as a number to compute the expected totals,
  // which no web-first assertion can provide.
  private async priceOf(name: string): Promise<number> {
    const price = this.item(name).getByTestId('inventory-item-price');
    await expect(price).toBeVisible();
    return parsePrice(await price.innerText());
  }

  private async addToCart(name: string): Promise<void> {
    const item = this.item(name);
    await item.getByRole('button', { name: 'Add to cart' }).click();
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
  }

  /**
   * Adds the given products to the cart in order and returns their catalogue prices in cents,
   * so the test can compute the expected totals from what the page shows.
   */
  async addProducts(names: readonly string[]): Promise<number[]> {
    const prices: number[] = [];
    for (const name of names) {
      prices.push(await this.priceOf(name));
      await this.addToCart(name);
    }
    return prices;
  }

  /** Opens the cart page. */
  async openCart(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/\/cart\.html$/);
  }
}
