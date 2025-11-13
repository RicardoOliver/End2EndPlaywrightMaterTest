import { type Page, expect } from "@playwright/test"

export class ContactPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/#/contact", { waitUntil: "domcontentloaded", timeout: 15000 }).catch(() => {})
  }

  async fillForm(data: { name: string; email: string; phone: string; subject: string; message: string }) {
    await this.page.getByLabel("Name").fill(data.name)
    await this.page.getByLabel("Email").fill(data.email)
    await this.page.getByLabel("Phone").fill(data.phone)
    await this.page.getByLabel("Subject").fill(data.subject)
    await this.page.getByLabel("Message").fill(data.message)
  }

  async submit() {
    await this.page.getByRole("button", { name: /submit/i }).click()
  }

  async expectSuccess() {
    await expect(this.page.locator("text=Thanks for getting in touch").first()).toBeVisible()
  }
}