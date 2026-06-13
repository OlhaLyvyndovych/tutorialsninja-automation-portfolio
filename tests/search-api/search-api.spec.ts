import { test, expect } from '@playwright/test';
import { SearchEngine } from '../../api/SearchEngine';

test.describe('TutorialsNinja Search - API Test Suite', () => {
  const targetClass = 'product-layout';

  test('TC_API_001: Happy Path -  Standard product keyword query', async ({ request }) => {
    // 1. Initialize API Controller class
    const searchAPI = new SearchEngine(request);

    // 2. Execute the search for 'iPhone'
    const response = await searchAPI.executeSearch('MacBook');

    // 3. Assert the server accepted the request successfully
    expect(response.status()).toBe(200);

    // 4. Extract the raw HTML content as a plain text string
    const htmlContent = await response.text();

    // 5. Verification: Ensure the product we searched for exists inside the page text
    expect(htmlContent).toContain('MacBook');

    // 6. Verification: Ensure an irrelevant product is NOT on the page
    expect(htmlContent).not.toContain('Samsung Galaxy Tab');

    // Check how many items are returned
    // 1 --> Look for the unique text chunk that sits right around the pagination number
    const paginationTextAnchor = htmlContent.match(/Showing \d+ to \d+ of \d+/);

    if (!paginationTextAnchor) throw new Error('Could not locate the pagination text summary inside the backend response!');

    const fullSummarySentence = paginationTextAnchor[0]; // .match returns a specialized array of meta data, where the searched string is the first one

    // 2 --> Get an array of words from the sentence
    const wordsArr = fullSummarySentence.split(' '); //  [ 'Showing', '1', 'to', '1', 'of', '1' ]

    // 3 --> The total count is the last item of an array, specify the radix (the base) which is 10, base-10 number
    const extractedTextCount = parseInt(wordsArr[wordsArr.length - 1], 10); // 1

    // 3 --> Now we have the pagination number which we should to compare with product-layout blocks
    const physicalLayoutCount = htmlContent.split(targetClass).length - 1; // 1

    // 4 --> Cross-verify both values match perfectly
    expect(physicalLayoutCount).toBe(extractedTextCount);
  });

  test('TC_API_002: Case Insensitivity - Upper-case parameter handling', async ({ request }) => {
    const searchAPI = new SearchEngine(request);

    // Execute search for both variations: lowercase and uppsercase
    const lowerCaseResponse = await (await searchAPI.executeSearch('macbook')).text();
    const upperCaseResponse = await (await searchAPI.executeSearch('MACBOOK')).text();

    // Count product-layout classes in each of them
    const lowercaseCount = lowerCaseResponse.split(targetClass).length - 1;
    const uppercaseCount = upperCaseResponse.split(targetClass).length - 1;

    // Assert backend search engine mapping treats them identically - returned count of items should be the same
    expect(uppercaseCount).toBe(lowercaseCount);
  });

  test('TC_API_003: Negative Path - Clean zero-state data handling', async ({ request }) => {
    const searchAPI = new SearchEngine(request);

    const response = await searchAPI.executeSearch('NonsenseItemXYZ789');
    // Server should handle it successfully
    expect(response.status()).toBe(200);

    // Check the returned items to be zero
    const htmlContent = await response.text();
    const physicalLayoutCount = htmlContent.split(targetClass).length - 1; // Split on class name to count product-layout
    expect(physicalLayoutCount).toBe(0);

    // Check returned message that no product matches search keyword
    expect(htmlContent).toContain('There is no product that matches the search criteria.');
  });

  test('TC_API_004: Security/Boundary - Handle special string character payloads', async ({ request }) => {
    const searchAPI = new SearchEngine(request);

    // Check search with SQL injection / Special character payload string
    const securityPayload = "' OR 1=1 -- %&^";
    const response = await searchAPI.executeSearch(securityPayload);

    // The server MUST remain stable (200 OK) and treat the payload safely as text
    expect(response.status()).toBe(200);
    const htmlContent = await response.text();

    const physicalLayoutCount = htmlContent.split(targetClass).length - 1;

    // It should safely escape characters and return 0 matching products
    expect(physicalLayoutCount).toBe(0);
  });
});
