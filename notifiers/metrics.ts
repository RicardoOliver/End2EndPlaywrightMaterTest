import fs from "fs"

export function extractMetrics(reportPath: string) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"))

  let total = 0
  let passed = 0
  let failed = 0
  let skipped = 0
  let timedOut = 0

  // Recursively traverse suites to count all test results
  function traverseSuites(suites: any[]) {
    for (const suite of suites) {
      // Process specs in this suite
      if (suite.specs) {
        for (const spec of suite.specs) {
          if (spec.tests) {
            for (const test of spec.tests) {
              total++
              if (test.status === "expected") {
                passed++
              } else if (test.status === "unexpected") {
                failed++
              } else if (test.status === "skipped") {
                skipped++
              } else if (test.status === "timedOut") {
                timedOut++
              }
            }
          }
        }
      }

      // Recursively process nested suites
      if (suite.suites && suite.suites.length > 0) {
        traverseSuites(suite.suites)
      }
    }
  }

  // Start traversing from root suites
  if (report.suites) {
    traverseSuites(report.suites)
  }

  return `Total: ${total}, Passaram: ${passed}, Falharam: ${failed}${skipped > 0 ? `, Pulados: ${skipped}` : ""}${timedOut > 0 ? `, Timeout: ${timedOut}` : ""}`
}
