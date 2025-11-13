import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"

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
    expect([200, 400, 422].includes(status)).toBe(true)
    const body = await response.json().catch(() => ({} as any))
    const errors = (body as any).errors || {}
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