export function randomString(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let out = ""
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function firstName() {
  const pool = ["Ricardo", "Oliver", "Mateus", "Lucas", "Ana", "Beatriz", "Mariana", "João", "Carlos", "Fernanda"]
  return `${pool[Math.floor(Math.random() * pool.length)]}-${randomString(6)}`
}

export function lastName() {
  const pool = ["Silva", "Oliveira", "Santos", "Souza", "Ferreira", "Rodrigues", "Almeida", "Gomes", "Ribeiro", "Carvalho"]
  return `${pool[Math.floor(Math.random() * pool.length)]}-${randomString(6)}`
}

export function email() {
  const user = `${randomString(6)}`
  return `ricardo.${user}@example.com`
}

export function phone(minLen = 11, maxLen = 21) {
  const len = Math.max(minLen, Math.min(maxLen, 12 + Math.floor(Math.random() * 6)))
  let digits = "5550"
  while (digits.length < len) digits += Math.floor(Math.random() * 10).toString()
  return digits.slice(0, len)
}