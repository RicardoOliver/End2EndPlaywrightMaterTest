import { type Page, expect } from "@playwright/test"

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/")
  }

  async getTitle() {
    return await this.page.title()
  }

  async isLogoVisible() {
    return await this.page.locator(".logo img").isVisible()
  }

  async searchProduct(productName: string) {
    await this.page.fill("#filter_keyword", productName)
    await this.page.click(".button-in-search")
  }

  async clickCategory(categoryName: string) {
    await this.page.click(`a:has-text("${categoryName}")`)
  }

  async expectPageLoaded() {
    await expect(this.page.locator(".logo")).toBeVisible()
  }

  async getWelcomeMessage() {
    return await this.page.locator(".maintext").first().textContent()
  }

  async clickLoginLink() {
    await this.page.click('a[href*="account/login"]')
  }

  async clickCartIcon() {
    await this.page.click(".cart")
  }
}
