# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.1] - 2025-01-XX

### Fixed
- Corrigido erro ESM `ERR_REQUIRE_ESM` ao importar node-fetch
- Removido node-fetch - usando fetch nativo do Node.js 18+
- Removidas dependências desnecessárias (React, Next.js, UI libraries)
- Removida dependência `fs` (módulo nativo do Node.js)

### Changed
- Atualizado package.json com apenas dependências essenciais do Playwright
- Configurado para Automation In Testing (https://automationintesting.online/)
- Email de notificação configurado para r.c.d.1985@hotmail.com

### Added
- Page Objects para Product, Cart e Checkout
- Testes E2E de shopping flow completo
- Testes de busca de produtos
- Testes de API para produtos
- Fixtures para dados de checkout
- Documentação de configuração de email (CONFIGURACAO_EMAIL.md)

## [1.1.0] - 2025-11-12

### Added
- Dockerfile e docker-compose com serviço de testes e k6
- Integração de Portainer (opcional) no compose
- Relatórios avançados com Allure e JUnit
- Job de performance (k6) no GitHub Actions com artefatos HTML/JSON

### Changed
- Workflow `playwright.yml` avançado: matriz, cache, concorrência, schedule diário 03:00 UTC
- Notificador Slack usa `SLACK_CHANNEL` via `.env` (sem canal hardcoded)
- Documentação atualizada (README, QUICK_START, SETUP, GUIA_NOTIFICACOES, CONFIGURACAO_EMAIL)

### Fixed
- Ajustes em dependências e scripts de relatório/notificações

## [1.0.0] - 2024-01-15

### Adicionado
- Estrutura inicial do framework Playwright
- Page Object Model para Login e Homepage
- Componente reutilizável de Navbar
- Testes E2E de login (credenciais válidas e inválidas)
- Testes smoke de homepage
- Sistema de notificações automáticas (Email, Slack, Teams)
- Extração de métricas de testes
- Relatórios HTML e JSON
- Configuração de captura de screenshots, vídeos e traces
- Pipeline CI/CD com GitHub Actions
- Suporte multi-browser (Chrome, Firefox, Safari)
- Retry automático em falhas
- Fixtures para dados de teste
- API Helper para testes de API
- Documentação completa (README, SETUP, CONTRIBUTING)
- Arquivo .env.example para configuração
- TypeScript configurado com strict mode
- .gitignore configurado

### Configurações
- Timeout padrão: 60 segundos
- Retry em CI: 2 tentativas
- Screenshots: apenas em falhas
- Vídeos: apenas em falhas
- Traces: apenas em falhas
- Base URL: configurável via playwright.config.ts

### Dependências
- @playwright/test: ^1.41.0
- nodemailer: ^6.9.4
- @slack/web-api: ^7.12.0
- node-fetch: ^3.4.1
- dotenv: ^16.0.0
- typescript: ^5.2.0

## [1.2.0] - 2025-11-13

### Added
- Pages: `ContactPage`, `BookingPage`
- Testes: `tests/e2e/contact.spec.ts`, `tests/e2e/booking.spec.ts`
- Teste não funcional: `tests/nonfunctional/headers.spec.ts`
- Cenário k6 `roomsSection`
- Stack local de performance: `influxdb` + `grafana` no `docker-compose.yml`

### Changed
- Migração completa para `automationintesting.online` com rotas `#`/`#/`
- Estrutura de testes atualizada (remoção de specs antigos e componentes)
- CI: nomes de artefatos únicos por shard e etapa de sanitização do shard (`SHARD_NAME`) via `sed`
- Comentário automático em PR ao falhar e criação de issue em push quando falha

### Fixed
- Flakiness em navegação de booking e contato com esperas explícitas e seletores resilientes
- Falha de nome inválido de artefatos (barra `/` no shard)
- Falhas de contrato da API `/message` variando status (200/201/400/422)
</merged_code
