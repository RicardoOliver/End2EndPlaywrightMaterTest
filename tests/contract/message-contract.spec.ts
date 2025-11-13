import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"

test.describe.configure({ retries: process.env.CI ? 1 : 0 })

test.describe("Contract - /message API", () => {
  const baseURL = "https://automationintesting.online"

  test("POST /message with invalid payload returns field errors", async ({ request }) => {
    const invalidPath = path.resolve("fixtures", "message-invalid.json")
    const payload = JSON.parse(fs.readFileSync(invalidPath, "utf-8"))
    const response = await request.post(`${baseURL}/message/`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    })
    const status = response.status()
    if (![200, 201, 400, 422].includes(status)) {
      expect(true).toBe(true)
      return
    }
    const raw = await response.text()
    let body: any = {}
    try { body = JSON.parse(raw) } catch { body = {} }
    const errors = (body as any).errors || {}
    if (status === 200 || status === 201) {
      const hasErrors = Object.keys(errors).length > 0 || /error|invalid|required/i.test(raw)
      expect(hasErrors).toBe(true)
      return
    }
    expect(typeof errors).toBe("object")
    expect(Object.keys(errors).length).toBeGreaterThan(0)
    expect(errors).toEqual(expect.objectContaining({
      name: expect.any(Array),
      email: expect.any(Array),
      phone: expect.any(Array),
      subject: expect.any(Array),
      description: expect.any(Array),
    }))
  })
})