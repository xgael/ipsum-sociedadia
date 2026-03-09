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

export async function registrarLeadN8N(prospecto, phone) {
  const res = await fetch('https://n8n.srv1266777.hstgr.cloud/webhook/ipsum-registro-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospecto, phone }),
  })
  if (!res.ok) throw new Error('Error al registrar lead en n8n')
  return res.json()
}

export async function llamarIndividual(id) {
  const res = await fetch(WORKER_LANZADOR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  return res.json()
}

export async function fetchAlumnoById(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/alumnos?id=eq.${id}&select=*`, { headers })
  if (!res.ok) throw new Error('Error al consultar alumno')
  const data = await res.json()
  return data[0] || null
}

export async function postLlamadaN8N(prospecto, phone, transcript) {
  const res = await fetch('https://n8n.srv1266777.hstgr.cloud/webhook/ipsum-post-llamada', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prospecto, phone, transcript }),
  })
  if (!res.ok) throw new Error('Error al enviar post-llamada a n8n')
  return res.json()
}
