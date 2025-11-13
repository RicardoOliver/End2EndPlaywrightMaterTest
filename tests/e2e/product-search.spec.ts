import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("Product Search - Automation Test Store", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goTo()
  })

  test("Search for existing product", async ({ page }) => {
    await homePage.searchProduct("skinsheen")

    await expect(page).toHaveURL(/.*product\/search/)

    const results = await page.locator(".thumbnail").count()
    console.log("[playwright] Search results found:", results)
    expect(results).toBeGreaterThan(0)
  })

  test("Search for non-existing product", async ({ page }) => {
    await homePage.searchProduct("xyznonexistentproduct123")

    await expect(page).toHaveURL(/.*product\/search/)

    const noResults = await page
      .locator(".contentpanel:has-text('no products')")
      .isVisible()
      .catch(() => false)
    console.log("[playwright] No results message visible:", noResults)
  })

  test("Browse by category", async ({ page }) => {
    // Click on Skincare category
    await page.click('a[href*="path=43"]')

    await expect(page).toHaveURL(/.*path=43/)

    const products = await page.locator(".thumbnail").count()
    console.log("[playwright] Products in category:", products)
    expect(products).toBeGreaterThan(0)
  })

  test("View product details", async ({ page }) => {
    await homePage.searchProduct("benefit")

    // Click first product
    await page.locator(".thumbnail a").first().click()

    // Verify product page elements
    await expect(page.locator(".productname")).toBeVisible()
    await expect(page.locator(".productprice")).toBeVisible()
    await expect(page.locator(".cart")).toBeVisible()
  })
})
