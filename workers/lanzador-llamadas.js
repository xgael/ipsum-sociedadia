const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const supabaseHeaders = {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      };

      let alumnosParaLlamar = [];

      if (request.method === 'POST') {
         const body = await request.json().catch(() => ({}));
         if (body.id) {
            const resAlumno = await fetch(`${env.SUPABASE_URL}/rest/v1/alumnos?id=eq.${body.id}&select=*`, { headers: supabaseHeaders });
            alumnosParaLlamar = await resAlumno.json();
         }
      }

      if (alumnosParaLlamar.length === 0) {
         const resAlumnos = await fetch(`${env.SUPABASE_URL}/rest/v1/alumnos?estatus=eq.pendiente&select=*`, { headers: supabaseHeaders });
         alumnosParaLlamar = await resAlumnos.json();
      }

      if (!alumnosParaLlamar || alumnosParaLlamar.length === 0) {
        return new Response(JSON.stringify({ mensaje: 'No hay alumnos disponibles para llamar.' }), { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const promesasLlamadas = alumnosParaLlamar.map(async (alumno) => {
        try {