import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseDefaults";

const supabase = getSupabaseAdmin();

// Función para determinar el turno según el horario institucional
function getTurnoActual(date: Date = new Date()) {
  const day = date.getDay(); // 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miercoles, 4 = Jueves, 5 = Viernes, 6 = Sabado
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeNum = hours + minutes / 60;

  // Lunes (1), Miércoles (3), Viernes (5) -> 18:00 a 21:30
  if (day === 1 || day === 3 || day === 5) {
    return {
      activo: true,
      nombre: "Turno Noche (18:00 - 21:30)",
      inicio: "18:00",
      salida: "21:30",
      limiteTolerancia: "18:30",
      haComenzado: timeNum >= 18.0,
      fueraDeTolerancia: timeNum >= 18.5,
    };
  }

  // Sábados (6) -> Mañana (07:00 a 14:00) y Tarde (15:00 a 18:30)
  if (day === 6) {
    if (timeNum < 14.5) {
      return {
        activo: true,
        nombre: "Sábado - Turno Mañana (07:00 - 14:00)",
        inicio: "07:00",
        salida: "14:00",
        limiteTolerancia: "07:30",
        haComenzado: timeNum >= 7.0,
        fueraDeTolerancia: timeNum >= 7.5,
      };
    } else {
      return {
        activo: true,
        nombre: "Sábado - Turno Tarde (15:00 - 18:30)",
        inicio: "15:00",
        salida: "18:30",
        limiteTolerancia: "15:30",
        haComenzado: timeNum >= 15.0,
        fueraDeTolerancia: timeNum >= 15.5,
      };
    }
  }

  return {
    activo: false,
    nombre: "Fuera de Horario Institucional",
    inicio: "--",
    salida: "--",
    limiteTolerancia: "--",
    haComenzado: false,
    fueraDeTolerancia: false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone, apikey, customMessage } = body;

    const now = new Date();
    const turno = getTurnoActual(now);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // 1. Obtener padrón de docentes
    const { data: docentes } = await supabase.from("docentes").select("*");
    
    // 2. Obtener marcaciones de hoy
    const { data: logs } = await supabase
      .from("access_logs")
      .select("employee_id, timestamp")
      .gte("timestamp", startOfToday);

    const presentIds = new Set(logs?.map((l) => String(l.employee_id)) || []);
    const totalDocentes = docentes || [];
    const missingDocentes = totalDocentes.filter((d) => !presentIds.has(String(d.employee_id)));

    // Formatear mensaje
    let reportText = customMessage;
    if (!reportText) {
      reportText = `🚨 *ALERTA DE INASISTENCIAS DOCENTES*\n`;
      reportText += `📅 *Fecha:* ${now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}\n`;
      reportText += `⏰ *Hora:* ${now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}\n`;
      reportText += `🏫 *Turno:* ${turno.nombre}\n\n`;
      reportText += `📊 *Asistencia:* ${presentIds.size} / ${totalDocentes.length} (${Math.round((presentIds.size / (totalDocentes.length || 1)) * 100)}%)\n\n`;

      if (missingDocentes.length > 0) {
        reportText += `⚠️ *DOCENTES QUE AÚN NO MARCAN INGRESO:*\n`;
        missingDocentes.forEach((d, i) => {
          reportText += `${i + 1}. ❌ *[ID: ${d.employee_id}]* ${d.name} (${d.cargo || "Docente"})\n`;
        });
      } else {
        reportText += `✅ *¡Todos los docentes han registrado su ingreso puntual!*\n`;
      }
    }

    // Si se configuró CallMeBot (soporta un destinatario o múltiples destinatarios)
    const callMeBotResults = [];
    const recipients: { phone: string; apikey: string }[] = body.recipients || (phone && apikey ? [{ phone, apikey }] : []);

    for (const r of recipients) {
      if (r.phone && r.apikey) {
        try {
          let cleanPhone = r.phone.replace(/[^0-9]/g, "");
          // Si el usuario puso 9 dígitos (ej: 946207347), anteponer 51 (Perú)
          if (cleanPhone.length === 9) {
            cleanPhone = "51" + cleanPhone;
          }

          // Sanitizar y limitar longitud para evitar que CallMeBot descarte el mensaje en cola
          let textToSend = reportText;
          if (textToSend.length > 900) {
            textToSend = textToSend.slice(0, 900) + "\n\n... (Reporte completo en el panel web)";
          }

          const encodedMsg = encodeURIComponent(textToSend);
          const callMeBotUrl = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodedMsg}&apikey=${r.apikey.trim()}`;

          const botRes = await fetch(callMeBotUrl);
          const botText = await botRes.text();
          const isQueued = botText.toLowerCase().includes("queued") || botText.toLowerCase().includes("success");

          callMeBotResults.push({
            phone: cleanPhone,
            status: botRes.status,
            response: botText.replace(/<[^>]*>?/gm, "").trim(),
            isQueued,
          });
        } catch (err: unknown) {
          callMeBotResults.push({ phone: r.phone, error: String(err) });
        }
      }
    }

    return NextResponse.json({
      success: true,
      turno,
      reportText,
      missingCount: missingDocentes.length,
      presentCount: presentIds.size,
      callMeBotResults,
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
