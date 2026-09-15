const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

function normalizeDNI(dni) {
  if (!dni) return '';
  let s = String(dni).trim();
  s = s.replace(/^[oO]/, '0').replace(/[^0-9a-zA-Z]/g, '');
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, '0');
  }
  return s;
}

async function verify() {
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  const docentes = JSON.parse(await fileBlob.text());

  const docentesLMV = docentes.filter(d => 
    d.tipo_horario === 'Entre Semana' || 
    d.tipo_horario === 'Ambos Horarios' ||
    (d.aula && d.aula.startsWith('Aula') && d.tipo_horario !== 'Fin de Semana' && d.tipo_horario !== 'Padrón General')
  );

  const { data: dbLogs } = await supabase
    .from('access_logs')
    .select('*')
    .gte('timestamp', '2026-09-14T00:00:00.000Z')
    .order('timestamp', { ascending: true });

  const table = docentesLMV.map(d => {
    const dni = normalizeDNI(d.employee_id);
    const docLogs = (dbLogs || []).filter(l => normalizeDNI(l.employee_id) === dni);
    const horas = docLogs.map(l => new Date(l.timestamp).toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })).join(', ');
    return {
      Aula: d.aula,
      Docente: d.name,
      DNI: d.employee_id,
      Estado: docLogs.length > 0 ? '🟢 PRESENTE' : '🔴 SIN REGISTRO',
      Marcacion_Hoy: horas || '-'
    };
  });

  console.table(table);

  const total = table.length;
  const presentes = table.filter(t => t.Estado.startsWith('🟢')).length;
  const faltas = table.filter(t => t.Estado.startsWith('🔴')).length;

  console.log(`\n======================================================`);
  console.log(`TOTAL DOCENTES PROGRAMADOS LMV: ${total}`);
  console.log(`🟢 ASISTENCIAS CONFIRMADAS HOY: ${presentes}`);
  console.log(`🔴 PENDIENTES / SIN MARCAR: ${faltas}`);
  console.log(`======================================================`);
}

verify().catch(console.error);