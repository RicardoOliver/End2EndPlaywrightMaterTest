import type { Page, Locator } from "@playwright/test"

export async function stabilize(page: Page) {
  await page.waitForLoadState("domcontentloaded")
  await page.waitForLoadState("networkidle").catch(() => {})
}

export async function visibleOrFalse(locator: Locator, timeout = 10000) {
  await locator.waitFor({ state: "visible", timeout }).catch(() => {})
  return await locator.isVisible().catch(() => false)
}

export async function hasBackendError(page: Page) {
  const panel = page.locator(".contentpanel").first()
  const text = await panel.textContent().catch(() => "")
  return !!text && /Cannot establish database connection/i.test(text)
}