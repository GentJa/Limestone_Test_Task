import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  /** Opens the login page. */
  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.loginButton).toBeVisible();
  }

  /** Fills the form and clicks Login, without assuming the login succeeds (used for validation tests). */
  async submit(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  /** Logs in and waits until the product list is shown. */
  async loginAs(username: string, password: string): Promise<void> {
    await this.submit(username, password);
    await expect(this.page).toHaveURL(/\/inventory\.html$/);
  }
}
