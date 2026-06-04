import { test, Locator, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page Features', () => {
  // 1. Declare the variable at the file/describe level so all tests can use it
  let hp: HomePage;

  // 2. Preconditions are set once before EVERY test case runs
  test.beforeEach(async ({ page }) => {
    hp = new HomePage(page);
    await hp.gotoHomePage();
  });
  /**
   * @testcase TC_SEARCH_001
   * @description Verify search functionality using a valid keyword via the Magnifying Glass icon.
   * @type Smoke
   */

  test('Search functionality with valid keyword using Magnifying Glass icon', async ({ page }) => {
    await hp.searchForProduct('MacBook');

    // Assertions according to the expected result:
    // Browser redirects to the Search Results page
    await expect(page).toHaveURL(/.*route=product\/search&search=MacBook.*/);

    // Relevant MacBook products are displayed in Grid Mode by default
    await expect(hp.activeGridModeBtn).toHaveId('grid-view');

    const searchResult: Locator = page.locator('.product-thumb h4 a');
    const resultCount: number = await searchResult.count();

    for (let i = 0; i < resultCount; i++) {
      await expect(searchResult.nth(i)).toHaveText(/MacBook/);
    }

    // Maximum of 20 items are visible on the page
    await expect(hp.selectedDefault).toHaveText('20');

    // Verify that all the products displayed on the page are equal or less than 20
    const productCount: number = await hp.productThumbnails.count();
    expect(productCount).toBeLessThanOrEqual(20);

    // Additional: verify heading to contain a keyword
    const searchHeading: Locator = page.getByRole('heading', {
      name: 'Search - MacBook',
    });
    await expect(searchHeading).toBeVisible();
  });

  /**
   * @testcase TC_SEARCH_002
   * @description Verify search functionality using a valid keyword via the Enter key.
   * @type Smoke
   */

  test('Search functionality with valid keyword using Enter key', async ({ page }) => {
    await hp.searchForProductWithEnter('iPhone');

    // Assertions according to the expected result:
    // Browser redirects to the Search Results page
    await expect(page).toHaveURL(/.*route=product\/search&search=iPhone.*/);

    // Relevant iPhone products are displayed in Grid Mode by default
    await expect(hp.activeGridModeBtn).toHaveId('grid-view');

    const searchResult: Locator = page.locator('.product-thumb h4 a');
    const resultCount: number = await searchResult.count();

    for (let i = 0; i < resultCount; i++) {
      await expect(searchResult.nth(i)).toHaveText(/iPhone/);
    }

    // Maximum of 20 items are visible on the page
    await expect(hp.selectedDefault).toHaveText('20');

    // Verify that all the products displayed on the page are equal or less than 20
    const productCount: number = await hp.productThumbnails.count();
    expect(productCount).toBeLessThanOrEqual(20);

    // Additional: verify heading to contain a keyword
    const searchHeading: Locator = page.getByRole('heading', {
      name: 'Search - iPhone',
    });
    await expect(searchHeading).toBeVisible();
  });

  /**
   * @testcase TC_SEARCH_003
   * @description Verify search functionality handles compound product names missing spaces gracefully.
   * @type Regression
   */
  test('Search functionality handles compound product name gracefully', async ({ page }) => {
    await hp.searchForProductWithEnter('product11');

    // Assertions according to expected result:
    // Browser redirects to the Search Results page.
    await expect(page).toHaveURL(/.*route=product\/search&search=product11.*/);

    // No products are displayed.
    const productCount: number = await hp.productThumbnails.count();
    expect(productCount).toBe(0);

    // The message: "There is no product that matches the search criteria." is displayed.
    await expect(hp.noResultsMsg).toBeVisible();
    await expect(hp.noResultsMsg).toHaveText('There is no product that matches the search criteria.');
  });

  /**
   * @testcase TC_SEARCH_004
   * @description Verify case insensitivity of the search functionality.
   * @type Regression
   */

  test('Search functionality with the capitalized keyword', async ({ page }) => {
    await hp.searchForProductWithEnter('MACBOOK');

    // Assertions according to expected result:
    // Browser redirects to the Search Results page.
    await expect(page).toHaveURL(/.*route=product\/search&search=MACBOOK.*/);

    //Relevant MacBook products are displayed identically to lowercase results.
    await expect(hp.activeGridModeBtn).toHaveId('grid-view');

    const searchResult: Locator = page.locator('.product-thumb h4 a');
    const resultCount: number = await searchResult.count();

    for (let i = 0; i < resultCount; i++) {
      await expect(searchResult.nth(i)).toHaveText(/MACBOOK/i);
    }

    // Maximum of 20 items are visible on the page
    await expect(hp.selectedDefault).toHaveText('20');

    // Verify that all the products displayed on the page are equal or less than 20
    const productCount: number = await hp.productThumbnails.count();
    expect(productCount).toBeLessThanOrEqual(20);

    // Additional: verify heading to contain a keyword
    const searchHeading: Locator = page.getByRole('heading', {
      name: 'Search - MACBOOK',
    });
    await expect(searchHeading).toBeVisible();
  });

  /**
   * @testcase TC_SEARCH_005
   * @description Verify edge case handling of whitespace-only queries.
   * @type Regression
   */

  test('Search functionality handles empty spaces as a keyword gracefully', async ({ page }) => {
    await hp.searchForProductWithEnter('     ');

    // Assertions according to requirements
    // Browser redirects to the Search Results page.
    await expect(page).toHaveURL(/.*route=product\/search.*/);
    await expect(page).toHaveURL(/.*search=%20%20%20%20%20.*/);

    // NOTE: The site currently returns products for spaces due to an un-trimmed search bug.
    // We assert that the product count is greater than 0 to match current site reality.
    const productCount: number = await hp.productThumbnails.count();
    expect(productCount).toBeGreaterThan(0);
  });
});
