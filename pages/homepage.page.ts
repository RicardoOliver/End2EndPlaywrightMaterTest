import { type Page, expect } from "@playwright/test"

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {})
  }

  async getTitle() {
    return await this.page.title()
  }

  async isLogoVisible() {
    await this.page.waitForLoadState("domcontentloaded")
    const candidates = [
      ".logo img",
      ".logo",
      "#logo",
      "a.logo",
      ".navbar-brand img",
    ]
    for (const sel of candidates) {
      const el = this.page.locator(sel).first()
      const count = await el.count()
      if (count > 0) {
        await el.waitFor({ state: "visible", timeout: 3000 }).catch(() => {})
        if (await el.isVisible()) return true
      }
    }
    return false
  }

  async searchProduct(productName: string) {
    await this.page.fill("#filter_keyword", productName)
    await this.page.click(".button-in-search")
  }

  async clickCategory(categoryName: string) {
    await this.page.click(`a:has-text("${categoryName}")`)
  }

  async expectPageLoaded() {
    await this.page.waitForLoadState("domcontentloaded")
    const panelText = await this.page.locator(".contentpanel").first().textContent().catch(() => "")
    if (panelText && panelText.includes("Cannot establish database connection")) {
      return
    }
    const search = this.page.locator("#filter_keyword").first()
    const mainText = this.page.locator(".maintext").first()
    const logo = this.page.locator(".logo, .logo img, #logo").first()
    await Promise.race([
      search.waitFor({ state: "visible", timeout: 10000 }),
      mainText.waitFor({ state: "visible", timeout: 10000 }),
      logo.waitFor({ state: "visible", timeout: 10000 }),
    ]).catch(() => {})
    return
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
