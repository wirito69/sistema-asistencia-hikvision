import { NextRequest, NextResponse } from "next/server";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

export const dynamic = "force-dynamic";

const supabase = getSupabaseAdmin();

// Helper para agregar cabeceras CORS
function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

function normalizeDNI(id: string | null | undefined): string {
  if (!id) return "";
  const cleaned = id.replace(/\D/g, "");
  if (cleaned.length === 0) return id.trim();
  return cleaned.padStart(8, "0");
}

function matchDNI(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const aClean = a.replace(/^0+/, "");
  const bClean = b.replace(/^0+/, "");
  return aClean.length > 0 && aClean === bClean;
}

// Convertir timestamp a Fecha Local Perú (YYYY-MM-DD)
function getPeruDateStr(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-CA", { timeZone: "America/Lima" }); // Devuelve "YYYY-MM-DD"
  } catch {
    return isoString.split("T")[0];
  }
}

// Convertir timestamp a Hora Local Perú (HH:MM:SS)
function getPeruTimeStr(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

// Obtener hora decimal en Horario Perú (ej: 18.5 = 18:30)
function getPeruHourDec(isoString: string): number {
  try {
    const d = new Date(isoString);
    const timeStr = d.toLocaleTimeString("es-PE", {
      timeZone: "America/Lima",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const [h, m, s] = timeStr.split(":").map(Number);
    return h + (m || 0) / 60 + (s || 0) / 3600;
  } catch {
    const d = new Date(isoString);
    return d.getHours() + d.getMinutes() / 60;
  }
}

// Ordenamiento natural de Aulas (Aula 101, 102... 506, Fiis, Dirección, Virtuales)
function sortAulasNatural(a: { aula?: string }, b: { aula?: string }): number {
  const parseAulaRank = (aulaStr?: string): number => {
    if (!aulaStr) return 9999;
    const clean = aulaStr.trim().toLowerCase();
    const match = clean.match(/aula\s*(\d+)/);
    if (match) return parseInt(match[1], 10);
    if (clean.includes("fiis")) return 2000;
    if (clean.includes("grados")) return 2100;
    if (clean.includes("direcc")) return 2200;
    const vMatch = clean.match(/virtual\s*(\d+)/);
    if (vMatch) return 3000 + parseInt(vMatch[1], 10);
    if (clean.includes("virtual")) return 3000;
    return 5000;
  };
  const rankA = parseAulaRank(a.aula);
  const rankB = parseAulaRank(b.aula);
  if (rankA !== rankB) return rankA - rankB;
  return (a.aula || "").localeCompare(b.aula || "", undefined, { numeric: true, sensitivity: "base" });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fechaInicio = searchParams.get("fecha_inicio");
    const fechaFin = searchParams.get("fecha_fin") || fechaInicio;
    const tipoHorario = searchParams.get("tipo_horario")?.toLowerCase();
    const querySearch = searchParams.get("q")?.toLowerCase();

    const todayStr = getPeruDateStr(new Date().toISOString());
    const targetStart = fechaInicio || todayStr;
    const targetEnd = fechaFin || targetStart;

    let docentesList: DocenteData[] = UNHEVAL_DOCENTES_DATA;
    try {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from("access-captures")
        .download("config/docentes.json");

      if (fileBlob && !downloadError) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          docentesList = parsed;
        }
      }
    } catch {}

    // Ampliar rango UTC para abarcar la noche de Perú (+5 horas de margen)
    const startIso = new Date(targetStart + "T00:00:00-05:00").toISOString();
    const endIso = new Date(targetEnd + "T23:59:59-05:00").toISOString();

    const { data: logsData, error: logsError } = await supabase
      .from("access_logs")
      .select("*")
      .gte("timestamp", startIso)
      .lte("timestamp", endIso)
      .order("timestamp", { ascending: true });

    if (logsError) {
      console.error("Error al consultar logs de reporte:", logsError);
    }

    const allLogs = (logsData || []).filter(
      (l) =>
        l.employee_id &&
        !l.employee_id.startsWith("DEV-") &&
        !l.employee_id.startsWith("CONFIG_") &&
        l.employee_name !== "Personal Registrado" &&
        l.employee_name !== "Marcación Terminal"
    );

    let filteredDocentes = docentesList.filter((d) => {
      const horarioStr = String(d.tipo_horario || "");
      const isBoth =
        horarioStr === "Ambos Horarios" ||
        horarioStr === "Todos los Horarios" ||
        horarioStr === "Ambos";

      if (tipoHorario === "sd" || tipoHorario === "fin_de_semana") {
        return horarioStr === "Fin de Semana" || isBoth;
      }
      if (tipoHorario === "lmv" || tipoHorario === "entre_semana") {
        return horarioStr === "Entre Semana" || isBoth;
      }
      return true;
    });

    if (querySearch) {
      filteredDocentes = filteredDocentes.filter(
        (d) =>
          d.name.toLowerCase().includes(querySearch) ||
          d.employee_id.includes(querySearch) ||
          (d.aula && d.aula.toLowerCase().includes(querySearch)) ||
          (d.curso && d.curso.toLowerCase().includes(querySearch))
      );
    }

    const dateList: string[] = [];
    const curr = new Date(targetStart + "T00:00:00");
    const endLimit = new Date(targetEnd + "T00:00:00");

    while (curr <= endLimit) {
      dateList.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }

    const detalleAsistencias: Array<{
      fecha: string;
      dia_semana: string;
      dni: string;
      docente: string;
      aula: string;
      curso: string;
      tipo_horario: string;
      modalidad: string;
      hora_entrada: string | null;
      hora_salida: string | null;
      total_marcajes: number;
      estado: string;
      badge_estado: string;
      minutos_tardanza: number;
      horas_dictadas: number;
      foto_captura: string | null;
    }> = [];
    
    const consolidadoMap = new Map<string, any>();

    filteredDocentes.forEach((d) => {
      const normDni = normalizeDNI(d.employee_id);
      consolidadoMap.set(normDni, {
        dni: d.employee_id,
        docente: d.name,
        aula: d.aula,
        curso: d.curso,
        tipo_horario: d.tipo_horario,
        total_dias_programados: 0,
        total_asistencias: 0,
        total_tardanzas: 0,
        total_faltas: 0,
        minutos_tardanza_acumulados: 0,
        total_horas_dictadas: 0,
        porcentaje_asistencia: 100,
      });
    });

    dateList.forEach((dateStr) => {
      const [y, m, dayNum] = dateStr.split("-").map(Number);
      const dayObj = new Date(y, m - 1, dayNum, 12, 0, 0);
      const dayOfWeek = dayObj.getDay();
      const isSaturday = dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;
      const isWeekend = isSaturday || isSunday;
      const isMWF = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5; // Lunes (1), Miércoles (3), Viernes (5)

      // SI ES MARTES O JUEVES, NO HAY CLASES EN POSGRADO UNHEVAL
      if (!isMWF && !isWeekend) {
        return;
      }

      const diaNombre = dayObj.toLocaleDateString("es-PE", { weekday: "long" });
      
      // FILTRAR LOGS DEL DÍA USANDO LA FECHA LOCAL DE PERÚ
      const dayLogs = allLogs.filter((l) => getPeruDateStr(l.timestamp) === dateStr);

      // Docentes programados para este turno
      const dayDocentesList = filteredDocentes
        .filter((docente) => {
          if (querySearch) return true;
          const isBoth =
            docente.tipo_horario === "Ambos Horarios" ||
            docente.tipo_horario === "Todos los Horarios" ||
            docente.tipo_horario === "Ambos";

          if (isWeekend) {
            return docente.tipo_horario === "Fin de Semana" || isBoth;
          }
          if (isMWF) {
            return docente.tipo_horario === "Entre Semana" || isBoth;
          }
          return false;
        })
        .sort(sortAulasNatural);

      dayDocentesList.forEach((docente) => {
        const normDni = normalizeDNI(docente.employee_id);

        const isVirtual =
          docente.modalidad?.toLowerCase().includes("virtual") ||
          docente.aula?.toLowerCase().includes("virtual");

        const consRecord = consolidadoMap.get(normDni);
        if (consRecord) {
          consRecord.total_dias_programados++;
        }

        const docLogs = dayLogs
          .filter((l) => matchDNI(l.employee_id, docente.employee_id))
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const punchCount = docLogs.length;

        // ASIGNACIÓN EXACTA DE ENTRADA Y SALIDA:
        let firstLog: any = null;
        let lastLog: any = null;

        if (isMWF) {
          // Ventana de Entrada L-M-V: 15:00 a 20:24 (Perú)
          const entryLogs = docLogs.filter((l) => {
            const dec = getPeruHourDec(l.timestamp);
            return dec >= 15.0 && dec < 20.4;
          });
          if (entryLogs.length > 0) {
            // Seleccionar la marcación más próxima a 18:00 (18.0)
            firstLog = entryLogs.reduce((prev, curr) => {
              const prevDec = getPeruHourDec(prev.timestamp);
              const currDec = getPeruHourDec(curr.timestamp);
              return Math.abs(currDec - 18.0) < Math.abs(prevDec - 18.0) ? curr : prev;
            });
          }

          // Ventana de Salida L-M-V: a partir de 20:25 (20.4 hrs en adelante, ej: 21:30, 21:42...)
          const exitLogs = docLogs.filter((l) => {
            const dec = getPeruHourDec(l.timestamp);
            return dec >= 20.4;
          });
          if (exitLogs.length > 0) {
            // Tomar el último marcaje de salida
            lastLog = exitLogs[exitLogs.length - 1];
          }
        } else if (isSaturday) {
          // Sábado
          const morningLogs = docLogs.filter((l) => {
            const dec = getPeruHourDec(l.timestamp);
            return dec >= 6.0 && dec < 11.5;
          });
          if (morningLogs.length > 0) {
            firstLog = morningLogs.reduce((prev, curr) => {
              const prevDec = getPeruHourDec(prev.timestamp);
              const currDec = getPeruHourDec(curr.timestamp);
              return Math.abs(currDec - 7.0) < Math.abs(prevDec - 7.0) ? curr : prev;
            });
          }

          const exitLogs = docLogs.filter((l) => {
            const dec = getPeruHourDec(l.timestamp);
            return (dec >= 11.5 && dec < 14.5) || dec >= 17.0;
          });
          if (exitLogs.length > 0) {
            lastLog = exitLogs[exitLogs.length - 1];
          }
        }

        // EVALUACIÓN DE ESTADO:
        let estado = "SIN_REGISTRO";
        let badgeEstado = "🔴 Sin Registro";
        let minsTardanza = 0;
        const horasDictadas = isSaturday ? 7.5 : 3.5;

        if (isVirtual) {
          estado = "VIRTUAL";
          badgeEstado = firstLog ? "🟢 En Sesión Teams" : "💻 Virtual Teams";
          if (consRecord) {
            consRecord.total_asistencias++;
            consRecord.total_horas_dictadas += horasDictadas;
          }
        } else if (firstLog) {
          const timeNum = getPeruHourDec(firstLog.timestamp);
          let isEntryLate = false;

          if (isSaturday) {
            isEntryLate = timeNum > 7.5;
          } else {
            isEntryLate = timeNum > 18.5; // Pasado 18:30 es tardanza
          }

          if (isEntryLate) {
            estado = "TARDANZA";
            badgeEstado = lastLog ? "🔵 Salió (Tardanza)" : "🟡 En Aula (+30m)";
            minsTardanza = Math.round((timeNum - (isSaturday ? 7.0 : 18.0)) * 60);
            if (consRecord) {
              consRecord.total_tardanzas++;
              consRecord.minutos_tardanza_acumulados += minsTardanza;
              consRecord.total_horas_dictadas += horasDictadas;
            }
          } else {
            estado = "PUNTUAL";
            badgeEstado = lastLog ? "🔵 Salió del Aula ✅" : "🟢 En Aula (Puntual)";
            minsTardanza = 0;
            if (consRecord) {
              consRecord.total_asistencias++;
              consRecord.total_horas_dictadas += horasDictadas;
            }
          }
        } else {
          estado = "FALTA";
          badgeEstado = "🔴 Sin Registro";
          if (consRecord) {
            consRecord.total_faltas++;
          }
        }

        detalleAsistencias.push({
          fecha: dateStr,
          dia_semana: diaNombre.toUpperCase(),
          dni: docente.employee_id,
          docente: docente.name,
          aula: docente.aula,
          curso: docente.curso,
          tipo_horario: docente.tipo_horario,
          modalidad: docente.modalidad || "Presencial",
          hora_entrada: firstLog ? getPeruTimeStr(firstLog.timestamp) : null,
          hora_salida: lastLog ? getPeruTimeStr(lastLog.timestamp) : null,
          total_marcajes: punchCount,
          estado,
          badge_estado: badgeEstado,
          minutos_tardanza: minsTardanza,
          horas_dictadas: horasDictadas,
          foto_captura: docLogs.find((l) => l.picture_url)?.picture_url || null,
        });
      });
    });

    const consolidadoList = Array.from(consolidadoMap.values())
      .filter((c) => c.total_dias_programados > 0 || c.total_asistencias > 0 || c.total_tardanzas > 0)
      .map((c) => {
        const totalAsistidas = c.total_asistencias + c.total_tardanzas;
        const pct =
          c.total_dias_programados > 0
            ? Math.round((totalAsistidas / c.total_dias_programados) * 100)
            : 100;
        return {
          ...c,
          porcentaje_asistencia: pct,
        };
      });

    // Registros biométricos brutos
    const rawLogsList = allLogs.map((l) => {
      const docInfo =
        docentesList.find((d) => matchDNI(d.employee_id, l.employee_id)) ||
        UNHEVAL_DOCENTES_DATA.find((d) => matchDNI(d.employee_id, l.employee_id));

      const hourDec = getPeruHourDec(l.timestamp);
      return {
        id: l.id,
        dni: l.employee_id,
        docente: docInfo?.name || l.employee_name || "Docente",
        aula: docInfo?.aula || "Posgrado UNHEVAL",
        curso: docInfo?.curso || "Docencia Posgrado",
        fecha: getPeruDateStr(l.timestamp),
        hora: getPeruTimeStr(l.timestamp),
        tipo: l.tipo_evento || (hourDec >= 20.4 ? "SALIDA" : "ENTRADA"),
        foto_url: l.picture_url || "",
      };
    });

    const successRes = NextResponse.json(
      {
        success: true,
        rango: { fecha_inicio: targetStart, fecha_fin: targetEnd },
        total_dias: dateList.length,
        resumen: {
          total_docentes: filteredDocentes.length,
          total_asistencias: consolidadoList.reduce((acc, c) => acc + c.total_asistencias, 0),
          total_tardanzas: consolidadoList.reduce((acc, c) => acc + c.total_tardanzas, 0),
          total_faltas: consolidadoList.reduce((acc, c) => acc + c.total_faltas, 0),
          total_horas_dictadas: consolidadoList.reduce((acc, c) => acc + c.total_horas_dictadas, 0),
          total_registros_evaluados: detalleAsistencias.length,
        },
        consolidado: consolidadoList,
        detalle: detalleAsistencias,
        raw_logs: rawLogsList,
      },
      { status: 200 }
    );
    return setCorsHeaders(successRes);
  } catch (error: unknown) {
    console.error("Error al procesar reporte:", error);
    const errRes = NextResponse.json(
      { success: false, error: "Error interno al generar reporte", details: String(error) },
      { status: 500 }
    );
    return setCorsHeaders(errRes);
  }
}
