-- 1. Tabla de Registros de Acceso con tipo de evento (ENTRADA / SALIDA)
CREATE TABLE IF NOT EXISTS public.access_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT,
    tipo_evento TEXT DEFAULT 'ENTRADA', -- 'ENTRADA' o 'SALIDA'
    picture_url TEXT,
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Si la tabla ya existe, agregar la columna tipo_evento si no está presente
ALTER TABLE public.access_logs ADD COLUMN IF NOT EXISTS tipo_evento TEXT DEFAULT 'ENTRADA';

-- 2. Tabla de Padrón de Docentes
CREATE TABLE IF NOT EXISTS public.docentes (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    cargo TEXT DEFAULT 'Docente',
    telefono TEXT, -- Para WhatsApp
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.docentes ADD COLUMN IF NOT EXISTS telefono TEXT;

-- Habilitar RLS y lectura para ambas tablas
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.docentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública en access_logs" ON public.access_logs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Lectura pública en docentes" ON public.docentes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Gestión completa en docentes" ON public.docentes FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- Activar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.access_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.docentes;

-- Bucket de Fotos
INSERT INTO storage.buckets (id, name, public) VALUES ('access-captures', 'access-captures', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Permitir fotos" ON storage.objects FOR ALL TO anon, authenticated, service_role USING (bucket_id = 'access-captures') WITH CHECK (bucket_id = 'access-captures');
