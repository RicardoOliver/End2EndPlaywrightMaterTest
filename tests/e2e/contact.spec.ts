import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("E2E - Contact form submission", () => {
  test("Submit contact form with valid data", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await expect(page).toHaveURL(/.*#\//)
    await page.getByText("Contact").first().click()
    await expect(page).toHaveURL(/.*#\/contact/)

    await page.getByLabel("Name").fill("Test User")
    await page.getByLabel("Email").fill("test.user@example.com")
    await page.getByLabel("Phone").fill("1234567890")
    await page.getByLabel("Subject").fill("Booking enquiry")
    await page.getByLabel("Message").fill("I would like to know availability.")

    await page.getByRole("button", { name: /submit/i }).click()

    const success = page.locator("text=Thanks for getting in touch").first()
    await expect(success).toBeVisible()
  })
})