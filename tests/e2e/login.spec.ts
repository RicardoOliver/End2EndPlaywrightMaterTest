import { test } from "@playwright/test";
import { LoginPage } from "../../pages/login.page";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const usersPath = path.join(__dirname, "../../fixtures/users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));


test.describe("Login Tests - Automation Test Store", () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goTo()
  })

  test("Valid credentials", async () => {
    await loginPage.login(users.valid.username, users.valid.password)
    await loginPage.expectSuccessfulLogin()
  })

  test("Invalid credentials", async () => {
    await loginPage.login(users.invalid.username, users.invalid.password)
    const error = await loginPage.getErrorMessage()
    console.log("Error Message:", error)
  })

  test("Navigate to register page", async () => {
    await loginPage.clickRegisterLink()
  })

  test("Navigate to forgot password", async () => {
    await loginPage.clickForgotPassword()
  })
})