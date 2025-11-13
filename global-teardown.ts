import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { sendAllNotifications } from "./notifiers/notifyResults.js"

// Obter __dirname no formato ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carrega o .env a partir da raiz do projeto (mesmo diretório do config)
const envPath = path.resolve(__dirname, ".env")


console.log(`[Global Teardown] Attempting to load .env from: ${envPath}`)
console.log(`[Global Teardown] .env file exists: ${fs.existsSync(envPath)}`)

if (!fs.existsSync(envPath)) {
  console.warn(`⚠️  WARNING: .env file not found at ${envPath}`)
  console.warn(`⚠️  Please create a .env file in the project root directory`)
  console.warn(`⚠️  You can copy .env.example to .env and fill in your credentials`)
}

// Carrega as variáveis de ambiente
dotenv.config({ path: envPath })

async function globalTeardown() {
  console.log("\n=== Running global teardown - sending test notifications ===\n")

  // Modo FAST: pular notificações para acelerar execução
  const fastMode = process.env.FAST === "true" || process.env.PW_FAST === "true"
  if (fastMode) {
    console.log("⏩ FAST mode enabled — skipping notifications in global teardown.")
    return
  }

  console.log("Environment variables loaded:")
  console.log("- EMAIL_HOST:", process.env.EMAIL_HOST || "NOT SET")
  console.log("- EMAIL_USER:", process.env.EMAIL_USER || "NOT SET")
  console.log("- EMAIL_TO:", process.env.EMAIL_TO || "NOT SET")
  console.log("- SLACK_TOKEN:", process.env.SLACK_TOKEN ? "SET" : "NOT SET")
  console.log("- SLACK_CHANNEL:", process.env.SLACK_CHANNEL || "NOT SET")
  console.log("- TEAMS_WEBHOOK:", process.env.TEAMS_WEBHOOK ? "SET" : "NOT SET")
  console.log("")

  try {
    await sendAllNotifications("reports/report.json")
  } catch (error) {
    console.error("❌ Error sending notifications:", error)
  }
}

export default globalTeardown
