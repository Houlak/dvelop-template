import { test, expect } from '../fixtures/auth.fixture';

test.describe('Example Page (Protected)', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Navigate to example page with authenticated user
    await authenticatedPage.goto('/example');
  });

  test('should display example page with all elements', async ({ authenticatedPage }) => {
    // Check page title and description
    await expect(authenticatedPage.getByRole('heading', { name: 'Houlak frontend template' })).toBeVisible();
    await expect(authenticatedPage.getByText('This is a template for a frontend application.')).toBeVisible();
    
    // Check form elements
    await expect(authenticatedPage.getByLabel('Name')).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: /submit/i })).toBeVisible();
    
    // Check logout buttons
    await expect(authenticatedPage.getByRole('button', { name: 'Test Logout' })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: 'Test Clear Auth' })).toBeVisible();
  });

  test('should display example items grid', async ({ authenticatedPage }) => {
    // Check example items section
    await expect(authenticatedPage.getByRole('heading', { name: 'Example Items' })).toBeVisible();
    
    // Check that 5 example items are displayed
    for (let i = 1; i <= 5; i++) {
      await expect(authenticatedPage.getByText(`Example Item ${i}`)).toBeVisible();
    }
  });

  test('should show validation error for short name', async ({ authenticatedPage }) => {
    // Fill short name
    await authenticatedPage.getByLabel('Name').fill('test');
    await authenticatedPage.getByRole('button', { name: /submit/i }).click();
    
    // Check for validation error
    await expect(authenticatedPage.getByText(/name must be at least 5 characters/i)).toBeVisible();
  });

  test('should successfully submit form with valid data', async ({ authenticatedPage }) => {
    // Mock successful API response
    await authenticatedPage.route('**/api/example', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { name: 'Valid Name' }
        })
      });
    });

    // Fill valid name
    await authenticatedPage.getByLabel('Name').fill('Valid Name');
    await authenticatedPage.getByRole('button', { name: /submit/i }).click();
    
    // Check for success message
    await expect(authenticatedPage.getByText(/success! form submitted successfully/i)).toBeVisible();
  });

  test('should show loading state during form submission', async ({ authenticatedPage }) => {
    // Mock slow API response
    await authenticatedPage.route('**/api/example', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Fill and submit form
    await authenticatedPage.getByLabel('Name').fill('Testing Name');
    await authenticatedPage.getByRole('button', { name: /submit/i }).click();
    
    // Check for loading state
    await expect(authenticatedPage.getByRole('button', { name: /submitting/i })).toBeVisible();
    await expect(authenticatedPage.getByRole('button', { name: /submitting/i })).toBeDisabled();
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

  test('should clear auth and redirect to login page', async ({ authenticatedPage }) => {
    // Click clear auth button
    await authenticatedPage.getByRole('button', { name: 'Test Clear Auth' }).click();
    
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

