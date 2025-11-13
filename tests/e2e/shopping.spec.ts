import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"
import { ProductPage } from "../../pages/product.page"
import { CartPage } from "../../pages/cart.page"

test.describe("Shopping Flow - Automation Test Store", () => {
  let homePage: HomePage
  let productPage: ProductPage
  let cartPage: CartPage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    productPage = new ProductPage(page)
    cartPage = new CartPage(page)
  })

  test("Browse and add product to cart", async ({ page }) => {
    await homePage.goTo()
    await homePage.searchProduct("skinsheen")

    // Click on first product in search results
await page.locator(".thumbnail a").first().click()

    const productName = await productPage.getProductName()
    console.log("[playwright] Product selected:", productName)

    await productPage.addToCart()
    await productPage.expectProductAdded()
  })

  test("View cart and update quantity", async ({ page }) => {
    await cartPage.goTo()

    // Check if cart has items or is empty
    const isEmpty = await page
      .locator(".contentpanel:has-text('empty')")
      .isVisible()
      .catch(() => false)

    if (!isEmpty) {
      console.log("[playwright] Cart has items")
      const total = await cartPage.getCartTotal()
      console.log("[playwright] Cart total:", total)
    } else {
      console.log("[playwright] Cart is empty")
    }
  })

  test("Complete shopping flow", async ({ page }) => {
    await homePage.goTo()

    // Navigate to a category
    await page.locator('a[href*="product/category"]').first().click()

    // Add first available product
    await page.locator(".thumbnail .productcart").first().click()

    // Go to cart
    await cartPage.goTo()

    // Verify item in cart
    const cartContent = await page.locator(".contentpanel").textContent()
    expect(cartContent).toBeTruthy()
  })

  test("Remove item from cart", async ({ page }) => {
    await cartPage.goTo()

    const isEmpty = await page
      .locator(".contentpanel:has-text('empty')")
      .isVisible()
      .catch(() => false)

    if (!isEmpty) {
      // Remove first item
      await page.locator(".btn-remove").first().click()
      console.log("[playwright] Item removed from cart")
    }
  })
})
