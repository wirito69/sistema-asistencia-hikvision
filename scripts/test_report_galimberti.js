const http = require('http');

http.get('http://localhost:8080/api/reportes?fecha_inicio=2026-09-01&fecha_fin=2026-09-15&q=galimberti', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(data);
      console.log('Reporte Galimberti:');
      console.log('Consolidado:', JSON.stringify(j.consolidado, null, 2));
      console.log('Detalle días:');
      console.table((j.detalle || []).map(d => ({
        Fecha: d.fecha,
        Dia: d.dia_semana,
        Turno: d.tipo_horario,
        Entrada: d.hora_entrada || d.hora_entrada_m,
        Salida: d.hora_salida || d.hora_salida_t,
        Estado: d.estado,
        Badge: d.badge_estado
      })));
    } catch(e) { console.error(e, data); }
  });
}).on('error', console.error);