// Lista oficial de 26 campus UVM
const CAMPUS_OFICIALES = [
  "Aguascalientes", "Chihuahua", "Coyoacán", "Cuernavaca", "Guadalajara Sur",
  "Hermosillo", "Hispano", "Lomas Verdes", "Mérida", "Monterrey",
  "Puebla", "Querétaro", "Reforma", "Saltillo", "San Luis Potosí",
  "San Rafael", "Tampico", "Texcoco", "Tlalpan", "Toluca",
  "Veracruz", "Villahermosa", "Zapopan", "Tlaxcala", "Mexicali", "Tuxtla Gutiérrez"
];

function normalizarTexto(texto) {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function buscarCampus(campusRaw) {
  if (!campusRaw) return null;
  const normalizado = normalizarTexto(campusRaw);
  const encontrado = CAMPUS_OFICIALES.find(campus => 
    normalizarTexto(campus).includes(normalizado) || 
    normalizado.includes(normalizarTexto(campus))
  );
  return encontrado || campusRaw;
}

function inferirTipoPrograma(modalidad, analisis) {
  const modalidadLower = (modalidad || '').toLowerCase();
  const esMaestria = (analisis.nivel_interes || '').toLowerCase().includes('maestr') ||
                      (analisis.nivel_interes || '').toLowerCase().includes('posgrado');
  
  if (esMaestria) return 'Posgrado';
  if (modalidadLower.includes('ejecutiva')) return 'Licenciatura Ejecutiva';
  if (modalidadLower.includes('línea') || modalidadLower.includes('online')) return 'Licenciatura Online';
  return 'Licenciatura Tradicional';
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Solo POST', { status: 405 });

    try {
      const rawBody = await request.text();
      const payload = JSON.parse(rawBody);

      if (payload.event === 'call_analyzed') {
        const call = payload.call;
        const telefono = call.to_number;
        
        const resumen = call.call_analysis?.call_summary || null;
        const analisis = call.call_analysis?.custom_analysis_data || {};
        
        const carreraInteres = analisis.carrera_interes || null;
        const quiereWhatsapp = analisis.envio_whatsapp === true || analisis.envio_whatsapp === 'true';
        const modalidad = analisis.modalidad_interes || null;
        const campusRaw = analisis.campus_interes || null;
        const revalidacion = analisis.requiere_revalidacion === true || analisis.requiere_revalidacion === 'true';
        const cicloInteres = analisis.ciclo_interes || null;
        const nombrePadre = analisis.nombre_padre || null;
        
        const campusNormalizado = buscarCampus(campusRaw);
        const tipoProgramaInferido = analisis.tipo_programa || inferirTipoPrograma(modalidad, analisis);
        
        let promedioEscolar = null;
        let becaCalculada = null;

        if (analisis.promedio) {
            let rawPromedio = parseFloat(analisis.promedio);
            if (!isNaN(rawPromedio)) {
                promedioEscolar = rawPromedio > 10 ? rawPromedio / 10 : rawPromedio;

                if (promedioEscolar >= 9.0) becaCalculada = "Hasta 40%";
                else if (promedioEscolar >= 8.0) becaCalculada = "Hasta 35%";
                else if (promedioEscolar >= 7.0) becaCalculada = "Hasta 20%";
                else becaCalculada = "Financiamiento disponible";
            }
        }

        console.log(`Guardando -> Tel: ${telefono} | Prom: ${promedioEscolar} | Beca: ${becaCalculada} | Programa: ${tipoProgramaInferido} | Ciclo: ${cicloInteres} | Padre: ${nombrePadre || 'N/A'}`);

        await fetch(`${env.SUPABASE_URL}/rest/v1/alumnos?telefono=eq.${encodeURIComponent(telefono)}`, {
          method: 'PATCH',
          headers: {
            'apikey': env.SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            estatus: 'completada',
            carrera_interes: carreraInteres,
            envio_whatsapp: quiereWhatsapp,
            modalidad_interes: modalidad,
            campus_interes: campusNormalizado,
            promedio: promedioEscolar,
            requiere_revalidacion: revalidacion,
            beca_estimada: becaCalculada,
            resumen_llamada: resumen,
            tipo_programa: tipoProgramaInferido,
            ciclo_interes: cicloInteres,
            nombre_padre: nombrePadre
          })
        });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.log("ERROR:", error.message);
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
};