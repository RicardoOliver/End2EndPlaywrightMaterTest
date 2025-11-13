import { type Page, expect } from "@playwright/test"

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goTo() {
    await this.page.goto("/index.php?rt=checkout/checkout")
  }

  async fillShippingAddress(address: {
    firstname: string
    lastname: string
    address1: string
    city: string
    postcode: string
    country: string
    zone: string
  }) {
    await this.page.fill("#guestFrm_firstname", address.firstname)
    await this.page.fill("#guestFrm_lastname", address.lastname)
    await this.page.fill("#guestFrm_address_1", address.address1)
    await this.page.fill("#guestFrm_city", address.city)
    await this.page.fill("#guestFrm_postcode", address.postcode)
    await this.page.selectOption("#guestFrm_country_id", { label: address.country })
    await this.page.selectOption("#guestFrm_zone_id", { label: address.zone })
  }

  async continueToPayment() {
    await this.page.click("#checkout_btn")
  }

  async confirmOrder() {
    await this.page.click("#checkout_btn")
  }

  async expectOrderConfirmation() {
    await expect(this.page.locator(".maintext")).toContainText("Your Order Has Been Processed")
  }

  async getOrderNumber() {
    return await this.page.locator(".order-number").textContent()
  }
}
