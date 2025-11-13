import { test, expect } from "@playwright/test"
import { LoginPage } from "../../pages/login.page"
import { HomePage } from "../../pages/homepage.page"
import { ApiHelper } from "../../utils/apiHelper"

/**
 * Exemplos avançados de testes com Playwright
 * Este arquivo demonstra padrões e técnicas avançadas
 */

test.describe("Advanced Test Patterns", () => {
  // Exemplo 1: Teste com setup de API
  test("Login via API and verify UI", async ({ page, request }) => {
    // Setup: Criar usuário via API
    const api = new ApiHelper("https://api.example.com")
    const user = await api.post("/users", {
      username: "test_user",
      password: "test123",
    })

    // Test: Login via UI
    const loginPage = new LoginPage(page)
    await loginPage.goTo()
    await loginPage.login(user.username, "test123")
    await loginPage.expectSuccessfulLogin()
  })

  // Exemplo 2: Teste com múltiplos contextos (multi-user)
  test("Multi-user interaction", async ({ browser }) => {
    // Criar dois contextos separados (dois usuários)
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Usuário 1 faz login
    const loginPage1 = new LoginPage(page1)
    await loginPage1.goTo()
    await loginPage1.login("user1", "pass1")

    // Usuário 2 faz login
    const loginPage2 = new LoginPage(page2)
    await loginPage2.goTo()
    await loginPage2.login("user2", "pass2")

    // Verificar que ambos estão logados
    await expect(page1).toHaveURL(/.*home/)
    await expect(page2).toHaveURL(/.*home/)

    // Cleanup
    await context1.close()
    await context2.close()
  })

  // Exemplo 3: Teste com interceptação de requisições
  test("Intercept and mock API response", async ({ page }) => {
    // Interceptar requisição e retornar mock
    await page.route("**/api/user", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          name: "Mock User",
          email: "mock@example.com",
        }),
      })
    })

    const homePage = new HomePage(page)
    await homePage.goTo()

    // Verificar que o mock foi usado
    const userName = await page.locator(".user-name").textContent()
    expect(userName).toBe("Mock User")
  })

  // Exemplo 4: Teste com upload de arquivo
  test("Upload file", async ({ page }) => {
    await page.goto("/upload")

    // Upload de arquivo
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles("fixtures/test-file.pdf")

    // Verificar upload
    await page.click('button:has-text("Upload")')
    await expect(page.locator(".success-message")).toBeVisible()
  })

  // Exemplo 5: Teste com download de arquivo
  test("Download file", async ({ page }) => {
    await page.goto("/downloads")

    // Iniciar download
    const downloadPromise = page.waitForEvent("download")
    await page.click('a:has-text("Download Report")')
    const download = await downloadPromise

    // Verificar nome do arquivo
    expect(download.suggestedFilename()).toBe("report.pdf")

    // Salvar arquivo
    await download.saveAs(`./downloads/${download.suggestedFilename()}`)
  })

  // Exemplo 6: Teste com geolocalização
  test("Test with geolocation", async ({ browser }) => {
    const context = await browser.newContext({
      geolocation: { latitude: -23.5505, longitude: -46.6333 }, // São Paulo
      permissions: ["geolocation"],
    })

    const page = await context.newPage()
    await page.goto("/location")

    // Verificar que a localização foi detectada
    const location = await page.locator(".detected-location").textContent()
    expect(location).toContain("São Paulo")

    await context.close()
  })

  // Exemplo 7: Teste com localStorage
  test("Test with localStorage", async ({ page }) => {
    await page.goto("/")

    // Definir item no localStorage
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark")
      localStorage.setItem("language", "pt-BR")
    })

    // Recarregar página
    await page.reload()

    // Verificar que as preferências foram mantidas
    const theme = await page.evaluate(() => localStorage.getItem("theme"))
    expect(theme).toBe("dark")
  })

  // Exemplo 8: Teste com cookies
  test("Test with cookies", async ({ context, page }) => {
    // Definir cookies
    await context.addCookies([
      {
        name: "session_id",
        value: "abc123",
        domain: "example.com",
        path: "/",
      },
    ])

    await page.goto("/")

    // Verificar que o cookie foi enviado
    const cookies = await context.cookies()
    const sessionCookie = cookies.find((c) => c.name === "session_id")
    expect(sessionCookie?.value).toBe("abc123")
  })

  // Exemplo 9: Teste com espera customizada
  test("Custom wait conditions", async ({ page }) => {
    await page.goto("/dashboard")

    // Esperar por condição customizada
    await page.waitForFunction(() => {
      const element = document.querySelector(".data-loaded")
      return element && element.textContent !== "Loading..."
    })

    // Esperar por múltiplos elementos
    await Promise.all([page.waitForSelector(".chart"), page.waitForSelector(".table"), page.waitForSelector(".stats")])

    // Verificar que tudo carregou
    await expect(page.locator(".dashboard")).toBeVisible()
  })

  // Exemplo 10: Teste com retry customizado
  test("Test with custom retry logic", async ({ page }) => {
    await page.goto("/flaky-page")

    // Retry customizado para elemento que pode demorar
    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      try {
        await page.locator(".dynamic-content").waitFor({ timeout: 5000 })
        break
      } catch (error) {
        attempts++
        if (attempts === maxAttempts) throw error
        await page.reload()
      }
    }

    await expect(page.locator(".dynamic-content")).toBeVisible()
  })
})

// Exemplo de teste parametrizado
const testData = [
  { browser: "chrome", viewport: { width: 1920, height: 1080 } },
  { browser: "firefox", viewport: { width: 1366, height: 768 } },
  { browser: "safari", viewport: { width: 1440, height: 900 } },
]

testData.forEach(({ browser, viewport }) => {
  test(`Responsive test on ${browser}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")

    // Verificar layout responsivo
    const isMobile = viewport.width < 768
    const menuButton = page.locator(".mobile-menu-button")

    if (isMobile) {
      await expect(menuButton).toBeVisible()
    } else {
      await expect(menuButton).not.toBeVisible()
    }
  })
})
