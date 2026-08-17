import { useCallback, useRef, useState } from 'react'
import type { ProjectAskResult } from '../types/chat'
import { askProject } from '../api/client'

function sanitizeAnswerText(answer: string): string {
  return answer
    .replace(/(?:^|\n)\s*(?:projects|technologies)\/[A-Za-z0-9_.\-/]+\.(?:md|txt|json|csv)\s*/gi, '\n')
    .replace(/(?:^|\n)\s*[A-Za-z0-9_.\-/]+\.(?:md|txt|json|csv)\s*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function getVisibleSources(sources?: string[]): string[] | undefined {
  if (!sources || sources.length === 0) return undefined

  const filtered = sources.filter((source) => !/(?:^|\/)(?:projects|technologies)\/[A-Za-z0-9_.\-/]+\.(?:md|txt|json|csv)$/i.test(source))
  return filtered.length > 0 ? filtered : undefined
}

export function useProjectAsk(projectId: string) {
  const requestIdRef = useRef(0)
  const [answer, setAnswer] = useState<ProjectAskResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ask = useCallback(async (question: string) => {
    if (!question.trim()) {
      return
    }

    const requestId = ++requestIdRef.current

    setError(null)
    setIsLoading(true)

    try {
      const result = await askProject(projectId, question)
      if (requestId !== requestIdRef.current) {
        return
      }

      const sanitizedAnswer = sanitizeAnswerText(result.answer)
      const sanitizedSources = getVisibleSources(result.sources)
      const polishedAnswer = sanitizedAnswer === "I don't have enough information about that in Aathif's portfolio."
        ? "I can help with Aathif's projects, technology choices, stack, and project experience. Ask me about a specific project or technology."
        : sanitizedAnswer

      setAnswer({ answer: polishedAnswer, sources: sanitizedSources ?? [] })
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return
      }

      setError(err instanceof Error ? err.message : 'Unable to send the question.')
    } finally {
      if (requestId !== requestIdRef.current) {
        return
      }

      setIsLoading(false)
    }
  }, [projectId])

  return { answer, isLoading, error, ask }
}
