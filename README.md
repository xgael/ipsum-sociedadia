🦁 Sistema Lince UVM - Agente de Voz IA
Sistema completo de agente de voz con IA para calificación automática de prospectos universitarios de la Universidad del Valle de México (UVM).

🎯 Descripción
Lince es un agente conversacional de IA que:

📞 Realiza llamadas telefónicas automatizadas a prospectos
🤖 Mantiene conversaciones naturales en español
📊 Califica prospectos y calcula becas en tiempo real
💾 Almacena automáticamente toda la información capturada
🚨 Detecta casos especiales que requieren atención humana
📈 Proporciona dashboard en tiempo real con KPIs


🏗️ Arquitectura del Sistema
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │ (1) Agrega prospecto
       ▼
┌─────────────────────┐
│   Dashboard HTML    │ ← Cloudflare Pages
│  (index.html)       │
└──────┬──────────────┘
       │ (2) Click "Llamar"
       ▼
┌─────────────────────┐
│ Worker Lanzador     │ ← Cloudflare Worker
│ (lanzador.js)       │
└──────┬──────────────┘
       │ (3) Inicia llamada
       ▼
┌─────────────────────┐
│    Retell AI        │ ← API de voz
│  (Agente Lince)     │
└──────┬──────────────┘
       │ (4) Llama al prospecto
       │ (5) Conversación
       ▼
┌─────────────────────┐
│ Worker Webhook      │ ← Cloudflare Worker
│ (webhook.js)        │
└──────┬──────────────┘
       │ (6) Guarda resultados
       ▼
┌─────────────────────┐
│    Supabase         │ ← Base de datos
│  (PostgreSQL)       │
└─────────────────────┘
       │
       │ (7) Dashboard consulta
       ▼
┌─────────────────────┐
│   Dashboard HTML    │
└─────────────────────┘

🚀 Stack Tecnológico
ComponenteTecnologíaFrontendHTML5, TailwindCSS, Vanilla JSBackendCloudflare Workers (Serverless)Base de DatosSupabase (PostgreSQL)Agente de VozRetell AI (GPT-4.1)HostingCloudflare PagesTelefoníaRetell AI Phone System

📋 Funcionalidades
✅ Agente de Voz

 Conversación natural en español de México
 Tuteo juvenil para prospectos de 18-23 años
 Detección de interés académico
 Captura de modalidad (presencial/ejecutiva/online)
 Identificación de campus de interés
 Obtención de promedio escolar
 Cálculo automático de beca según promedio
 Captura de ciclo de inscripción
 Detección de casos de revalidación
 Cierre con envío de información por WhatsApp

📊 Dashboard

 KPIs en tiempo real
 Tabla de prospectos con filtros visuales
 Agregar prospectos manualmente
 Llamadas individuales
 Llamadas masivas en paralelo
 Modal de resumen completo por prospecto
 Alertas de revalidación con email prellenado
 Auto-refresh cada 30 segundos

🔧 Workers

 Lanzador: Ejecuta llamadas en paralelo
 Webhook: Procesa resultados automáticamente
 Normalización de campus (26 ubicaciones)
 Inferencia de tipo de programa
 Conversión de promedios (90 → 9.0)


🗄️ Estructura de Base de Datos
Tabla: alumnos
CampoTipoDescripcióniduuidIdentificador úniconombretextNombre completotelefonotextTeléfono con código país (+52)estatustextpendiente / en_curso / completadacarrera_interestextCarrera de interésmodalidad_interestextPresencial / Ejecutiva / Onlinecampus_interestextCampus normalizadotipo_programatextLicenciatura Tradicional/Ejecutiva/Online/Posgradociclo_interestextMayo/Julio/Agosto 2026promedionumericPromedio escolar (escala de 10)beca_estimadatextHasta 40% / Hasta 35% / Hasta 20%envio_whatsappbooleanAceptó recibir info por WhatsApprequiere_revalidacionbooleanPreguntó por revalidaciónresumen_llamadatextResumen generado por IAnombre_padretextNombre del padre/madre (si aplica)tipo_contactotextalumno / padre_madrecreated_attimestampFecha de creación

⚙️ Configuración e Instalación
1️⃣ Clonar el Repositorio
bashgit clone https://github.com/TU_USUARIO/lince-uvm-sistema-admisiones.git
cd lince-uvm-sistema-admisiones
2️⃣ Configurar Supabase

Crear proyecto en https://supabase.com
Ejecutar database/schema.sql en SQL Editor
Copiar URL y API Key del proyecto

