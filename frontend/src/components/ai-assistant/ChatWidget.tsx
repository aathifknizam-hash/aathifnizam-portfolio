import type { ChatMessage } from '../../types/chat'
import { useChat } from '../../hooks/useChat'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import SuggestedQuestions from './SuggestedQuestions'
import ThinkingIndicator from './ThinkingIndicator'
import ErrorMessage from '../shared/ErrorMessage'

type Props = {
  messages?: ChatMessage[]
  isLoading?: boolean
  error?: string | null
  sendMessage?: (question: string) => Promise<void>
  selectSuggestion?: (question: string) => void
  defaultSuggestions?: string[]
  hideSuggestions?: boolean
}

function ChatWidget({
  messages,
  isLoading,
  error,
  sendMessage,
  selectSuggestion,
  defaultSuggestions,
  hideSuggestions,
}: Props) {
  const chat = useChat()
  const currentMessages = messages ?? chat.messages
  const currentLoading = isLoading ?? chat.isLoading
  const currentError = error ?? chat.error
  const currentLoadingStatus = chat.loadingStatus
  const currentSendMessage = sendMessage ?? chat.sendMessage
  const currentSelectSuggestion = selectSuggestion ?? chat.selectSuggestion
  const currentSuggestions = defaultSuggestions ?? chat.defaultSuggestions

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-inner backdrop-blur-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Assistant</p>
        <p className="mt-2 text-slate-300">Ask questions about the portfolio, projects, or the RAG implementation.</p>
      </div>

      <div className="flex min-h-[260px] flex-1 flex-col gap-3 overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
        {currentMessages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center text-slate-500">
            <p>Ask something to get started.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-2">
            {currentMessages.map((message, index) => (
              <ChatBubble key={`${message.role}-${index}`} message={message} />
            ))}
          </div>
        )}
      </div>

      {currentError ? (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-100/90">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span>Offline</span>
          </div>
        </div>
      ) : null}
      {currentError ? <ErrorMessage message={currentError} compact /> : null}
      {currentLoading ? <ThinkingIndicator status={currentLoadingStatus} /> : null}
      <ChatInput onSubmit={currentSendMessage} disabled={currentLoading} />
      {!hideSuggestions ? <SuggestedQuestions suggestions={currentSuggestions} onSelect={currentSelectSuggestion} /> : null}
    </div>
  )
}

export default ChatWidget
