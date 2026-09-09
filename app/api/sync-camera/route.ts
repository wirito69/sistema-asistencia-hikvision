import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import http from "http";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ttadifnnamibraysbrbm.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEFAULT_IP = process.env.HIKVISION_IP || "172.16.80.12";
const DEFAULT_USER = process.env.HIKVISION_USER || "admin";
const DEFAULT_PASS = process.env.HIKVISION_PASS || "Inf2026@";

function normalizeDNI(dni: string | null | undefined): string {
  if (!dni) return "";
  let s = String(dni).trim();
  s = s.replace(/^[oO]/, "0").replace(/[^0-9a-zA-Z]/g, "");
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, "0");
  }
  return s;
}

function parseDigestHeader(header: string) {
  const params: Record<string, string> = {};
  const regex = /(\w+)=(?:"([^"]+)"|([^\s,]+))/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(header)) !== null) {
    params[match[1]] = match[2] || match[3];
  }
  return params;
}

function calculateDigest(method: string, uri: string, user: string, pass: string, authHeader: string) {
  const p = parseDigestHeader(authHeader);
  const realm = p.realm || "";
  const nonce = p.nonce || "";
  const qop = p.qop;
  const nc = "00000001";
  const cnonce = crypto.randomBytes(8).toString("hex");

  const ha1 = crypto.createHash("md5").update(`${user}:${realm}:${pass}`).digest("hex");
  const ha2 = crypto.createHash("md5").update(`${method}:${uri}`).digest("hex");
  let response: string;
  if (qop === "auth" || qop === "auth-int") {
    response = crypto.createHash("md5").update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest("hex");
  } else {
    response = crypto.createHash("md5").update(`${ha1}:${nonce}:${ha2}`).digest("hex");
  }

  let auth = `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
  if (qop) auth += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
  return auth;
}

function makeRequest(ip: string, method: string, path: string, body: string | null = null, auth: string | null = null): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: string }> {
  return new Promise((resolve, reject) => {
    const headers: Record<string, string | number> = { "Content-Type": "application/json" };
    if (body) headers["Content-Length"] = Buffer.byteLength(body);
    if (auth) headers["Authorization"] = auth;

    const req = http.request(
      {
        hostname: ip,
        port: 80,
        path: path,
        method: method,
        headers: headers,
        timeout: 10000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({ status: res.statusCode || 500, headers: res.headers, data });
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Timeout al conectar con el equipo Hikvision"));
    });

    if (body) req.write(body);
    req.end();
  });
}

async function isapiRequest(ip: string, user: string, pass: string, method: string, path: string, body: string | null = null) {
  const initial = await makeRequest(ip, method, path, body);
  if (initial.status === 401 && initial.headers["www-authenticate"]) {
    const auth = calculateDigest(method, path, user, pass, initial.headers["www-authenticate"] as string);
    return await makeRequest(ip, method, path, body, auth);
  }
  return initial;
}

function clasificarMarcacionPorHorario(date: Date): "ENTRADA" | "SALIDA" {
  const day = date.getDay();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeNum = hours + minutes / 60;

  if (day === 6) {
    if (timeNum < 11.0) return "ENTRADA";
    if (timeNum >= 11.0 && timeNum < 14.5) return "SALIDA";
    if (timeNum >= 14.5 && timeNum < 17.5) return "ENTRADA";
    return "SALIDA";
  }

  if (timeNum < 20.5) return "ENTRADA";
  return "SALIDA";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get("ip") || DEFAULT_IP;
    const user = searchParams.get("user") || DEFAULT_USER;
    const pass = searchParams.get("pass") || DEFAULT_PASS;
    const dias = parseInt(searchParams.get("dias") || "15", 10);

    const now = new Date();
    const startDate = new Date(now.getTime() - dias * 24 * 60 * 60 * 1000);
    const startTimeStr = startDate.toISOString().split("T")[0] + "T00:00:00-05:00";
    const endTimeStr = now.toISOString().split("T")[0] + "T23:59:59-05:00";

    let position = 0;
    const maxResults = 30;
    const allEvents: any[] = [];

    while (true) {
      const body = JSON.stringify({
        AcsEventCond: {
          searchID: "1",
          searchResultPosition: position,
          maxResults: maxResults,
          major: 5,
          minor: 75,
          startTime: startTimeStr,
          endTime: endTimeStr,
        },
      });

      const res = await isapiRequest(ip, user, pass, "POST", "/ISAPI/AccessControl/AcsEvent?format=json", body);
      if (res.status !== 200) {
        throw new Error(`Error en ISAPI (${res.status}): ${res.data}`);
      }

      const json = JSON.parse(res.data);
      const acs = json.AcsEvent || {};
      const infoList = acs.InfoList || [];
      const totalMatches = acs.totalMatches || 0;

      allEvents.push(...infoList);

      if (infoList.length === 0 || allEvents.length >= totalMatches || acs.responseStatusStrg === "OK") {
        break;
      }

      position += infoList.length;
    }

    const { data: existingLogs } = await supabase
      .from("access_logs")
      .select("id, employee_id, timestamp");

    const existingSet = new Set<string>();
    (existingLogs || []).forEach((log) => {
      const dni = normalizeDNI(log.employee_id);
      const t = new Date(log.timestamp).getTime();
      const minBucket = Math.round(t / 60000);
      existingSet.add(`${dni}_${minBucket}`);
      existingSet.add(`${dni}_${minBucket - 1}`);
      existingSet.add(`${dni}_${minBucket + 1}`);
    });

    const recordsToInsert: any[] = [];
    for (const ev of allEvents) {
      const rawDni = ev.employeeNoString || "";
      const dni = normalizeDNI(rawDni);
      if (!dni || dni === "0") continue;

      const eventDate = new Date(ev.time);
      const minBucket = Math.round(eventDate.getTime() / 60000);

      if (!existingSet.has(`${dni}_${minBucket}`)) {
        const tipo = clasificarMarcacionPorHorario(eventDate);
        recordsToInsert.push({
          employee_id: dni,
          employee_name: ev.name || "Docente Registrado",
          tipo_evento: tipo,
          picture_url: null,
          timestamp: eventDate.toISOString(),
        });
        existingSet.add(`${dni}_${minBucket}`);
        existingSet.add(`${dni}_${minBucket - 1}`);
        existingSet.add(`${dni}_${minBucket + 1}`);
      }
    }

    if (recordsToInsert.length > 0) {
      for (let i = 0; i < recordsToInsert.length; i += 50) {
        const chunk = recordsToInsert.slice(i, i + 50);
        await supabase.from("access_logs").insert(chunk);
      }
    }

    return NextResponse.json({
      success: true,
      mensaje: `Sincronización completada con éxito desde el equipo Hikvision (${ip}).`,
      eventos_camara_totales: allEvents.length,
      nuevos_registros_insertados: recordsToInsert.length,
      rango_sincronizado: { inicio: startTimeStr, fin: endTimeStr },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error al sincronizar con el equipo Hikvision",
      },
      { status: 500 }
    );
  }
}
