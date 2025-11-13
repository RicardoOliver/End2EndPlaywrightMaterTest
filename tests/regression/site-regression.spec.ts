import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("Regression - Core pages and elements", () => {
  test("Home elements visible", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await expect(page.locator("text=Shady Meadows B&B").first()).toBeVisible()
    await expect(page.locator("text=Rooms").first()).toBeVisible()
    await expect(page.locator("text=Make a booking").first()).toBeVisible()
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