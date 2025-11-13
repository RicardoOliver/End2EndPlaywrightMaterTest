import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("Homepage Tests - Automation Test Store", () => {
  let homePage: HomePage

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    await homePage.goTo()
  })

  test("Homepage loads successfully", async () => {
    await homePage.expectPageLoaded()
    const title = await homePage.getTitle()
    expect(title).toContain("A place to practice Automation Testing")
  })

  test("Logo is visible", async () => {
    const isVisible = await homePage.isLogoVisible()
    expect(isVisible).toBe(true)
  })

  test("Search functionality works", async () => {
    await homePage.searchProduct("skinsheen")
    await expect(homePage.page).toHaveURL(/.*product\/search/)
  })

  test("Navigate to login page", async () => {
    await homePage.clickLoginLink()
    await expect(homePage.page).toHaveURL(/.*account\/login/)
  })

  test("Cart icon is visible", async () => {
    await homePage.clickCartIcon()
  })
})
