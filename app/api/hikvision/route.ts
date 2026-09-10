import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

const supabase = getSupabaseAdmin();

import { UNHEVAL_DOCENTES_DATA } from "@/lib/docentesData";

function normalizeDNI(dni: string | null | undefined): string {
  if (!dni) return "";
  let s = String(dni).trim();
  // Reemplazar la letra 'O' o 'o' inicial por '0'
  s = s.replace(/^[oO]/, "0").replace(/[^0-9a-zA-Z]/g, "");
  // Si son dígitos y tiene entre 6 y 7 caracteres, rellenar con ceros a la izquierda (ej: 7951959 -> 07951959)
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, "0");
  }
  return s;
}

function matchDNI(dniA: string | null | undefined, dniB: string | null | undefined): boolean {
  const a = normalizeDNI(dniA);
  const b = normalizeDNI(dniB);
  if (!a || !b) return false;
  if (a === b) return true;
  const aClean = a.replace(/^0+/, "");
  const bClean = b.replace(/^0+/, "");
  return aClean.length > 0 && aClean === bClean;
}

// Clasificar marcación según horario
function clasificarMarcacionPorHorario(date: Date = new Date()): { tipoEvento: "ENTRADA" | "SALIDA"; slotNombre: string; slotIndex: number } {
  const day = date.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mie, 4: Jue, 5: Vie, 6: Sab
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeNum = hours + minutes / 60; // Decimal: ej. 18:30 = 18.5, 13:30 = 13.5

  if (day === 6) {
    // SÁBADOS: 4 slots
    // Slot 1: Entrada Mañana (07:00) -> de 06:00 a 11:00
    if (timeNum < 11.0) {
      return { tipoEvento: "ENTRADA", slotNombre: "Entrada Mañana", slotIndex: 0 };
    }
    // Slot 2: Salida Mañana (14:00 +- 30 min) -> de 13.0 a 14.5 (13:00 a 14:30)
    if (timeNum >= 11.0 && timeNum < 14.5) {
      return { tipoEvento: "SALIDA", slotNombre: "Salida Mañana", slotIndex: 1 };
    }
    // Slot 3: Entrada Tarde (15:00 +- 30 min) -> de 14.5 a 17.0 (14:30 a 17:00)
    if (timeNum >= 14.5 && timeNum < 17.5) {
      return { tipoEvento: "ENTRADA", slotNombre: "Entrada Tarde", slotIndex: 2 };
    }
    // Slot 4: Salida Tarde (18:30 +- 30 min) -> de 17.5 en adelante (17:30 a 22:00)
    return { tipoEvento: "SALIDA", slotNombre: "Salida Tarde", slotIndex: 3 };
  }

  // DÍAS DE SEMANA (Lunes, Miércoles, Viernes y otros): 2 slots (18:00 y 21:30)
  // Slot 1: Entrada Noche (18:00) -> antes de las 20:30 (16:30 a 20:30)
  if (timeNum < 20.5) {
    return { tipoEvento: "ENTRADA", slotNombre: "Entrada Noche", slotIndex: 0 };
  }
  // Slot 2: Salida Noche (21:30 +- 30 min) -> a partir de las 20:30 en adelante (20:30 a 23:59)
  return { tipoEvento: "SALIDA", slotNombre: "Salida Noche", slotIndex: 1 };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let employeeId: string | null = null;
    let employeeName: string | null = null;
    let pictureUrl: string | null = null;
    let imageBuffer: Buffer | null = null;
    let imageMimeType: string = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await req.formData();

        for (const [key, value] of Array.from(formData.entries())) {
          const lowerKey = key.toLowerCase();

          if (typeof value === "string") {
            if (lowerKey === "employeeno" || lowerKey === "employeenostring" || lowerKey === "employee_id" || lowerKey === "cardno") {
              if (value.trim() && value !== "0" && value !== "null") employeeId = value.trim();
            } else if (lowerKey === "name" || lowerKey === "employeename" || lowerKey === "employee_name" || lowerKey === "username") {
              if (value.trim() && value !== "null" && value !== "Personal Registrado") employeeName = value.trim();
            } else if (value.startsWith("data:image/")) {
              const base64Data = value.split(",")[1];
              imageBuffer = Buffer.from(base64Data, "base64");
            } else if (value.trim().startsWith("{") || lowerKey.includes("event") || lowerKey.includes("log")) {
              try {
                const parsed = JSON.parse(value);
                const event = parsed.AccessControllerEvent || parsed.EventNotificationAlert || parsed.event_log || parsed;

                const extractedId = event.employeeNoString || event.employeeNo || event.employee_id || event.CardNo || event.cardNo;
                if (extractedId && String(extractedId).trim() && extractedId !== "0") {
                  employeeId = String(extractedId).trim();
                }

                const extractedName = event.name || event.employee_name || event.employeeName || event.userName || event.personName;
                if (extractedName && String(extractedName).trim() && extractedName !== "null" && extractedName !== "Personal Registrado") {
                  employeeName = String(extractedName).trim();
                }

                if (event.pictureBase64 || event.faceImage) {
                  const b64 = (event.pictureBase64 || event.faceImage).replace(/^data:image\/\w+;base64,/, "");
                  imageBuffer = Buffer.from(b64, "base64");
                }
              } catch {
                const matchId = value.match(/"(?:employeeNoString|employeeNo|employee_id|cardNo)"\s*:\s*"([^"]+)"/i);
                const matchName = value.match(/"(?:name|employee_name|employeeName|userName|personName)"\s*:\s*"([^"]+)"/i);
                if (matchId && matchId[1] !== "0") employeeId = matchId[1].trim();
                if (matchName && matchName[1] !== "null" && matchName[1] !== "Personal Registrado") employeeName = matchName[1].trim();
              }
            }
          } else {
            const fileBlob = value as Blob;
            const isImage = fileBlob.type?.startsWith("image/") || lowerKey.includes("picture") || lowerKey.includes("face") || lowerKey.includes("snap") || lowerKey.includes("image");
            if (isImage) {
              const arrayBuffer = await fileBlob.arrayBuffer();
              imageBuffer = Buffer.from(arrayBuffer);
              imageMimeType = fileBlob.type || "image/jpeg";
            }
          }
        }
      } catch (err) {
        console.warn("Error procesando formData:", err);
      }
    } else {
      try {
        const rawBody = await req.text();
        const data = JSON.parse(rawBody);
        const event = data.AccessControllerEvent || data.EventNotificationAlert || data.event_log || data;
        const extractedId = event.employeeNoString || event.employeeNo || event.employee_id || event.CardNo || data.employeeNo;
        if (extractedId && String(extractedId).trim() && extractedId !== "0") {
          employeeId = String(extractedId).trim();
        }

        const extractedName = event.name || event.employee_name || event.employeeName || event.userName || data.name;
        if (extractedName && String(extractedName).trim() && extractedName !== "null" && extractedName !== "Personal Registrado") {
          employeeName = String(extractedName).trim();
        }

        if (event.pictureBase64 || event.faceImage || data.pictureBase64) {
          const b64 = (event.pictureBase64 || event.faceImage || data.pictureBase64).replace(/^data:image\/\w+;base64,/, "");
          imageBuffer = Buffer.from(b64, "base64");
        }
      } catch {
        // Ignorar
      }
    }

    // Filtrar ruido y heartbeats
    if (!employeeId || employeeId.startsWith("DEV-") || employeeId === "0" || employeeId === "null") {
      return NextResponse.json({ statusCode: 1, statusString: "Ignored Heartbeat" }, { status: 200 });
    }

    // Normalizar DNI (ej: O7951959 -> 07951959, 7951959 -> 07951959)
    const normalizedEmployeeId = normalizeDNI(employeeId);

    // Buscar nombre del docente en el padrón institucional UNHEVAL
    if (!employeeName || employeeName === "Personal Registrado" || employeeName === "Desconocido") {
      const foundDocente = UNHEVAL_DOCENTES_DATA.find((d) => matchDNI(d.employee_id, normalizedEmployeeId));
      if (foundDocente) {
        employeeName = foundDocente.name;
      }
    }

    const finalName = employeeName && employeeName !== "Personal Registrado" && employeeName !== "Desconocido"
      ? employeeName
      : `Docente ${normalizedEmployeeId}`;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // Clasificar según la hora actual (+- 30 min de tolerancia de salida/entrada)
    let { tipoEvento, slotNombre } = clasificarMarcacionPorHorario(now);

    // Obtener marcaciones de hoy para anti-rebote (3 min) y detección de salida
    const { data: todayLogs } = await supabase
      .from("access_logs")
      .select("*")
      .or(`employee_id.eq.${normalizedEmployeeId},employee_id.eq.${employeeId}`)
      .gte("timestamp", startOfToday)
      .order("timestamp", { ascending: false });

    if (todayLogs && todayLogs.length > 0) {
      const lastLog = todayLogs[0];
      const lastLogTime = new Date(lastLog.timestamp).getTime();
      const diffMinutes = (now.getTime() - lastLogTime) / (1000 * 60);

      // Anti-rebote: Si marcó hace menos de 2 minutos, ignorar el segundo pase inmediato
      if (diffMinutes < 2) {
        console.log(`[DOBLE MARCAJE IGNORADO] ${finalName} (ID: ${normalizedEmployeeId}) marcó hace ${Math.round(diffMinutes * 60)}s.`);
        return NextResponse.json({ statusCode: 1, statusString: "Ignored Duplicate (Anti-rebound)" }, { status: 200 });
      }
    }

    // Subir foto a Supabase Storage
    if (imageBuffer && imageBuffer.length > 0) {
      try {
        const fileName = `captures/${Date.now()}_${normalizedEmployeeId}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("access-captures")
          .upload(fileName, imageBuffer, {
            contentType: imageMimeType,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: publicUrlData } = supabase.storage
            .from("access-captures")
            .getPublicUrl(fileName);

          pictureUrl = publicUrlData?.publicUrl || null;
        }
      } catch (storageErr) {
        console.error("Error subiendo foto:", storageErr);
      }
    }

    // Guardar registro con DNI normalizado de 8 dígitos
    const insertPayload: Record<string, unknown> = {
      employee_id: normalizedEmployeeId,
      employee_name: finalName,
      picture_url: pictureUrl,
      timestamp: now.toISOString(),
      tipo_evento: tipoEvento,
    };

    const { error: dbError } = await supabase.from("access_logs").insert([insertPayload]);

    if (dbError) {
      delete insertPayload.tipo_evento;
      await supabase.from("access_logs").insert([insertPayload]);
    }

    console.log(`[${tipoEvento} - ${slotNombre}]: ${finalName} (ID: ${employeeId}) a las ${now.toLocaleTimeString()}`);
    return NextResponse.json({
      statusCode: 1,
      statusString: "OK",
      eventType: tipoEvento,
      slot: slotNombre,
    }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error en route hikvision:", err);
    return NextResponse.json({ statusCode: 1, statusString: "OK" }, { status: 200 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("access_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json({ success: false, logs: [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, logs: data || [] }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, logs: [] }, { status: 200 });
  }
}
