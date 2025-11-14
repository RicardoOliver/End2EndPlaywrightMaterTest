import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("E2E Avançado - Rooms", () => {
  test("Explorar listagem de quartos", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    const toggler = page.locator('button[class*=navbar]').first()
    if (await toggler.isVisible()) await toggler.click()
    await page.getByRole('link', { name: /^rooms$/i }).first().click()
    const ourRooms = page.getByRole('heading', { name: /our rooms/i }).first()
    await expect(ourRooms).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('heading', { name: /^single$/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: /^double$/i })).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('heading', { name: /^suite$/i })).toBeVisible({ timeout: 10000 })
    const anyBookNow = page.getByRole('link', { name: /^book now$/i }).first()
    await expect(anyBookNow).toBeVisible({ timeout: 10000 })
  })
})