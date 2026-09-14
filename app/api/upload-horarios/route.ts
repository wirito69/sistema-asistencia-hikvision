import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";
import {
  AsignacionGrupo,
  parseSpanishFechas,
  obtenerHistorialAsignaciones,
  guardarHistorialAsignaciones,
} from "@/lib/historialAsignaciones";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParsePkg = require("pdf-parse");

export const dynamic = "force-dynamic";

const supabase = getSupabaseAdmin();
const CONFIG_STORAGE_PATH = "config/docentes.json";
const BUCKET_NAME = "access-captures";
const CONFIG_KEY = "CONFIG_DOCENTES_UNHEVAL";

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

function normalizeDocenteName(n: string): string {
  return (n || "")
    .replace(/^(DR\.|DRA\.|MAG\.|MG\.|DR|DRA|MAG|MG|LIC\.|ING\.)\s*/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, " ")
    .trim();
}

// Buscar docente por similitud de nombre en el padrón
function findDocenteByFuzzyName(nameToFind: string, docentesList: DocenteData[]): DocenteData | null {
  const cleanTarget = normalizeDocenteName(nameToFind);
  if (!cleanTarget) return null;

  const targetWords = cleanTarget.split(/\s+/).filter((w) => w.length >= 3);
  if (targetWords.length === 0) return null;

  let bestMatch: DocenteData | null = null;
  let maxScore = 0;

  for (const doc of docentesList) {
    const cleanDoc = normalizeDocenteName(doc.name);
    const docWords = cleanDoc.split(/\s+/).filter((w) => w.length >= 3);

    let matchCount = 0;
    for (const tw of targetWords) {
      if (cleanDoc.includes(tw)) matchCount++;
    }

    const score = matchCount / Math.max(targetWords.length, 1);
    if (matchCount >= 2 && score >= 0.5 && score > maxScore) {
      maxScore = score;
      bestMatch = doc;
    }
  }

  return bestMatch;
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    if (pdfParsePkg && pdfParsePkg.PDFParse) {
      const parser = new pdfParsePkg.PDFParse({ data: buffer });
      const res = await parser.getText();
      return typeof res === "string" ? res : res?.text || "";
    } else if (typeof pdfParsePkg === "function") {
      const res = await pdfParsePkg(buffer);
      return res?.text || "";
    }
  } catch (err) {
    console.warn("Error en PDFParse:", err);
  }
  return buffer.toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const defaultSchedule = (formData.get("targetSchedule") as string) || "Entre Semana";
    const customGrupoNombre = (formData.get("grupoNombre") as string) || "";
    const customFechaInicio = (formData.get("fechaInicio") as string) || "";
    const customFechaFin = (formData.get("fechaFin") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo." }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Obtener padrón actual de docentes
    let currentDocentes: DocenteData[] = UNHEVAL_DOCENTES_DATA;
    try {
      const { data: fileBlob } = await supabase.storage.from(BUCKET_NAME).download(CONFIG_STORAGE_PATH);
      if (fileBlob) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentDocentes = parsed;
        }
      }
    } catch {}

    const parsedRows: {
      dni?: string;
      docente: string;
      aula: string;
      curso: string;
      programa?: string;
      codigo?: string;
      turno: string;
      modalidad: string;
      grupo: string;
      fechasStr?: string;
      fechasList: string[];
      fechaInicio: string;
      fechaFin: string;
    }[] = [];

    // Determinar si es archivo Excel / CSV o PDF
    const isExcel = fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv");
    const isPdf = fileName.endsWith(".pdf");

    if (isExcel) {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName =
        workbook.SheetNames.find((s) => s.toLowerCase().includes("asignadas") || s.toLowerCase().includes("horarios")) ||
        workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];
      const rawData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (!rawData || rawData.length === 0) {
        return NextResponse.json({ error: "La hoja de cálculo está vacía o no tiene formato válido." }, { status: 400 });
      }

      for (const row of rawData) {
        // Encontrar columnas de forma flexible (mayúsculas/minúsculas)
        const keys = Object.keys(row);
        const getVal = (...possibleKeys: string[]) => {
          for (const pk of possibleKeys) {
            const found = keys.find((k) => k.trim().toLowerCase() === pk.toLowerCase());
            if (found && row[found] !== undefined && String(row[found]).trim() !== "") {
              return String(row[found]).trim();
            }
          }
          return "";
        };

        const aula = getVal("aula", "salon", "salón", "ambiente") || "Posgrado UNHEVAL";
        const docenteRaw = getVal("docente", "docentes", "profesor", "nombre", "nombres");
        if (!docenteRaw) continue; // Si no hay nombre de docente en la fila, omitir

        const dniRaw = getVal("dni", "cedula", "cédula", "codigo_docente", "código_docente", "id");
        const curso = getVal("curso", "asignatura", "materia", "modulo", "módulo") || "Docencia Posgrado";
        const programa = getVal("programa", "mencion", "mención", "maestria", "doctorado");
        const codigo = getVal("codigo", "código", "cod");
        const turnoRaw = getVal("turno_horario", "turno", "tipo_horario", "horario") || defaultSchedule;
        const modalidadRaw = getVal("modalidad", "tipo_modalidad") || (aula.toLowerCase().includes("virtual") ? "Virtual (Teams)" : "Presencial");
        const grupoRaw = getVal("grupo_ciclo", "grupo", "ciclo", "periodo") || customGrupoNombre || "Nuevo Ciclo LMV";
        const fechasRaw = getVal("fechas", "fecha", "dias", "días");

        const { fechas, fechaInicio, fechaFin } = parseSpanishFechas(fechasRaw);

        parsedRows.push({
          dni: dniRaw ? normalizeDNI(dniRaw) : undefined,
          docente: docenteRaw,
          aula,
          curso,
          programa,
          codigo,
          turno: turnoRaw.toLowerCase().includes("fin") || turnoRaw.toLowerCase().includes("sab") ? "Fin de Semana" : "Entre Semana",
          modalidad: modalidadRaw,
          grupo: grupoRaw,
          fechasStr: fechasRaw,
          fechasList: fechas,
          fechaInicio: customFechaInicio || fechaInicio,
          fechaFin: customFechaFin || fechaFin,
        });
      }
    } else if (isPdf) {
      // Parsear PDF
      const fullText = await extractPdfText(buffer);
      const lines = fullText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const aulaRegex = /(Aula\s*\d+|FIIS\s*[A-Za-z0-9]+|Sala\s*de\s*grados|Virtual\s*\d+|Dirección\s*\d+)/i;
      const dniRegex = /\b([0-9O]{8}|[0-9]{7,8})\b/;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const aulaMatch = line.match(aulaRegex);
        const dniMatch = line.match(dniRegex);

        const detectedDni = dniMatch ? normalizeDNI(dniMatch[1]) : undefined;
        let detectedAula = aulaMatch ? aulaMatch[1] : undefined;

        if (!detectedAula && i > 0 && lines[i - 1].match(aulaRegex)) {
          detectedAula = lines[i - 1].match(aulaRegex)![1];
        } else if (!detectedAula && i < lines.length - 1 && lines[i + 1].match(aulaRegex)) {
          detectedAula = lines[i + 1].match(aulaRegex)![1];
        }

        const matchedDoc = findDocenteByFuzzyName(line, currentDocentes);
        if (matchedDoc || detectedDni || detectedAula) {
          const effectiveDni = detectedDni || matchedDoc?.employee_id;
          const effectiveName = matchedDoc ? matchedDoc.name : detectedDni ? `Docente ${detectedDni}` : line;
          const isVirtual = (detectedAula || "").toLowerCase().includes("virtual") || line.toLowerCase().includes("virtual");

          const today = new Date().toISOString().split("T")[0];
          parsedRows.push({
            dni: effectiveDni ? normalizeDNI(effectiveDni) : undefined,
            docente: effectiveName,
            aula: detectedAula || matchedDoc?.aula || "Posgrado UNHEVAL",
            curso: matchedDoc?.curso || "Docencia Posgrado",
            turno: defaultSchedule,
            modalidad: isVirtual ? "Virtual (Teams)" : "Presencial",
            grupo: customGrupoNombre || "Grupo Actualizado",
            fechasList: [today],
            fechaInicio: customFechaInicio || today,
            fechaFin: customFechaFin || today,
          });
        }
      }
    } else {
      return NextResponse.json({ error: "Formato no soportado. Debe ser un archivo .xlsx, .xls, .csv o .pdf." }, { status: 400 });
    }

    if (parsedRows.length === 0) {
      return NextResponse.json({ error: "No se pudieron extraer registros válidos del archivo." }, { status: 400 });
    }

    // 2. Asociar DNIs exactos a cada docente
    const historialExistente = await obtenerHistorialAsignaciones();
    const nuevasAsignacionesHistorial: AsignacionGrupo[] = [];
    const timestampNow = new Date().toISOString();

    let updatedDocentesCount = 0;
    let newDocentesCount = 0;

    const updatedDocentesList = [...currentDocentes];

    for (const r of parsedRows) {
      let matchedDni = r.dni;
      let matchedDoc: DocenteData | null = null;

      if (matchedDni) {
        matchedDoc = updatedDocentesList.find((d) => matchDNI(d.employee_id, matchedDni)) || null;
      }

      if (!matchedDoc) {
        // Buscar por nombre difuso en el padrón
        matchedDoc = findDocenteByFuzzyName(r.docente, updatedDocentesList);
        if (matchedDoc) {
          matchedDni = matchedDoc.employee_id;
        }
      }

      // Si aún no tiene DNI, crear un identificador o usar un fallback numérico
      if (!matchedDni) {
        // Intentar buscar en el historial si ya existía
        const enHistorial = historialExistente.find((h) => normalizeDocenteName(h.docente_nombre) === normalizeDocenteName(r.docente));
        if (enHistorial) {
          matchedDni = enHistorial.docente_dni;
        } else {
          // Generar código numérico único basado en hash de nombre para consistencia
          let hash = 0;
          for (let c = 0; c < r.docente.length; c++) {
            hash = (hash << 5) - hash + r.docente.charCodeAt(c);
            hash |= 0;
          }
          matchedDni = String(Math.abs(hash) % 89999999 + 10000000);
        }
      }

      const finalDni = normalizeDNI(matchedDni);
      const finalName = r.docente.toUpperCase().trim();
      const finalAula = r.aula.trim();
      const finalCurso = r.curso.trim();
      const finalModalidad = r.modalidad;
      const finalTurno = r.turno;
      const finalGrupo = r.grupo || customGrupoNombre || "Grupo LMV";

      // 3. Crear registro de asignación histórica
      const asignacionItem: AsignacionGrupo = {
        id: `asig_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        grupo_nombre: finalGrupo,
        tipo_horario: finalTurno,
        fecha_inicio: r.fechaInicio,
        fecha_fin: r.fechaFin,
        fechas_especificas: r.fechasList.length > 0 ? r.fechasList : undefined,
        docente_dni: finalDni,
        docente_nombre: finalName,
        aula: finalAula,
        curso: finalCurso,
        programa: r.programa,
        codigo_curso: r.codigo,
        modalidad: finalModalidad,
        activo: true,
        created_at: timestampNow,
      };

      nuevasAsignacionesHistorial.push(asignacionItem);

      // 4. Actualizar o Insertar en lista activa de Docentes
      const idx = updatedDocentesList.findIndex((d) => matchDNI(d.employee_id, finalDni));
      if (idx >= 0) {
        updatedDocentesList[idx] = {
          ...updatedDocentesList[idx],
          name: finalName,
          aula: finalAula,
          curso: finalCurso,
          modalidad: finalModalidad,
          tipo_horario: finalTurno,
        };
        updatedDocentesCount++;
      } else {
        updatedDocentesList.unshift({
          employee_id: finalDni,
          name: finalName,
          aula: finalAula,
          curso: finalCurso,
          teams: `TEAMS-${finalDni}`,
          modalidad: finalModalidad,
          tipo_horario: finalTurno,
          cargo: "Docente",
        });
        newDocentesCount++;
      }
    }

    // 5. Guardar el nuevo padrón activo de docentes en Supabase
    const payloadDocentes = Buffer.from(JSON.stringify(updatedDocentesList, null, 2), "utf8");
    await supabase.storage.from(BUCKET_NAME).upload(CONFIG_STORAGE_PATH, payloadDocentes, {
      contentType: "application/json",
      upsert: true,
    });

    // Backups en access_logs
    await supabase.from("access_logs").delete().eq("employee_id", CONFIG_KEY);
    await supabase.from("access_logs").insert({
      employee_id: CONFIG_KEY,
      employee_name: "CONFIG_SYNC_CLOUD",
      picture_url: JSON.stringify(updatedDocentesList),
      timestamp: timestampNow,
    });

    // 6. Guardar el Historial de Asignaciones actualizado (manteniendo las anteriores)
    const historialCombinado = [...nuevasAsignacionesHistorial, ...historialExistente];
    await guardarHistorialAsignaciones(historialCombinado);

    return NextResponse.json({
      success: true,
      message: `¡Carga exitosa! Se procesaron ${parsedRows.length} docentes. Se actualizaron ${updatedDocentesCount} y se agregaron ${newDocentesCount} nuevos al padrón con su respectivo historial.`,
      totalProcesados: parsedRows.length,
      docentesActualizados: updatedDocentesCount,
      docentesNuevos: newDocentesCount,
      grupo: customGrupoNombre || parsedRows[0]?.grupo || "Nuevo Grupo",
      asignaciones: nuevasAsignacionesHistorial,
      docentes: updatedDocentesList,
    });
  } catch (error: unknown) {
    console.error("Error en upload-horarios:", error);
    return NextResponse.json({ error: "Error procesando el archivo: " + String(error) }, { status: 500 });
  }
}
