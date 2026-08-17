import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function Reveal({ children }: Props) {
  return <div className="fade-in">{children}</div>
}

export default Reveal
