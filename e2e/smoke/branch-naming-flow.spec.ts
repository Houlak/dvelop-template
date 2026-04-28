import { test, expect } from '../fixtures/auth.fixture';

test.describe('Smoke: auth guard stability for branch flow validation', () => {
  test('redirects unauthenticated users away from protected routes', async ({ page }) => {
    await page.goto('/example');

    await expect(page).toHaveURL(/\/login\?redirect=%2Fexample/, { timeout: 5000 });
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  });

  test('allows authenticated users to access protected routes', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/example');

    await expect(authenticatedPage).toHaveURL('/example', { timeout: 5000 });
    await expect(authenticatedPage.getByRole('heading', { name: 'Example Items' })).toBeVisible();
  });
});
