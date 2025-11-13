import { WebClient } from "@slack/web-api"
import dotenv from "dotenv"

dotenv.config()

const web = new WebClient(process.env.SLACK_TOKEN)

export async function sendSlack(reportPath: string) {
  await web.chat.postMessage({
    channel: process.env.SLACK_CHANNEL!,
    text: `Relatório de testes Playwright concluído! <file://${reportPath}|Clique para abrir>`,
  })
}
