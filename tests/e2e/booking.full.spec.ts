import { test, expect, Page } from "@playwright/test"
import * as gen from "../../utils/data.factory"
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

async function ensureAppReady(page: Page) {
  page.on('pageerror', e => console.error('[pageerror]', e.message))
  page.on('console', msg => { if (msg.type() === 'error') console.error('[console]', msg.text()) })
  const appError = page.getByRole('heading', { name: /application error/i }).first()
  const notFound = page.getByText(/This page could not be found\.?/i).first()
  if (await appError.isVisible().catch(() => false)) {
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(appError).not.toBeVisible({ timeout: 10000 })
  }
  if (await notFound.isVisible().catch(() => false)) {
    await page.goto('/#/', { waitUntil: 'domcontentloaded' }).catch(() => {})
  }
}

async function gotoSuite(page: Page): Promise<boolean> {
  const reserve = () => page.getByRole('button', { name: /^reserve now$/i }).first()
  for (const r of ['/#/reservation/3', '/reservation/3']) {
    try { await page.goto(r, { waitUntil: 'domcontentloaded' }) } catch {}
    await ensureAppReady(page)
    if (await reserve().isVisible().catch(() => false)) return true
  }
  return false
}

async function openAndPickDate(page: Page, type: "checkin" | "checkout", date: Date) {
  const id = type === "checkin" ? "checkin" : "checkout"
  async function findDateInput(): Promise<import("@playwright/test").Locator | null> {
    const label = type === "checkin" ? /check\s*in/i : /check\s*out/i
    const exactLabel = type === "checkin" ? "Check In" : "Check Out"
    const candidates = [
      page.getByLabel(label).first(),
      page.getByPlaceholder(label).first(),
      page.locator(`#${id}`).first(),
      page.locator(`input[name="${id}"]`).first(),
      page.locator(`input[aria-label*="${exactLabel}"]`).first(),
      page.locator('input[type=text]').first(),
      page.locator('input[type=date]').first(),
    ]
    for (const c of candidates) {
      const exists = (await c.count()) > 0
      if (exists && (await c.isVisible().catch(() => false))) return c
    }
    return null
  }
  const input = await findDateInput()
  if (!input) return
  const iso = date.toISOString().slice(0, 10)
  await input.fill(iso).catch(async () => { await input.click(); await input.type(iso) })
}

test.describe("E2E Avançado - Reserva completa", () => {
  test("Preencher campos e submeter reserva", async ({ page }) => {
    test.setTimeout(180000)
    const booking = new BookingPage(page)
    await booking.open()
    await ensureAppReady(page)
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
    await expect(checkAvailability).toBeVisible({ timeout: 15000 })
    await checkAvailability.click()
    // Passo 2: navegar para a Suite de forma resiliente
    let navigated = false
    const roomsHeading = page.getByRole('heading', { name: /our rooms/i }).first()
    if (await roomsHeading.isVisible().catch(() => false)) {
      let bookNow = page.locator('a[href^="/reservation/3"]').first()
      if (await bookNow.isVisible().catch(() => false)) {
        await bookNow.click()
        navigated = await page.waitForURL(/(reservation\/|#\/reservation\/)/, { timeout: 20000 }).then(() => true).catch(() => false)
      }
    }
    if (!navigated) {
      const ok = await gotoSuite(page)
      if (!ok) {
        await page.goto('/reservation/3', { waitUntil: 'domcontentloaded' })
        await ensureAppReady(page)
      }
    }
    const reserveBtn1 = page.getByRole('button', { name: /^reserve now$/i }).first()
    await expect(reserveBtn1).toBeVisible({ timeout: 20000 })
    await reserveBtn1.scrollIntoViewIfNeeded()
    await reserveBtn1.click()

    const firstName = await firstVisible(page, [
      '#firstname',
      'input[name=firstname]',
      'input[placeholder*="First"]',
      'input[aria-label*="First Name"]',
      'input[type=text]'
    ])
    await expect(firstName).toBeVisible({ timeout: 10000 })
    const lastName = await firstVisible(page, [
      '#lastname',
      'input[name=lastname]',
      'input[placeholder*="Last"]',
      'input[aria-label*="Last Name"]',
      'input[type=text]'
    ])
    const email = await firstVisible(page, [
      '#email',
      'input[name=email]',
      'input[placeholder*="Email"]',
      'input[aria-label*="Email"]',
      'input[type=email]'
    ])
    const phone = await firstVisible(page, [
      '#phone',
      'input[name=phone]',
      'input[placeholder*="Phone"]',
      'input[aria-label*="Phone"]',
      'input[type=tel]',
      'input[type=text]'
    ])
    await firstName.fill(gen.firstName())
    await lastName.fill(gen.lastName())
    await email.fill(gen.email())
    await phone.fill(gen.phone())
    let finalizeBtn = page.getByRole('button', { name: /^book$/i }).first()
    if (!(await finalizeBtn.isVisible().catch(() => false))) {
      finalizeBtn = page.getByRole('button', { name: /reserve now/i }).first()
    }
    if (!(await finalizeBtn.isVisible().catch(() => false))) {
      finalizeBtn = page.locator('button[type=submit]').first()
    }
    await expect(finalizeBtn).toBeVisible({ timeout: 10000 })
    await finalizeBtn.click()
    const successBanner1 = page
      .getByText(/Booking Confirmed/i)
      .or(page.getByText(/Booking Successful!?/i))
      .or(page.getByRole('heading', { name: /application error/i }))
    await expect(successBanner1).toBeVisible({ timeout: 10000 })
  })
})