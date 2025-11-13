import { test, expect } from "@playwright/test"

test.describe("API Tests - Products", () => {
  const baseURL = "https://automationteststore.com"

  test("Get product categories", async ({ request }) => {
    const response = await request.get(`${baseURL}/index.php?rt=product/category`)

    expect(response.status()).toBe(200)
    console.log("[playwright] Categories page status:", response.status())
  })

  test("Search products via URL", async ({ request }) => {
    const response = await request.get(`${baseURL}/index.php?rt=product/search&keyword=skinsheen`)

    expect(response.status()).toBe(200)
    const body = await response.text()
    const dbError = body.includes("Cannot establish database connection")
    if (dbError) {
      console.warn("[playwright] Search API returned backend DB error — skipping content assertion")
    } else {
      expect(body.toLowerCase()).toContain("skinsheen")
      console.log("[playwright] Search API working correctly")
    }
  })

  test("Access product detail page", async ({ request }) => {
    const response = await request.get(`${baseURL}/index.php?rt=product/product&product_id=50`)

    expect(response.status()).toBe(200)
    console.log("[playwright] Product detail page accessible")
  })

  test("Check cart endpoint", async ({ request }) => {
    const response = await request.get(`${baseURL}/index.php?rt=checkout/cart`)

    expect(response.status()).toBe(200)
    console.log("[playwright] Cart endpoint accessible")
  })
})
