import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_HORARIOS_CONFIG, HorariosConfig } from "@/lib/horariosConfig";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ttadifnnamibraysbrbm.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const CONFIG_STORAGE_PATH = "config/horarios_config.json";
const BUCKET_NAME = "access-captures";

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

export async function GET() {
  try {
    let config: HorariosConfig = DEFAULT_HORARIOS_CONFIG;

    try {
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from(BUCKET_NAME)
        .download(CONFIG_STORAGE_PATH);

      if (fileBlob && !downloadError) {
        const text = await fileBlob.text();
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && parsed.entreSemana) {
          config = { ...DEFAULT_HORARIOS_CONFIG, ...parsed };
        }
      }
    } catch (storageErr) {
      console.warn("Fallback to default config:", storageErr);
    }

    const response = NextResponse.json({
      success: true,
      config,
    }, { status: 200 });

    return setCorsHeaders(response);
  } catch (err: unknown) {
    const errorRes = NextResponse.json({
      success: false,
      config: DEFAULT_HORARIOS_CONFIG,
      error: String(err),
    }, { status: 200 });

    return setCorsHeaders(errorRes);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { config } = body;

    if (!config || typeof config !== "object" || !config.entreSemana) {
      const errRes = NextResponse.json({ error: "Formato de configuración inválido" }, { status: 400 });
      return setCorsHeaders(errRes);
    }

    const payloadBuffer = Buffer.from(JSON.stringify(config, null, 2), "utf8");

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(CONFIG_STORAGE_PATH, payloadBuffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error al guardar config en Storage:", uploadError);
      const res = NextResponse.json({ error: "Error al guardar en Supabase Storage" }, { status: 500 });
      return setCorsHeaders(res);
    }

    // Broadcast change to all connected clients (Smart TVs, PCs) via Supabase Realtime
    try {
      const channel = supabase.channel("realtime_config_horarios");
      await channel.send({
        type: "broadcast",
        event: "config_updated",
        payload: { config, timestamp: Date.now() },
      });
      supabase.removeChannel(channel);
    } catch (realtimeErr) {
      console.warn("Could not broadcast config update:", realtimeErr);
    }

    const okRes = NextResponse.json({ success: true, config }, { status: 200 });
    return setCorsHeaders(okRes);
  } catch (err: unknown) {
    console.error("Error al guardar configuración:", err);
    const errRes = NextResponse.json({ error: String(err) }, { status: 500 });
    return setCorsHeaders(errRes);
  }
}
