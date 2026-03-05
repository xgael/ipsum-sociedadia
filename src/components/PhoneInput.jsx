import { useState, useRef, useEffect } from 'react'

const countries = [
  { code: '+52', flag: '\u{1F1F2}\u{1F1FD}', name: 'México' },
  { code: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'Estados Unidos' },
  { code: '+57', flag: '\u{1F1E8}\u{1F1F4}', name: 'Colombia' },
  { code: '+54', flag: '\u{1F1E6}\u{1F1F7}', name: 'Argentina' },
  { code: '+56', flag: '\u{1F1E8}\u{1F1F1}', name: 'Chile' },
  { code: '+51', flag: '\u{1F1F5}\u{1F1EA}', name: 'Perú' },
  { code: '+593', flag: '\u{1F1EA}\u{1F1E8}', name: 'Ecuador' },
  { code: '+58', flag: '\u{1F1FB}\u{1F1EA}', name: 'Venezuela' },
  { code: '+502', flag: '\u{1F1EC}\u{1F1F9}', name: 'Guatemala' },
  { code: '+503', flag: '\u{1F1F8}\u{1F1FB}', name: 'El Salvador' },
  { code: '+504', flag: '\u{1F1ED}\u{1F1F3}', name: 'Honduras' },
  { code: '+506', flag: '\u{1F1E8}\u{1F1F7}', name: 'Costa Rica' },
  { code: '+507', flag: '\u{1F1F5}\u{1F1E6}', name: 'Panamá' },
  { code: '+55', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brasil' },
  { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', name: 'España' },
]

export default function PhoneInput({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(countries[0])
  const [number, setNumber] = useState('')
  const dropdownRef = useRef(null)

  // Sync internal state → parent value
  useEffect(() => {
    const full = number ? `${selected.code}${number}` : ''
    onChange(full)
  }, [selected, number])

  // Parse initial value if provided
  useEffect(() => {
    if (value && !number) {
      const match = countries.find(c => value.startsWith(c.code))
      if (match) {
        setSelected(match)
        setNumber(value.slice(match.code.length))
      }
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/[^\d]/g, '')
    setNumber(val)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex bg-[var(--bg-muted)] border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 border-r border-[var(--border)] hover:bg-[var(--border)]/50 transition-colors shrink-0"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="font-body text-sm text-[var(--text-secondary)] font-medium">{selected.code}</span>
          <i className={`fas fa-chevron-down text-[9px] text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}></i>
        </button>
        <input
          type="tel"
          value={number}
          onChange={handleNumberChange}
          placeholder="9991234567"
          className="flex-1 bg-transparent px-3 py-2.5 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none min-w-0"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[var(--border)] shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-10 max-h-52 overflow-y-auto">
          {countries.map(country => (
            <button
              key={country.code}
              type="button"
              onClick={() => { setSelected(country); setOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-muted)] transition-colors text-left ${
                selected.code === country.code ? 'bg-[var(--bg-muted)]' : ''
              }`}
            >
              <span className="text-base leading-none">{country.flag}</span>
              <span className="font-body text-sm text-[var(--text-primary)] font-medium flex-1">{country.name}</span>
              <span className="font-body text-xs text-[var(--text-muted)]">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
