import { useState, useEffect, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext()

export function useToast() {
  return useContext(ToastContext)
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onRemove, 300)
    }, toast.duration || 3500)
    return () => clearTimeout(timer)
  }, [toast.duration, onRemove])

  const isError = toast.type === 'error'

  return (
    <div
      className={`flex items-center gap-3 bg-white border border-[var(--border)] rounded-xl px-5 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-full ${
        isError ? 'bg-[#FEE2E2]' : 'bg-[#DCFCE7]'
      }`}>
        <i className={`fas ${isError ? 'fa-times' : 'fa-check'} text-xs ${
          isError ? 'text-[var(--accent)]' : 'text-[#16a34a]'
        }`}></i>
      </span>
      <span className="font-body text-sm text-[var(--text-primary)] font-medium max-w-sm">
        {toast.message}
      </span>
      <button
        onClick={() => { setVisible(false); setTimeout(onRemove, 300) }}
        className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors ml-2"
      >
        <i className="fas fa-times text-xs"></i>
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
