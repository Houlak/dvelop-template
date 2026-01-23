import { expect, test } from '../fixtures/auth.fixture';

test.describe('Example Detail Page', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to first example detail page
    await authenticatedPage.goto('/example/1');
  });

  test('should load different items with unique content', async ({ authenticatedPage }) => {
    // Visit item 1
    await authenticatedPage.goto('/example/1');
    const title1 = await authenticatedPage.getByRole('heading', { level: 1 }).textContent();
    
    // Visit item 2
    await authenticatedPage.goto('/example/2');
    const title2 = await authenticatedPage.getByRole('heading', { level: 1 }).textContent();
    
    // Titles should be different (if your loader provides different data)
    await expect(title1).not.toBe(title2);
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
    await authenticatedPage.getByRole('button', { name: '2' }).click();
    await expect(authenticatedPage).toHaveURL('/example/2');
    await expect(authenticatedPage.getByText('Item ID: 2')).toBeVisible();
    
    // Navigate to item 3
    await authenticatedPage.getByRole('button', { name: '3' }).click();
    await expect(authenticatedPage).toHaveURL('/example/3');
    await expect(authenticatedPage.getByText('Item ID: 3')).toBeVisible();
  });
});

