import { useState } from 'react'
import { createAlumno } from '../services/supabase'
import { useToast } from './Toast'

export default function AddProspectModal({ isOpen, onClose, onSaved }) {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  if (!isOpen) return null

  const handleClose = () => {
    setNombre('')
    setTelefono('')
    setError('')
    onClose()
  }

  const handleSave = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      setError('Por favor completa nombre y teléfono.')
      return
    }
    if (!telefono.trim().startsWith('+')) {
      setError('El teléfono debe incluir el código de país. Ej: +529991234567')
      return
    }

    setSaving(true)
    try {
      await createAlumno(nombre.trim(), telefono.trim())
      handleClose()
      toast('Prospecto agregado correctamente. Usa el botón "Llamar" cuando quieras contactarlo.')
      onSaved()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-heading text-[var(--text-primary)] font-semibold text-lg">
            Nuevo Prospecto
          </h3>
          <button onClick={handleClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-body text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1px] mb-1 block">Nombre completo *</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Juan García"
              className="w-full bg-[var(--bg-muted)] border border-[var(--border)] focus:border-[var(--accent)] px-4 py-2.5 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="font-body text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1px] mb-1 block">Teléfono (con código de país) *</label>
            <input
              type="text"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="Ej. +529991234567"
              className="w-full bg-[var(--bg-muted)] border border-[var(--border)] focus:border-[var(--accent)] px-4 py-2.5 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors"
            />
            <p className="font-body text-[11px] text-[var(--text-muted)] mt-1">Incluye +52 para México</p>
          </div>
        </div>
        {error && (
          <div className="mt-3 font-body text-xs text-[var(--accent)] bg-[var(--accent)]/5 border border-[var(--accent)]/20 px-3 py-2">
            {error}
          </div>
        )}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 font-body bg-[var(--bg-muted)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-secondary)] font-semibold py-2.5 transition-all text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 font-body bg-[var(--accent)] hover:opacity-90 text-white font-semibold py-2.5 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <><i className="fas fa-spinner fa-spin"></i> Guardando...</>
            ) : (
              <><i className="fas fa-save"></i> Guardar</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
