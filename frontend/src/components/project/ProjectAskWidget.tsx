import { useState } from 'react'
import { useProjectAsk } from '../../hooks/useProjectAsk'
import Button from '../shared/Button'
import ErrorMessage from '../shared/ErrorMessage'

type Props = {
  projectId: string
}

function ProjectAskWidget({ projectId }: Props) {
  const { answer, isLoading, error, ask } = useProjectAsk(projectId)
  const [question, setQuestion] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await ask(question)
    setQuestion('')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#d6c9ff]">
        Ask about this project
      </label>
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        rows={3}
        disabled={isLoading}
        placeholder="Example: How did you design the knowledge retrieval flow?"
        className="w-full rounded-2xl border border-[#c8b4ff]/20 bg-[#0d0914]/90 px-4 py-3 text-sm text-[#f9f5ff] outline-none transition placeholder:text-[#b8abcf] focus:border-[#b592ff] focus:ring-2 focus:ring-[#8b5cf6]/20"
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button disabled={isLoading || !question.trim()} type="submit">
          Ask question
        </Button>
        {isLoading ? <span className="text-sm text-[#d5caff]">Processing…</span> : null}
      </div>
      {error ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-amber-100/90">Offline</span>
          </div>
          <ErrorMessage message={error} compact />
        </div>
      ) : null}
      {answer ? <ProjectAnswer result={answer} /> : null}
    </form>
  )
}

type AnswerProps = {
  result: {
    answer: string
    sources: string[]
  }
}

function ProjectAnswer({ result }: AnswerProps) {
  return (
    <div className="rounded-2xl border border-[#c6b8ff]/15 bg-[#0e0a17]/90 p-5 text-[#ede6ff]">
      <p className="text-sm font-semibold text-[#f7f3ff]">Assistant answer</p>
      <p className="mt-3 whitespace-pre-line text-[#ddd3ff]">{result.answer}</p>
    </div>
  )
}

export default ProjectAskWidget
