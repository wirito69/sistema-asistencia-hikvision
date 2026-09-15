const crypto = require('crypto');
const http = require('http');
const path = require('path');
const fs = require('fs');

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const IP = '172.16.80.12';
const USER = 'admin';
const PASS = 'Inf2026@';

function normalizeDNI(dni) {
  if (!dni) return '';
  let s = String(dni).trim();
  s = s.replace(/^[oO]/, '0').replace(/[^0-9a-zA-Z]/g, '');
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, '0');
  }
  return s;
}

function parseDigest(header) {
  const params = {};
  const regex = /(\w+)=(?:"([^"]+)"|([^\s,]+))/g;
  let match;
  while ((match = regex.exec(header)) !== null) {
    params[match[1]] = match[2] || match[3];
  }
  return params;
}

function getDigestAuth(method, uri, user, pass, authHeader) {
  const p = parseDigest(authHeader);
  const realm = p.realm || '';
  const nonce = p.nonce || '';
  const qop = p.qop;
  const nc = '00000001';
  const cnonce = crypto.randomBytes(8).toString('hex');

  const ha1 = crypto.createHash('md5').update(user + ':' + realm + ':' + pass).digest('hex');
  const ha2 = crypto.createHash('md5').update(method + ':' + uri).digest('hex');
  let response;
  if (qop === 'auth') {
    response = crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2).digest('hex');
  } else {
    response = crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + ha2).digest('hex');
  }

  let header = `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
  if (p.opaque) header += `, opaque="${p.opaque}"`;
  if (qop) header += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
  return header;
}

function isapiRequest(method, uri, body = null) {
  return new Promise((resolve, reject) => {
    const doReq = (authHeader = null) => {
      const headers = { 'Content-Type': 'application/json' };
      if (authHeader) headers['Authorization'] = authHeader;
      if (body) headers['Content-Length'] = Buffer.byteLength(body);

      const req = http.request({
        host: IP,
        port: 80,
        path: uri,
        method,
        headers,
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 401 && !authHeader && res.headers['www-authenticate']) {
            const digest = getDigestAuth(method, uri, USER, PASS, res.headers['www-authenticate']);
            return doReq(digest);
          }
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Hikvision timeout (8s)'));
      });
      if (body) req.write(body);
      req.end();
    };

    doReq();
  });
}

async function fixAndSync() {
  console.log('=== ACTUALIZANDO DNI DE DOCENTES CON LA LISTA REAL DE LA CÁMARA ===');
  
  // 1. Descargar config/docentes.json
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  const docentes = JSON.parse(await fileBlob.text());

  // Mapeo de correcciones exactas basadas en la cámara Hikvision
  const dniCameraMap = {
    'ELIZABETH YUDI LEIVA CORDOVA': '20721793',
    'DRA. LEIVA CORDOVA, ELIZABETH YUDI': '20721793',
    'CARLOS FLORENCIO ROSAS LUCAS': '44758332',
    'MAG. ROSAS LUCAS, CARLOS FLORENCIO': '44758332',
    'DIEGO EYUP BETETA AMANCIO': '48142674',
    'MAG. BETETA AMANCIO, DIEGO EYUP': '48142674',
    'RICARDO JUAN SEGOVIA CAPCHA': '22436363',
    'DR. SEGOVIA CAPCHA, RICARDO JUAN': '22436363',
    'RENZO FABRIZZIO MALPARTIDA JIMENEZ': '73058959',
    'MG. MALPARTIDA JIMENEZ, RENZO FABRIZZIO': '73058959',
    'WALTER FRANCISCO MENDOZA JAIME': '04060522',
    'MG. MENDOZA JAIME, WALTER FRANCISCO': '04060522',
    'ALFREDO CRUZ AMBROSIO': '22734259',
    'DR. CRUZ AMBROSIO, ALFREDO': '22734259',
    'VLADIMIR HAMILTON SANTIAGO ESPINOZA': '41815735',
    'MAG. SANTIAGO ESPINOZA, VLADIMIR HAMILTON': '41815735',
    'JORGE ERNESTO ROMERO VELA': '07327108',
    'MG. ROMERO VELA, JORGE ERNESTO': '07327108'
  };

  let updatedCount = 0;
  docentes.forEach(d => {
    for (const [nombreKey, realDni] of Object.entries(dniCameraMap)) {
      if (d.name.toUpperCase().includes(nombreKey.toUpperCase()) || nombreKey.toUpperCase().includes(d.name.toUpperCase())) {
        if (d.employee_id !== realDni) {
          console.log(`🔄 Corrigiendo DNI para [${d.name}]: "${d.employee_id}" -> "${realDni}"`);
          d.employee_id = realDni;
          d.teams = `TEAMS-${realDni}`;
          updatedCount++;
        }
      }
    }
  });

  console.log(`Total docentes corregidos: ${updatedCount}`);

  // Subir de vuelta a Supabase Storage
  const payloadBuffer = Buffer.from(JSON.stringify(docentes, null, 2), 'utf8');
  await supabase.storage.from('access-captures').upload('config/docentes.json', payloadBuffer, {
    contentType: 'application/json',
    upsert: true
  });
  console.log('✅ config/docentes.json actualizado en Supabase Storage.');

  // 2. Traer todos los eventos de la cámara de hoy (2026-09-14)
  console.log('\n=== FORZANDO RE-SINCRONIZACIÓN DE TODOS LOS EVENTOS DE HOY ===');
  let pos = 0;
  let totalMatches = 1;
  const allEvents = [];
  while (pos < totalMatches) {
    const body = JSON.stringify({
      AcsEventCond: {
        searchID: "resync_" + Date.now(),
        searchResultPosition: pos,
        maxResults: 50,
        major: 5,
        minor: 75,
        startTime: '2026-09-14T17:00:00-05:00',
        endTime: '2026-09-14T23:59:59-05:00'
      }
    });
    const res = await isapiRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', body);
    const json = JSON.parse(res.data);
    totalMatches = json.AcsEvent?.totalMatches || 0;
    const list = json.AcsEvent?.InfoList || [];
    if (list.length === 0) break;
    allEvents.push(...list);
    pos += list.length;
    if (pos >= totalMatches) break;
  }
  console.log(`Total eventos obtenidos de cámara: ${allEvents.length}`);

  // Insertar marcaciones en Supabase para los docentes recién corregidos
  let inserted = 0;
  for (const ev of allEvents) {
    const dni = normalizeDNI(ev.employeeNoString);
    if (!dni || dni === '0' || dni === '72123814') continue; // Ignorar Joel o IDs vacíos si aplica

    const eventDate = new Date(ev.time);
    const { data: existing } = await supabase.from('access_logs')
      .select('id')
      .eq('employee_id', dni)
      .gte('timestamp', '2026-09-14T00:00:00.000Z')
      .limit(1);

    if (!existing || existing.length === 0) {
      // Buscar nombre del docente en el padrón
      const matchedDoc = docentes.find(d => normalizeDNI(d.employee_id) === dni);
      const nombreDoc = matchedDoc ? matchedDoc.name : (ev.name || 'Docente');

      await supabase.from('access_logs').insert({
        employee_id: dni,
        employee_name: nombreDoc,
        tipo_evento: 'ENTRADA',
        picture_url: null,
        timestamp: eventDate.toISOString()
      });
      inserted++;
      console.log(`⚡ Insertada asistencia para: [${dni}] ${nombreDoc} a las ${ev.time.substring(11, 19)}`);
    }
  }

  console.log(`\n🎉 Sincronización completada: ${inserted} nuevas asistencias insertadas en la base de datos.`);
}

fixAndSync().catch(console.error);