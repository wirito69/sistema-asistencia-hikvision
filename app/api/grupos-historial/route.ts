import { NextRequest, NextResponse } from "next/server";
import {
  AsignacionGrupo,
  obtenerHistorialAsignaciones,
  guardarHistorialAsignaciones,
} from "@/lib/historialAsignaciones";

export const dynamic = "force-dynamic";

function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  return setCorsHeaders(res);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const dni = searchParams.get("dni")?.trim();
    const grupo = searchParams.get("grupo")?.toLowerCase().trim();
    const aula = searchParams.get("aula")?.toLowerCase().trim();
    const q = searchParams.get("q")?.toLowerCase().trim();

    const historial = await obtenerHistorialAsignaciones();

    let filtered = historial;

    if (dni) {
      filtered = filtered.filter((h) => h.docente_dni.includes(dni));
    }

    if (grupo) {
      filtered = filtered.filter((h) => h.grupo_nombre.toLowerCase().includes(grupo));
    }

    if (aula) {
      filtered = filtered.filter((h) => h.aula.toLowerCase().includes(aula));
    }

    if (q) {
      filtered = filtered.filter(
        (h) =>
          h.docente_nombre.toLowerCase().includes(q) ||
          h.docente_dni.includes(q) ||
          h.aula.toLowerCase().includes(q) ||
          h.curso.toLowerCase().includes(q) ||
          h.grupo_nombre.toLowerCase().includes(q)
      );
    }

    // Extraer resumen de grupos únicos
    const gruposMap = new Map<string, { nombre: string; turno: string; fechaInicio: string; fechaFin: string; docentesCount: number }>();
    historial.forEach((h) => {
      const gKey = h.grupo_nombre;
      if (!gruposMap.has(gKey)) {
        gruposMap.set(gKey, {
          nombre: h.grupo_nombre,
          turno: h.tipo_horario,
          fechaInicio: h.fecha_inicio,
          fechaFin: h.fecha_fin,
          docentesCount: 1,
        });
      } else {
        const item = gruposMap.get(gKey)!;
        item.docentesCount++;
      }
    });

    const response = NextResponse.json({
      success: true,
      count: filtered.length,
      historial: filtered,
      grupos: Array.from(gruposMap.values()),
    });

    return setCorsHeaders(response);
  } catch (error: unknown) {
    console.error("Error en GET grupos-historial:", error);
    const errRes = NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    return setCorsHeaders(errRes);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, asignacion, idToDelete } = body;

    const historial = await obtenerHistorialAsignaciones();

    if (action === "delete" && idToDelete) {
      const updated = historial.filter((h) => h.id !== idToDelete);
      await guardarHistorialAsignaciones(updated);
      return setCorsHeaders(NextResponse.json({ success: true, message: "Asignación eliminada del historial." }));
    }

    if (action === "add" && asignacion) {
      const newItem: AsignacionGrupo = {
        ...asignacion,
        id: asignacion.id || `asig_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        created_at: asignacion.created_at || new Date().toISOString(),
      };
      const updated = [newItem, ...historial];
      await guardarHistorialAsignaciones(updated);
      return setCorsHeaders(NextResponse.json({ success: true, asignacion: newItem }));
    }

    return setCorsHeaders(NextResponse.json({ error: "Acción no válida" }, { status: 400 }));
  } catch (error: unknown) {
    console.error("Error en POST grupos-historial:", error);
    return setCorsHeaders(NextResponse.json({ error: String(error) }, { status: 500 }));
  }
}
