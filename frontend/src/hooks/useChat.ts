import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChatMessage, ContactDetails, ProjectCard } from '../types/chat'
import { askChat, PortfolioKnowledgeError } from '../api/client'
import { projects as portfolioProjects } from '../data/projects'
import { technologies } from '../data/technologies'

const PROJECTS: ProjectCard[] = [
  {
    projectId: 'rag-powered-helpdesk',
    projectName: 'Smart Service Desk (SSD)',
    shortDescription: 'AI-powered IT support with RAG, support workflows, and retrieval-based responses.'
  },
  {
    projectId: 'semantic-cache-llm',
    projectName: 'Semantic Cache Layer',
    shortDescription: 'A cost-optimised semantic cache for LLM applications using embeddings and ChromaDB.'
  },
  {
    projectId: 'ai-interview-chatbot',
    projectName: 'AI Interview Coach',
    shortDescription: 'Semantic interview coaching and intent matching for practice and feedback.'
  },
  {
    projectId: 'taletm_acquisition',
    projectName: 'TaleTM Acquisition',
    shortDescription: 'Talent acquisition platform for ranking candidates against job descriptions.'
  }
]

const CONTACT_DETAILS: ContactDetails = {
  email: 'aathif.knizam@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aathif-nizam/',
  phone: '+91 9645860618'
}

const defaultSuggestions = [
  'What are the key features of the Clinic Management System?',
  'How did you build the Smart Service Desk project?',
  'Tell me about the backend architecture and tools you chose.',
  'What is the RAG workflow used in your portfolio project?'
]

function normalizeQuestion(question: string) {
  return question.toLowerCase().replace(/[^a-z0-9\s]/g, ' ')
}

function getTechnologyIdFromQuestion(question: string): string | null {
  const normalized = normalizeQuestion(question)

  if (/(^|\s)rag(\s|$)/.test(normalized)) return 'rag'
  if (/(^|\s)chromadb(\s|$)/.test(normalized)) return 'chromadb'
  if (/(^|\s)fastapi(\s|$)/.test(normalized)) return 'fastapi'
  if (/(django\s+rest|django-rest|drf)/.test(normalized)) return 'django-rest'

  return null
}

function getProjectsForTechnology(technologyId: string): ProjectCard[] {
  const technology = technologies.find((item) => item.id === technologyId)
  const projectMap = new Map(portfolioProjects.map((project) => [project.id, project]))

  const projectIds = Array.from(
    new Set((technology?.relatedProjects ?? []).filter((projectId) => projectMap.has(projectId)))
  )

  return projectIds
    .map((projectId) => {
      const project = projectMap.get(projectId)
      if (!project) return null

      return {
        projectId: project.id,
        projectName: project.title,
        shortDescription: project.subtitle
      }
    })
    .filter((project): project is ProjectCard => Boolean(project))
}

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

function detectPortfolioIntent(question: string) {
  const normalized = normalizeQuestion(question)
  const technologyId = getTechnologyIdFromQuestion(question)
  const hasTechnologyUsagePattern = /(what is rag|what is the rag|rag project|which project|which projects|where did|where has|where have|used in|use rag|uses rag|use chromadb|uses chromadb|use fastapi|uses fastapi|use django rest|uses django rest|project is rag|projects use|did aathif use|did he use)/.test(normalized)

  if (/(^|\s)(hi|hello|hey|good morning|good evening|greetings|hello there|hi there)(\s|$)/.test(normalized)) {
    return 'greeting'
  }

  if (/(^|\s)(bye|goodbye|good bye|see you|see ya|exit|quit|close|stop)(\s|$)/.test(normalized)) {
    return 'exit'
  }

  if (technologyId && hasTechnologyUsagePattern) {
    return 'PROJECT_TECHNOLOGY_USAGE'
  }

  if (/(^|\s)(projects?|his projects|my projects|what projects|show projects|show his projects|what has he built|aathif projects|project details|show project details|give project details|can you show me his project details)/.test(normalized)) {
    return 'project_list'
  }

  if (/(contact|contact details|email|gmail|linkedin|phone|number|how can i reach|how reach aathif|aathifs contact)/.test(normalized)) {
    return 'contact'
  }

  if (/(give groq api key|api key|secret|token|quota|how much token|cost api|each message cost api)/.test(normalized)) {
    return 'security'
  }

  if (/(why are you saying you are aathif.*assistant.*dont know anything|portfolio assistant|outside.*scope|not.*portfolio)/.test(normalized)) {
    return 'scope'
  }

  return null
}

