import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wb = XLSX.utils.book_new();

    // 1. Hoja de Plantilla
    const headers = [
      "DNI",
      "DOCENTE",
      "AULA",
      "CURSO",
      "PROGRAMA",
      "TURNO_HORARIO",
      "MODALIDAD",
      "GRUPO_CICLO",
      "FECHAS",
    ];

    const sampleRows = [
      [
        "22514666",
        "MG. CONDEZO FIGUEROA, CARLOS MANUEL",
        "Aula 102",
        "GESTIÓN DE LA CONTABILIDAD E INVERSIONES",
        "MAESTRÍA EN GERENCIA PÚBLICA 2025-II GRUPO 02",
        "Entre Semana",
        "Presencial",
        "Grupo LMV - Septiembre 2026",
        "14, 16, 18, 21, 23, 25, 28, 30 DE SETIEMBRE, 02, 05, 07, 09 DE OCTUBRE DE 2026",
      ],
      [
        "22464940",
        "Dr. NACION MOYA, JULIO AUGUSTO",
        "Aula 103",
        "COMERCIO EXTERIOR Y TRIBUTACIÓN ARANCELARIA",
        "MAESTRÍA EN TRIBUTACIÓN Y POLÍTICA FISCAL 2025-I",
        "Entre Semana",
        "Presencial",
        "Grupo LMV - Septiembre 2026",
        "14, 16, 18, 21, 23, 25, 28, 30 DE SETIEMBRE, 02, 05, 07, 09 DE OCTUBRE DE 2026",
      ],
      [
        "09532543",
        "DAVID ABEL NIETO MODESTO",
        "Aula 401",
        "METODOLOGÍA DE LA INVESTIGACIÓN CIENTÍFICA",
        "MAESTRÍA EN DERECHO CIVIL Y COMERCIAL 2026-I",
        "Fin de Semana",
        "Presencial",
        "Grupo Sábados 2026",
        "22, 29 DE AGOSTO, 05, 12, 19, 26 DE SETIEMBRE DE 2026",
      ],
      [
        "22486638",
        "Dra. VILLAVICENCIO GUARDIA, MARIA DEL CARMEN",
        "Virtual 2",
        "SEMINARIO TALLER DE TESIS I: ELABORACIÓN DE PROYECTO DE TESIS",
        "CICLO DE NIVELACIÓN MAESTRÍA 2026-II GRUPO 02",
        "Entre Semana",
        "Virtual (Teams)",
        "Grupo LMV - Septiembre 2026",
        "07, 09, 11, 14, 16, 18, 21, 23, 25, 28, 30 DE SETIEMBRE, 02 DE OCTUBRE DE 2026",
      ],
    ];

    const wsData = [headers, ...sampleRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ajustar anchos de columnas
    ws["!cols"] = [
      { wch: 12 }, // DNI
      { wch: 42 }, // DOCENTE
      { wch: 18 }, // AULA
      { wch: 45 }, // CURSO
      { wch: 48 }, // PROGRAMA
      { wch: 18 }, // TURNO_HORARIO
      { wch: 18 }, // MODALIDAD
      { wch: 30 }, // GRUPO_CICLO
      { wch: 60 }, // FECHAS
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Plantilla_Horarios");

    // 2. Hoja de Instrucciones
    const instruccionesData = [
      ["GUÍA DE LLENADO DE LA PLANTILLA DE HORARIOS Y AULAS - UNHEVAL"],
      [""],
      ["Columna", "Obligatorio", "Descripción / Formato", "Ejemplos Permitidos"],
      ["DNI", "Recomendado", "DNI de 8 dígitos del docente. Si no lo tiene, el sistema buscará por Nombre.", "22411045, 09532543"],
      ["DOCENTE", "Sí", "Nombres y apellidos completos del docente con o sin grado académico.", "MG. CONDEZO FIGUEROA, CARLOS MANUEL"],
      ["AULA", "Sí", "Nombre del ambiente o salón asignado para el ciclo.", "Aula 101, Aula 202, FIIS 101, Sala de grados, Virtual 1"],
      ["CURSO", "Sí", "Nombre oficial de la asignatura o módulo.", "GESTIÓN DE LA CONTABILIDAD E INVERSIONES"],
      ["PROGRAMA", "Opcional", "Nombre del programa de Maestría, Doctorado o Diplomado.", "MAESTRÍA EN GERENCIA PÚBLICA 2026-I"],
      ["TURNO_HORARIO", "Sí", "Turno de dictado de clases: 'Entre Semana' (L-M-V) o 'Fin de Semana' (Sábados).", "Entre Semana, Fin de Semana, Ambos Horarios"],
      ["MODALIDAD", "Sí", "Modalidad de dictado: 'Presencial' o 'Virtual (Teams)'.", "Presencial, Virtual (Teams)"],
      ["GRUPO_CICLO", "Sí", "Nombre identificador del grupo o ciclo para el registro histórico.", "Grupo LMV Septiembre 2026, Ciclo 2026-II Grupo A"],
      ["FECHAS", "Opcional", "Fechas exactas de dictado en texto natural o formato YYYY-MM-DD.", "14, 16, 18, 21, 23 DE SETIEMBRE, 02 DE OCTUBRE DE 2026"],
      [""],
      ["NOTAS IMPORTANTES:"],
      ["1. El sistema acepta también archivos de Control de Aulas con las columnas estándar ('Aula', 'Docente', 'Curso', 'Programa', 'Fechas')."],
      ["2. Al subir este archivo, los salones anteriores se archivan en el Historial con sus fechas correspondientes."],
      ["3. Los reportes de asistencia utilizarán automáticamente el aula asignada para cada fecha histórica."],
    ];

    const wsInstrucciones = XLSX.utils.aoa_to_sheet(instruccionesData);
    wsInstrucciones["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 60 },
      { wch: 55 },
    ];

    XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");

    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Plantilla_Horarios_Docentes_UNHEVAL.xlsx"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("Error generando plantilla Excel:", error);
    return NextResponse.json({ error: "Error al generar la plantilla Excel: " + String(error) }, { status: 500 });
  }
}
