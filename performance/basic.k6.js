import http from 'k6/http'
import { check, sleep } from 'k6'
import { htmlReport } from 'https://jslib.k6.io/k6-summary/0.0.4/index.js'

const BASE_URL = __ENV.BASE_URL || 'https://automationintesting.online/'
const HOME_URL = `${BASE_URL}#/`
const CONTACT_URL = `${BASE_URL}#/contact`
const MESSAGE_URL = `${BASE_URL}message/`

export const options = {
  scenarios: {
    home: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 50 },
        { duration: '30s', target: 0 },
      ],
      exec: 'home',
      tags: { scenario: 'home' },
    },
    contact: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '40s', target: 20 },
        { duration: '20s', target: 0 },
      ],
      exec: 'contact',
      tags: { scenario: 'contact' },
    },
    roomsSection: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '40s', target: 20 },
        { duration: '20s', target: 0 },
      ],
      exec: 'roomsSection',
      tags: { scenario: 'rooms' },
    },
    message: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 5 },
        { duration: '40s', target: 15 },
        { duration: '20s', target: 0 },
      ],
      exec: 'message',
      tags: { scenario: 'message' },
    },
  },
  thresholds: {
    'http_req_failed': ['rate<0.01'],
    'http_req_duration{scenario:home}': ['p(95)<800'],
    'http_req_duration{scenario:contact}': ['p(95)<800'],
    'http_req_duration{scenario:rooms}': ['p(95)<800'],
    'http_req_duration{scenario:message}': ['p(95)<1000'],
  },
}

export function home () {
  const res = http.get(HOME_URL, { tags: { name: 'home' } })
  check(res, {
    'home status 200': (r) => r.status === 200,
  })
  sleep(1)
}

export function contact () {
  const res = http.get(CONTACT_URL, { tags: { name: 'contact' } })
  check(res, {
    'contact status 200': (r) => r.status === 200,
  })
  sleep(1)
}

export function message () {
  const payload = JSON.parse(open('fixtures/k6-message.json'))
  const body = JSON.stringify(payload)
  const params = { headers: { 'Content-Type': 'application/json' }, tags: { name: 'message' } }
  const res = http.post(MESSAGE_URL, body, params)
  check(res, {
    'message status 2xx/3xx': (r) => r.status >= 200 && r.status < 400,
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

export function roomsSection () {
  const res = http.get(HOME_URL, { tags: { name: 'rooms' } })
  check(res, {
    'rooms section status 200': (r) => r.status === 200,
  })
  sleep(1)
}