import type { Page, Locator } from "@playwright/test"

export class NavbarComponent {
  readonly page: Page
  readonly navbar: Locator

  constructor(page: Page) {
    this.page = page
    this.navbar = page.locator(".categorymenu")
  }

  async clickMenuItem(itemName: string) {
    await this.navbar.locator(`a:has-text("${itemName}")`).click()
  }

  async isMenuItemVisible(itemName: string): Promise<boolean> {
    return await this.navbar.locator(`a:has-text("${itemName}")`).isVisible()
  }

  async clickCategory(categoryName: string) {
    await this.page.click(`.subnav a:has-text("${categoryName}")`)
  }

  async hoverCategory(categoryName: string) {
    await this.navbar.locator(`a:has-text("${categoryName}")`).hover()
  }

  async logout() {
    await this.page.click('a[href*="account/logout"]')
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.page.locator('a[href*="account/account"]').isVisible()
  }
}
