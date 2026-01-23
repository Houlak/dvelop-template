import { expect, test } from '@playwright/test';
import { config } from '../config';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form with all required elements', async ({ page }) => {
    // Check page heading
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    
    // Check form fields
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Check login button
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeDisabled(); // Should be disabled initially
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to type and clear fields to trigger validation
    await page.getByLabel('Email').click();
    await page.getByLabel('Email').fill('a');
    await page.getByLabel('Email').clear();
    await page.getByLabel('Password').click();
    
    // Check for email required error
    await expect(page.getByText('Email is required')).toBeVisible();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    // Fill invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').click();
    
    // Check for invalid email error
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    // Fill short password (less than 8 characters)
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('Pass1!a');
    
    // Check for password length error
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible();
  });

  test('should show validation error for password without uppercase letter', async ({ page }) => {
    // Fill password without uppercase
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('password123!');
    
    // Check for uppercase letter error
    await expect(page.getByText(/password must contain at least one uppercase letter/i)).toBeVisible();
  });

  test('should show validation error for password without lowercase letter', async ({ page }) => {
    // Fill password without lowercase
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('PASSWORD123!');
    
    // Check for lowercase letter error
    await expect(page.getByText(/password must contain at least one lowercase letter/i)).toBeVisible();
  });

  test('should show validation error for password without number', async ({ page }) => {
    // Fill password without number
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('Password!');
    
    // Check for number error
    await expect(page.getByText(/password must contain at least one number/i)).toBeVisible();
  });

  test('should show validation error for password without special character', async ({ page }) => {
    // Fill password without special character
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('Password123');
    
    // Check for special character error
    await expect(page.getByText(/password must contain at least one special character/i)).toBeVisible();
  });

  test('should enable login button when form is valid', async ({ page }) => {
    // Fill valid credentials (meets all requirements)
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill(config.testPassword);
    
    // Button should be enabled
    const loginButton = page.getByRole('button', { name: /login/i });
    await expect(loginButton).toBeEnabled();
  });

  test('should handle login submission with API mocking', async ({ page }) => {
    // Mock successful login API response
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: config.testEmail,
            name: 'Test User'
          }
        })
      });
    });

    // Fill and submit form with valid password
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill(config.testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/', { timeout: 5000 });
  });

  test('should display error message for failed login', async ({ page }) => {
    // Mock failed login API response
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Invalid credentials'
        })
      });
    });

    // Fill and submit form with valid format but wrong credentials
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill('WrongPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/auth/login', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-token',
          user: { id: 1, email: config.testEmail }
        })
      });
    });

    // Fill and submit form with valid password
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill(config.testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for loading state
    await expect(page.getByRole('button', { name: /logging in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });

  test('should preserve redirect path after login', async ({ page }) => {
    // Mock successful login
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'mock-token',
          user: { id: 1, email: config.testEmail }
        })
      });
    });

    // Navigate to login with redirect parameter
    await page.goto('/login?redirect=/example');
    
    // Fill and submit form with valid password
    await page.getByLabel('Email').fill(config.testEmail);
    await page.getByLabel('Password').fill(config.testPassword);
    await page.getByRole('button', { name: /login/i }).click();
    
    // Should redirect to the specified path
    await expect(page).toHaveURL('/example', { timeout: 5000 });
  });
});

