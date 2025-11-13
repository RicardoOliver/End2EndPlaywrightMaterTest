import { type Page, expect } from "@playwright/test"

export class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/index.php?rt=account/login")
  }

  async login(username: string, password: string) {
    await this.page.fill("#loginFrm_loginname", username)
    await this.page.fill("#loginFrm_password", password)
    await this.page.click('button[title="Login"]')
  }

  async getErrorMessage() {
    return await this.page.locator(".alert-error").textContent()
  }

  async expectSuccessfulLogin() {
    await expect(this.page).toHaveURL(/.*account\/account/)
  }

  async clickRegisterLink() {
    await this.page.click('a[href*="account/create"]')
  }

  async clickForgotPassword() {
    await this.page.click('a[href*="account/forgotten/password"]')
  }
}
