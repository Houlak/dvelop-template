import { expect, test as base, Page } from '@playwright/test';
import { config } from '../config';

type AuthFixtures = {
  authenticatedPage: Page;
};

/**
 * Auth fixture that automatically logs in before tests
 * Usage: import { test, expect } from '../fixtures/auth.fixture';
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    if (!config.testEmail || !config.testPassword) {
      throw new Error(
        'Missing VITE_TEST_EMAIL or VITE_TEST_PASSWORD for e2e auth fixture.'
      );
    }

    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login credentials
    // Note: Password must meet requirements: 8+ chars, uppercase, lowercase, number, special char
    await page.getByLabel(/username|email/i).fill(config.testEmail);
    await page.getByLabel(/password/i).fill(config.testPassword);
    
    // Submit the form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for successful login and any protected route redirect.
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), {
      timeout: 10000,
    });

    // Wait until auth persistence is available for route loaders.
    await page.waitForFunction(() => {
      const authStorage = window.localStorage.getItem('auth-storage');
      if (!authStorage) {
        return false;
      }

      const parsedStorage = JSON.parse(authStorage) as {
        state?: { isAuthenticated?: boolean; token?: string | null };
      };

      return (
        parsedStorage.state?.isAuthenticated === true &&
        typeof parsedStorage.state?.token === 'string'
      );
    });

    await expect(page).not.toHaveURL(/\/login/);
    
    // Use the authenticated page in tests
    await use(page);
  },
});

export { expect } from '@playwright/test';
