import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"
import fs from "fs"
import path from "path"

test.describe("E2E - Contact form submission", () => {
  test("Submit contact form with valid data", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    await expect(page).toHaveURL(/.*#\//)
    await page.getByText("Contact").first().click()
    await expect(page).toHaveURL(/.*#\/contact/)

    const dataPath = path.resolve("fixtures", "contact.json")
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"))
    await page.getByLabel("Name").fill(data.name)
    await page.getByLabel("Email").fill(data.email)
    await page.getByLabel("Phone").fill(data.phone)
    await page.getByLabel("Subject").fill(data.subject)
    await page.getByLabel("Message").fill(data.message)

    await page.getByRole("button", { name: /submit/i }).click()

    const success = page.locator("text=Thanks for getting in touch").first()
    await expect(success).toBeVisible()
  })
})