import { NextRequest, NextResponse } from "next/server";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ttadifnnamibraysbrbm.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CONFIG_STORAGE_PATH = "config/docentes.json";
const BUCKET_NAME = "access-captures";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const tipo = searchParams.get("tipo")?.toLowerCase();
    const query = searchParams.get("q")?.toLowerCase().trim();
    const aula = searchParams.get("aula")?.toLowerCase().trim();
    const modalidad = searchParams.get("modalidad")?.toLowerCase().trim();

    let data: DocenteData[] = UNHEVAL_DOCENTES_DATA;

    try {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(CONFIG_STORAGE_PATH);

      if (fileBlob && !downloadError) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          data = parsed;
        }
      }
    } catch (storageErr) {
      console.warn("Storage download fallback to default data:", storageErr);
    }

    // Filtrar por turno / horario
    if (tipo) {
      if (tipo === "sd" || tipo === "fin_de_semana" || tipo === "fin de semana") {
        data = data.filter((d) => d.tipo_horario === "Fin de Semana" || d.tipo_horario === "Ambos Horarios");
      } else if (tipo === "lmv" || tipo === "entre_semana" || tipo === "entre semana") {
        data = data.filter((d) => d.tipo_horario === "Entre Semana" || d.tipo_horario === "Ambos Horarios");
      } else if (tipo === "ambos") {
        data = data.filter((d) => d.tipo_horario === "Ambos Horarios");
      } else {
        data = data.filter((d) => (d.tipo_horario || "").toLowerCase().includes(tipo));
      }
    }

    // Filtrar por aula
    if (aula) {
      data = data.filter((d) => (d.aula || "").toLowerCase().includes(aula));
    }

    // Filtrar por modalidad
    if (modalidad) {
      data = data.filter((d) => (d.modalidad || "").toLowerCase().includes(modalidad));
    }

    // Filtrar por búsqueda general (DNI, Nombre, Curso)
    if (query) {
      data = data.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.employee_id.includes(query) ||
          (d.aula && d.aula.toLowerCase().includes(query)) ||
          (d.curso && d.curso.toLowerCase().includes(query))
      );
    }

    const response = NextResponse.json({
      success: true,
      count: data.length,
      docentes: data,
    }, { status: 200 });

    return setCorsHeaders(response);
  } catch (err: unknown) {
    const errorRes = NextResponse.json({
      success: false,
      docentes: UNHEVAL_DOCENTES_DATA,
      count: UNHEVAL_DOCENTES_DATA.length,
      error: String(err),
    }, { status: 200 });

    return setCorsHeaders(errorRes);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docentes } = body;

    if (!Array.isArray(docentes) || docentes.length === 0) {
      const errRes = NextResponse.json({ error: "Formato inválido. Se espera un array con docentes." }, { status: 400 });
      return setCorsHeaders(errRes);
    }

    const payloadBuffer = Buffer.from(JSON.stringify(docentes, null, 2), "utf8");

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(CONFIG_STORAGE_PATH, payloadBuffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error al actualizar docentes en Storage:", uploadError);
      const res = NextResponse.json({ error: "Error al guardar en Supabase Storage" }, { status: 500 });
      return setCorsHeaders(res);
    }

    const okRes = NextResponse.json({ success: true, count: docentes.length }, { status: 200 });
    return setCorsHeaders(okRes);
  } catch (err: unknown) {
    console.error("Error al guardar docentes:", err);
    const errRes = NextResponse.json({ error: String(err) }, { status: 500 });
    return setCorsHeaders(errRes);
  }
}
