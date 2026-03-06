export default function ProgramBadge({ tipoPrograma, ciclo }) {
  if (!tipoPrograma) return <span className="font-body text-[var(--text-muted)] text-sm">-</span>

  return (
    <span className="inline-flex items-center rounded-2xl py-1 px-[5px] bg-[#E3F2FA]">
      <span className="inline-flex items-center gap-1.5 bg-white rounded-xl py-[7px] px-3.5">
        <span className="w-1.5 h-1.5 rounded-sm bg-[#29ABE2]" />
        <span className="font-body text-xs font-semibold text-[#1a1a1a]">{tipoPrograma}</span>
        {ciclo && (
          <>
            <span className="font-body text-xs text-[#a3a3a3]">&middot;</span>
            <span className="font-body text-xs font-medium text-[#6b7280]">{ciclo}</span>
          </>
        )}
      </span>
    </span>
  )
}
