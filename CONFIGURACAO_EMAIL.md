# 📧 Configuração de Email para Relatórios

Este guia explica como configurar o envio de relatórios de testes por email para **r.c.d.1985@hotmail.com**.

## 📋 Pré-requisitos

- Conta de email válida para envio (Gmail, Outlook, Yahoo, etc.)
- Credenciais de acesso (email e senha)
- Para Gmail: App Password configurado (recomendado)

---

## 🔧 Configuração Passo a Passo

### 1. Gmail (Recomendado)

#### Opção A: Usando App Password (Mais Seguro)

1. Acesse [Google Account Security](https://myaccount.google.com/security)
2. Ative a verificação em duas etapas
3. Vá em "App passwords" (Senhas de app)
4. Selecione "Mail" e "Other device"
5. Copie a senha gerada (16 caracteres)
6. Configure no `.env`:

\`\`\`env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu.email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  # App Password gerado
EMAIL_TO=r.c.d.1985@hotmail.com
\`\`\`

#### Opção B: Permitir Apps Menos Seguros (Não Recomendado)

1. Acesse [Less Secure Apps](https://myaccount.google.com/lesssecureapps)
2. Ative "Permitir apps menos seguros"
3. Use sua senha normal no `.env`

⚠️ **Atenção**: Esta opção é menos segura e pode ser desativada pelo Google.

---

### 2. Outlook/Hotmail

\`\`\`env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=seu.email@outlook.com
EMAIL_PASS=sua_senha
EMAIL_TO=r.c.d.1985@hotmail.com
\`\`\`

**Notas**:
- Use a senha da sua conta Microsoft
- Certifique-se de que a autenticação em duas etapas está configurada
- Pode ser necessário gerar uma senha de aplicativo

---

### 3. Yahoo Mail

\`\`\`env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=seu.email@yahoo.com
EMAIL_PASS=senha_de_app  # Gere em Account Security
EMAIL_TO=r.c.d.1985@hotmail.com
\`\`\`

**Como gerar senha de app no Yahoo**:
1. Acesse [Yahoo Account Security](https://login.yahoo.com/account/security)
2. Clique em "Generate app password"
3. Selecione "Other App" e dê um nome
4. Use a senha gerada no `.env`

---

### 4. Outros Provedores SMTP

Para outros provedores, você precisará:

1. **Host SMTP**: Endereço do servidor (ex: `smtp.seudominio.com`)
2. **Porta**: Geralmente 587 (TLS) ou 465 (SSL)
3. **Usuário**: Seu email completo
4. **Senha**: Senha da conta ou senha de aplicativo

\`\`\`env
EMAIL_HOST=smtp.seudominio.com
EMAIL_PORT=587
EMAIL_USER=seu.email@seudominio.com
EMAIL_PASS=sua_senha
EMAIL_TO=r.c.d.1985@hotmail.com
\`\`\`

---

## ✅ Testando a Configuração

Após configurar o `.env`, teste o envio de email:

\`\`\`bash
# Execute os testes
npm run test

# Ou execute apenas um teste específico
npx playwright test tests/smoke/homepage.spec.ts
\`\`\`

Se configurado corretamente, você receberá um email em **r.c.d.1985@hotmail.com** com:
- Resumo dos testes executados
- Métricas (total, passou, falhou)
- Link para o relatório
- Anexo ZIP com relatório HTML quando disponível

---

## 🐛 Solução de Problemas

### Erro: "Invalid login credentials"

**Causa**: Email ou senha incorretos

**Solução**:
- Verifique se o email e senha estão corretos
- Para Gmail, use App Password em vez da senha normal
- Certifique-se de que não há espaços extras no `.env`

---

### Erro: "Connection timeout"

**Causa**: Firewall ou porta bloqueada

**Solução**:
- Verifique se a porta 587 está aberta no firewall
- Tente usar porta 465 com SSL
- Verifique sua conexão com a internet

---

### Erro: "Authentication failed"

**Causa**: Autenticação em duas etapas ou apps menos seguros

**Solução**:
- Gmail: Use App Password
- Outlook: Gere senha de aplicativo
- Yahoo: Gere senha de aplicativo
- Verifique se a autenticação em duas etapas está configurada

---

### Email não chega em r.c.d.1985@hotmail.com

**Possíveis causas**:
1. Email foi para spam/lixo eletrônico
2. Filtros de email bloquearam a mensagem
3. Endereço EMAIL_TO está incorreto no `.env`

**Solução**:
- Verifique a pasta de spam
- Adicione o remetente à lista de contatos seguros
- Confirme que `EMAIL_TO=r.c.d.1985@hotmail.com` está correto

---

## 📊 Formato do Email Enviado

O email enviado para **r.c.d.1985@hotmail.com** contém:

\`\`\`
Assunto: Resultados de Testes Playwright

Corpo:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 RELATÓRIO DE TESTES PLAYWRIGHT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Site: https://automationteststore.com/
Data: [timestamp]

📈 MÉTRICAS:
• Total: 15 testes
• Passou: 13 ✅
• Falhou: 2 ❌

📎 Relatório ZIP contendo HTML (quando disponível)

### Variáveis opcionais

```
EMAIL_SUBJECT="Resultados de Testes Playwright"
```
\`\`\`

---

## 🔒 Segurança

**Boas práticas**:
- ✅ Use App Passwords em vez de senhas reais
- ✅ Nunca commite o arquivo `.env` no Git
- ✅ Use variáveis de ambiente no CI/CD
- ✅ Rotacione senhas periodicamente
- ❌ Não compartilhe credenciais em texto plano

---

## 📞 Suporte

Se você ainda tiver problemas:

1. Verifique os logs em `console.log` durante a execução
2. Teste a conexão SMTP manualmente
3. Consulte a documentação do seu provedor de email
4. Abra uma issue no repositório do projeto

---

**Email de destino configurado**: r.c.d.1985@hotmail.com ✉️
