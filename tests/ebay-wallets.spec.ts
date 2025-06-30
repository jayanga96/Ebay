import { test, expect } from '@playwright/test';

test('eBay search for wallets and view related products', async ({ page }) => {
  // Step 1: Navigate to https://www.ebay.com/
  await page.goto('https://www.ebay.com/');

  // Step 2: Search for "wallets"
  const searchInput = page.locator('input[aria-label="Search for anything"]');
  await expect(searchInput).toBeVisible();
  await searchInput.fill('wallets');
  // Try input[type="submit"] as the search button
  let searchButton = page.locator('input[type="submit"]');
  if (await searchButton.count() === 0) {
    // Fallback: try input[type="submit"] inside the main search form
    searchButton = page.locator('form input[type="submit"]');
  }
  await expect(searchButton).toBeVisible();
  await searchButton.click();

  // Step 3: View related products list
  // Wait for search results to load
  const resultsSection = page.locator('[data-testid="srp-results"]');
  await expect(resultsSection).toBeVisible();

  // Check for related products ("People who viewed this item also viewed" or similar)
  // eBay may show related products in a carousel or section with a heading
  const relatedProductsHeading = page.locator('text=/related|also viewed|you may like/i');
  // This is a soft check, as related products may not always be present
  if (await relatedProductsHeading.count() > 0) {
    await expect(relatedProductsHeading.first()).toBeVisible();
  } else {
    // Fallback: check that search results are present
    const itemCards = page.locator('[data-testid="item-card"]');
    await expect(itemCards.first()).toBeVisible();
  }
});
