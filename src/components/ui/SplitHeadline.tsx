import { useMemo } from 'react'
import type { CSSProperties } from 'react'

interface SplitHeadlineProps {
  children: string
  className?: string
  charClassName?: string
  style?: CSSProperties
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
}

export function SplitHeadline({
  children,
  className = '',
  charClassName = '',
  style,
  as: Tag = 'h2',
}: SplitHeadlineProps) {
  const chars = useMemo(() => {
    return children.split('').map((char, i) => ({
      char: char === ' ' ? '\u00A0' : char,
      key: `${char}-${i}`,
    }))
  }, [children])

  return (
    <Tag className={className} style={style}>
      {chars.map(({ char, key }) => (
        <span
          key={key}
          className={`split-char inline-block ${charClassName}`}
          style={{ willChange: 'transform, opacity' }}
        >
          {char}
        </span>
      ))}
    </Tag>
  )
}
