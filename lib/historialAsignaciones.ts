import { DocenteData } from "@/lib/docentesData";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

export interface AsignacionGrupo {
  id: string;
  grupo_nombre: string;
  tipo_horario: "Entre Semana" | "Fin de Semana" | "Ambos Horarios" | string;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string;    // YYYY-MM-DD
  fechas_especificas?: string[]; // ["2026-09-14", "2026-09-16", ...]
  docente_dni: string;
  docente_nombre: string;
  aula: string;
  curso: string;
  programa?: string;
  codigo_curso?: string;
  modalidad: "Presencial" | "Virtual (Teams)" | string;
  activo: boolean;
  created_at: string;
}

const HISTORIAL_STORAGE_PATH = "config/historial_asignaciones.json";
const BUCKET_NAME = "access-captures";
const CONFIG_KEY_HISTORIAL = "CONFIG_HISTORIAL_ASIGNACIONES";

function normalizeDNI(dni: string | number | null | undefined): string {
  if (!dni) return "";
  let s = String(dni).trim();
  s = s.replace(/^[oO]/, "0").replace(/[^0-9a-zA-Z]/g, "");
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, "0");
  }
  return s;
}

function matchDNI(dniA: string | number | null | undefined, dniB: string | number | null | undefined): boolean {
  const a = normalizeDNI(dniA);
  const b = normalizeDNI(dniB);
  if (!a || !b) return false;
  if (a === b) return true;
  const aClean = a.replace(/^0+/, "");
  const bClean = b.replace(/^0+/, "");
  return aClean.length > 0 && aClean === bClean;
}

const MESES_MAP: Record<string, string> = {
  ENERO: "01",
  FEBRERO: "02",
  MARZO: "03",
  ABRIL: "04",
  MAYO: "05",
  JUNIO: "06",
  JULIO: "07",
  AGOSTO: "08",
  SETIEMBRE: "09",
  SEPTIEMBRE: "09",
  OCTUBRE: "10",
  NOVIEMBRE: "11",
  DICIEMBRE: "12",
};

/**
 * Parsea cadenas de fechas en español comunes en UNHEVAL:
 * Ejemplo: "14, 16, 18, 21, 23, 25, 28, 30 DE SETIEMBRE, 02, 05, 07, 09 DE OCTUBRE DE 2026"
 */
export function parseSpanishFechas(fechasStr: string): {
  fechas: string[];
  fechaInicio: string;
  fechaFin: string;
} {
  if (!fechasStr || typeof fechasStr !== "string") {
    const today = new Date().toISOString().split("T")[0];
    return { fechas: [today], fechaInicio: today, fechaFin: today };
  }

  const clean = fechasStr.toUpperCase().trim();
  
  // Extraer año si existe (ej. 2026)
  const yearMatch = clean.match(/\b(202\d)\b/);
  const defaultYear = yearMatch ? yearMatch[1] : String(new Date().getFullYear());

  const resultDates: string[] = [];

  // Dividir por bloques de mes, ej: "14, 16, 18, 21, 23, 25, 28, 30 DE SETIEMBRE" y "02, 05, 07, 09 DE OCTUBRE DE 2026"
  const monthBlockRegex = /([\d\s,]+)\s*(?:DE\s+)?(ENERO|FEBRERO|MARZO|ABRIL|MAYO|JUNIO|JULIO|AGOSTO|SETIEMBRE|SEPTIEMBRE|OCTUBRE|NOVIEMBRE|DICIEMBRE)(?:\s*(?:DE\s+)?(\d{4}))?/gi;
  
  let match: RegExpExecArray | null;
  while ((match = monthBlockRegex.exec(clean)) !== null) {
    const daysPart = match[1];
    const monthName = match[2].toUpperCase();
    const blockYear = match[3] || defaultYear;
    const monthNum = MESES_MAP[monthName];

    if (monthNum) {
      const days = daysPart
        .split(/[\s,]+/)
        .map((d) => d.trim())
        .filter((d) => /^\d{1,2}$/.test(d));

      for (const d of days) {
        const dayPadded = d.padStart(2, "0");
        const iso = `${blockYear}-${monthNum}-${dayPadded}`;
        if (!resultDates.includes(iso)) {
          resultDates.push(iso);
        }
      }
    }
  }

  // Ordenar fechas cronológicamente
  resultDates.sort();

  if (resultDates.length === 0) {
    // Si no se pudo parsear con el formato especial, intentar buscar fechas ISO YYYY-MM-DD
    const isoMatches = clean.match(/\b\d{4}-\d{2}-\d{2}\b/g);
    if (isoMatches && isoMatches.length > 0) {
      isoMatches.sort();
      return {
        fechas: isoMatches,
        fechaInicio: isoMatches[0],
        fechaFin: isoMatches[isoMatches.length - 1],
      };
    }
    const today = new Date().toISOString().split("T")[0];
    return { fechas: [today], fechaInicio: today, fechaFin: today };
  }

  return {
    fechas: resultDates,
    fechaInicio: resultDates[0],
    fechaFin: resultDates[resultDates.length - 1],
  };
}

