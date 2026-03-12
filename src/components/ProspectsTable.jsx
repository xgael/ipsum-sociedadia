import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import StatusBadge from './StatusBadge'
import ProspectExpandedRow from './ProspectExpandedRow'

export default function ProspectsTable({ alumnos, loading, error, onCallIndividual, onDeleteProspect }) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [expanded, setExpanded] = useState({})
  const [columnFilters, setColumnFilters] = useState([])

  const statusOptions = useMemo(() => {
    const unique = [...new Set(alumnos.map(a => a.estatus).filter(Boolean))]
    return unique.sort()
  }, [alumnos])

  const statusFilter = columnFilters.find(f => f.id === 'estatus')?.value || ''

  const setStatusFilter = (value) => {
    setColumnFilters(prev => {
      const rest = prev.filter(f => f.id !== 'estatus')
      return value ? [...rest, { id: 'estatus', value }] : rest
    })
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
  }

  const columns = useMemo(() => [
    {
      id: 'expander',
      header: '',
      size: 40,
      cell: ({ row }) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            row.getToggleExpandedHandler()()
          }}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
        >
          <i className={`fas fa-chevron-${row.getIsExpanded() ? 'down' : 'right'} text-xs`}></i>
        </button>
      ),
    },
    {
      accessorKey: 'nombre',
      header: 'Prospecto',
      cell: ({ row }) => (
        <div>
          <div className="font-body font-bold text-[var(--text-primary)]">{row.original.nombre}</div>
          <div className="font-body text-xs text-[var(--text-secondary)]">{row.original.telefono}</div>
        </div>
      ),
    },
    {
      accessorKey: 'estatus',
      header: 'Estatus',
      cell: ({ getValue }) => <StatusBadge estatus={getValue()} />,
      filterFn: 'equals',
    },
    {
      id: 'interes',
      header: 'Interés / Campus',
      accessorFn: row => `${row.carrera_interes || ''} ${row.campus_interes || ''}`,
      cell: ({ row }) => (
        <div>
          <div className="font-body text-[13px] font-semibold text-[var(--text-primary)]">
            {row.original.carrera_interes || <span className="text-[var(--text-muted)] font-normal italic">Indefinida</span>}
          </div>
          <div className="font-body text-[11px] text-[var(--text-secondary)] mt-0.5">
            {row.original.modalidad_interes || '—'} · {row.original.campus_interes || '—'}
          </div>
        </div>
      ),
    },
    {
      id: 'accion',
      header: () => <span className="block text-right">Acción</span>,
      cell: ({ row }) => (
        <div className="text-right flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCallIndividual(row.original.id, row.original.telefono, row.original.nombre)
            }}
            className="font-body text-[var(--text-primary)] border border-[var(--text-primary)] font-semibold px-4 py-2 transition-all duration-200 inline-flex items-center gap-2 text-[13px] hover:bg-[var(--text-primary)] hover:text-[var(--bg-surface)]"
          >
            <i className="fas fa-phone text-xs"></i> Llamar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDeleteProspect(row.original.id, row.original.nombre)
            }}
            title="Eliminar prospecto"
            className="border border-[var(--border)] text-[var(--text-muted)] p-2 transition-all duration-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
          >
            <i className="fas fa-trash text-xs"></i>
          </button>
        </div>
      ),
    },
  ], [onCallIndividual, onDeleteProspect])

  const table = useReactTable({
    data: alumnos,
    columns,
    state: { globalFilter, sorting, pagination, expanded, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: (updater) => {
      setExpanded((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        // Find which row was just toggled on
        const newKey = Object.keys(next).find((k) => next[k] && !prev[k])
        // If a new row was opened, only keep that one
        return newKey ? { [newKey]: true } : next
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowCanExpand: () => true,
  })

  const totalColumns = columns.length

  const exportCSV = () => {
    const rows = table.getFilteredRowModel().rows
    const headers = ['Nombre', 'Teléfono', 'Estatus', 'Carrera', 'Modalidad', 'Campus']
    const csvRows = rows.map(row => {
      const a = row.original
      return [a.nombre, a.telefono, a.estatus, a.carrera_interes || '', a.modalidad_interes || '', a.campus_interes || '']
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    })
    const csv = '\uFEFF' + [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `prospectos_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border border-[var(--border)] overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="font-heading text-lg font-semibold text-[var(--text-primary)]">Base de Datos de Prospectos</h2>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 bg-[var(--bg-muted)] border border-[var(--border)] px-3.5 py-2 rounded">
              <i className="fas fa-search text-[var(--text-muted)] text-xs"></i>
              <input
                type="text"
                value={globalFilter ?? ''}
                onChange={e => { setGlobalFilter(e.target.value); setPagination(prev => ({ ...prev, pageIndex: 0 })) }}
                placeholder="Buscar prospecto..."
                className="bg-transparent font-body text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none w-40"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="font-body text-[13px] bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 rounded outline-none cursor-pointer"
            >
              <option value="">Todos los estatus</option>
              {statusOptions.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={exportCSV}
              className="font-body text-[13px] font-medium border border-[var(--border)] text-[var(--text-primary)] px-3.5 py-2 rounded inline-flex items-center gap-1.5 hover:bg-[var(--bg-muted)] transition-colors"
            >
              <i className="fas fa-file-csv text-xs"></i> Exportar
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-body text-[13px] text-[var(--text-secondary)]">Mostrar</span>
            <select
              value={pagination.pageSize}
              onChange={e => setPagination({ pageIndex: 0, pageSize: Number(e.target.value) })}
              className="font-body text-[13px] bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-2 py-1 rounded outline-none cursor-pointer"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="font-body text-[13px] text-[var(--text-secondary)]">entradas</span>
          </div>
          <span className="font-body text-[13px] text-[var(--text-secondary)] font-medium whitespace-nowrap">
            {loading && <i className="fas fa-sync-alt animate-spin mr-2"></i>}
            {table.getFilteredRowModel().rows.length} prospectos
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[var(--border)]" />

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-[#FAFAFA]">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left font-body text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[1px] ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-[var(--text-secondary)] transition-colors' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                    style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' && <i className="fas fa-sort-up text-[var(--accent)]"></i>}
                      {header.column.getIsSorted() === 'desc' && <i className="fas fa-sort-down text-[var(--accent)]"></i>}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {error ? (
              <tr>
                <td colSpan={totalColumns} className="px-6 py-8 text-center font-body text-[var(--accent)] font-medium">
                  Error al conectar con los servidores.
                </td>
              </tr>
            ) : loading && alumnos.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="px-6 py-10 text-center text-[var(--text-muted)]">
                  <i className="fas fa-spinner fa-spin fa-2x mb-3 text-[var(--accent)]"></i>
                  <p className="font-body font-medium">Cargando base de datos...</p>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="px-6 py-8 text-center font-body text-[var(--text-muted)] font-medium">
                  {globalFilter ? 'No se encontraron resultados.' : 'No hay prospectos en la base de datos.'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <>
                  <tr
                    key={row.id}
                    className={`hover:bg-[#FAFAFA] transition-colors duration-150 cursor-pointer ${
                      row.getIsExpanded() ? 'bg-[#FAFAFA]' : ''
                    }`}
                    onClick={row.getToggleExpandedHandler()}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-3.5 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && (
                    <ProspectExpandedRow
                      key={`${row.id}-expanded`}
                      alumno={row.original}
                      colSpan={totalColumns}
                    />
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        {error ? (
          <div className="px-5 py-8 text-center font-body text-[var(--accent)] font-medium">
            Error al conectar con los servidores.
          </div>
        ) : loading && alumnos.length === 0 ? (
          <div className="px-5 py-10 text-center text-[var(--text-muted)]">
            <i className="fas fa-spinner fa-spin fa-2x mb-3 text-[var(--accent)]"></i>
            <p className="font-body font-medium">Cargando...</p>
          </div>
        ) : table.getRowModel().rows.length === 0 ? (
          <div className="px-5 py-8 text-center font-body text-[var(--text-muted)]">
            {globalFilter ? 'No se encontraron resultados.' : 'No hay prospectos.'}
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {table.getRowModel().rows.map(row => (
              <div key={row.id} className="border border-[var(--border)] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm font-bold text-[var(--text-primary)]">{row.original.nombre}</span>
                  <StatusBadge estatus={row.original.estatus} />
                </div>
                <span className="font-body text-xs text-[var(--text-secondary)]">{row.original.telefono}</span>
                <div>
                  <div className="font-body text-[13px] font-semibold text-[var(--text-primary)]">
                    {row.original.carrera_interes || <span className="text-[var(--text-muted)] font-normal italic">Indefinida</span>}
                  </div>
                  <div className="font-body text-[11px] text-[var(--text-secondary)]">
                    {row.original.modalidad_interes || '—'} · {row.original.campus_interes || '—'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onCallIndividual(row.original.id, row.original.telefono, row.original.nombre)}
                    className="flex-1 font-body text-[var(--text-primary)] border border-[var(--text-primary)] font-semibold py-2.5 transition-all text-[13px] flex items-center justify-center gap-2 hover:bg-[var(--text-primary)] hover:text-[var(--bg-surface)]"
                  >
                    <i className="fas fa-phone text-xs"></i> Llamar
                  </button>
                  <button
                    onClick={() => onDeleteProspect(row.original.id, row.original.nombre)}
                    title="Eliminar prospecto"
                    className="border border-[var(--border)] text-[var(--text-muted)] px-3.5 transition-all duration-200 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <i className="fas fa-trash text-xs"></i>
                  </button>
                </div>
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="font-body text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex items-center gap-1"
                >
                  <i className={`fas fa-chevron-${row.getIsExpanded() ? 'up' : 'down'} text-[10px]`}></i>
                  {row.getIsExpanded() ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
                {row.getIsExpanded() && (
                  <>
                    <div className="w-full h-px bg-[var(--border)]" />
                    <ProspectExpandedRow alumno={row.original} mobile />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {table.getFilteredRowModel().rows.length > 0 && (
        <>
          <div className="w-full h-px bg-[var(--border)]" />
          <div className="px-6 py-4 flex items-center justify-between">
            <span className="font-body text-[13px] text-[var(--text-secondary)]">
              Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              de {table.getFilteredRowModel().rows.length} prospectos
            </span>
            {table.getPageCount() > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="font-body text-[13px] font-medium px-3 py-1.5 border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left text-xs"></i>
                </button>
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`font-body text-[13px] font-medium w-8 h-8 flex items-center justify-center border transition-colors ${
                      table.getState().pagination.pageIndex === i
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="font-body text-[13px] font-medium px-3 py-1.5 border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right text-xs"></i>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
