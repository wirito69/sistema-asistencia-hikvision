const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function normalizeDNI(dni) {
  if (!dni) return '';
  let s = String(dni).trim();
  s = s.replace(/^[oO]/, '0').replace(/[^0-9a-zA-Z]/g, '');
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, '0');
  }
  return s;
}

async function analyzeToday() {
  const { data: logs, error } = await supabase
    .from('access_logs')
    .select('*')
    .gte('timestamp', '2026-09-12T00:00:00.000Z')
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching logs:', error);
    return;
  }

  console.log(`Total registros encontrados hoy (12 de Septiembre): ${logs.length}`);

  const byTeacher = {};
  logs.forEach(l => {
    const norm = normalizeDNI(l.employee_id);
    if (!byTeacher[norm]) byTeacher[norm] = [];
    byTeacher[norm].push(l);
  });

  const duplicateIdsToDelete = [];
  const validRecords = [];

  Object.entries(byTeacher).forEach(([dni, records]) => {
    // Si tiene más de 1 marcación en el mismo turno/slot de la mañana (ej: entre 6:00 AM y 11:00 AM)
    // Mantener la primera o la que tenga foto
    const morningRecords = records.filter(r => {
      const d = new Date(r.timestamp);
      const peruHour = d.getUTCHours() - 5; // o toLocaleTimeString
      return r.tipo_evento === 'ENTRADA';
    });

    if (morningRecords.length > 1) {
      console.log(`\nDocente con duplicados: ${records[0].employee_name} (DNI: ${dni}) -> ${morningRecords.length} entradas:`);
      morningRecords.forEach(r => {
        const hPeru = new Date(r.timestamp).toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
        console.log(`   ID: ${r.id} | Hora: ${hPeru} | Foto: ${!!r.picture_url} | URL: ${r.picture_url ? r.picture_url.slice(-30) : 'none'}`);
      });

      // Escoger el mejor registro (el que tenga foto y menor ID / hora original)
      // Ordenar: primero con foto, luego por timestamp ascendente
      const sorted = [...morningRecords].sort((a, b) => {
        if (a.picture_url && !b.picture_url) return -1;
        if (!a.picture_url && b.picture_url) return 1;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });

      const keepRecord = sorted[0];
      const dupes = sorted.slice(1);

      console.log(`   -> Conservar ID: ${keepRecord.id}`);
      dupes.forEach(d => {
        console.log(`   -> Eliminar duplicado ID: ${d.id}`);
        duplicateIdsToDelete.push(d.id);
      });
    }
  });

  console.log(`\nTotal IDs duplicados identificados para eliminar: ${duplicateIdsToDelete.length}`);
  return duplicateIdsToDelete;
}

analyzeToday();
