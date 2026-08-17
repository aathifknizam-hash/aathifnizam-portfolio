export type ProjectCard = {
  projectId: string
  projectName: string
  shortDescription: string
}

export type ContactDetails = {
  email: string
  linkedin: string
  phone: string
}

export type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  sources?: string[]
  projectCards?: ProjectCard[]
  contact?: ContactDetails
}

export type ChatResponse = {
  answer: string
  sources: string[]
}

export type ProjectAskResult = {
  answer: string
  sources: string[]
}
