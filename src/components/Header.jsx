export default function Header() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/img/ipsum-all.png" alt="Ipsum Technology" className="h-6 w-auto" />
          <span className="font-heading text-[var(--text-muted)] text-base">·</span>
          <span className="font-heading text-[var(--text-primary)] text-base font-semibold">Lince AI</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex flex-col gap-3">
          <span className="font-heading text-[var(--accent)] text-[11px] font-semibold tracking-[3px]">
            MONITOREO DE PROSPECTOS
          </span>
          <h1 className="font-heading text-[var(--text-primary)] text-3xl sm:text-[52px] font-bold tracking-[-2px] leading-none">
            Admisiones.
          </h1>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="font-heading text-[var(--text-primary)] text-[13px] font-medium">Ciclo 2026</span>
          <span className="font-body text-[var(--text-muted)] text-xs">Ipsum Technology</span>
        </div>
      </div>

      {/* Accent Line */}
      <div className="w-full h-0.5 bg-[var(--accent)]" />
    </div>
  )
}
