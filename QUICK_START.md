# Quick Start Guide

Guia rápido para começar a usar o framework em 5 minutos.

## 1. Instalação (2 minutos)

\`\`\`bash
# Instalar dependências
npm install

# Instalar browsers
npx playwright install --with-deps
\`\`\`

## 2. Configuração Mínima (1 minuto)

Crie um arquivo `.env`:

\`\`\`env
# Apenas para testes locais - notificações são opcionais
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha
\`\`\`

Edite `playwright.config.ts` e altere a URL:

\`\`\`typescript
baseURL: "https://sua-aplicacao.com"
\`\`\`

## 3. Execute seu primeiro teste (1 minuto)

\`\`\`bash
# Executar todos os testes
npm test

# Ver relatório
npm run test:report

### Relatórios avançados (Allure)

```
npm run report:allure
npm run report:allure:open
```
\`\`\`

## 4. Crie seu primeiro teste (1 minuto)

Crie `tests/e2e/meu-teste.spec.ts`:

\`\`\`typescript
import { test, expect } from "@playwright/test"

test("Meu primeiro teste", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("h1")).toBeVisible()
})
\`\`\`

Execute:

\`\`\`bash
npx playwright test tests/e2e/meu-teste.spec.ts
\`\`\`

## Pronto! 🎉

Você já tem um framework de testes funcionando!

## Próximos Passos

1. Leia o [README.md](README.md) completo
2. Consulte o [SETUP.md](SETUP.md) para configuração avançada
3. Veja exemplos em `tests/examples/advanced.spec.ts`
4. Configure CI/CD seguindo o [SETUP.md](SETUP.md)

## Comandos Úteis

\`\`\`bash
# Modo debug
npx playwright test --debug

# Apenas Chrome
npx playwright test --project=chromium

# Gerar código automaticamente
npx playwright codegen https://sua-aplicacao.com
\`\`\`

## Ajuda

- 📖 [Documentação Playwright](https://playwright.dev)
- 💬 Abra uma issue no repositório
- 📧 Entre em contato com a equipe de QA
\`\`\`
### Alternativa: Docker

```
# Executar testes com Docker Compose
docker compose run --rm tests

# Executar performance (k6)
npm run perf:k6
```
