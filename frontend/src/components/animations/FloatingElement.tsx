import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function FloatingElement({ children }: Props) {
  return <div className="animate-float">{children}</div>
}

export default FloatingElement
