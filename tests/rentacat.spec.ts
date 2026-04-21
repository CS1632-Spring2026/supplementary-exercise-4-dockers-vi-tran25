import { test, expect } from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto("http://localhost:8080/");

    await page.context().addCookies([
        {name: "1", value: "false", url: "http://localhost:8080/"},
        {name: "2", value: "false", url: "http://localhost:8080/"},
        {name: "3", value: "false", url: "http://localhost:8080/"},
    ]);
});

// TEST-1-RESET
test("TEST-1-RESET", async ({ page }) => {
    await page.goto("http://localhost:8080/");

    await page.context().addCookies([
        {name: "1", value: "true", url: "http://localhost:8080/"},
        {name: "2", value: "true", url: "http://localhost:8080/"},
        {name: "3", value: "true", url: "http://localhost:8080/"},
    ]);

    await page.getByRole('link', { name: 'Reset' }).click();

    await expect(page.getByTestId('listing').getByRole('listitem').nth(0)).toHaveText("ID 1. Jennyanydots");
    await expect(page.getByTestId('listing').getByRole('listitem').nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(page.getByTestId('listing').getByRole('listitem').nth(2)).toHaveText("ID 3. Mistoffelees");
})

//  TEST-2-CATALOG
test("TEST-2-CATALOG", async ({page}) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    const images = page.locator('ol li img');
    await expect(images.nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
})

// TEST-3-LISTING
test("TEST-3-LISTING", async ({ page }) => {
    await page.goto("http://localhost:8080/");

    await page.getByRole('link', { name: 'Catalog' }).click();

    await expect(page.getByTestId('listing').getByRole('listitem')).toHaveCount(3);
    await expect(page.getByTestId('listing').getByRole('listitem').nth(2)).toHaveText("ID 3. Mistoffelees");
})
// TEST-5-RENT
test("TEST-5-RENT", async ({ page }) => {
    await page.goto("http://localhost:8080/");

    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();

    await expect(page.getByTestId('listing').getByRole('listitem')).toHaveCount(3);
    await expect(page.getByTestId('listing').getByRole('listitem').nth(0)).toHaveText("Rented out");
    await expect(page.getByTestId('listing').getByRole('listitem').nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(page.getByTestId('listing').getByRole('listitem').nth(2)).toHaveText("ID 3. Mistoffelees");
    await expect(page.getByTestId('rentResult')).toHaveText("Success!");
})

// TEST-4-RENT-A-CAT
test("TEST-4-RENT-A-CAT", async ({page}) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
})

// TEST-6-RETURN
test("TEST-6-RETURN", async ({page}) => {
    await page.context().addCookies([
        {name: "2", value: "true", url: "http://localhost:8080/"},
        {name: "3", value: "true", url: "http://localhost:8080/"},
    ]);
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByTestId('returnID').click();
    await page.getByTestId('returnID').fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    const listing = page.locator(".list-group-item");
    await expect(listing.nth(0)).toHaveText("ID 1. Jennyanydots");
    await expect(listing.nth(1)).toHaveText("ID 2. Old Deuteronomy");
    await expect(listing.nth(2)).toHaveText("Rented out");
    await expect(page.locator('#returnResult')).toHaveText('Success!');
})

// TEST-7-FEED-A-CAT
test("TEST-7-FEED-A-CAT", async ({ page }) => {
    await page.goto("http://localhost:8080/");

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
})

//  TEST-8-FEED
test("TEST-8-FEED", async ({page}) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByTestId('catnips').click();
    await page.getByTestId('catnips').fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.getByTestId('feedResult')).toHaveText("Nom, nom, nom.", { timeout: 10000 });
})

// TEST-9-GREET-A-CAT
test("TEST-9-GREET-A-CAT", async({ page }) => {
    await page.goto("http://localhost:8080/");

    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();

    await expect(page.getByTestId("greeting")).toBeVisible();
    await expect(page.getByTestId("greeting")).toHaveText("Meow!Meow!Meow!");
})

//  TEST-10-GREET-A-CAT-WITH-NAME
test("TEST-10-GREET-A-CAT-WITH-NAME", async ({page}) => {
    await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');
    await expect(page.locator('#greeting h4')).toHaveText("Meow! from Jennyanydots.");
})

//  TEST-11-FEED-A-CAT-SCREENSHOT
test("TEST-11-FEED-A-CAT-SCREENSHOT", async ({ page }) => {
    await page.goto("http://localhost:8080/");
   
    await page.context().addCookies([
        {name: "1", value: "true", url: "http://localhost:8080/"},
        {name: "2", value: "true", url: "http://localhost:8080/"},
        {name: "3", value: "true", url: "http://localhost:8080/"},
    ]);

    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('body')).toHaveScreenshot();
})
