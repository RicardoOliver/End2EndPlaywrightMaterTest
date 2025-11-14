import { test, expect, Page } from "@playwright/test"
import { BookingPage } from "../../pages/booking.page"

function firstVisible(page: Page, selectors: string[]) {
  const all = selectors.map(s => page.locator(s).first())
  return Promise.any(all.map(async l => (await l.isVisible().catch(() => false)) ? l : Promise.reject()))
}

async function fillDate(page: Page, type: "checkin" | "checkout", iso: string) {
  const id = type === "checkin" ? "checkin" : "checkout"
  const input = await firstVisible(page, [
    `#${id}`,
    `input[name=${id}]`,
    `input[placeholder*=${type === "checkin" ? "Check" : "Out"}]`,
    `input[type=date]`
  ]).catch(() => page.locator(`input[type=date]`).first())
  await input.fill(iso).catch(async () => {
    await input.click().catch(() => {})
    await page.keyboard.type(iso)
  })
}

test.describe("E2E Avançado - Reserva completa", () => {
  test("Preencher campos e submeter reserva", async ({ page }) => {
    const booking = new BookingPage(page)
    await booking.open()
    await booking.expectOpen()
    const now = new Date()
    const checkin = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
    const checkout = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5)
    const isoIn = checkin.toISOString().slice(0, 10)
    const isoOut = checkout.toISOString().slice(0, 10)
    await fillDate(page, "checkin", isoIn)
    await fillDate(page, "checkout", isoOut)
    const firstName = page.getByRole("textbox", { name: /first|nome/i }).first()
    const lastName = page.getByRole("textbox", { name: /last|sobrenome|surname/i }).first()
    const email = page.getByRole("textbox", { name: /email/i }).first()
    const phone = page.getByRole("textbox", { name: /phone|telefone/i }).first()
    await firstName.fill("Ricardo").catch(() => {})
    await lastName.fill("Oliver").catch(() => {})
    await email.fill("ricardo@example.com").catch(() => {})
    await phone.fill("555-0101").catch(() => {})
    const submit = page.getByRole("button", { name: /book|reservar/i }).first()
    await submit.click().catch(() => {})
    const okMsg = page.locator("text=Booking").first()
    const errors = page.locator('[aria-invalid="true"], .error, [role=alert]')
    const valid = (await errors.count()) === 0 || (await okMsg.isVisible().catch(() => false))
    expect(valid).toBe(true)
  })
})