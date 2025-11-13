# Guia de Configuração - Playwright Test Framework

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Git (para CI/CD)

## Instalação Passo a Passo

### 1. Clone ou baixe o projeto

\`\`\`bash
git clone <seu-repositorio>
cd playwright-test-framework
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
\`\`\`

### 3. Instale os browsers do Playwright

\`\`\`bash
npx playwright install --with-deps
\`\`\`

Isso instalará Chromium, Firefox e WebKit com todas as dependências do sistema.

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

Edite o arquivo `.env` com suas credenciais reais:

\`\`\`env
# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Slack
SLACK_TOKEN=<SLACK_BOT_TOKEN>

# Teams
TEAMS_WEBHOOK=https://outlook.office.com/webhook/seu-webhook-real
\`\`\`

### 5. Configure a URL base

Edite `playwright.config.ts` e altere a `baseURL` para a URL da sua aplicação:

\`\`\`typescript
use: {
  baseURL: "https://sua-aplicacao.com",
  // ... outras configurações
}
\`\`\`

### 6. Execute os testes

\`\`\`bash
# Executar todos os testes
npm test

# Executar com interface gráfica
npm run test:headed

# Ver relatório
npm run test:report
\`\`\`

## Configuração de Notificações

### Email (Gmail)

1. Ative a verificação em duas etapas na sua conta Google
2. Gere uma senha de app em: https://myaccount.google.com/apppasswords
3. Use essa senha no `.env` como `EMAIL_PASS`

### Slack

1. Crie um Slack App em: https://api.slack.com/apps
2. Adicione o escopo `chat:write` em OAuth & Permissions
3. Instale o app no seu workspace
4. Copie o Bot User OAuth Token (token OAuth do bot)
5. Cole no `.env` como `SLACK_TOKEN`
6. Defina `SLACK_CHANNEL` no `.env` (não é necessário editar código)

### Teams

1. No canal do Teams, clique em "..." → Connectors
2. Configure "Incoming Webhook"
3. Copie a URL do webhook
4. Cole no `.env` como `TEAMS_WEBHOOK`

## Configuração CI/CD (GitHub Actions)

### 1. Configure os Secrets no GitHub

Vá em: Settings → Secrets and variables → Actions → New repository secret

Adicione cada variável do `.env` como um secret:
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `SLACK_TOKEN`
- `TEAMS_WEBHOOK`

### 2. Ative o GitHub Actions

O workflow já está configurado em `.github/workflows/playwright.yml`

Ele será executado automaticamente em:
- Push para `main` ou `develop`
- Pull requests para `main`
- Agendado diariamente às 03:00 UTC

### 3. Visualize os resultados

Após cada execução:
1. Vá em Actions no GitHub
2. Clique no workflow executado
3. Baixe os artifacts: relatórios Playwright (HTML/JSON/Allure/JUnit) e performance k6 (HTML/JSON)

## Personalização

### Adicionar novos testes

1. Crie um arquivo em `tests/e2e/` ou `tests/smoke/`
2. Siga o padrão dos testes existentes
3. Use Page Objects para organizar seletores

### Adicionar novos Page Objects

1. Crie um arquivo em `pages/`
2. Exporte uma classe com os métodos da página
3. Importe e use nos testes

### Modificar configurações do Playwright

Edite `playwright.config.ts` para:
- Alterar timeout
- Adicionar/remover browsers
- Configurar retry
- Ajustar captura de screenshots/vídeos

## Troubleshooting

### Erro: "Browser not found"
\`\`\`bash
npx playwright install --with-deps
\`\`\`

### Erro: "Cannot find module"
\`\`\`bash
npm install
\`\`\`

### Testes falhando com timeout
- Aumente o timeout em `playwright.config.ts`
- Verifique se a aplicação está acessível

### Notificações não enviadas
- Verifique as credenciais no `.env`
- Verifique os logs de erro no console
- Teste as credenciais manualmente

## Comandos Úteis

\`\`\`bash
# Executar apenas um arquivo de teste
npx playwright test tests/e2e/login.spec.ts

# Executar em modo debug
npx playwright test --debug

# Executar apenas em um browser
npx playwright test --project=chromium

# Gerar código de teste automaticamente
npx playwright codegen https://sua-aplicacao.com

# Ver trace de um teste
npx playwright show-trace test-results/.../trace.zip

## Relatórios Avançados (Allure)

```
npm run report:allure
npm run report:allure:open
```

Requer Java instalado no ambiente.

## Docker

```
docker build -t e2e-playwright .
docker compose run --rm tests
```

## Performance (k6)

```
npm run perf:k6
```
\`\`\`

## Estrutura de Pastas

\`\`\`
playwright-framework/
├── .github/workflows/     # CI/CD pipelines
├── pages/                 # Page Object Models
├── components/            # Componentes reutilizáveis
├── tests/                 # Arquivos de teste
│   ├── e2e/              # Testes end-to-end
│   └── smoke/            # Testes de smoke
├── fixtures/             # Dados de teste
├── utils/                # Utilitários
├── notifiers/            # Sistema de notificações
├── reports/              # Relatórios gerados (git ignored)
└── test-results/         # Resultados dos testes (git ignored)
\`\`\`

## Próximos Passos

1. Adapte os testes para sua aplicação
2. Configure as notificações
3. Configure o CI/CD no GitHub
4. Adicione mais testes conforme necessário
5. Documente casos de teste específicos

## Suporte

Para dúvidas ou problemas:
- Consulte a [documentação oficial do Playwright](https://playwright.dev)
- Abra uma issue no repositório
- Entre em contato com a equipe de QA
