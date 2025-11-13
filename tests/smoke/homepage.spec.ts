import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"
import { BookingPage } from "../../pages/booking.page"

test.describe("Homepage Tests - Automation In Testing", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goTo()
  })

  test("Homepage loads successfully", async () => {
    await homePage.expectPageLoaded()
    await expect(homePage.page).toHaveURL(/.*#\/?/)
  })

  test("Brand or rooms are visible", async () => {
    const brand = homePage.page.locator("text=Shady Meadows B&B").first()
    const rooms = homePage.page.locator("text=Rooms").first()
    await brand.waitFor({ state: "visible", timeout: 10000 }).catch(() => {})
    const visible = (await brand.isVisible().catch(() => false)) || (await rooms.isVisible().catch(() => false))
    expect(visible).toBe(true)
  })

  test("Rooms section accessible", async () => {
    await expect(homePage.page.locator("text=Rooms").first()).toBeVisible()
  })

  test("Navigate to booking", async () => {
    const booking = new BookingPage(homePage.page)
    await booking.open()
    await booking.expectOpen()
  })

  test("Open rooms navigation", async () => {
    await homePage.clickCartIcon()
    await expect(homePage.page.locator("text=Rooms").first()).toBeVisible()
  })
})
