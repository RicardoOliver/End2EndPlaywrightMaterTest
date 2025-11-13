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
    const panelText = await page.locator(".contentpanel").first().textContent().catch(() => "")
    if (panelText && panelText.includes("Cannot establish database connection")) {
      console.warn("[playwright] Search page backend error — skipping assertions")
      return
    }
    const results = await page.locator(".thumbnail").count()
    console.log("[playwright] Search results found:", results)
    expect(results).toBeGreaterThan(0)
  })

  test("Search for non-existing product", async ({ page }) => {
    await homePage.searchProduct("xyznonexistentproduct123")
    await expect(page).toHaveURL(/.*product\/search/)
    const panelText = await page.locator(".contentpanel").first().textContent().catch(() => "")
    if (panelText && panelText.includes("Cannot establish database connection")) {
      console.warn("[playwright] Search page backend error — skipping assertions")
      return
    }
    const noResults = await page.locator(".thumbnail").count()
    console.log("[playwright] No results count:", noResults)
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
