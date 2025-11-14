import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig, devices } from "@playwright/test"

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file from project root
const envPath = path.resolve(__dirname, ".env")
console.log(`[Playwright Config] Loading .env from: ${envPath}`)
dotenv.config({ path: envPath })

// Modo FAST: otimiza execução reduzindo projetos e desligando mídias/traces
const fastMode = process.env.FAST === "true" || process.env.PW_FAST === "true"

const useDefaults = {
  headless: true,
  screenshot: fastMode ? "off" : "only-on-failure",
  video: process.env.PW_VIDEO === "on" ? "on" : fastMode ? "off" : "retain-on-failure",
  trace: fastMode ? "off" : "retain-on-failure",
  baseURL: process.env.BASE_URL || "https://automationintesting.online/",
  outputDir: "test-results",
  viewport: null,
} as const

export default defineConfig({
  testDir: "./tests",
  timeout: 45 * 1000,
  retries: process.env.CI ? 1 : 0,
  fullyParallel: true,
  reporter: [
    ["html", { outputFolder: "reports/html", open: "never" }],
    ["json", { outputFile: "reports/report.json" }],
    ["allure-playwright", { outputFolder: "allure-results", detail: true }],
    ["junit", { outputFile: "reports/junit.xml" }],
  ],
  use: useDefaults,
  projects: fastMode
    ? [
        {
          name: "chromium",
          use: {
            viewport: null,
            launchOptions: { args: ["--start-maximized"] },
          },
        },
      ]
    : [
        {
          name: "chromium",
          use: {
            viewport: null,
            launchOptions: { args: ["--start-maximized"] },
          },
        },
        {
          name: "firefox",
          use: {
            ...devices["Desktop Firefox"],
            viewport: { width: 1920, height: 1080 },
          },
        },
        {
          name: "webkit",
          use: {
            ...devices["Desktop Safari"],
            viewport: { width: 1920, height: 1080 },
          },
        },
      ],
  globalTeardown: "./global-teardown.ts",
})