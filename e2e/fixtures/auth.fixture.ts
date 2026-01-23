import { test as base } from '@playwright/test';
import { config } from '../config';

type AuthFixtures = {
  authenticatedPage: any;
};

/**
 * Auth fixture that automatically logs in before tests
 * Usage: import { test, expect } from '../fixtures/auth.fixture';
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in login credentials
    // Note: Password must meet requirements: 8+ chars, uppercase, lowercase, number, special char
    await page.getByLabel(/username|email/i).fill(config.testEmail);
    await page.getByLabel(/password/i).fill(config.testPassword);
    
    // Submit the form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Wait for successful login and redirect
    await page.waitForURL('/', { timeout: 5000 });
    
    // Use the authenticated page in tests
    await use(page);
  },
});

export { expect } from '@playwright/test';

