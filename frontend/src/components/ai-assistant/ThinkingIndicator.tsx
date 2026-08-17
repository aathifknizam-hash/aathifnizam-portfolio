type Props = {
  status?: string
}

function ThinkingIndicator({ status = 'Thinking... please wait.' }: Props) {
  return <p className="text-sm text-slate-400">{status}</p>
}

export default ThinkingIndicator
