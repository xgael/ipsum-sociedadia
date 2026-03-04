import { useRef, useEffect } from 'react'
import { animateNumber } from '../utils/animateNumber'

const dotColors = {
  red: 'bg-[var(--accent)]',
  green: 'bg-[var(--success)]',
  yellow: 'bg-[var(--warning)]',
  gray: 'bg-[var(--text-muted)]',
}

export default function KpiCard({ dotColor, label, value, displayText }) {
  const valueRef = useRef(null)

  useEffect(() => {
    if (!valueRef.current) return
    if (typeof value === 'number') {
      const cleanup = animateNumber(valueRef.current, value, displayText)
      return cleanup
    } else {
      valueRef.current.innerText = displayText || value
    }
  }, [value, displayText])

  return (
    <div className="flex flex-col gap-1.5">
      <p
        className="font-heading text-[var(--text-primary)] text-[40px] sm:text-[32px] lg:text-[40px] font-bold tracking-[-1px] leading-none"
        ref={valueRef}
      >
        0
      </p>
      <p className="font-body text-[var(--text-muted)] text-xs">{label}</p>
      <div className={`w-1.5 h-1.5 rounded-full ${dotColors[dotColor] || dotColors.gray}`} />
    </div>
  )
}
