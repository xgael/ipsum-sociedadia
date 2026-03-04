import KpiCard from './KpiCard'

function Separator() {
  return <div className="hidden sm:block w-px h-[70px] bg-[var(--border)] shrink-0" />
}

export default function KpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:flex sm:items-start sm:gap-0 w-full">
      <div className="sm:flex-1">
        <KpiCard
          dotColor="red"
          label="Llamadas completadas"
          value={kpis.completadas}
          displayText={`${kpis.completadas}/${kpis.total}`}
        />
      </div>
      <Separator />
      <div className="sm:flex-1 sm:pl-8">
        <KpiCard
          dotColor="green"
          label="Aceptaron seguimiento"
          value={kpis.whatsapp}
        />
      </div>
      <Separator />
      <div className="sm:flex-1 sm:pl-8">
        <KpiCard
          dotColor="yellow"
          label="Promedio general"
          value={kpis.promGral}
          displayText={kpis.promGral}
        />
      </div>
      <Separator />
      <div className="sm:flex-1 sm:pl-8">
        <KpiCard
          dotColor="gray"
          label="Requieren humano"
          value={kpis.urgentes}
        />
      </div>
    </div>
  )
}
