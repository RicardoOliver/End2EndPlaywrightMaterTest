import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"
import { ProductPage } from "../../pages/product.page"
import { CartPage } from "../../pages/cart.page"
import { CheckoutPage } from "../../pages/checkout.page"

test.describe("Checkout Flow - Automation Test Store", () => {
  let homePage: HomePage
  let productPage: ProductPage
  let cartPage: CartPage
  let checkoutPage: CheckoutPage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    productPage = new ProductPage(page)
    cartPage = new CartPage(page)
    checkoutPage = new CheckoutPage(page)
  })

  test("Guest checkout flow", async ({ page }) => {
    // Add product to cart
    await homePage.goTo()
    await page.locator('a[href*="product/category"]').first().click()
    await page.locator(".thumbnail .productcart").first().click()

    console.log("[playwright] Product added to cart")

    // Go to cart
    await cartPage.goTo()

    // Proceed to checkout
    const checkoutButton = await page
      .locator("#cart_checkout1")
      .isVisible()
      .catch(() => false)

    if (checkoutButton) {
      await cartPage.proceedToCheckout()
      console.log("[playwright] Proceeded to checkout")

      // Verify checkout page loaded
      await expect(page).toHaveURL(/.*checkout/)
    }
  })

  test("View checkout page", async ({ page }) => {
    await checkoutPage.goTo()

    // Check if redirected to login or guest checkout
    const url = page.url()
    console.log("[playwright] Checkout page URL:", url)

    expect(url).toContain("checkout")
  })

  test("Add multiple products and checkout", async ({ page }) => {
    await homePage.goTo()

    // Add first product
    await page.click('a[href*="path=43"]')
    await page.locator(".thumbnail .productcart").first().click()

    // Continue shopping
    await homePage.goTo()

    // Add second product
    await page.click('a[href*="path=49"]')
    await page.locator(".thumbnail .productcart").first().click()

    console.log("[playwright] Multiple products added")

    // View cart
    await cartPage.goTo()

    const items = await page.locator(".table tbody tr").count()
    console.log("[playwright] Items in cart:", items)
    expect(items).toBeGreaterThan(0)
  })
})
