export class ApiHelper {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async get(endpoint: string, headers: Record<string, string> = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", ...headers },
    })
    return await response.json()
  }

  async post(endpoint: string, body: any, headers: Record<string, string> = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    })
    return await response.json()
  }

  async delete(endpoint: string, headers: Record<string, string> = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...headers },
    })
    return response.status === 204 ? null : await response.json()
  }
}
