import { expect, type Locator, type Page } from '@playwright/test';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutInfoPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
  }

  /** Fills the customer form, checks that the values were kept, and continues to the overview. */
  async submit(customer: CustomerInfo): Promise<void> {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    // Checking the inputs makes a broken form fail here with a clear message, not on a later page.
    await expect(this.firstName).toHaveValue(customer.firstName);
    await expect(this.lastName).toHaveValue(customer.lastName);
    await expect(this.postalCode).toHaveValue(customer.postalCode);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
  }
}
