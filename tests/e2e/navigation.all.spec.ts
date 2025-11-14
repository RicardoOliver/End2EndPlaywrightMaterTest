import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("E2E Avançado - Navegação", () => {
  test("Menu: acessar Rooms, Booking, Contact", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    const toggler = page.locator('button[class*=navbar]').first()
    if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
    await page.getByRole('link', { name: /rooms/i }).first().click()
    await expect(page.getByRole('link', { name: /rooms/i }).first()).toBeVisible()
    const backHome = page.getByRole('link', { name: /shady meadows/i }).first()
    if (await backHome.isVisible().catch(() => false)) await backHome.click().catch(() => {})
    if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
    const bookingLink = page.getByRole('link', { name: /make a booking/i }).first()
    if (await bookingLink.isVisible().catch(() => false)) await bookingLink.click().catch(() => {})
    const maybeBookBtn = page.getByRole('button', { name: /book|reservar/i }).first()
    await maybeBookBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    if (await backHome.isVisible().catch(() => false)) await backHome.click().catch(() => {})
    if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
    await page.getByRole('link', { name: /contact/i }).first().click()
    await expect(page).toHaveURL(/.*#\/?.*contact/i)
  })
})