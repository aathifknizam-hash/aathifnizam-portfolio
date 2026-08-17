import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

function Button(props: Props) {
  return (
    <button
      {...props}
      className={
        'inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 ' +
        (props.className ?? '')
      }
    />
  )
}

export default Button
