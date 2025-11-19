# 🎭 Playwright Testing Framework

![VISITANTES](https://visitor-badge.laobi.icu/badge?page_id=RicardoOliver.End2EndPlaywrightMaterTest&left_text=VISITANTES)

Framework completo de testes E2E com Playwright para o site [Automation In Testing](https://automationintesting.online/).

## 📁 Estrutura do Projeto

```bash
playwright-framework/
├─ tests/
│  ├─ e2e/              # Testes End-to-End
│  │  ├─ contact.spec.ts
│  │  └─ booking.spec.ts
│  ├─ smoke/            # Testes de Smoke
│  │  └─ homepage.spec.ts
│  ├─ regression/       # Testes regressivos
│  │  └─ site-regression.spec.ts
│  ├─ api/              # Testes de API/Health
│  │  └─ products.spec.ts
│  └─ nonfunctional/    # Testes não funcionais
│     └─ headers.spec.ts
├─ pages/               # Page Object Models
│  ├─ homepage.page.ts
│  ├─ contact.page.ts
│  └─ booking.page.ts
├─ fixtures/            # Dados de teste
│  ├─ contact.json
│  ├─ k6-message.json
│  └─ message-invalid.json
├─ utils/               # Utilitários (API helpers)
├─ notifiers/           # Sistema de notificações
│  ├─ notifyResults.ts
│  └─ email/slack/teams helpers
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
- **contact.spec.ts**: Envio do formulário de contato
- **booking.spec.ts**: Abertura do fluxo de reserva e validação do botão Book

### Smoke Tests
- **homepage.spec.ts**: Validação de elementos principais e navegação básica

### API/Health Tests
- **products.spec.ts**: Health de `/#/` e `#/contact`

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
- `test`: matriz de SO/Node, shard, artefatos com nomes únicos por shard, comentário automático em PR ao falhar e criação de issue em push quando falha
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
- Métricas de performance: `docker compose up -d influxdb grafana` e `npm run perf:k6` (k6 envia para InfluxDB e visualização no Grafana em `http://localhost:3000`)

## ⚡ Performance (k6)

- Local via Docker: `npm run perf:k6`
- Cenários: `home`, `contact`, `roomsSection`, `message`
- Saídas: `reports/k6-summary.json`, `reports/k6-summary.html` e métricas em InfluxDB (opcional)
- CI: job `performance` publica artefatos em Actions
 - Visualização no Grafana:
   ![Grafana Dashboard](docs/media/grafana-dashboard.png)

## 📈 Allure

- Gerar: `npm run report:allure`
- Abrir: `npm run report:allure:open`
- Requer Java instalado no ambiente

![Allure Report](docs/media/allure-report.png)

## 🎬 Mídias (Vídeos e Imagens)

- Vídeos dos testes
  - Os vídeos são anexados nos artefatos do GitHub Actions em `test-results` quando há falhas.
  - Para demonstrar no repositório, adicione um vídeo em `docs/media/demo.mp4` e use o link:
    - Use o player abaixo ou abra diretamente:
    - <video src="docs/media/demo.mp4" controls width="640"></video>

 - Dashboard Grafana (Performance)
  - Após executar `docker compose up -d influxdb grafana` e `npm run perf:k6`, capture o painel e salve em `docs/media/grafana-dashboard.png`.
  - Visualização:
    - ![Grafana Dashboard](docs/media/grafana-dashboard.png)

## 🌐 Site Testado

**Automation In Testing**: https://automationintesting.online/

Site de demonstração (Shady Meadows B&B) com:
- Homepage e navegação por `Rooms`
- Fluxo “Make a booking”
- Página `Contact` com formulário

## 📚 Documentação Adicional

- [CHANGELOG.md](./CHANGELOG.md) - Histórico de versões
- [CONFIGURACAO_EMAIL.md](./CONFIGURACAO_EMAIL.md) - Configuração de email e comportamento do teardown

  ## 🧮 Contador de Visitantes  

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=RicardoOliver/End2EndPlaywrightMaterTest/edit/main/README.md&color=ff69b4&style=for-the-badge&label=VISITANTES" alt="Contador de visitantes"/>
</p>
