import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function FadeIn({ children }: Props) {
  return <div className="fade-in">{children}</div>
}

export default FadeIn
