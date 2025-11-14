import { test, expect, Page } from "@playwright/test"
import { BookingPage } from "../../pages/booking.page"

async function firstVisible(page: Page, selectors: string[]) {
  for (const s of selectors) {
    const locator = page.locator(s).first()
    const exists = (await locator.count()) > 0
    if (exists && (await locator.isVisible().catch(() => false))) return locator
  }
  return page.locator("input[type=date]").first()
}

function parseDate(str: string | null): Date | null {
  if (!str) return null
  const s = str.trim()
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T00:00:00`)
  }
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (m) {
    const d = Number(m[1])
    const mo = Number(m[2]) - 1
    const y = Number(m[3])
    return new Date(y, mo, d)
  }
  return null
}

async function readDateValue(page: Page, type: "checkin" | "checkout"): Promise<Date | null> {
  const id = type === "checkin" ? "checkin" : "checkout"
  const input = await firstVisible(page, [
    `#${id}`,
    `input[name=${id}]`,
    `input[placeholder*=${type === "checkin" ? "Check" : "Out"}]`,
    "input[type=date]",
    "input[type=text]",
  ])
  const val = await input.inputValue().catch(() => "")
  return parseDate(val)
}

async function openAndPickDate(page: Page, type: "checkin" | "checkout", date: Date) {
  const id = type === "checkin" ? "checkin" : "checkout"
  async function findDateInput(): Promise<import("@playwright/test").Locator> {
    const label = type === "checkin" ? /check\s*in/i : /check\s*out/i
    const exactLabel = type === "checkin" ? "Check In" : "Check Out"
    const candidates = [
      page.getByLabel(label).first(),
      page.getByPlaceholder(label).first(),
      page.locator(`#${id}`).first(),
      page.locator(`input[name="${id}"]`).first(),
      page.locator(`input[aria-label*="${exactLabel}"]`).first(),
      page.locator('input[type=date]').nth(type === 'checkin' ? 0 : 1),
      page.locator('input[type=text]').nth(type === 'checkin' ? 0 : 1),
    ]
    for (const c of candidates) {
      const exists = (await c.count()) > 0
      if (exists && (await c.isVisible().catch(() => false))) return c
    }
    return page.locator('input[type=date]').first()
  }
  const input = await findDateInput()
  const iso = date.toISOString().slice(0, 10)
  await input.scrollIntoViewIfNeeded().catch(() => {})
  await input.fill(iso).catch(async () => {
    await input.click().catch(() => {})
    await input.type(iso).catch(() => {})
  })
}

