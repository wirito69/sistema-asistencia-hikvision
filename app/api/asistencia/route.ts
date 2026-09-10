import { NextResponse } from "next/server";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

export const dynamic = "force-dynamic";

const supabase = getSupabaseAdmin();

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

function formatTimeToHHMMSS(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryFecha = searchParams.get("fecha"); // Formato YYYY-MM-DD
    const queryTipoHorario = searchParams.get("tipo_horario")?.toLowerCase(); // "sd", "lmv", "todos"
    const queryEstado = searchParams.get("estado")?.toLowerCase(); // "en_aula", "salio", "en_espera", "sin_registro", "virtual", "todos"
    const querySearch = searchParams.get("q")?.toLowerCase();

    const now = new Date();
    const todayIso = now.toISOString().split("T")[0];
    const targetDateStr = queryFecha || todayIso;

    // Calcular día de la semana para la fecha consultada
    const [y, m, d] = targetDateStr.split("-").map(Number);
    const targetDateObj = new Date(y, m - 1, d, 12, 0, 0);
    const dayOfWeek = targetDateObj.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;
    const isWeekend = isSaturday || isSunday;
    const isMWF = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;

    // 1. Obtener lista de docentes personalizada de Supabase Storage
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
    } catch {
      // Usar lista por defecto
    }

    // 2. Obtener marcaciones de la fecha especificada
    const startOfDay = new Date(y, m - 1, d, 0, 0, 0).toISOString();
    const endOfDay = new Date(y, m - 1, d, 23, 59, 59).toISOString();

    const { data: logsData, error: logsError } = await supabase
      .from("access_logs")
      .select("*")
      .gte("timestamp", startOfDay)
      .lte("timestamp", endOfDay)
      .order("timestamp", { ascending: true });

    if (logsError) {
      console.error("Error al consultar logs:", logsError);
    }

    const dayLogs = (logsData || []).filter(
      (l) =>
        l.employee_id &&
        !l.employee_id.startsWith("DEV-") &&
        !l.employee_id.startsWith("CONFIG_") &&
        l.employee_name !== "Personal Registrado" &&
        l.employee_name !== "Marcación Terminal"
    );

    // 3. Filtrar docentes según el turno del día (Fin de semana vs Entre semana)
    let filteredDocentes = docentesList.filter((docente) => {
      const isVirtual = docente.modalidad?.toLowerCase().includes("virtual") || docente.aula?.toLowerCase().includes("virtual");
      if (isVirtual) return true; // Incluir virtuales para monitoreo

      const horarioStr = String(docente.tipo_horario || "");
      const isBoth =
        horarioStr === "Ambos Horarios" ||
        horarioStr === "Todos los Horarios" ||
        horarioStr === "Ambos";
      if (isBoth) return true;

      if (isWeekend) return horarioStr === "Fin de Semana";
      if (isMWF) return horarioStr === "Entre Semana";
      return true;
    });

    if (queryTipoHorario === "sd") {
      filteredDocentes = filteredDocentes.filter((d) => d.tipo_horario === "Fin de Semana" || d.tipo_horario === "Ambos Horarios");
    } else if (queryTipoHorario === "lmv") {
      filteredDocentes = filteredDocentes.filter((d) => d.tipo_horario === "Entre Semana" || d.tipo_horario === "Ambos Horarios");
    }

    if (querySearch) {
      filteredDocentes = filteredDocentes.filter(
        (d) =>
          d.name.toLowerCase().includes(querySearch) ||
          d.employee_id.includes(querySearch) ||
          d.aula.toLowerCase().includes(querySearch) ||
          d.curso.toLowerCase().includes(querySearch)
      );
    }

    // 4. Calcular horas de entrada, salida, tardanzas y estados para cada docente
    const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
    const horaProgramadaEntrada = isSaturday ? 7.0 : 18.0;
    const horaLimiteTolerancia = horaProgramadaEntrada + 0.5; // +30m tolerancia

    let countPresentes = 0;
    let countSalieron = 0;
    let countEnEspera = 0;
    let countSinRegistro = 0;
    let countVirtuales = 0;

    const reporteDocentes = filteredDocentes.map((docente) => {
      const normDni = normalizeDNI(docente.employee_id);
      const isVirtual = docente.modalidad?.toLowerCase().includes("virtual") || docente.aula?.toLowerCase().includes("virtual");

      // Marcaciones de este docente ordenadas cronológicamente (filtrando pasos fuera de hora de clase)
      const docLogs = dayLogs
        .filter((l) => matchDNI(l.employee_id, docente.employee_id))
        .filter((l) => {
          const dObj = new Date(l.timestamp);
          const timeNum = dObj.getHours() + dObj.getMinutes() / 60;
          if (isMWF && timeNum < 17.5) return false;
          if (isSaturday && timeNum < 6.5) return false;
          return true;
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      const punchCount = docLogs.length;
      const firstLog = docLogs[0] || null;
      const lastLog = punchCount > 1 ? docLogs[punchCount - 1] : null;

      const hasRegisteredSalida = punchCount >= 2 || (firstLog && String(firstLog.tipo_evento).toUpperCase() === "SALIDA");
      const isCurrentlyInAula = punchCount === 1 && !hasRegisteredSalida;

      // Calcular hora de entrada y salida
      const horaEntrada = firstLog ? formatTimeToHHMMSS(firstLog.timestamp) : null;
      const horaSalida = lastLog ? formatTimeToHHMMSS(lastLog.timestamp) : (hasRegisteredSalida && firstLog ? formatTimeToHHMMSS(firstLog.timestamp) : null);
      const fotoCaptura = docLogs.find((l) => l.picture_url)?.picture_url || null;

      // Calcular puntualidad y tardanza
      let minutosTardanza = 0;
      let esPuntual = false;
      if (firstLog) {
        const dObj = new Date(firstLog.timestamp);
        const logHourDec = dObj.getHours() + dObj.getMinutes() / 60;
        const diffMins = Math.round((logHourDec - horaProgramadaEntrada) * 60);
        if (diffMins <= 3) {
          esPuntual = true;
          minutosTardanza = 0;
        } else {
          esPuntual = false;
          minutosTardanza = diffMins;
        }
      }

      // Clasificación de estado
      let estado = "EN_ESPERA";
      let estadoTexto = "En Espera (Por ingresar)";

      if (isVirtual) {
        if (punchCount > 0) {
          estado = "EN_SESION_VIRTUAL";
          estadoTexto = "En Sesión Virtual (Teams)";
          countVirtuales++;
        } else {
          estado = "VIRTUAL_PENDIENTE";
          estadoTexto = "Virtual Pendiente";
          countEnEspera++;
        }
      } else if (hasRegisteredSalida) {
        estado = "SALIO";
        estadoTexto = "Salió del Aula (Jornada Concluida)";
        countSalieron++;
      } else if (isCurrentlyInAula) {
        estado = "EN_AULA";
        estadoTexto = "En Aula (Dictando Clase)";
        countPresentes++;
      } else if (currentHourDecimal > horaLimiteTolerancia) {
        estado = "SIN_REGISTRO";
        estadoTexto = "Sin Registro (+30m Ausente)";
        countSinRegistro++;
      } else {
        estado = "EN_ESPERA";
        estadoTexto = "En Espera (Dentro de Tolerancia)";
        countEnEspera++;
      }

      return {
        dni: normDni,
        dni_original: docente.employee_id,
        nombres_completos: docente.name.replace(/^(DR\.|MAG\.|DRA\.|MG\.)\s*/i, "").trim(),
        grado_y_nombres: docente.name,
        curso: docente.curso,
        aula: docente.aula,
        modalidad: docente.modalidad || "Presencial",
        tipo_horario: docente.tipo_horario,
        teams: docente.teams || null,
        estado,
        estado_descripcion: estadoTexto,
        hora_entrada: horaEntrada,
        hora_salida: horaSalida,
        total_marcajes: punchCount,
        es_puntual: esPuntual,
        minutos_tardanza: minutosTardanza,
        foto_captura: fotoCaptura,
        marcajes_detalle: docLogs.map((l) => ({
          timestamp: l.timestamp,
          hora: formatTimeToHHMMSS(l.timestamp),
          tipo: l.tipo_evento || "MARCACION",
          foto: l.picture_url,
        })),
      };
    });

    // Filtrar por estado si se especificó
    let resultadoFinal = reporteDocentes;
    if (queryEstado && queryEstado !== "todos") {
      resultadoFinal = reporteDocentes.filter((d) => d.estado.toLowerCase().includes(queryEstado));
    }

    const totalFiltrados = filteredDocentes.length;
    const totalRegistraron = countPresentes + countSalieron + countVirtuales;
    const porcentajeAsistencia = totalFiltrados > 0 ? Math.round((totalRegistraron / totalFiltrados) * 100) : 0;

    return NextResponse.json(
      {
        success: true,
        fecha: targetDateStr,
        dia: isSaturday ? "Sábado" : isSunday ? "Domingo" : "Entre Semana",
        horario_programado: isSaturday ? "07:00 a 18:30" : "18:00 a 21:30",
        resumen: {
          total_programados: totalFiltrados,
          total_atendieron: totalRegistraron,
          en_aula: countPresentes,
          salieron: countSalieron,
          virtuales: countVirtuales,
          en_espera: countEnEspera,
          sin_registro: countSinRegistro,
          porcentaje_asistencia: `${porcentajeAsistencia}%`,
        },
        docentes: resultadoFinal,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error en API /api/asistencia:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
