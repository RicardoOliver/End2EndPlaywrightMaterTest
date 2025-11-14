import { exec } from 'child_process'
import path from 'path'
import { existsSync } from 'fs'

const reportPath = path.resolve('reports', 'allure', 'index.html')
if (!existsSync(reportPath)) {
  console.error('Report not found')
  console.log(reportPath)
  process.exit(1)
}

const quoted = `"${reportPath.replace(/\\/g, '\\\\')}"`
let cmd = ''
if (process.platform === 'win32') {
  cmd = `start "" ${quoted}`
} else if (process.platform === 'darwin') {
  cmd = `open ${quoted}`
} else {
  cmd = `xdg-open ${quoted}`
}

exec(cmd, (err) => {
  if (err) {
    console.error(err.message)
    console.log(reportPath)
    process.exit(1)
  }
})