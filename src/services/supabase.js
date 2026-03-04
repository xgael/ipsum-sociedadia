const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const WORKER_LANZADOR_URL = import.meta.env.VITE_WORKER_LANZADOR_URL
export const EMAIL_ASESOR = import.meta.env.VITE_EMAIL_ASESOR

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

export async function fetchAlumnos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos?select=*&order=id.desc`, { headers })
  if (!res.ok) throw new Error('Error al conectar con Supabase')
  return res.json()
}

export async function createAlumno(nombre, telefono) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify({ nombre, telefono, estatus: 'pendiente' }),
  })
  if (!res.ok) throw new Error('Error al guardar en la base de datos.')
  return res.json()
}

export async function lanzarMasivo() {
  const res = await fetch(WORKER_LANZADOR_URL)
  return res.text()
}

export async function llamarIndividual(id) {
  const res = await fetch(WORKER_LANZADOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  return res.json()
}