/**
 * Obtiene el historial completo de asignaciones desde Supabase
 */
export async function obtenerHistorialAsignaciones(): Promise<AsignacionGrupo[]> {
  const supabase = getSupabaseAdmin();
  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(HISTORIAL_STORAGE_PATH);

    if (fileBlob && !downloadError) {
      const text = await fileBlob.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (storageErr) {
    console.warn("Storage fallback for historial asignaciones:", storageErr);
  }

  // Fallback desde access_logs
  try {
    const { data: record } = await supabase
      .from("access_logs")
      .select("picture_url")
      .eq("employee_id", CONFIG_KEY_HISTORIAL)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (record && record.picture_url) {
      const parsed = JSON.parse(record.picture_url);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {}

  return [];
}

/**
 * Guarda el historial completo de asignaciones en Supabase
 */
export async function guardarHistorialAsignaciones(historial: AsignacionGrupo[]): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const jsonString = JSON.stringify(historial, null, 2);
  const payloadBuffer = Buffer.from(jsonString, "utf8");

  try {
    // 1. Guardar en Storage
    await supabase.storage.from(BUCKET_NAME).upload(HISTORIAL_STORAGE_PATH, payloadBuffer, {
      contentType: "application/json",
      upsert: true,
    });

    // 2. Guardar en access_logs como respaldo
    await supabase.from("access_logs").delete().eq("employee_id", CONFIG_KEY_HISTORIAL);
    await supabase.from("access_logs").insert({
      employee_id: CONFIG_KEY_HISTORIAL,
      employee_name: "CONFIG_HISTORIAL_BACKUP",
      picture_url: jsonString,
      timestamp: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error("Error guardando historial de asignaciones:", err);
    return false;
  }
}

/**
 * Resuelve el aula y curso exactos de un docente para una fecha histórica determinada.
 * Si la fecha cae dentro de un grupo histórico, retorna esa aula y curso.
 * En caso contrario, retorna los datos activos por defecto.
 */
export function obtenerAsignacionParaFecha(
  docenteDni: string,
  fechaStr: string, // YYYY-MM-DD
  historial: AsignacionGrupo[],
  docenteDefault?: DocenteData
): {
  aula: string;
  curso: string;
  modalidad: string;
  tipo_horario: string;
  grupo_nombre?: string;
} {
  const normDni = normalizeDNI(docenteDni);

  // 1. Buscar coincidencia exacta por fechas específicas
  const matchEspecifico = historial.find((h) => {
    if (!matchDNI(h.docente_dni, normDni)) return false;
    if (h.fechas_especificas && h.fechas_especificas.includes(fechaStr)) return true;
    return false;
  });

  if (matchEspecifico) {
    return {
      aula: matchEspecifico.aula,
      curso: matchEspecifico.curso,
      modalidad: matchEspecifico.modalidad,
      tipo_horario: matchEspecifico.tipo_horario,
      grupo_nombre: matchEspecifico.grupo_nombre,
    };
  }

  // 2. Buscar por rango de fechas (fecha_inicio <= fechaStr <= fecha_fin)
  const matchRango = historial.find((h) => {
    if (!matchDNI(h.docente_dni, normDni)) return false;
    if (h.fecha_inicio && h.fecha_fin) {
      return fechaStr >= h.fecha_inicio && fechaStr <= h.fecha_fin;
    }
    return false;
  });

  if (matchRango) {
    return {
      aula: matchRango.aula,
      curso: matchRango.curso,
      modalidad: matchRango.modalidad,
      tipo_horario: matchRango.tipo_horario,
      grupo_nombre: matchRango.grupo_nombre,
    };
  }

  // 3. Fallback a datos del docente actual
  return {
    aula: docenteDefault?.aula || "Posgrado UNHEVAL",
    curso: docenteDefault?.curso || "Docencia Posgrado",
    modalidad: docenteDefault?.modalidad || "Presencial",
    tipo_horario: docenteDefault?.tipo_horario || "Entre Semana",
    grupo_nombre: "Grupo Regular",
  };
}
