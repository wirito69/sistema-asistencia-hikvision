const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

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

async function main() {
  console.log('=== 1. DATOS EN CONFIG/DOCENTES.JSON EN SUPABASE STORAGE ===');
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  const docentes = JSON.parse(await fileBlob.text());

  const galimbertiList = docentes.filter(d => d.employee_id === '23944821' || d.name?.toUpperCase().includes('GALIMBERTI'));
  console.log('Docentes Galimberti:', JSON.stringify(galimbertiList, null, 2));

  console.log('\n=== 2. HISTORIAL DE ASIGNACIONES (GRUPOS) ===');
  const { data: histBlob } = await supabase.storage.from('access-captures').download('config/historial_asignaciones.json');
  if (histBlob) {
    const hist = JSON.parse(await histBlob.text());
    const gHist = hist.filter(h => h.employee_id === '23944821');
    console.log('Historial Galimberti:', JSON.stringify(gHist, null, 2));
  } else {
    console.log('No historial blob');
  }

  console.log('\n=== 3. MARCACIONES EN SUPABASE ACCESS_LOGS ===');
  const { data: logs } = await supabase.from('access_logs')
    .select('*')
    .eq('employee_id', '23944821')
    .order('timestamp', { ascending: false });
  console.log(`Total logs en BD para 23944821: ${logs ? logs.length : 0}`);
  if (logs) console.table(logs.slice(0, 15));

  console.log('\n=== 4. BUSCANDO EN CÁMARA EVENTOS DE 23944821 ===');
  const body = JSON.stringify({
    AcsEventCond: {
      searchID: 'galimberti_' + Date.now(),
      searchResultPosition: 0,
      maxResults: 100,
      major: 5,
      minor: 75,
      startTime: '2026-09-01T00:00:00-05:00',
      endTime: '2026-09-15T23:59:59-05:00'
    }
  });
  const res = await isapiRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', body);
  try {
    const json = JSON.parse(res.data);
    const list = (json.AcsEvent?.InfoList || []).filter(e => e.employeeNoString === '23944821' || (e.name && e.name.toUpperCase().includes('GALIMBERTI')));
    console.log(`Eventos en cámara desde 01/09: ${list.length}`);
    console.table(list.map(e => ({ hora: e.time, dni: e.employeeNoString, nombre: e.name })));
  } catch(e) {
    console.error('Error parseando eventos de cámara:', e);
  }
}

main().catch(console.error);