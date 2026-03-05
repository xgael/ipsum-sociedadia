import { useState, useEffect } from 'react'

export default function ConfirmModal({ isOpen, title, message, confirmLabel, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => setVisible(true))
    else setVisible(false)
  }, [isOpen])

  if (!isOpen) return null

  const handleCancel = () => {
    setVisible(false)
    setTimeout(onCancel, 200)
  }

  const handleConfirm = () => {
    setVisible(false)
    setTimeout(onConfirm, 200)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleCancel}
    >
      <div
        className={`bg-[var(--bg-surface)] border border-[var(--border)] p-6 w-full max-w-sm mx-4 transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--accent)]/10 shrink-0 mt-0.5">
            <i className="fas fa-robot text-sm text-[var(--accent)]"></i>
          </span>
          <div>
            <h3 className="font-heading text-[var(--text-primary)] font-semibold text-base mb-1">
              {title || 'Confirmar acción'}
            </h3>
            <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 font-body bg-[var(--bg-muted)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold py-2.5 transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 font-body bg-[var(--accent)] hover:opacity-90 text-white font-semibold py-2.5 transition-all text-sm flex items-center justify-center gap-2"
          >
            <i className="fas fa-check text-xs"></i>
            {confirmLabel || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
