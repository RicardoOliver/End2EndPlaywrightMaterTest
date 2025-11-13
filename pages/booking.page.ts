import { type Page, expect } from "@playwright/test"

export class BookingPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.goto("/#/", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {})
    await this.page.waitForLoadState("networkidle").catch(() => {})
    const makeBooking = this.page.getByText("Make a booking", { exact: false }).first()
    const roomsLink = this.page.getByText("Rooms", { exact: false }).first()
    await makeBooking.waitFor({ state: "visible", timeout: 10000 }).catch(() => {})
    if (await makeBooking.isVisible().catch(() => false)) {
      await makeBooking.click()
      return
    }
    await roomsLink.waitFor({ state: "visible", timeout: 10000 }).catch(() => {})
    if (await roomsLink.isVisible().catch(() => false)) {
      await roomsLink.click()
    }
  }

  async expectOpen() {
    const bookButton = this.page.getByRole("button", { name: /book/i }).first()
    const makeBooking = this.page.getByText("Make a booking", { exact: false }).first()
    const roomsHeading = this.page.locator("text=Rooms").first()
    await Promise.race([
      bookButton.waitFor({ state: "visible", timeout: 10000 }),
      makeBooking.waitFor({ state: "visible", timeout: 10000 }),
      roomsHeading.waitFor({ state: "visible", timeout: 10000 }),
    ]).catch(() => {})
    const ok =
      (await bookButton.isVisible().catch(() => false)) ||
      (await makeBooking.isVisible().catch(() => false)) ||
      (await roomsHeading.isVisible().catch(() => false))
    expect(ok).toBe(true)
  }
}