import type { ChatResponse, ProjectAskResult } from '../types/chat'

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
const API_TIMEOUT_MS = 90000

export class PortfolioKnowledgeError extends Error {
  readonly kind = 'portfolio_knowledge'

  constructor(message: string) {
    super(message)
    this.name = 'PortfolioKnowledgeError'
  }
}

function isPortfolioKnowledgeDetail(detail: string | null): boolean {
  if (!detail) {
    return false
  }

  return /I don't have enough information about that in Aathif's portfolio|No knowledge available for project|not enough information about that in Aathif's portfolio/i.test(detail)
}

async function fetchJson<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    })

    let data: any
    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      const detail = typeof data === 'object' && data && 'detail' in data ? String((data as any).detail) : null

      if (response.status === 404 && isPortfolioKnowledgeDetail(detail)) {
        throw new PortfolioKnowledgeError(detail ?? "I don't have enough information about that in Aathif's portfolio.")
      }

      throw new Error(detail ?? 'Unable to fetch from the portfolio API.')
    }

    return data as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('It may take a moment — the AI assistant is waking up. This portfolio uses Render\'s free tier, so cold starts can take a little time.')
    }

    if (error instanceof TypeError) {
      throw new Error('It may take a moment — the AI assistant is waking up. This portfolio uses Render\'s free tier, so cold starts can take a little time.')
    }

    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export function askChat(question: string) {
  return fetchJson<ChatResponse>(`${baseUrl}/api/chat`, { question })
}

export function askProject(projectId: string, question: string) {
  return fetchJson<ProjectAskResult>(`${baseUrl}/api/projects/${projectId}/ask`, { question })
}
