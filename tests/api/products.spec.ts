import { test, expect } from "@playwright/test"

test.describe("Automation In Testing - API/Health", () => {
  const baseURL = "https://automationintesting.online"

  test("Homepage reachable", async ({ request }) => {
    const response = await request.get(`${baseURL}/#/`)
    expect(response.status()).toBe(200)
  })
})
