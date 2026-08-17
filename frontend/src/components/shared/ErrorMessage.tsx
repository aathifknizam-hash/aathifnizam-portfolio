type Props = {
  message: string
  compact?: boolean
}

function ErrorMessage({ message, compact = false }: Props) {
  return (
    <div
      className={
        compact
          ? 'rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100'
          : 'rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200'
      }
    >
      {message}
    </div>
  )
}

export default ErrorMessage
