import { test, expect } from '@playwright/test';

test.describe('QuickDine Application Flow', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test Restaurant',
    address: '123 Test St',
    phone: '1234567890',
    description: 'Test restaurant description',
    logo: 'https://example.com/logo.png',
    numberOfTables: 2,
    tableCapacity: 4
  };

  test.beforeEach(async ({ page }) => {
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('Complete restaurant registration and menu management flow', async ({ page }) => {
    // 1. Register a new restaurant
    await page.goto('/auth/signup');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="address"]', testUser.address);
    await page.fill('input[name="phone"]', testUser.phone);
    await page.fill('input[name="description"]', testUser.description);
    await page.fill('input[name="logo"]', testUser.logo);
    await page.fill('input[name="numberOfTables"]', testUser.numberOfTables.toString());
    await page.fill('input[name="tableCapacity"]', testUser.tableCapacity.toString());
    await page.click('button[type="submit"]');

    // Wait for registration to complete and redirect to dashboard
    await expect(page).toHaveURL('/admin/dashboard');

    // 2. Navigate to menu management
    await page.click('text=Menu');
    await expect(page).toHaveURL('/admin/menu');

    // 3. Add a new menu item
    await page.click('button:has-text("Add Menu Item")');
    await page.fill('input[id="name"]', 'Test Item');
    await page.fill('textarea[id="description"]', 'Test description');
    await page.fill('input[id="price"]', '9.99');
    await page.fill('input[id="stock"]', '10');
    await page.selectOption('select', 'MAIN_COURSE');
    await page.fill('input[id="image"]', 'https://example.com/image.jpg');
    await page.click('button:has-text("Add")');

    // Verify the new item appears in the menu
    await expect(page.locator('text=Test Item')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();

    // 4. Edit the menu item
    await page.click('button[aria-label="Edit Test Item"]');
    await page.fill('input[id="name"]', 'Updated Test Item');
    await page.fill('input[id="price"]', '12.99');
    await page.click('button:has-text("Update")');

    // Verify the updated item
    await expect(page.locator('text=Updated Test Item')).toBeVisible();
    await expect(page.locator('text=$12.99')).toBeVisible();

    // 5. Delete the menu item
    await page.click('button[aria-label="Delete Updated Test Item"]');
    await page.click('button:has-text("OK")');

    // Verify the item is removed
    await expect(page.locator('text=Updated Test Item')).not.toBeVisible();
  });

  test('Customer ordering flow', async ({ page }) => {
    // 1. Visit the restaurant page
    await page.goto('/restaurant/1/table/1');

    // 2. Add items to cart
    await page.click('button:has-text("Add to Cart")');
    await page.click('button:has-text("Add to Cart")');

    // 3. View cart
    await page.click('button:has-text("View Cart")');

    // 4. Place order
    await page.click('button:has-text("Place Order")');

    // 5. Verify order confirmation
    await expect(page.locator('text=Order Placed Successfully')).toBeVisible();
  });

  test('Restaurant admin order management flow', async ({ page }) => {
    // 1. Login as restaurant admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // 2. Navigate to orders
    await page.click('text=Orders');
    await expect(page).toHaveURL('/admin/orders');

    // 3. View order details
    await page.click('text=View Details');

    // 4. Update order status
    await page.selectOption('select[name="status"]', 'PREPARING');
    await page.click('button:has-text("Update Status")');

    // 5. Verify status update
    await expect(page.locator('text=Status: PREPARING')).toBeVisible();
  });

  test('Analytics and reporting flow', async ({ page }) => {
    // 1. Login as restaurant admin
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // 2. Navigate to analytics
    await page.click('text=Analytics');
    await expect(page).toHaveURL('/admin/analytics');

    // 3. Verify analytics data is displayed
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Top Items')).toBeVisible();
  });

  test('Error handling and edge cases', async ({ page }) => {
    // 1. Try to access protected routes without login
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL('/auth/login');

    // 2. Try to access invalid restaurant/table
    await page.goto('/restaurant/invalid/table/invalid');
    await expect(page.locator('text=Restaurant not found')).toBeVisible();

    // 3. Try to place order with empty cart
    await page.goto('/restaurant/1/table/1');
    await page.click('button:has-text("View Cart")');
    await page.click('button:has-text("Place Order")');
    await expect(page.locator('text=Cart is empty')).toBeVisible();
  });
}); 