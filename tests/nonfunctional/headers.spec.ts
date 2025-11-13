import { test, expect } from "@playwright/test"

test.describe.configure({ retries: process.env.CI ? 1 : 0 })

test.describe("Non-functional - Headers and cache", () => {
  test("Assets have cache headers", async ({ page }) => {
    const collected: Array<{ url: string; status: number; headers: Record<string, string> }> = []
    page.on("response", async (res) => {
      const url = res.url()
      const status = res.status()
      const headers = res.headers()
      const type = headers["content-type"] || ""
      const isAsset = type.includes("text/css") || type.includes("javascript")
      const sameHost = url.includes("automationintesting.online") || url.includes("cdn") || url.includes("bootstrapcdn")
      if (isAsset && sameHost) collected.push({ url, status, headers })
    })

    await page.goto("/#/", { waitUntil: "domcontentloaded" })
    await page.waitForLoadState("networkidle").catch(() => {})

    const assets = collected.filter((a) => a.status === 200 || a.status === 304)
    expect(assets.length).toBeGreaterThan(3)

    for (const a of assets) {
      const cc = a.headers["cache-control"] || a.headers["Cache-Control"] || ""
      const etag = a.headers["etag"] || a.headers["ETag"] || ""
      const lm = a.headers["last-modified"] || a.headers["Last-Modified"] || ""
      expect((cc && cc.length > 0) || (etag && etag.length > 0) || (lm && lm.length > 0)).toBe(true)
    }
  })
})