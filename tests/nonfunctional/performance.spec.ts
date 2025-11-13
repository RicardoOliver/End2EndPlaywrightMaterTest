import { test, expect } from "@playwright/test"

test.describe("Non-functional - Performance", () => {
  test("DOMContentLoaded under threshold", async ({ page }) => {
    await page.goto("/#/")
    const nav = await page.evaluate(() => {
      const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      return entry ? { domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime } : null
    })
    const dcl = nav ? nav.domContentLoaded : 0
    expect(dcl).toBeLessThan(10000)
  })
})