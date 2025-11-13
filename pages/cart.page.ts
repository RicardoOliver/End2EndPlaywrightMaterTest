import { type Page, expect } from "@playwright/test"

export class CartPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/index.php?rt=checkout/cart")
  }

  async getCartTotal() {
    return await this.page.locator(".total-price").textContent()
  }

  async removeItem(productName: string) {
    await this.page.click(`tr:has-text("${productName}") .btn-remove`)
  }

  async updateQuantity(productName: string, quantity: string) {
    await this.page.fill(`tr:has-text("${productName}") input[name*="quantity"]`, quantity)
    await this.page.click('button[title="Update"]')
  }

  async proceedToCheckout() {
    await this.page.click("#cart_checkout1")
  }

  async expectCartEmpty() {
    await expect(this.page.locator(".contentpanel")).toContainText("Your shopping cart is empty")
  }

  async expectItemInCart(productName: string) {
    await expect(this.page.locator(`tr:has-text("${productName}")`)).toBeVisible()
  }

  async continueShopping() {
    await this.page.click('a[title="Continue Shopping"]')
  }
}
