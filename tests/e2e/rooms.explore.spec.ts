import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("E2E Avançado - Rooms", () => {
  test("Explorar listagem de quartos", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    const toggler = page.locator('button[class*=navbar]').first()
    if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
    await page.getByRole('link', { name: /rooms/i }).first().click()
    const cards = page.locator('.room').first()
    await expect(cards).toBeVisible()
    const firstView = page.getByRole('button', { name: /view|details/i }).first()
    if (await firstView.isVisible().catch(() => false)) await firstView.click().catch(() => {})
    await expect(page.locator('text=Rooms').first()).toBeVisible()
  })
})