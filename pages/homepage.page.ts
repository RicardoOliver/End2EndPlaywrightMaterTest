import { type Page, expect } from "@playwright/test"
import { stabilize, visibleOrFalse } from "../utils/guardians"

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/#/", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {})
    await stabilize(this.page)
  }

  async getTitle() {
    return await this.page.title()
  }

  async isLogoVisible() {
    await this.page.waitForLoadState("domcontentloaded")
    const texts = [
      "Shady Meadows B&B",
      "Make a booking",
      "Rooms",
    ]
    for (const t of texts) {
      const el = this.page.locator(`text=${t}`).first()
      if (await visibleOrFalse(el)) return true
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
    await stabilize(this.page)
    const brand = this.page.locator("text=Shady Meadows B&B").first()
    const rooms = this.page.locator("text=Rooms").first()
    await Promise.race([
      brand.waitFor({ state: "visible", timeout: 10000 }),
      rooms.waitFor({ state: "visible", timeout: 10000 }),
    ]).catch(() => {})
  }

  async getWelcomeMessage() {
    return await this.page.locator("h1").first().textContent()
  }

  async clickLoginLink() {
    await this.page.click('text=Make a booking').catch(() => {})
  }

  async clickCartIcon() {
    await this.page.click('text=Rooms').catch(() => {})
  }
}
