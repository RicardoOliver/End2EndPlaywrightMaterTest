# 🎭 Playwright Testing Framework

Framework completo de testes E2E com Playwright para o site [Automation Test Store](https://automationteststore.com/).

## 📁 Estrutura do Projeto

```bash
playwright-framework/
├─ tests/
│  ├─ e2e/              # Testes End-to-End
│  │  ├─ login.spec.ts
│  │  ├─ shopping.spec.ts
│  │  ├─ product-search.spec.ts
│  │  └─ checkout.spec.ts
│  ├─ smoke/            # Testes de Smoke
│  │  ├─ homepage.spec.ts
│  │  └─ navigation.spec.ts
│  ├─ api/              # Testes de API
│  │  └─ products.spec.ts
│  └─ examples/         # Exemplos avançados
├─ pages/               # Page Object Models
│  ├─ login.page.ts
│  ├─ homepage.page.ts
│  ├─ product.page.ts
│  ├─ cart.page.ts
│  └─ checkout.page.ts
├─ components/          # Componentes reutilizáveis
│  └─ navbar.component.ts
├─ fixtures/            # Dados de teste
│  ├─ users.json
│  └─ checkout.json
├─ utils/               # Utilitários (API helpers)
├─ notifiers/           # Sistema de notificações
│  ├─ emailNotifier.ts
│  ├─ slackNotifier.ts
│  ├─ teamsNotifier.ts
│  ├─ metrics.ts
│  └─ notifyResults.ts
└─ reports/             # Relatórios HTML e JSON
```

## 🚀 Instalação

```bash
npm install
npx playwright install
```

## ⚙️ Configuração

1. Copie `.env.example` para `.env`
2. Configure suas credenciais:

```env
# Email (SMTP) - OBRIGATÓRIO
EMAIL_HOST=smtp.seuprovedor.com
EMAIL_PORT=587
EMAIL_USER=seuemail@dominio.com
EMAIL_PASS=suasenha
EMAIL_TO=r.c.d.1985@hotmail.com

# Slack Token - OPCIONAL
SLACK_TOKEN=<SLACK_BOT_TOKEN>

# Teams Webhook URL - OPCIONAL
TEAMS_WEBHOOK=https://outlook.office.com/webhook/...
```

## 🧪 Executar Testes

```bash
# Todos os testes
npm run test

# Com interface gráfica
npm run test:headed

# Modo UI interativo
npm run test:ui

# Ver relatório
npm run test:report

# Testes específicos
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/e2e/shopping.spec.ts

# Browser específico
npx playwright test --project=chromium
npx playwright test --project=firefox

# Modo debug
npx playwright test --debug
```

## 🎯 Testes Disponíveis

### E2E Tests (End-to-End)
- **login.spec.ts**: Autenticação com credenciais válidas/inválidas
- **shopping.spec.ts**: Fluxo completo de compras (busca → carrinho → checkout)
- **product-search.spec.ts**: Busca e navegação por produtos
- **checkout.spec.ts**: Processo de finalização de compra

### Smoke Tests
- **homepage.spec.ts**: Validação de elementos principais da homepage
- **navigation.spec.ts**: Navegação entre categorias e páginas

### API Tests
- **products.spec.ts**: Validação de endpoints de produtos e categorias

## 📊 Relatórios

- **HTML**: `reports/html/index.html`
- **JSON**: `reports/report.json`
- **JUnit**: `reports/junit.xml`
- **Allure**: `reports/allure/` (abra com `npm run report:allure:open`)
- Screenshots e vídeos salvos automaticamente em caso de falha
- Traces disponíveis para debug detalhado

## 🔔 Notificações Automáticas

Após cada execução, notificações são enviadas automaticamente para:

### ✉️ Email
- Destinatário: **r.c.d.1985@hotmail.com**
- Conteúdo: Relatório HTML completo com métricas

### 💬 Slack (Opcional)
- Resumo com métricas de execução
- Usa canal configurável via `SLACK_CHANNEL`

### 👥 Microsoft Teams (Opcional)
- Card adaptativo com resultados
- Métricas resumidas

## 🔄 CI/CD

Pipeline GitHub Actions configurado em `.github/workflows/playwright.yml`

- ✅ Execução automática em push/PR
- 🕐 Testes agendados diariamente às 03:00 UTC
- 📦 Artefatos salvos por 30 dias
- 🔔 Notificações automáticas após execução

### Jobs
- `test`: matriz de SO/Node, cache de browsers, upload de relatórios (HTML/JSON/Allure/JUnit)
- `performance`: executa k6 e publica `reports/k6-summary.html` e `reports/k6-summary.json`

### Variáveis/Secrets recomendados
- `BASE_URL` para performance (vars/secrets)
- `EMAIL_*`, `SLACK_TOKEN`, `SLACK_CHANNEL`, `TEAMS_WEBHOOK`

## 📝 Adicionar Novos Testes

1. **Criar Page Object** em `pages/`:
```typescript
export class MinhaPage {
  constructor(readonly page: Page) {}
  
  async minhaAcao() {
    await this.page.click('.seletor')
  }
}
```

2. **Adicionar teste** em `tests/e2e/`:
```typescript
import { test } from '@playwright/test'
import { MinhaPage } from '../../pages/minha.page'

test('Meu teste', async ({ page }) => {
  const minhaPage = new MinhaPage(page)
  await minhaPage.minhaAcao()
})
```

3. **Usar fixtures** de `fixtures/` para dados de teste

## 🛠️ Tecnologias

- Playwright 1.41+
- TypeScript 5.2+
- Nodemailer (email)
- Slack Web API
- Node Fetch (Teams)
- Allure (relatórios avançados)
- k6 (performance)

## 🐳 Docker

- Build: `docker build -t e2e-playwright .`
- Testes via compose: `docker compose run --rm tests`
- Portainer (opcional): gerencie containers via UI usando serviço definido em `docker-compose.yml`

## ⚡ Performance (k6)

- Local via Docker: `npm run perf:k6`
- CI: job `performance` publica artefatos em Actions

## 📈 Allure

- Gerar: `npm run report:allure`
- Abrir: `npm run report:allure:open`
- Requer Java instalado no ambiente

## 🌐 Site Testado

**Automation Test Store**: https://automationteststore.com/

Site de demonstração para prática de automação de testes com:
- Sistema de login/registro
- Catálogo de produtos
- Carrinho de compras
- Processo de checkout
- Múltiplas categorias

## 📚 Documentação Adicional

- [SETUP.md](./SETUP.md) - Guia detalhado de instalação
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Como contribuir
- [CHANGELOG.md](./CHANGELOG.md) - Histórico de versões
- [QUICK_START.md](./QUICK_START.md) - Início rápido
