-- Tabla principal de alumnos/prospectos
CREATE TABLE IF NOT EXISTS alumnos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL UNIQUE,
    estatus TEXT DEFAULT 'pendiente' CHECK (estatus IN ('pendiente', 'en_curso', 'completada')),
    
    -- Información académica capturada
    carrera_interes TEXT,
    modalidad_interes TEXT,
    campus_interes TEXT,
    tipo_programa TEXT,
    ciclo_interes TEXT,
    
    -- Calificación y beca
    promedio NUMERIC(3,1),
    beca_estimada TEXT,
    
    -- Seguimiento
    envio_whatsapp BOOLEAN DEFAULT FALSE,
    requiere_revalidacion BOOLEAN DEFAULT FALSE,
    resumen_llamada TEXT,
    
    -- Para agente de padres (opcional)
    nombre_padre TEXT,
    tipo_contacto TEXT DEFAULT 'alumno' CHECK (tipo_contacto IN ('alumno', 'padre_madre')),
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_alumnos_estatus ON alumnos(estatus);
CREATE INDEX IF NOT EXISTS idx_alumnos_telefono ON alumnos(telefono);
CREATE INDEX IF NOT EXISTS idx_alumnos_created_at ON alumnos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alumnos_requiere_revalidacion ON alumnos(requiere_revalidacion) WHERE requiere_revalidacion = TRUE;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alumnos_updated_at
    BEFORE UPDATE ON alumnos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (opcional, recomendado)
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir todo para service_role (usado por workers)
CREATE POLICY "Enable all for service role"
    ON alumnos
    FOR ALL
    USING (true);

-- Comentarios de documentación
COMMENT ON TABLE alumnos IS 'Tabla principal de prospectos universitarios del sistema Lince UVM';
COMMENT ON COLUMN alumnos.estatus IS 'Estado del prospecto: pendiente (sin llamar), en_curso (llamando), completada (llamada finalizada)';
COMMENT ON COLUMN alumnos.tipo_programa IS 'Licenciatura Tradicional, Licenciatura Ejecutiva, Licenciatura Online, o Posgrado';
COMMENT ON COLUMN alumnos.promedio IS 'Promedio escolar en escala de 10 (ej: 9.0, 8.5)';
COMMENT ON COLUMN alumnos.beca_estimada IS 'Beca calculada según promedio: "Hasta 40%", "Hasta 35%", "Hasta 20%", o "Financiamiento disponible"';
COMMENT ON COLUMN alumnos.tipo_contacto IS 'Indica si se habló con el alumno o con padre/madre';