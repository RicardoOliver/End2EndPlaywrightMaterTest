# Guia de Contribuição

## Como Contribuir

### 1. Padrões de Código

#### Page Objects
- Use classes para representar páginas
- Métodos devem ser descritivos e autoexplicativos
- Agrupe seletores relacionados
- Use `readonly` para propriedades imutáveis

\`\`\`typescript
export class LoginPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async login(username: string, password: string) {
    await this.page.fill("#username", username)
    await this.page.fill("#password", password)
    await this.page.click('button[type="submit"]')
  }
}
\`\`\`

#### Testes
- Use `describe` para agrupar testes relacionados
- Use `beforeEach` para setup comum
- Nomes de testes devem ser claros e descritivos
- Um teste deve testar apenas uma funcionalidade

\`\`\`typescript
test.describe("Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  })

  test("Should login with valid credentials", async () => {
    // Test implementation
  })
})
\`\`\`

#### Fixtures
- Use JSON para dados de teste
- Organize por categoria (valid, invalid, edge cases)
- Não commite dados sensíveis reais

\`\`\`json
{
  "valid": { "username": "test_user", "password": "test123" },
  "invalid": { "username": "wrong_user", "password": "wrong_pass" }
}
\`\`\`

### 2. Convenções de Nomenclatura

- **Arquivos de teste**: `*.spec.ts`
- **Page Objects**: `*.page.ts`
- **Componentes**: `*.component.ts`
- **Utilitários**: `*.helper.ts` ou `*.util.ts`
- **Fixtures**: `*.json`

### 3. Estrutura de Commits

Use commits semânticos:

\`\`\`
feat: adiciona teste de recuperação de senha
fix: corrige seletor do botão de login
docs: atualiza README com instruções de setup
refactor: reorganiza page objects
test: adiciona testes de navegação
chore: atualiza dependências
\`\`\`

### 4. Pull Requests

1. Crie uma branch a partir de `develop`
2. Faça suas alterações
3. Execute os testes localmente
4. Crie um PR para `develop`
5. Aguarde review

### 5. Code Review

Checklist para reviewers:
- [ ] Código segue os padrões estabelecidos
- [ ] Testes estão passando
- [ ] Não há dados sensíveis no código
- [ ] Documentação foi atualizada se necessário
- [ ] Commits são claros e descritivos

### 6. Boas Práticas

#### Seletores
- Prefira seletores por data-testid
- Evite seletores frágeis (classes CSS dinâmicas)
- Use seletores semânticos quando possível

\`\`\`typescript
// ✅ Bom
await page.click('[data-testid="login-button"]')
await page.click('button[type="submit"]')

// ❌ Evite
await page.click('.btn-primary-123')
await page.click('div > div > button')
\`\`\`

#### Waits
- Use waits explícitos do Playwright
- Evite `page.waitForTimeout()`
- Confie nos auto-waits do Playwright

\`\`\`typescript
// ✅ Bom
await expect(page.locator('.message')).toBeVisible()
await page.waitForLoadState('networkidle')

// ❌ Evite
await page.waitForTimeout(5000)
\`\`\`

#### Assertions
- Use assertions específicas
- Adicione mensagens descritivas quando necessário

\`\`\`typescript
// ✅ Bom
await expect(page.locator('h1')).toHaveText('Welcome')
await expect(page).toHaveURL(/.*dashboard/)

// ❌ Evite
expect(await page.locator('h1').textContent()).toBe('Welcome')
\`\`\`

### 7. Testes Flaky

Se um teste está falhando intermitentemente:
1. Adicione waits apropriados
2. Verifique race conditions
3. Use retry apenas como último recurso
4. Documente o problema

### 8. Performance

- Evite testes desnecessariamente longos
- Use paralelização quando possível
- Reutilize estados de autenticação
- Minimize navegações desnecessárias

## Dúvidas?

Abra uma issue ou entre em contato com a equipe de QA.
\`\`\`

```json file="" isHidden
