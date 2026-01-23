# E2E Testing with Playwright

This directory contains end-to-end tests for the application using [Playwright](https://playwright.dev/).

## Directory Structure

```
e2e/
├── auth/
│   └── login.spec.ts          # Login page tests
├── example/
│   ├── example-page.spec.ts   # Protected page tests
│   └── api-mocking.spec.ts    # Advanced API mocking examples
├── fixtures/
│   └── auth.fixture.ts        # Reusable authentication fixture
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js and Yarn installed
- Playwright browsers installed (already done during setup)

### Running Tests

```bash
# Run all tests
yarn test:e2e

# Run tests in UI mode (interactive)
yarn test:e2e:ui

# Run tests in headed mode (see browser)
yarn test:e2e:headed

# Debug a specific test
yarn test:e2e:debug e2e/auth/login.spec.ts

# Run specific test file
yarn test:e2e e2e/auth/login.spec.ts

# Run tests matching a pattern
yarn test:e2e --grep "login"

# View test report
yarn test:e2e:report
```

## Test Categories

### 1. Authentication Tests (`auth/login.spec.ts`)

Tests for the login functionality:
- Form validation (empty fields, invalid email, short password)
- Successful login flow
- Error handling for invalid credentials
- Loading states
- Redirect preservation after login

### 2. Protected Page Tests (`example/example-page.spec.ts`)

Tests for authenticated user interactions:
- Page rendering and content display
- Form submission with validation
- Navigation between pages
- Logout functionality
- Unauthenticated access redirection

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.getByRole('heading')).toBeVisible();
  });
});
```

### Using the Auth Fixture

For tests that require authentication:

```typescript
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Protected Feature', () => {
  test('should access protected content', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/protected-route');
    // Test authenticated functionality
  });
});
```

### API Mocking

Mock API responses for predictable tests:

```typescript
test('should handle API response', async ({ page }) => {
  await page.route('**/api/endpoint', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 'mock data' })
    });
  });
  
  // Your test logic here
});
```

## Best Practices

### 1. Use Semantic Selectors

Prefer user-facing selectors:
```typescript
// Good
await page.getByRole('button', { name: 'Login' });
await page.getByLabel('Email');

// Avoid
await page.locator('#login-btn');
await page.locator('.email-input');
```

### 2. Add Test IDs for Complex Elements

For elements that are hard to select semantically:

```tsx
// In your component
<div data-testid="complex-widget">...</div>

// In your test
await page.getByTestId('complex-widget');
```

### 3. Wait for Navigation

Always wait for navigation to complete:
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
await expect(page).toHaveURL('/success', { timeout: 5000 });
```

### 4. Mock External APIs

Always mock external APIs in E2E tests:
- Ensures tests are fast and reliable
- Prevents dependencies on external services
- Allows testing error scenarios

### 5. Keep Tests Independent

Each test should:
- Set up its own data
- Not depend on other tests
- Clean up after itself

## Debugging Tests

### UI Mode (Recommended)

```bash
yarn test:e2e:ui
```

This opens an interactive UI where you can:
- See test execution in real-time
- Step through tests
- View DOM snapshots
- Inspect network requests

### Debug Mode

```bash
yarn test:e2e:debug
```

Opens Playwright Inspector for step-by-step debugging.

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (in `test-results/`)
- Videos (in `test-results/`)
- Traces (in `test-results/`)

View traces with:
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: yarn install
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      
      - name: Run E2E tests
        run: yarn test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

## Configuration

The Playwright configuration is in `playwright.config.ts` at the project root.

Key settings:
- **testDir**: `./e2e` - Location of test files
- **baseURL**: `http://localhost:5173` - Development server URL
- **webServer**: Automatically starts dev server before tests
- **retries**: 2 on CI, 0 locally
- **timeout**: 30 seconds per test

## Common Issues

### Port Already in Use

If the dev server port is in use:
1. Stop other instances: `lsof -ti:5173 | xargs kill`
2. Or change port in `vite.config.js`

### Browser Not Found

Reinstall browsers:
```bash
npx playwright install chromium
```

### Tests Failing Locally But Passing in CI

Check for:
- Timing issues (add proper waits)
- Environment-specific behavior
- Browser differences

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Debugging Guide](https://playwright.dev/docs/debug)

