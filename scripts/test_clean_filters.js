const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function testFilters() {
  console.log('=== TEST 1: REPORTE FILTRADO POR SÁBADOS (tipo_horario=sd) ===');
  const sdData = await fetchJson('http://localhost:8080/api/reportes?fecha_inicio=2026-09-01&fecha_fin=2026-09-15&tipo_horario=sd&q=galimberti');
  const sdDays = Array.from(new Set(sdData.detalle.map(d => `${d.fecha} (${d.dia_semana})`)));
  console.log('Días devueltos en filtro Sábados:', sdDays);
  console.table(sdData.detalle.map(d => ({
    Fecha: d.fecha,
    Dia: d.dia_semana,
    Docente: d.docente,
    EntradaM: d.hora_entrada_m,
    SalidaM: d.hora_salida_m,
    EntradaT: d.hora_entrada_t,
    SalidaT: d.hora_salida_t,
    Estado: d.badge_estado
  })));

  console.log('\n=== TEST 2: REPORTE FILTRADO POR L-M-V (tipo_horario=lmv) ===');
  const lmvData = await fetchJson('http://localhost:8080/api/reportes?fecha_inicio=2026-09-01&fecha_fin=2026-09-15&tipo_horario=lmv&q=galimberti');
  const lmvDays = Array.from(new Set(lmvData.detalle.map(d => `${d.fecha} (${d.dia_semana})`)));
  console.log('Días devueltos en filtro L-M-V:', lmvDays);
  console.table(lmvData.detalle.map(d => ({
    Fecha: d.fecha,
    Dia: d.dia_semana,
    Docente: d.docente,
    EntradaNoche: d.hora_entrada,
    SalidaNoche: d.hora_salida,
    Estado: d.badge_estado
  })));
}

testFilters().catch(console.error);