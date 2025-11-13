import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
// @ts-ignore
import archiver from "archiver"
import { extractMetrics } from "./metrics"

dotenv.config()

export async function sendEmail(reportJsonPath: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  // 1) Gerar resumo das métricas a partir do JSON
  let summary = ""
  try {
    summary = extractMetrics(reportJsonPath)
  } catch (err) {
    summary = "Resumo indisponível (falha ao ler report.json)."
    console.warn("Falha ao extrair métricas do relatório:", err)
  }

  // 2) Compactar a pasta de relatório HTML para anexar
  const htmlReportDir = path.resolve("reports", "html")
  const zipOutputPath = path.resolve("reports", "playwright-report.zip")

  // Cria o zip apenas se a pasta HTML existir
  let zipAttachment: { filename: string; path: string; contentType: string } | undefined
  if (fs.existsSync(htmlReportDir)) {
    await zipDirectory(htmlReportDir, zipOutputPath)
    zipAttachment = {
      filename: "playwright-report.zip",
      path: zipOutputPath,
      contentType: "application/zip",
    }
  } else {
    console.warn(`Pasta de relatório HTML não encontrada em: ${htmlReportDir}`)
  }

  const subject = process.env.EMAIL_SUBJECT || "Resultados de Testes Playwright"
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; line-height: 1.4;">
      <h2>${subject}</h2>
      <p>${summary}</p>
      <p>O relatório HTML completo está anexado como <strong>playwright-report.zip</strong>.</p>
      <p>Alternativamente, você pode abrir localmente: <code>reports/html/index.html</code>.</p>
    </div>
  `

  await transporter.sendMail({
    from: `"Playwright CI" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject,
    html: htmlBody,
    attachments: zipAttachment ? [zipAttachment] : [],
  })
}

async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Garantir diretório de saída existente
      const outDir = path.dirname(outPath)
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true })
      }

      const output = fs.createWriteStream(outPath)
      const archive = archiver("zip", { zlib: { level: 9 } })

      output.on("close", () => resolve())
      archive.on("error", (err: Error) => reject(err))

      archive.pipe(output)
      archive.directory(sourceDir, false)
      archive.finalize()
    } catch (err) {
      reject(err)
    }
  })
}
