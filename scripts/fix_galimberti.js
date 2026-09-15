const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixGalimberti() {
  console.log('=== 1. ACTUALIZANDO CONFIG/DOCENTES.JSON ===');
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  let docentes = JSON.parse(await fileBlob.text());

  let found = false;
  docentes.forEach(d => {
    if (d.employee_id === '23944821' || d.name?.toUpperCase().includes('GALIMBERTI')) {
      d.employee_id = '23944821';
      d.name = 'MG. GALIMBERTI OLIVEIRA, MARIA CECILIA';
      d.aula = 'Aula 404';
      d.curso = 'ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA';
      d.teams = '419H 260817 ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA';
      d.modalidad = 'Presencial';
      d.tipo_horario = 'Ambos Horarios';
      d.cargo = 'Docente';
      found = true;
      console.log('✅ Docente Galimberti actualizado a "Ambos Horarios":', d);
    }
  });

  if (!found) {
    docentes.push({
      aula: 'Aula 404',
      employee_id: '23944821',
      name: 'MG. GALIMBERTI OLIVEIRA, MARIA CECILIA',
      curso: 'ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA',
      teams: '419H 260817 ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA',
      modalidad: 'Presencial',
      tipo_horario: 'Ambos Horarios',
      cargo: 'Docente'
    });
    console.log('✅ Docente Galimberti agregado con "Ambos Horarios".');
  }

  // Subir config/docentes.json
  const payloadDocentes = Buffer.from(JSON.stringify(docentes, null, 2), 'utf8');
  await supabase.storage.from('access-captures').upload('config/docentes.json', payloadDocentes, {
    contentType: 'application/json',
    upsert: true
  });
  console.log('✅ config/docentes.json guardado en Supabase Storage.');

  console.log('\n=== 2. ACTUALIZANDO CONFIG/HISTORIAL_ASIGNACIONES.JSON ===');
  let historial = [];
  try {
    const { data: histBlob } = await supabase.storage.from('access-captures').download('config/historial_asignaciones.json');
    if (histBlob) historial = JSON.parse(await histBlob.text());
  } catch (e) {}

  // Agregar asignaciones históricas para Galimberti
  // Grupo LMV (Agosto - Septiembre 2026)
  const existsLMV = historial.some(h => h.employee_id === '23944821' && h.grupo_nombre?.includes('LMV'));
  if (!existsLMV) {
    historial.push({
      grupo_id: 'grupo_lmv_agosto_sept_2026',
      grupo_nombre: 'Grupo L-M-V (Agosto - Septiembre 2026)',
      fecha_inicio: '2026-08-17',
      fecha_fin: '2026-09-30',
      target_schedule: 'Entre Semana',
      employee_id: '23944821',
      name: 'MG. GALIMBERTI OLIVEIRA, MARIA CECILIA',
      aula: 'Aula 404',
      curso: 'ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA',
      modalidad: 'Presencial',
      tipo_horario: 'Ambos Horarios',
      created_at: new Date().toISOString()
    });
  }

  // Grupo Sábados (Agosto - Septiembre 2026)
  const existsSD = historial.some(h => h.employee_id === '23944821' && (h.grupo_nombre?.includes('Sábado') || h.grupo_nombre?.includes('Fin de Semana')));
  if (!existsSD) {
    historial.push({
      grupo_id: 'grupo_sabados_agosto_sept_2026',
      grupo_nombre: 'Grupo Sábados (Agosto - Septiembre 2026)',
      fecha_inicio: '2026-08-01',
      fecha_fin: '2026-09-30',
      target_schedule: 'Fin de Semana',
      employee_id: '23944821',
      name: 'MG. GALIMBERTI OLIVEIRA, MARIA CECILIA',
      aula: 'Aula 404',
      curso: 'ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA',
      modalidad: 'Presencial',
      tipo_horario: 'Ambos Horarios',
      created_at: new Date().toISOString()
    });
  }

  const payloadHist = Buffer.from(JSON.stringify(historial, null, 2), 'utf8');
  await supabase.storage.from('access-captures').upload('config/historial_asignaciones.json', payloadHist, {
    contentType: 'application/json',
    upsert: true
  });
  console.log('✅ config/historial_asignaciones.json guardado en Supabase Storage.');
}

fixGalimberti().catch(console.error);