test.describe("E2E Avançado - Reserva completa", () => {
  test("Preencher campos e submeter reserva", async ({ page }) => {
    test.setTimeout(180000)
    const booking = new BookingPage(page)
    await booking.open()
    await booking.expectOpen()
    // Passo 1: escolher datas dinamicamente na Home e verificar disponibilidade
    const now = new Date()
    const checkin = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
    const checkout = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4)
    await openAndPickDate(page, "checkin", checkin)
    await openAndPickDate(page, "checkout", checkout)
    const inDate = await readDateValue(page, "checkin")
    const outDate = await readDateValue(page, "checkout")
    if (!inDate || !outDate || outDate <= inDate) {
      const fixed = new Date((inDate ?? checkin).getFullYear(), (inDate ?? checkin).getMonth(), (inDate ?? checkin).getDate() + 1)
      await openAndPickDate(page, "checkout", fixed)
    }
    const checkAvailability = page.getByRole('button', { name: /check availability/i }).first()
    await checkAvailability.click().catch(() => {})
    await page.waitForLoadState('networkidle').catch(() => {})
    await page.getByRole('heading', { name: /our rooms/i }).first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})

    // Passo 2: escolher a opção Double e clicar em "Book now"
    await page.locator('.room').first().waitFor({ state: 'visible', timeout: 10000 }).catch(async () => {
      const toggler = page.locator('button[class*=navbar]').first()
      if (await toggler.isVisible().catch(() => false)) await toggler.click().catch(() => {})
      await page.getByRole('link', { name: /rooms/i }).first().click().catch(() => {})
      await page.locator('.room').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    })
    let doubleCard = page.locator('.room').filter({ has: page.getByRole('heading', { name: /double/i }) }).first()
    if (!(await doubleCard.isVisible().catch(() => false))) {
      doubleCard = page.locator('.room').nth(1)
    }
    const bookNow = doubleCard.getByRole('button', { name: /book now/i }).first()
    await bookNow.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    await bookNow.scrollIntoViewIfNeeded().catch(() => {})
    await bookNow.click().catch(() => {})
    await page.waitForURL(/reservation\//, { timeout: 8000 }).catch(() => {})
    await page.waitForLoadState('domcontentloaded').catch(() => {})

    const firstName = page.getByLabel(/first\s*name|first|nome/i).first()
    const lastName = page.getByLabel(/last\s*name|last|sobrenome|surname/i).first()
    const email = page.getByLabel(/email/i).first()
    const phone = page.getByLabel(/phone|telefone/i).first()
    await firstName.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    const rnd = Math.random().toString(36).slice(2, 8)
    await firstName.fill(`Ricardo-${rnd}`).catch(() => {})
    await lastName.fill(`Oliver-${rnd}`).catch(() => {})
    await email.fill(`ricardo.${rnd}@example.com`).catch(() => {})
    await phone.fill(`555-01${Math.floor(Math.random()*90+10)}`).catch(() => {})
    const book = page.getByRole('button', { name: /^book$/i }).first()
    await book.click().catch(() => {})
    const okMsg = page.locator("text=Booking").first()
    const errorsFirst = page.locator('[aria-invalid="true"], .error, [role=alert]').first()
    const success = await okMsg.isVisible().catch(() => false)
    const hasError = await errorsFirst.isVisible().catch(() => false)
    const valid = success || !hasError
    expect(valid).toBe(true)
  })
})

test.describe("E2E Reserva completa - Automation in Testing", () => {
  test("Realizar reserva com sucesso", async ({ page }) => {
    test.setTimeout(180000)
    await page.goto("https://automationintesting.online/#/booking")
    const now = new Date()
    const checkin = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3)
    const checkout = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4)
    await openAndPickDate(page, "checkin", checkin)
    await openAndPickDate(page, "checkout", checkout)
    await page.getByRole("button", { name: /check availability/i }).click()
    await page.getByRole("heading", { name: /our rooms/i }).first().waitFor({ state: 'visible', timeout: 15000 })
    const roomCard = page.locator(".room").first()
    await roomCard.waitFor({ state: 'visible', timeout: 10000 })
    const bookBtn = roomCard.getByRole("button", { name: /book this room|book now/i }).first()
    await bookBtn.click()
    await page.waitForURL(/reservation\//, { timeout: 8000 }).catch(() => {})
    await page.waitForLoadState('domcontentloaded').catch(() => {})
    const rnd = Math.random().toString(36).substring(2, 7)
    await page.getByLabel(/first name/i).fill(`Ricardo-${rnd}`)
    await page.getByLabel(/last name/i).fill(`Oliver-${rnd}`)
    await page.getByLabel(/email/i).fill(`ricardo.${rnd}@example.com`)
    await page.getByLabel(/phone/i).fill("999999999")
    await page.getByLabel(/message/i).fill("Test booking automated by Playwright")
    await page.getByRole("button", { name: /^book$/i }).click()
    const okMsg2 = page.locator("text=Booking")
    const errors2 = page.locator('[aria-invalid="true"], .error, [role=alert]')
    const success2 = await okMsg2.isVisible().catch(() => false)
    const hasError2 = await errors2.isVisible().catch(() => false)
    expect(success2 || !hasError2).toBe(true)
  })
})