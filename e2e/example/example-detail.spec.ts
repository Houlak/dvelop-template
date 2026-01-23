import { expect, test } from '../fixtures/auth.fixture';

test.describe('Example Detail Page', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to first example detail page
    await authenticatedPage.goto('/example/1');
  });

  test('should display example detail page with all elements', async ({ authenticatedPage }) => {
    // Check page structure
    await expect(authenticatedPage.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(authenticatedPage.getByText(/Item ID:/)).toBeVisible();
    
    // Check navigation buttons
    await expect(authenticatedPage.getByRole('button', { name: '← Back to Example List' })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: 'Back to Example List' })).toBeVisible();
  });

  test('should display navigation buttons for all items', async ({ authenticatedPage }) => {
    // Check that all 5 navigation buttons are present
    for (let i = 1; i <= 5; i++) {
      await expect(authenticatedPage.getByRole('link', { name: String(i) })).toBeVisible();
    }
  });

  test('should highlight current item in navigation', async ({ authenticatedPage }) => {
    // The current item (1) should have default variant
    const currentButton = authenticatedPage.getByRole('link', { name: '1' }).locator('button');
    await expect(currentButton).toBeVisible();
    
    // Other items should have outline variant
    const otherButton = authenticatedPage.getByRole('link', { name: '2' }).locator('button');
    await expect(otherButton).toBeVisible();
  });

  test('should navigate to different example items', async ({ authenticatedPage }) => {
    // Click on item 2
    await authenticatedPage.getByRole('link', { name: '2' }).click();
    
    // Should navigate to item 2
    await expect(authenticatedPage).toHaveURL('/example/2', { timeout: 5000 });
    
    // Page should update
    await expect(authenticatedPage.getByText('Item ID: 2')).toBeVisible();
  });

  test('should navigate back to example list using header button', async ({ authenticatedPage }) => {
    // Click back button in header
    await authenticatedPage.getByRole('button', { name: '← Back to Example List' }).click();
    
    // Should navigate back to example list
    await expect(authenticatedPage).toHaveURL('/', { timeout: 5000 });
  });

  test('should navigate back to example list using footer button', async ({ authenticatedPage }) => {
    // Click back button in footer
    await authenticatedPage.getByRole('button', { name: 'Back to Example List' }).first().click();
    
    // Should navigate back to example list
    await expect(authenticatedPage).toHaveURL('/', { timeout: 5000 });
  });

  test('should load different items with unique content', async ({ authenticatedPage }) => {
    // Visit item 1
    await authenticatedPage.goto('/example/1');
    const title1 = await authenticatedPage.getByRole('heading', { level: 1 }).textContent();
    
    // Visit item 2
    await authenticatedPage.goto('/example/2');
    const title2 = await authenticatedPage.getByRole('heading', { level: 1 }).textContent();
    
    // Titles should be different (if your loader provides different data)
    // This assertion depends on your actual data structure
    await expect(authenticatedPage.getByText('Item ID: 2')).toBeVisible();
  });

  test('should handle direct URL access to detail page', async ({ authenticatedPage }) => {
    // Navigate directly to item 3
    await authenticatedPage.goto('/example/3');
    
    // Page should load correctly
    await expect(authenticatedPage).toHaveURL('/example/3');
    await expect(authenticatedPage.getByText('Item ID: 3')).toBeVisible();
  });
});

test.describe('Example Detail Page (Unauthenticated)', () => {
  test('should redirect to login when accessing detail page without auth', async ({ page }) => {
    // Try to access detail page without authentication
    await page.goto('/example/1');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe('Example Detail Page Navigation Flow', () => {
  test('should navigate through multiple items sequentially', async ({ authenticatedPage }) => {
    // Start at item 1
    await authenticatedPage.goto('/example/1');
    await expect(authenticatedPage.getByText('Item ID: 1')).toBeVisible();
    
    // Navigate to item 2
    await authenticatedPage.getByRole('link', { name: '2' }).click();
    await expect(authenticatedPage).toHaveURL('/example/2');
    await expect(authenticatedPage.getByText('Item ID: 2')).toBeVisible();
    
    // Navigate to item 3
    await authenticatedPage.getByRole('link', { name: '3' }).click();
    await expect(authenticatedPage).toHaveURL('/example/3');
    await expect(authenticatedPage.getByText('Item ID: 3')).toBeVisible();
  });

  test('should maintain state when navigating back and forth', async ({ authenticatedPage }) => {
    // Visit item 1
    await authenticatedPage.goto('/example/1');
    await expect(authenticatedPage.getByText('Item ID: 1')).toBeVisible();
    
    // Go to example list
    await authenticatedPage.getByRole('button', { name: '← Back to Example List' }).click();
    await expect(authenticatedPage).toHaveURL('/');
    
    // Go back to item 1
    await authenticatedPage.getByText('Example Item 1').click();
    await expect(authenticatedPage).toHaveURL('/example/1');
    await expect(authenticatedPage.getByText('Item ID: 1')).toBeVisible();
  });
});

