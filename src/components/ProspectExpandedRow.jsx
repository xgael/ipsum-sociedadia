import ProgramBadge from './ProgramBadge'
import { EMAIL_ASESOR } from '../services/supabase'

function alertarAsesor(nombre, telefono, carrera, campus) {
  const asunto = encodeURIComponent(`Revalidación requerida - ${nombre}`)
  const cuerpo = encodeURIComponent(
`Hola, se requiere atención humana para el siguiente prospecto:

Nombre: ${nombre}
Teléfono: ${telefono}
Carrera de interés: ${carrera}
Campus: ${campus}

Este prospecto preguntó por revalidación de materias durante su llamada con Lince.
El predictamen de materias queda listo en menos de 24 horas.

NOTA: En producción esta alerta se enviaría automáticamente vía WhatsApp al detectarse la revalidación.`
  )
  window.location.href = `mailto:${EMAIL_ASESOR}?subject=${asunto}&body=${cuerpo}`
}

function SectionLabel({ children }) {
  return (
    <p className="font-body text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[1px] mb-2">
      {children}
    </p>
  )
}

function ExpandedContent({ alumno }) {
  const al = alumno
  const resumenTexto = al.resumen_llamada || 'Sin resumen disponible.'

  return (
    <>
      {/* Programa / Ciclo */}
      <div>
        <SectionLabel>Programa / Ciclo</SectionLabel>
        <ProgramBadge tipoPrograma={al.tipo_programa} ciclo={al.ciclo_interes} />
      </div>

      {/* Perfil y Beca */}
      <div>
        <SectionLabel>Perfil y Beca</SectionLabel>
        {al.promedio ? (
          <>
            <div className="font-body text-[13px] font-semibold text-[var(--text-primary)]">Promedio: {al.promedio}</div>
            <div className="font-body text-xs font-semibold text-[var(--accent)] mt-1">{al.beca_estimada || 'Pendiente'}</div>
          </>
        ) : (
          <span className="font-body text-[var(--text-muted)] text-sm">Sin datos</span>
        )}
      </div>

      {/* Seguimiento */}
      <div>
        <SectionLabel>Seguimiento</SectionLabel>
        <div className="flex items-center gap-1.5">
          {al.envio_whatsapp ? (
            <>
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--success)]" />
              <span className="font-body text-xs font-semibold text-[#166534]">WhatsApp: Sí</span>
            </>
          ) : (
            <>
              <span className="w-[7px] h-[7px] rounded-full bg-[var(--text-muted)]" />
              <span className="font-body text-xs text-[var(--text-secondary)]">WhatsApp: No</span>
            </>
          )}
        </div>
        {al.requiere_revalidacion && (
          <>
            <div className="mt-2 font-body text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/5 px-2 py-0.5 inline-block border border-[var(--accent)]/20">
              <i className="fas fa-exclamation-circle mr-1"></i>Requiere Revalidación
            </div>
            <button
              onClick={() => alertarAsesor(al.nombre, al.telefono, al.carrera_interes || 'No especificada', al.campus_interes || 'No especificado')}
              className="mt-2 font-body text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 px-3 py-1.5 flex items-center gap-1 transition-all duration-200 w-fit"
            >
              <i className="fas fa-envelope text-xs"></i> Alertar Asesor
            </button>
          </>
        )}
      </div>

      {/* Resumen de IA */}
      <div>
        <SectionLabel>Resumen de IA</SectionLabel>
        <p className="font-body text-xs text-[var(--text-secondary)] leading-relaxed">{resumenTexto}</p>
      </div>
    </>
  )
}

export default function ProspectExpandedRow({ alumno, colSpan, mobile }) {
  if (mobile) {
    return (
      <div className="flex flex-col gap-4">
        <ExpandedContent alumno={alumno} />
      </div>
    )
  }

  return (
    <tr className="bg-[#FAFAFA]">
      <td colSpan={colSpan} className="px-6 py-5 pl-16">
        <div className="grid grid-cols-4 gap-6">
          <ExpandedContent alumno={alumno} />
        </div>
      </td>
    </tr>
  )
}
