import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

function PageContainer({ children }: Props) {
  return <div className="mx-auto max-w-6xl px-6 md:px-8">{children}</div>
}

export default PageContainer
