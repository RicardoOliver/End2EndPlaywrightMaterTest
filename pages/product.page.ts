import { type Page, expect } from "@playwright/test"

export class ProductPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goToProduct(productId: string) {
    await this.page.goto(`/index.php?rt=product/product&product_id=${productId}`)
  }

  async getProductName() {
    return await this.page.locator(".productname").textContent()
  }

  async getProductPrice() {
    return await this.page.locator(".productprice").textContent()
  }

  async addToCart() {
    await this.page.click(".cart")
  }

  async selectQuantity(quantity: string) {
    await this.page.fill("#product_quantity", quantity)
  }

  async expectProductAdded() {
    await expect(this.page.locator(".alert-success")).toBeVisible()
  }

  async clickReviewsTab() {
    await this.page.click('a[href="#review"]')
  }

  async isProductAvailable() {
    const outOfStock = await this.page.locator(".nostock").isVisible()
    return !outOfStock
  }
}
