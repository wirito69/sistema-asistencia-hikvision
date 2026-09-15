const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const crypto = require('crypto');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IP = '172.16.80.12';
const USER = 'admin';
const PASS = 'Inf2026@';

function parseDigest(header) {
  const params = {};
  const regex = /(\w+)=(?:"([^"]+)"|([^\s,]+))/g;
  let match;
  while ((match = regex.exec(header)) !== null) params[match[1]] = match[2] || match[3];
  return params;
}

function getDigestAuth(method, uri, user, pass, authHeader) {
  const p = parseDigest(authHeader);
  const ha1 = crypto.createHash('md5').update(user + ':' + (p.realm||'') + ':' + pass).digest('hex');
  const ha2 = crypto.createHash('md5').update(method + ':' + uri).digest('hex');
  const nc = '00000001';
  const cnonce = crypto.randomBytes(8).toString('hex');
  const response = crypto.createHash('md5').update(ha1 + ':' + (p.nonce||'') + ':' + nc + ':' + cnonce + ':' + (p.qop||'') + ':' + ha2).digest('hex');
  return `Digest username="${user}", realm="${p.realm||''}", nonce="${p.nonce||''}", uri="${uri}", response="${response}", qop=${p.qop}, nc=${nc}, cnonce="${cnonce}"`;
}

function isapiRequest(method, uri, body = null) {
  return new Promise((resolve, reject) => {
    const doReq = (authHeader = null) => {
      const headers = { 'Content-Type': 'application/json' };
      if (authHeader) headers['Authorization'] = authHeader;
      if (body) headers['Content-Length'] = Buffer.byteLength(body);
      const req = http.request({ host: IP, port: 80, path: uri, method, headers, timeout: 8000 }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => {
          if (res.statusCode === 401 && !authHeader && res.headers['www-authenticate']) {
            return doReq(getDigestAuth(method, uri, USER, PASS, res.headers['www-authenticate']));
          }
          resolve({ status: res.statusCode, data });
        });
      });
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    };
    doReq();
  });
}

async function checkDnis() {
  console.log('=== 1. BUSCANDO EN TODA LA MEMORIA DE HOY DE LA CÁMARA (00:00 A 23:59) ===');
  let pos = 0;
  let allEvents = [];
  while (true) {
    const body = JSON.stringify({
      AcsEventCond: {
        searchID: 'all_' + Date.now(),
        searchResultPosition: pos,
        maxResults: 50,
        major: 5,
        minor: 75,
        startTime: '2026-09-14T00:00:00-05:00',
        endTime: '2026-09-14T23:59:59-05:00'
      }
    });
    const res = await isapiRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', body);
    const json = JSON.parse(res.data);
    const list = json.AcsEvent?.InfoList || [];
    if (list.length === 0) break;
    allEvents.push(...list);
    pos += list.length;
    if (pos >= (json.AcsEvent?.totalMatches || 0)) break;
  }
  console.log('Total eventos en cámara hoy:', allEvents.length);

  const targets = [
    { dni: '04060522', name: 'WALTER FRANCISCO MENDOZA JAIME' },
    { dni: '20721793', name: 'ELIZABETH YUDI LEIVA CORDOVA' },
    { dni: '22435369', name: 'EMIGIDIO RAMOS CORNELIO' },
    { dni: '22418408', name: 'ISIDRO TEODOLFO ENCISO GUTIERREZ' }
  ];

  for (const t of targets) {
    const cleanDni = t.dni.replace(/^0+/, '');
    const camMatch = allEvents.filter(e => 
      e.employeeNoString === t.dni || 
      e.employeeNoString === cleanDni ||
      (e.name && e.name.toUpperCase().includes(t.name.split(' ')[0]))
    );
    console.log(`\n--- [${t.dni}] ${t.name} ---`);
    if (camMatch.length > 0) {
      console.log(`✅ Eventos en cámara hoy:`, camMatch.map(e => `${e.time} | ID: ${e.employeeNoString} | Nombre: ${e.name}`));
    } else {
      console.log(`❌ CERO eventos en cámara hoy (No se paró frente al lente biométrico).`);
    }

    // Buscar en todo el historial histórico de Supabase
    const { data: supaLogs } = await supabase.from('access_logs')
      .select('*')
      .or(`employee_id.eq.${t.dni},employee_id.eq.${cleanDni},employee_name.ilike.%${t.name.split(' ')[0]}%`)
      .order('timestamp', { ascending: false })
      .limit(5);

    if (supaLogs && supaLogs.length > 0) {
      console.log(`Últimos registros históricos en BD:`, supaLogs.map(s => `${s.timestamp} (${s.tipo_evento}) [DNI: ${s.employee_id}]`));
    } else {
      console.log(`Sin registros históricos en BD.`);
    }
  }

  console.log('\n=== 2. VERIFICANDO BAMBAREN Y NIETO MODESTO ===');
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  let docentes = JSON.parse(await fileBlob.text());

  const bambaren = docentes.find(d => d.name?.toUpperCase().includes('BAMBAREN') || d.employee_id === '43183838');
  const modesto = docentes.find(d => d.name?.toUpperCase().includes('MODESTO') || d.name?.toUpperCase().includes('NIETO') || d.employee_id === '09532543' || d.employee_id === 'O9532543');

  console.log('Bambarén actual:', bambaren ? { name: bambaren.name, dni: bambaren.employee_id, horario: bambaren.tipo_horario, aula: bambaren.aula } : 'NO ENCONTRADO');
  console.log('Modesto actual:', modesto ? { name: modesto.name, dni: modesto.employee_id, horario: modesto.tipo_horario, aula: modesto.aula } : 'NO ENCONTRADO');
}

checkDnis().catch(console.error);