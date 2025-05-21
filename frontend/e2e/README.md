# End-to-End Testing

This directory contains end-to-end tests for the QuickDine application using Playwright.

## Prerequisites

1. Node.js 18 or later
2. npm or yarn package manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run tests in debug mode
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test flow.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
```

## Test Structure

The tests are organized into the following flows:

1. **Restaurant Registration and Menu Management**
   - Register a new restaurant
   - Add menu items
   - Edit menu items
   - Delete menu items

2. **Customer Ordering**
   - Browse menu
   - Add items to cart
   - Place order
   - View order confirmation

3. **Restaurant Admin Order Management**
   - View orders
   - Update order status
   - View order details

4. **Analytics and Reporting**
   - View revenue data
   - View order statistics
   - View top items

5. **Error Handling and Edge Cases**
   - Protected route access
   - Invalid restaurant/table access
   - Empty cart handling

## Test Data

The tests use a test user with the following credentials:
- Email: test@example.com
- Password: testpassword123

## Debugging

1. Use the UI mode for visual debugging:
```bash
npm run test:ui
```

2. Use the debug mode for step-by-step debugging:
```bash
npm run test:debug
```

3. View test traces:
```bash
npx playwright show-trace test-results/trace.zip
```

## Best Practices

1. Keep tests independent and isolated
2. Use meaningful test descriptions
3. Clean up test data after each test
4. Use appropriate assertions
5. Handle asynchronous operations properly
6. Use test data that is representative of real usage

## Continuous Integration

The tests are configured to run in CI environments with the following settings:
- Retries: 2
- Workers: 1
- Video recording: on first retry
- Trace recording: on first retry

## Troubleshooting

1. If tests fail due to browser issues:
```bash
npx playwright install --force
```

2. If tests are flaky:
- Increase timeouts
- Add more explicit waits
- Check for race conditions

3. If tests fail in CI:
- Check browser versions
- Verify environment variables
- Check network connectivity 