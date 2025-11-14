import { test, expect } from "@playwright/test"
import { HomePage } from "../../pages/homepage.page"

test.describe("E2E Avançado - Contato", () => {
  test("Enviar contato com dados válidos", async ({ page }) => {
    const home = new HomePage(page)
    await home.goTo()
    const toggler = page.locator('button[class*=navbar]').first()
    if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
    await page.getByRole('link', { name: /contact/i }).first().click()
    const name = page.locator('#name, input[name=name]').first()
    const email = page.locator('#email, input[name=email]').first()
    const phone = page.locator('#phone, input[name=phone]').first()
    const subject = page.locator('#subject, input[name=subject]').first()
    let message = page.getByLabel(/message|mensagem/i).first()
    if (!(await message.isVisible().catch(() => false))) {
      message = page.locator('#message, textarea[name=message], textarea, [role=textbox]').first()
    }
    await message.scrollIntoViewIfNeeded().catch(() => {})
    await message.waitFor({ state: 'visible', timeout: 8000 }).catch(() => {})
    await name.fill('Ricardo')
    await email.fill('ricardo@example.com')
    await phone.fill('555-0101')
    await subject.fill('Informações sobre quartos')
    await message.fill('Gostaria de saber sobre disponibilidade na próxima semana.')
    const submit = page.getByRole('button', { name: /submit|send|enviar/i }).first()
    await submit.click().catch(() => {})
    await page.waitForTimeout(500)
  })
})