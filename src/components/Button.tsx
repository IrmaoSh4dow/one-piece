import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

type Variant = 'primary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button ref={ref} className={`btn ${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
