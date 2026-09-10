import { NextRequest, NextResponse } from "next/server";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParsePkg = require("pdf-parse");

const supabase = getSupabaseAdmin();

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

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    if (pdfParsePkg && pdfParsePkg.PDFParse) {
      const parser = new pdfParsePkg.PDFParse({ data: buffer });
      const res = await parser.getText();
      return typeof res === "string" ? res : (res?.text || "");
    } else if (typeof pdfParsePkg === "function") {
      const res = await pdfParsePkg(buffer);
      return res?.text || "";
    }
  } catch (err) {
    console.warn("Error en biblioteca PDFParse:", err);
  }
  return buffer.toString("utf8");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetSchedule = (formData.get("targetSchedule") as string) || "Entre Semana"; // "Fin de Semana" o "Entre Semana"

    if (!file) {
      return NextResponse.json({ error: "No se seleccionó ningún archivo PDF." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extraer texto del PDF
    const fullText = await extractPdfText(buffer);

    if (!fullText || !fullText.trim()) {
      return NextResponse.json({ error: "El archivo PDF no contiene texto legible." }, { status: 400 });
    }

    // 1. Obtener la lista actual de docentes desde Supabase Cloud
    const { data: configRecord } = await supabase
      .from("access_logs")
      .select("picture_url")
      .eq("employee_id", CONFIG_KEY)
      .order("id", { ascending: false })
      .limit(1)
      .single();

    let currentDocentes: DocenteData[] = UNHEVAL_DOCENTES_DATA;
    if (configRecord && configRecord.picture_url) {
      try {
        const parsed = JSON.parse(configRecord.picture_url);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentDocentes = parsed;
        }
      } catch {
        // Fallback
      }
    }

    // 2. Extraer asignaciones del PDF
    const lines: string[] = String(fullText).split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
    const assignedTeachers: {
      dni?: string;
      name?: string;
      aula?: string;
      curso?: string;
      teams?: string;
      modalidad?: string;
    }[] = [];

    const aulaRegex = /(Aula\s*\d+|FIIS\s*[A-Za-z0-9]+|Sala\s*de\s*grados|Virtual\s*\d+|Dirección\s*\d+)/i;
    const dniRegex = /\b([0-9O]{8}|[0-9]{7,8})\b/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const aulaMatch = line.match(aulaRegex);
      const dniMatch = line.match(dniRegex);

      let foundDocente: DocenteData | null = null;
      let detectedAula = aulaMatch ? aulaMatch[1] : undefined;
      let detectedDNI = dniMatch ? normalizeDNI(dniMatch[1]) : undefined;

      // Buscar coincidencias de nombre en el padrón
      for (const doc of currentDocentes) {
        const cleanDocName = doc.name
          .replace(/^(DR\.|DRA\.|MAG\.|MG\.|DR|DRA|MAG|MG)\s*/i, "")
          .trim()
          .toUpperCase();

        const words = cleanDocName.split(/[\s,]+/).filter((w: string) => w.length > 2);
        if (words.length >= 2) {
          const matchCount = words.filter((w: string) => line.toUpperCase().includes(w)).length;
          if (matchCount >= 2 && (matchCount / words.length) >= 0.5) {
            foundDocente = doc;
            break;
          }
        }
      }

      if (foundDocente || detectedDNI || detectedAula) {
        if (!detectedAula && i > 0 && lines[i - 1].match(aulaRegex)) {
          detectedAula = lines[i - 1].match(aulaRegex)![1];
        } else if (!detectedAula && i < lines.length - 1 && lines[i + 1].match(aulaRegex)) {
          detectedAula = lines[i + 1].match(aulaRegex)![1];
        }

        const effectiveDNI = detectedDNI || (foundDocente ? foundDocente.employee_id : undefined);
        const effectiveName = foundDocente ? foundDocente.name : (detectedDNI ? `Docente ${detectedDNI}` : line);
        const isVirtual = detectedAula?.toLowerCase().includes("virtual") || line.toLowerCase().includes("virtual") || line.toLowerCase().includes("teams");

        if (effectiveDNI) {
          assignedTeachers.push({
            dni: normalizeDNI(effectiveDNI),
            name: effectiveName,
            aula: detectedAula || foundDocente?.aula || "Posgrado UNHEVAL",
            curso: foundDocente?.curso || "Docencia Posgrado",
            teams: foundDocente?.teams || `TEAMS-${effectiveDNI}`,
            modalidad: isVirtual ? "Virtual (Teams)" : "Presencial",
          });
        }
      }
    }

    // 3. Aplicar las nuevas asignaciones a la lista maestra
    let updatedCount = 0;
    const updatedDocentesList = currentDocentes.map((doc) => {
      const match = assignedTeachers.find((a) => a.dni && matchDNI(a.dni, doc.employee_id));
      if (match) {
        updatedCount++;
        return {
          ...doc,
          aula: match.aula || doc.aula,
          tipo_horario: targetSchedule,
          modalidad: match.modalidad || doc.modalidad,
          curso: match.curso !== "Docencia Posgrado" ? match.curso : doc.curso,
          teams: match.teams || doc.teams,
        };
      }
      return doc;
    });

    // Agregar docentes nuevos si no existían en el padrón
    for (const a of assignedTeachers) {
      if (a.dni && !updatedDocentesList.some((d) => matchDNI(d.employee_id, a.dni))) {
        updatedDocentesList.unshift({
          employee_id: a.dni,
          name: a.name || `Docente ${a.dni}`,
          aula: a.aula || "Posgrado UNHEVAL",
          curso: a.curso || "Docencia Posgrado",
          teams: a.teams || `TEAMS-${a.dni}`,
          modalidad: a.modalidad || "Presencial",
          tipo_horario: targetSchedule,
          cargo: "Docente",
        });
        updatedCount++;
      }
    }

    // 4. Guardar inmediatamente en Supabase Cloud
    await supabase.from("access_logs").delete().eq("employee_id", CONFIG_KEY);
    const { error: insertError } = await supabase.from("access_logs").insert({
      employee_id: CONFIG_KEY,
      employee_name: "CONFIG_SYNC_CLOUD",
      picture_url: JSON.stringify(updatedDocentesList),
      timestamp: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error guardando en Supabase:", insertError);
    }

    return NextResponse.json({
      success: true,
      message: `¡PDF procesado exitosamente! Se auto-asignaron ${updatedCount} docentes al horario ${targetSchedule}.`,
      totalAssigned: assignedTeachers.length,
      updatedCount,
      targetSchedule,
      docentes: updatedDocentesList,
    });
  } catch (err: unknown) {
    console.error("Error en upload-pdf:", err);
    return NextResponse.json({ error: "Error procesando el archivo PDF: " + String(err) }, { status: 500 });
  }
}
