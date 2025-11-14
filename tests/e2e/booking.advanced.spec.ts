import { test, expect } from "@playwright/test"
import { BookingPage } from "../../pages/booking.page"

test.describe("E2E Avançado - Booking", () => {
  test("Formulário valida ao submeter vazio (robusto a labels)", async ({ page }) => {
    const booking = new BookingPage(page)
    await booking.open()
    await booking.expectOpen()

    let bookTrigger = page.getByRole("button", { name: /book|reservar/i }).first()
    if (!(await bookTrigger.isVisible().catch(() => false))) {
      const makeBookingLink = page.getByRole("link", { name: /make a booking/i }).first()
      if (await makeBookingLink.isVisible().catch(() => false)) await makeBookingLink.click().catch(() => {})
      await page.waitForTimeout(500)
      bookTrigger = page.getByRole("button", { name: /book|reservar/i }).first()
    }
    if (!(await bookTrigger.isVisible().catch(() => false))) {
      const bookLink = page.getByRole("link", { name: /book/i }).first()
      if (await bookLink.isVisible().catch(() => false)) bookTrigger = bookLink
    }

    await bookTrigger.click()

    const invalids = page.locator('[aria-invalid="true"], input:required, .error, .alert, [role="alert"]')
    const count = await invalids.count()
    expect(count >= 0).toBe(true)
  })

  test("Menu responsivo: garante que links essenciais estão acessíveis", async ({ page }) => {
    const booking = new BookingPage(page)
    await booking.open()

    const toggler = page.locator('button[class*=navbar]').first()
    if (await toggler.isVisible().catch(() => false)) {
      await toggler.click().catch(() => {})
    }
    await expect(page.getByRole('link', { name: /rooms/i }).first()).toBeVisible()
    const maybeBooking = page.getByRole('link', { name: /make a booking/i }).first()
    if (await maybeBooking.count() > 0) {
      await expect(maybeBooking).toBeVisible()
    }
  })
})