import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchAlumnos } from '../services/supabase'

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAlumnos()
      setAlumnos(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargar()
    const interval = setInterval(cargar, 30000)
    return () => clearInterval(interval)
  }, [cargar])

  const kpis = useMemo(() => {
    const total = alumnos.length
    const completadas = alumnos.filter(a => a.estatus === 'completada').length
    const whatsapp = alumnos.filter(a => a.envio_whatsapp === true).length
    const urgentes = alumnos.filter(a => a.requiere_revalidacion === true).length
    const promedios = alumnos
      .filter(a => a.promedio != null && a.promedio > 0)
      .map(a => parseFloat(a.promedio))
    const promGral = promedios.length > 0
      ? (promedios.reduce((a, b) => a + b, 0) / promedios.length).toFixed(1)
      : '-'
    return { total, completadas, whatsapp, promGral, urgentes }
  }, [alumnos])

  return { alumnos, kpis, loading, error, refetch: cargar }
}
