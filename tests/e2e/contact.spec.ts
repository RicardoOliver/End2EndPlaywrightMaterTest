import { test, expect } from "@playwright/test"
import { ContactPage } from "../../pages/contact.page"
import fs from "node:fs"
import path from "node:path"

test.describe("E2E - Contact form submission", () => {
  test("Submit contact form with valid data", async ({ page }) => {
    const contact = new ContactPage(page)
    await contact.goTo()
    await expect(page).toHaveURL(/.*#\/?contact/, { timeout: 10000 })

    const dataPath = path.resolve("fixtures", "contact.json")
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"))
    await contact.fillForm({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    })
    await contact.submit()
    await contact.expectSuccess()
  })
})