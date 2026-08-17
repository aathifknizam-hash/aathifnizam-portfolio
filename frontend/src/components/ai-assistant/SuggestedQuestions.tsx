type Props = {
  suggestions: string[]
  onSelect: (question: string) => void
}

function SuggestedQuestions({ suggestions, onSelect }: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
      <p className="text-sm font-semibold text-slate-100">Suggested questions</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-300 transition hover:border-brand hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SuggestedQuestions
