import { test, expect } from "@playwright/test"
import { BookingPage } from "../../pages/booking.page"

test.describe("E2E - Booking flow", () => {
  test("Open booking and validate", async ({ page }) => {
    const booking = new BookingPage(page)
    await booking.open()
    await booking.expectOpen()
  })
})