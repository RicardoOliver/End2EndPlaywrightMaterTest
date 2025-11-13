import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"
import { NavbarComponent } from "../../components/navbar.component"

test.describe("Navigation Tests - Automation Test Store", () => {
  let homePage: HomePage
  let navbar: NavbarComponent

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page)
    navbar = new NavbarComponent(page)
    await homePage.goTo()
  })

  test("Navigate through main categories", async ({ page }) => {
    // Click on Apparel & accessories
    await page.click('a[href*="path=68"]')
    await expect(page).toHaveURL(/.*path=68/)
    console.log("[playwright] Navigated to Apparel category")

    // Go back home
    await homePage.goTo()

    // Click on Makeup
    await page.click('a[href*="path=36"]')
    await expect(page).toHaveURL(/.*path=36/)
    console.log("[playwright] Navigated to Makeup category")
  })

  test("Navigate to account pages", async ({ page }) => {
    await homePage.clickLoginLink()
    await expect(page).toHaveURL(/.*account\/login/)

    // Click register
    await page.click('a[href*="account/create"]')
    await expect(page).toHaveURL(/.*account\/create/)
    console.log("[playwright] Navigated to registration page")
  })

  test("Footer links navigation", async ({ page }) => {
    // Check footer links
    const aboutUs = await page.locator('a[href*="content/about"]').isVisible()
    expect(aboutUs).toBe(true)

    const contactUs = await page.locator('a[href*="content/contact"]').isVisible()
    expect(contactUs).toBe(true)

    console.log("[playwright] Footer links are visible")
  })

  test("Breadcrumb navigation", async ({ page }) => {
    await page.click('a[href*="path=43"]')

    // Check breadcrumb
    const breadcrumb = await page.locator(".breadcrumb").isVisible()
    expect(breadcrumb).toBe(true)

    console.log("[playwright] Breadcrumb navigation working")
  })
})
