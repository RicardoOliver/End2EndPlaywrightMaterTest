import dotenv from "dotenv"

dotenv.config()

export async function sendTeams(reportPath: string) {
  const message = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    summary: "Relatório de Testes Playwright",
    sections: [
      {
        activityTitle: "Testes Automatizados Concluídos",
        text: `Relatório: [Clique aqui](file://${reportPath})`,
      },
    ],
  }

  await fetch(process.env.TEAMS_WEBHOOK!, {
    method: "POST",
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" },
  })
}
