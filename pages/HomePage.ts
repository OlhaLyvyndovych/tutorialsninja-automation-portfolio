import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchField: Locator;
  readonly searchBtn: Locator;
  readonly activeGridModeBtn: Locator;
  readonly selectedDefault: Locator;
  readonly productThumbnails: Locator;
  readonly noResultsMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchField = page.locator('input.form-control.input-lg');
    this.searchBtn = page.locator('button.btn.btn-default.btn-lg');
    this.activeGridModeBtn = page.locator('.btn-group button.active');
    this.selectedDefault = page.locator('select#input-limit option:checked');
    this.productThumbnails = page.locator('div.product-layout');
    this.noResultsMsg = page.locator(
      '#content p:has-text("There is no product that matches the search criteria.")',
    );
  }

  async gotoHomePage() {
    await this.page.goto(
      'https://tutorialsninja.com/demo/index.php?route=common/home',
    );
  }

  async searchForProduct(term: string) {
    await this.searchField.fill(term);
    await this.searchBtn.click();
  }

  async searchForProductWithEnter(term: string) {
    await this.searchField.fill(term);

    // Simulate pressing the physical Enter key on the keyboard
    await this.searchField.press('Enter');
  }
}
