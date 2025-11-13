# 📬 Guia de Configuração de Notificações

Este guia explica como configurar cada tipo de notificação no framework Playwright.

## 📧 Email (SMTP)

### Outlook/Hotmail

1. **Configuração básica:**
   \`\`\`env
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   EMAIL_USER=seu.email@outlook.com
   EMAIL_PASS=sua_senha
   EMAIL_TO=r.c.d.1985@hotmail.com
   \`\`\`

2. **Se tiver autenticação de 2 fatores:**
   - Acesse: https://account.microsoft.com/security
   - Vá em "Opções de segurança avançadas"
   - Clique em "Criar uma nova senha de aplicativo"
   - Use essa senha no `EMAIL_PASS`

### Gmail

1. **Configuração básica:**
   \`\`\`env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=seu.email@gmail.com
   EMAIL_PASS=sua_senha_de_app
   EMAIL_TO=r.c.d.1985@hotmail.com
   \`\`\`

2. **Criar senha de aplicativo:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "App" → "Outro (nome personalizado)"
   - Digite "Playwright Tests"
   - Copie a senha gerada (16 caracteres)
   - Use essa senha no `EMAIL_PASS`

3. **Requisitos:**
   - Verificação em 2 etapas deve estar ativada
   - Não use sua senha normal do Gmail

### Outros Provedores

| Provedor | Host SMTP | Porta |
|----------|-----------|-------|
| Yahoo | smtp.mail.yahoo.com | 587 |
| Office 365 | smtp.office365.com | 587 |
| Zoho | smtp.zoho.com | 587 |
| SendGrid | smtp.sendgrid.net | 587 |

## 💬 Slack

### Passo 1: Criar App no Slack

1. Acesse: https://api.slack.com/apps
2. Clique em "Create New App"
3. Escolha "From scratch"
4. Nome: "Playwright Tests"
5. Selecione seu workspace

### Passo 2: Configurar Permissões

1. No menu lateral, clique em "OAuth & Permissions"
2. Em "Scopes" → "Bot Token Scopes", adicione:
   - `chat:write` - Enviar mensagens
   - `chat:write.public` - Enviar em canais públicos
   - `files:write` - Anexar arquivos (opcional)

### Passo 3: Instalar no Workspace

1. Clique em "Install to Workspace"
2. Autorize as permissões
3. Copie o "Bot User OAuth Token" (token OAuth do bot)

### Passo 4: Configurar no .env

\`\`\`env
SLACK_TOKEN=<SLACK_BOT_TOKEN>
SLACK_CHANNEL=#testes-automatizados
\`\`\`

### Passo 5: Adicionar Bot ao Canal

1. Abra o canal no Slack
2. Digite: `/invite @Playwright Tests`
3. Ou clique em "Adicionar pessoas" e selecione o bot

## 🔔 Microsoft Teams

### Passo 1: Criar Webhook

1. Abra o Microsoft Teams
2. Vá até o canal onde quer receber notificações
3. Clique nos "..." ao lado do nome do canal
4. Selecione "Conectores"
5. Procure por "Incoming Webhook"
6. Clique em "Configurar"

### Passo 2: Configurar Webhook

1. Nome: "Playwright Tests"
2. Upload de imagem (opcional)
3. Clique em "Criar"
4. Copie a URL do webhook

### Passo 3: Configurar no .env

\`\`\`env
TEAMS_WEBHOOK=https://outlook.office.com/webhook/abc123.../IncomingWebhook/def456.../ghi789...
\`\`\`

## 🧪 Testar Notificações

### Teste Individual

\`\`\`bash
# Testar apenas email
npm run test -- --grep "login"

# Verificar logs no terminal
# Você verá: ✅ Email enviado com sucesso
# Ou: ⏭️ Email: não configurado (pulando)
\`\`\`

### Teste Completo

\`\`\`bash
# Executar todos os testes
npm run test

# Ao final, verá o resumo:
# 📬 Notificações concluídas: 3/3 enviadas com sucesso
\`\`\`

## ❌ Troubleshooting

### Email não envia

**Erro: ECONNREFUSED 127.0.0.1:587**
- Verifique se `EMAIL_HOST` está correto
- Não use `localhost` ou `127.0.0.1`

**Erro: Invalid login**
- Verifique usuário e senha
- Para Gmail/Outlook com 2FA, use senha de aplicativo

**Erro: EAUTH**
- Senha incorreta
- Para Gmail, ative "Acesso a app menos seguro" ou use senha de app

### Slack não envia

**Erro: not_in_channel**
- Adicione o bot ao canal: `/invite @Playwright Tests`

**Erro: invalid_auth**
- Token inválido ou expirado
- Gere um novo token no Slack App

**Erro: channel_not_found**
- Verifique o nome/ID do canal
- Use `#nome-do-canal` ou `C1234567890`

### Teams não envia

**Erro: 400 Bad Request**
- URL do webhook incorreta
- Webhook pode ter sido removido

**Erro: 404 Not Found**
- Webhook foi deletado
- Crie um novo webhook

## 🔕 Desabilitar Notificações

### Temporariamente

- Remova/oculte as variáveis no `.env` (`EMAIL_*`, `SLACK_TOKEN`/`SLACK_CHANNEL`, `TEAMS_WEBHOOK`). Cada notificador só envia se estiver configurado.

### Permanentemente

Remova ou comente as variáveis no `.env`:

\`\`\`env
# EMAIL_HOST=smtp-mail.outlook.com
# SLACK_TOKEN=<SLACK_BOT_TOKEN>
# TEAMS_WEBHOOK=https://...
\`\`\`

## 📊 Formato das Notificações

### Email
- Assunto: "Resultados de Testes Playwright"
- Corpo: Resumo com métricas e link para relatório
- Anexos: ZIP contendo HTML do relatório quando disponível

### Slack
- Mensagem formatada com métricas
- Link para relatório/artefatos
- Emoji indicando sucesso/falha

### Teams
- Card formatado (MessageCard)
- Cor verde (sucesso) ou vermelha (falha)
- Botão para abrir relatório

## 🎯 Boas Práticas

1. **Segurança:**
   - Nunca commite o arquivo `.env`
   - Use senhas de aplicativo, não senhas principais
   - Rotacione tokens periodicamente

2. **Organização:**
   - Crie canais específicos para testes
   - Use prefixos nos nomes: `#qa-testes-automatizados`
   - Configure regras de notificação no Slack/Teams

3. **CI/CD:**
   - Configure `CI=true` no GitHub Actions
   - Use secrets do GitHub para tokens
   - Envie notificações apenas em branches principais

4. **Monitoramento:**
   - Revise os logs de notificações
   - Configure alertas para falhas críticas
   - Mantenha histórico de relatórios
