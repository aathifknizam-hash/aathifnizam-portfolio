import { Link } from 'react-router-dom'
import type { ChatMessage } from '../../types/chat'

type Props = {
  message: ChatMessage
}

function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={isUser ? 'self-end rounded-3xl bg-slate-700/90 px-4 py-3 text-slate-100' : 'self-start rounded-3xl bg-slate-800/95 px-4 py-3 text-slate-100'}>
      <p className="text-sm leading-6">{message.text}</p>

      {message.projectCards && message.projectCards.length > 0 ? (
        <div className="mt-3 space-y-2">
          {message.projectCards.map((project) => (
            <Link
              key={project.projectId}
              to={`/project/${project.projectId}`}
              className="block rounded-2xl border border-violet-500/20 bg-slate-900/80 p-3 text-left transition hover:border-violet-400/40 hover:bg-slate-900"
            >
              <p className="text-sm font-semibold text-violet-100">{project.projectName}</p>
              <p className="mt-1 text-xs text-slate-300">{project.shortDescription}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-violet-300">View project →</p>
            </Link>
          ))}
        </div>
      ) : null}

      {message.contact ? (
        <div className="mt-3 space-y-2 rounded-2xl border border-violet-500/20 bg-slate-900/80 p-3 text-xs text-slate-200">
          <a href={`mailto:${message.contact.email}`} className="block text-violet-200 underline underline-offset-2">{message.contact.email}</a>
          <a href={message.contact.linkedin} target="_blank" rel="noreferrer" className="block text-violet-200 underline underline-offset-2">LinkedIn</a>
          <a href={`tel:${message.contact.phone.replace(/\s+/g, '')}`} className="block text-violet-200 underline underline-offset-2">{message.contact.phone}</a>
        </div>
      ) : null}

    </div>
  )
}

export default ChatBubble
