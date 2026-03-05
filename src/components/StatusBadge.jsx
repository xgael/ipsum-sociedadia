const statusConfig = {
  completada: {
    outerBg: 'bg-[#EAEEEA]',
    dot: 'bg-[#4ade80]',
    arrow: 'text-[#22c55e]',
    label: 'Completada',
  },
  en_curso: {
    outerBg: 'bg-[#EEEEE8]',
    dot: 'bg-[#facc15]',
    arrow: 'text-[#eab308]',
    label: 'En curso',
  },
  pendiente: {
    outerBg: 'bg-[#EBEBEB]',
    dot: 'bg-[#d4d4d4]',
    arrow: 'text-[#a3a3a3]',
    label: 'Pendiente',
  },
}

export default function StatusBadge({ estatus }) {
  const config = statusConfig[estatus] || statusConfig.pendiente
  return (
    <span className={`inline-flex items-center rounded-full py-1 px-[5px] ${config.outerBg}`}>
      <span className="inline-flex items-center gap-1.5 bg-white rounded-full py-[7px] px-4">
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="font-body text-xs font-semibold text-[#1a1a1a]">{config.label}</span>
      </span>
    </span>
  )
}
