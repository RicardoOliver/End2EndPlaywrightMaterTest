import { sendEmail } from "./emailNotifier"
import { sendSlack } from "./slackNotifier"
import { sendTeams } from "./teamsNotifier"
import { extractMetrics } from "./metrics"

export async function sendAllNotifications(reportPath: string) {
  try {
    const summary = extractMetrics(reportPath)
    console.log("Métricas:", summary)

    // Lista de notificações a serem executadas
    const notifications: Promise<void>[] = []

    // 1️⃣ E-mail — só envia se as variáveis necessárias existirem
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      notifications.push(sendEmail(reportPath))
    } else {
      console.log("📭 Email notification skipped: Missing email configuration.")
    }

    // 2️⃣ Slack — envia apenas se configurado
    if (process.env.SLACK_TOKEN && process.env.SLACK_CHANNEL) {
      notifications.push(sendSlack(reportPath))
    } else {
      console.log("💬 Slack notification skipped: Missing SLACK_TOKEN or SLACK_CHANNEL.")
    }

    // 3️⃣ Teams — envia apenas se configurado
    if (process.env.TEAMS_WEBHOOK) {
      notifications.push(sendTeams(reportPath))
    } else {
      console.log("💼 Teams notification skipped: Missing TEAMS_WEBHOOK.")
    }

    // Executa todas as notificações configuradas em paralelo
    await Promise.allSettled(notifications)

    console.log("✅ Notificações processadas com sucesso!\n")
  } catch (error) {
    console.error("❌ Erro ao enviar notificações:", error)
  }
}