export function useChat() {
  const requestIdRef = useRef(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingStatus, setLoadingStatus] = useState<string>('Thinking... please wait.')
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  // Update loading status based on elapsed time
  useEffect(() => {
    if (!isLoading || !loadingStartTime) return

    const checkElapsedTime = () => {
      const elapsed = Date.now() - loadingStartTime

      if (elapsed >= 15000) {
        setLoadingStatus('It may take a moment — the AI assistant is waking up. This portfolio uses Render\'s free tier, so cold starts can take a little time.')
      } else if (elapsed >= 5000) {
        setLoadingStatus('It may take a moment — the AI assistant is waking up. This portfolio uses Render\'s free tier, so cold starts can take a little time.')
      }
    }

    checkElapsedTime()
    const interval = setInterval(checkElapsedTime, 500)
    return () => clearInterval(interval)
  }, [isLoading, loadingStartTime])

  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim()) {
      return
    }

    const requestId = ++requestIdRef.current

    setError(null)
    setMessages((current) => [...current, { role: 'user', text: question }])

    const intent = detectPortfolioIntent(question)

    if (intent === 'greeting') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'Hi! I can help with Aathif\'s projects, technologies, stack, and contact details.'
        }
      ])
      return
    }

    if (intent === 'exit') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'Goodbye! Feel free to ask me about Aathif\'s projects, stack, or contact details anytime.'
        }
      ])
      return
    }

    if (intent === 'PROJECT_TECHNOLOGY_USAGE') {
      const technologyId = getTechnologyIdFromQuestion(question)
      const technology = technologies.find((item) => item.id === technologyId)
      const matchingProjects = technologyId ? getProjectsForTechnology(technologyId) : []

      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)

      const techName = technology?.name ?? technologyId?.toUpperCase() ?? 'the technology'
      const descriptionText = technology?.description ?? `${techName} is part of Aathif's toolkit.`
      const headingText = matchingProjects.length > 0
        ? `${descriptionText} Aathif uses ${techName} in:`
        : `${descriptionText} I couldn't verify a project relationship for ${techName} in the portfolio.`

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: headingText,
          projectCards: matchingProjects
        }
      ])
      return
    }

    if (intent === 'project_list') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'Here are Aathif\'s main projects:',
          projectCards: PROJECTS
        }
      ])
      return
    }

    if (intent === 'contact') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'You can reach Aathif through:',
          contact: CONTACT_DETAILS
        }
      ])
      return
    }

    if (intent === 'security') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: "I can't provide API keys or secrets. I can help with Aathif's portfolio, projects, skills, and technologies."
        }
      ])
      return
    }

    if (intent === 'scope') {
      setIsLoading(false)
      setLoadingStatus('Thinking... please wait.')
      setLoadingStartTime(null)
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: "I'm Aathif's portfolio assistant, so I'm focused on his projects, skills, technologies, experience, and background. If you ask about something outside that scope, I'll point you in the right direction instead of guessing."
        }
      ])
      return
    }

    setIsLoading(true)
    setLoadingStatus('Thinking... please wait.')
    setLoadingStartTime(Date.now())

    try {
      const result = await askChat(question)
      if (requestId !== requestIdRef.current) {
        return
      }

      const safeAnswer = sanitizeAnswerText(result.answer)
      const safeSources = getVisibleSources(result.sources)
      const polishedAnswer = safeAnswer === "I don't have enough information about that in Aathif's portfolio."
        ? "I can help with Aathif's projects, technologies, stack, and contact details. Ask me about those."
        : safeAnswer

      setMessages((current) => [
        ...current,
        { role: 'assistant', text: polishedAnswer, sources: safeSources }
      ])
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return
      }

      if (err instanceof PortfolioKnowledgeError) {
        const fallbackMessage = "I can help with Aathif's projects, technologies, stack, and contact details. Ask me about those."
        const assistantMessage = err.message === "I don't have enough information about that in Aathif's portfolio."
          ? fallbackMessage
          : err.message

        setMessages((current) => [
          ...current,
          { role: 'assistant', text: assistantMessage }
        ])
        return
      }

      setError(err instanceof Error ? err.message : 'Unable to send the chat request.')
    } finally {
      if (requestId !== requestIdRef.current) {
        return
      }

      setIsLoading(false)
      setLoadingStartTime(null)
      setLoadingStatus('Thinking... please wait.')
    }
  }, [])

  const selectSuggestion = useCallback((suggestion: string) => {
    void sendMessage(suggestion)
  }, [sendMessage])

  return { messages, isLoading, error, loadingStatus, sendMessage, selectSuggestion, defaultSuggestions }
}
