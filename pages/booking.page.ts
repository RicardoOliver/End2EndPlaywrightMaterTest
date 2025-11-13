import { type Page, expect } from "@playwright/test"

export class BookingPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.goto("/#/", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {})
    await this.page.getByText("Make a booking").first().click()
  }

  async expectOpen() {
    const bookButton = this.page.getByRole("button", { name: /book/i }).first()
    await expect(bookButton).toBeVisible({ timeout: 10000 })
  }
}