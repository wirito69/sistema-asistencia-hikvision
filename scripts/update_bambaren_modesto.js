const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function updateDocentes() {
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  let docentes = JSON.parse(await fileBlob.text());

  // 1. Asignar Bambarén a Fin de Semana
  let bambarenUpdated = false;
  docentes.forEach(d => {
    if (d.name?.toUpperCase().includes('BAMBAREN') || d.employee_id === '43183838') {
      d.tipo_horario = 'Fin de Semana';
      bambarenUpdated = true;
      console.log(`✅ [BAMBAREN ASIGNADO A SÁBADOS]: ${d.name} (${d.employee_id}) -> ${d.tipo_horario}`);
    }
  });

  if (!bambarenUpdated) {
    docentes.push({
      aula: "Posgrado UNHEVAL",
      employee_id: "43183838",
      name: "LUIS ALBERTO BAMBAREN MATA",
      curso: "Docente de Posgrado",
      teams: "TEAMS-43183838",
      modalidad: "Presencial",
      tipo_horario: "Fin de Semana",
      cargo: "Docente"
    });
    console.log('✅ Bambarén añadido a Fin de Semana.');
  }

  // 2. Asegurar David Abel Nieto Modesto a Fin de Semana
  docentes.forEach(d => {
    if (d.name?.toUpperCase().includes('MODESTO') || d.name?.toUpperCase().includes('NIETO') || d.employee_id === '09532543' || d.employee_id === 'O9532543') {
      d.tipo_horario = 'Fin de Semana';
      console.log(`✅ [NIETO MODESTO ASIGNADO A SÁBADOS]: ${d.name} (${d.employee_id}) -> ${d.tipo_horario}`);
    }
  });

  const payloadBuffer = Buffer.from(JSON.stringify(docentes, null, 2), 'utf8');
  await supabase.storage.from('access-captures').upload('config/docentes.json', payloadBuffer, {
    contentType: 'application/json',
    upsert: true
  });
  console.log('✅ Supabase config/docentes.json guardado con éxito.');
}

updateDocentes().catch(console.error);