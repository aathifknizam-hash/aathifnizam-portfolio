import { FormEvent, useState } from 'react'
import Button from '../shared/Button'

type Props = {
  onSubmit: (value: string) => void
  disabled?: boolean
}

function ChatInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(value)
    setValue('')
  }

  return (
    <form className="mt-4 flex gap-3" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        placeholder="Ask about this portfolio..."
        className="min-w-0 flex-1 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      <Button disabled={disabled || !value.trim()} type="submit">
        Send
      </Button>
    </form>
  )
}

export default ChatInput
