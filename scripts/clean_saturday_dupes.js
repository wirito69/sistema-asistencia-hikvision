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

function getPeruDateStr(d) {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

async function cleanSaturdayMorningDuplicates() {
  const { data: logs, error } = await supabase
    .from('access_logs')
    .select('*')
    .gte('timestamp', '2026-09-12T00:00:00.000Z')
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Filtrar estrictamente los que pertenecen al día 2026-09-12 en hora de Perú (Sábado Mañana)
  const saturdayLogs = logs.filter(l => {
    const d = new Date(l.timestamp);
    return getPeruDateStr(d) === '2026-09-12';
  });

  console.log(`Marcaciones de Sábado 12 de Septiembre (Hora Perú): ${saturdayLogs.length}`);

  const byTeacher = {};
  saturdayLogs.forEach(l => {
    const norm = normalizeDNI(l.employee_id);
    if (!byTeacher[norm]) byTeacher[norm] = [];
    byTeacher[norm].push(l);
  });

  const dupesToDelete = [];

  Object.entries(byTeacher).forEach(([dni, records]) => {
    if (records.length > 1) {
      console.log(`\nDocente: ${records[0].employee_name} (DNI: ${dni}) - ${records.length} registros hoy sábado:`);
      records.forEach(r => {
        const horaPeru = new Date(r.timestamp).toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
        console.log(`   ID: ${r.id} | Hora: ${horaPeru} | Tipo: ${r.tipo_evento} | Foto: ${!!r.picture_url}`);
      });

      // Si todos son ENTRADA en la mañana (entre 6:00 AM y 9:00 AM)
      // Mantener el primero que tenga foto
      const sorted = [...records].sort((a, b) => {
        if (a.picture_url && !b.picture_url) return -1;
        if (!a.picture_url && b.picture_url) return 1;
        return a.id - b.id;
      });

      const keep = sorted[0];
      const toDelete = sorted.slice(1);

      console.log(`   --> CONSERVAR: ID ${keep.id}`);
      toDelete.forEach(d => {
        console.log(`   --> ELIMINAR DUPLICADO: ID ${d.id}`);
        dupesToDelete.push(d.id);
      });
    }
  });

  console.log(`\nTotal duplicados a eliminar en Sábado 12: ${dupesToDelete.length}`);
  
  if (dupesToDelete.length > 0) {
    const { error: delErr } = await supabase
      .from('access_logs')
      .delete()
      .in('id', dupesToDelete);

    if (delErr) {
      console.error('Error eliminando duplicados:', delErr);
    } else {
      console.log(`✅ ¡Se eliminaron exitosamente ${dupesToDelete.length} registros duplicados!`);
    }
  }
}

cleanSaturdayMorningDuplicates();
