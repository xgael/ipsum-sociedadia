import { useState, useCallback } from 'react'
import { useAlumnos } from './hooks/useAlumnos'
import { lanzarMasivo, llamarIndividual, deleteAlumno } from './services/supabase'
import { useToast } from './components/Toast'
import Header from './components/Header'
import KpiCards from './components/KpiCards'
import ProspectsTable from './components/ProspectsTable'
import AddProspectModal from './components/AddProspectModal'
import ConfirmModal from './components/ConfirmModal'

function App() {
  const { alumnos, kpis, loading, error, refetch } = useAlumnos()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const toast = useToast()

  const showConfirm = useCallback((title, message, confirmLabel) => {
    return new Promise(resolve => {
      setConfirm({ title, message, confirmLabel, resolve })
    })
  }, [])

  const handleBulkCall = async () => {
    const ok = await showConfirm(
      'Activar Ipsum AI',
      '¿Estás seguro de activar Ipsum AI para TODOS los prospectos pendientes?',
      'Activar'
    )
    if (!ok) return
    try {
      const text = await lanzarMasivo()
      toast(text)
      setTimeout(refetch, 2000)
    } catch {
      toast('Error de conexión.', 'error')
    }
  }

  const handleDeleteProspect = async (id, nombre) => {
    const ok = await showConfirm(
      'Eliminar prospecto',
      `¿Eliminar a ${nombre} de la base de datos? Esta acción no se puede deshacer.`,
      'Eliminar'
    )
    if (!ok) return
    try {
      await deleteAlumno(id)
      toast(`${nombre} eliminado correctamente.`)
      refetch()
    } catch {
      toast('Error al eliminar el prospecto.', 'error')
    }
  }

  const handleCallIndividual = async (id, telefono, nombre) => {
    const ok = await showConfirm(
      'Iniciar llamada',
      `¿Iniciar Ipsum AI para contactar a ${nombre}?`,
      'Llamar'
    )
    if (!ok) return
    try {
      const data = await llamarIndividual(id)
      toast(data.mensaje || 'Ipsum AI ha iniciado la llamada.')
      setTimeout(refetch, 3000)
    } catch {
      toast('Error al contactar al servidor.', 'error')
    }
  }

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[var(--bg-surface)]">
        <div className="max-w-[1328px] mx-auto px-6 sm:px-14 pt-9 pb-11 flex flex-col gap-10">
          <Header />
          <KpiCards kpis={kpis} />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[var(--bg-surface)]">
        <div className="max-w-[1328px] mx-auto px-6 sm:px-14 pt-8 pb-12">
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mb-6">
            <button
              onClick={handleBulkCall}
              className="font-heading bg-[var(--accent)] text-white text-[13px] font-semibold px-5 py-2.5 flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <i className="fas fa-robot text-sm"></i>
              Activar Ipsum AI
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-heading border border-[#3a3a3d] text-[var(--text-primary)] text-[13px] font-medium px-5 py-2.5 flex items-center gap-1.5 hover:bg-[var(--bg-muted)] transition-colors"
            >
              <i className="fas fa-plus text-[var(--text-muted)] text-sm"></i>
              Agregar Prospecto
            </button>
          </div>

          <ProspectsTable
            alumnos={alumnos}
            loading={loading}
            error={error}
            onCallIndividual={handleCallIndividual}
            onDeleteProspect={handleDeleteProspect}
          />
        </div>
      </div>

      <AddProspectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={refetch}
      />

      <ConfirmModal
        isOpen={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        onConfirm={() => { confirm?.resolve(true); setConfirm(null) }}
        onCancel={() => { confirm?.resolve(false); setConfirm(null) }}
      />
    </>
  )
}

export default App
