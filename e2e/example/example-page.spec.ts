import { expect, test } from '../fixtures/auth.fixture';

test.describe('Example Page (Protected)', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to example page with authenticated user
    await authenticatedPage.goto('/example');
  });

  test('should display example items grid', async ({ authenticatedPage }) => {
    // Check example items section
    await expect(authenticatedPage.getByRole('heading', { name: 'Example Items' })).toBeVisible();
    
    // Check that 5 example items are displayed
    for (let i = 1; i <= 5; i++) {
      await expect(authenticatedPage.getByText(`Example Item ${i}`)).toBeVisible();
    }
  });

  test('should navigate to example detail page', async ({ authenticatedPage }) => {
    // Click on first example item
    await authenticatedPage.getByText('Example Item 1').click();
    
    // Should navigate to detail page
    await expect(authenticatedPage).toHaveURL('/example/1', { timeout: 5000 });
  });

  test('should logout and redirect to login page', async ({ authenticatedPage }) => {
    // Mock logout API
    await authenticatedPage.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Click logout button
    await authenticatedPage.getByRole('button', { name: 'Test Logout' }).click();
    
    // Should redirect to login page
    await expect(authenticatedPage).toHaveURL('/login', { timeout: 5000 });
  });
});

test.describe('Example Page (Unauthenticated)', () => {
  test('should redirect to login when accessing protected page', async ({ page }) => {
    // Try to access example page without authentication
    await page.goto('/example');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('should preserve redirect path when accessing protected page', async ({ page }) => {
    // Try to access example page without authentication
    await page.goto('/example');
    
    // Should be redirected to login with redirect parameter
    await expect(page).toHaveURL(/\/login.*redirect/, { timeout: 5000 });
  });
});

