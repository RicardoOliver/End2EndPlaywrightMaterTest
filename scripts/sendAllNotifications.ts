import path from "path"
import { sendAllNotifications } from "../notifiers/notifyResults"

async function main() {
  const reportPath = process.env.REPORT_JSON_PATH || path.resolve("reports", "report.json")
  await sendAllNotifications(reportPath)
}

main()