3️⃣ Configurar Cloudflare Workers
Worker Webhook:
bashcd workers
# Editar webhook-retell.js y agregar tus credenciales
wrangler publish webhook-retell.js
Worker Lanzador:
bash# Editar lanzador-llamadas.js
wrangler publish lanzador-llamadas.js
Variables de Entorno en Cloudflare:
bashwrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put RETELL_API_KEY
wrangler secret put RETELL_FROM_NUMBER
wrangler secret put RETELL_AGENT_ID_ALUMNOS
4️⃣ Configurar Retell AI

Crear cuenta en https://retell.ai
Crear agente de voz
Copiar contenido de prompts/agente-lince-alumnos.md
Configurar webhook URL: https://agenteuvm.smartpasses.workers.dev
Configurar número de teléfono

5️⃣ Desplegar Dashboard

Conectar repositorio a Cloudflare Pages
Build settings:

Framework: None
Build command: (vacío)
Build output directory: /dashboard


Variables de entorno:

SUPABASE_URL
SUPABASE_ANON_KEY
WORKER_LANZADOR_URL




🎨 Personalización
Cambiar Email de Alertas
En dashboard/index.html, línea 8:
javascriptconst EMAIL_ASESOR = 'tu-email@ejemplo.com';
Modificar Tabla de Becas
En workers/webhook-retell.js:
javascriptif (promedioEscolar >= 9.0) becaCalculada = "Hasta 40%";
else if (promedioEscolar >= 8.0) becaCalculada = "Hasta 35%";
else if (promedioEscolar >= 7.0) becaCalculada = "Hasta 20%";
// Personaliza los rangos según tu institución
Agregar/Modificar Campus
En workers/webhook-retell.js:
javascriptconst CAMPUS_OFICIALES = [
  "Aguascalientes", "Chihuahua", "Coyoacán",
  // Agrega o modifica según tus ubicaciones
];

🧪 Testing
Pruebas Automatizadas
Abre docs/guia-testing.html en el navegador para:

✅ 24 casos de prueba documentados
✅ Banco de 50+ preguntas categorizadas
✅ Flujos de conversación completos
✅ Botón copiar para testing rápido

Prueba Manual Rápida

Dashboard → Agregar Prospecto
Nombre: "Test Demo"
Teléfono: tu número con +52
Click "Llamar"
Verificar conversación natural
Verificar que datos se guarden correctamente


📊 KPIs y Métricas
El dashboard muestra 4 KPIs principales:

Avance de Campaña: X / Total (completadas vs total)
Aceptaron WhatsApp: Cuántos aceptaron recibir información
Promedio General: Promedio de promedios escolares
Atención Humana: Casos que requieren revalidación


🔐 Seguridad
Credenciales
⚠️ NUNCA commitear credenciales al repositorio.
Usa .env.example como plantilla:
bashSUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=tu_key_aqui
RETELL_API_KEY=tu_key_aqui
RETELL_FROM_NUMBER=+525599628707
RETELL_AGENT_ID_ALUMNOS=agent_xxxx
Variables de Entorno
Todas las credenciales se configuran como secrets en:

Cloudflare Workers → Settings → Variables and Secrets
Cloudflare Pages → Settings → Environment Variables


🐛 Troubleshooting
Problema: Llamadas no se inician
Solución:

Verificar que RETELL_AGENT_ID_ALUMNOS esté correcto
Verificar que RETELL_FROM_NUMBER tenga formato +525599628707
Revisar logs en Cloudflare Workers

Problema: Datos no se guardan en Supabase
Solución:

Verificar webhook URL en Retell esté correcto
Verificar que Supabase API Key tenga permisos de escritura
Revisar logs del Worker webhook

Problema: Dashboard no carga
Solución:

Verificar CORS en Supabase
Verificar que SUPABASE_URL y SUPABASE_ANON_KEY estén correctos
Abrir consola del navegador y revisar errores


📈 Roadmap
Próximas Funcionalidades

 Agente separado para padres de familia
 Auto-refresh del dashboard sin recargar página
 Exportación a CSV de prospectos
 Métricas de conversión por campus/carrera
 Integración con CRM universitario
 Dashboard de analítica avanzada
 Notificaciones push para asesores


👥 Equipo
Desarrollado por: [Tu Nombre / Tu Empresa]
Cliente: Universidad del Valle de México (UVM)
Año: 2026

📄 Licencia
Este proyecto es privado y confidencial. Todos los derechos reservados.

📞 Soporte
Para soporte técnico o consultas:

📧 Email: pedrocarrillo@b-drive.com.mx
🌐 Web: [Tu sitio web]


🙏 Agradecimientos

Retell AI - Plataforma de agentes de voz
Supabase - Base de datos y backend
Cloudflare - Infraestructura serverless
OpenAI/Anthropic - Modelos de lenguaje


⚡ Sistema en producción desde Marzo 2026