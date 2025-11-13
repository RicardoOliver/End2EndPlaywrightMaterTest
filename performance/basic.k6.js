import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js'

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
}

const BASE_URL = __ENV.BASE_URL || 'https://automationteststore.com/'

export default function () {
  const res = http.get(BASE_URL)
  check(res, {
    'status 200': (r) => r.status === 200,
  })
  sleep(1)
}

export function handleSummary(data) {
  const summary = data && typeof data === 'object' ? data : { metrics: {}, root_group: { name: 'summary' } }
  let html
  try {
    html = htmlReport(summary)
  } catch (e) {
    html = `<html><body><pre>${JSON.stringify(summary, null, 2)}</pre></body></html>`
  }
  return {
    'reports/k6-summary.html': html,
    'reports/k6-summary.json': JSON.stringify(summary, null, 2),
  }
}