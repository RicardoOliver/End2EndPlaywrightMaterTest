import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("Regression - Core pages and elements", () => {
  test("Home elements visible", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await expect(page.locator("text=Shady Meadows B&B").first()).toBeVisible()
    await expect(page.locator("text=Rooms").first()).toBeVisible()
    const booking = page.locator("text=Make a booking").first()
    const contact = page.locator("text=Contact").first()
    await Promise.race([
      booking.waitFor({ state: "visible", timeout: 5000 }),
      contact.waitFor({ state: "visible", timeout: 5000 }),
    ]).catch(() => {})
    const ok = (await booking.isVisible().catch(() => false)) || (await contact.isVisible().catch(() => false))
    expect(ok).toBe(true)
  })

  test("Navigate to Rooms", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await page.getByText("Rooms").first().click()
    await expect(page.locator("text=Rooms").first()).toBeVisible()
  })

  test("Navigate to Contact", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await page.getByText("Contact").first().click()
    await expect(page).toHaveURL(/.*#\/?contact/)
  })
})