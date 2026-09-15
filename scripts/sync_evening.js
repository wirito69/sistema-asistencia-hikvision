const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY = Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

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
  let response = crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2).digest('hex');
  return `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}", qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
}

function isapiRequest(method, uri, body = null) {
  return new Promise((resolve, reject) => {
    const doReq = (authHeader = null) => {
      const headers = { 'Content-Type': 'application/json' };
      if (authHeader) headers['Authorization'] = authHeader;
      if (body) headers['Content-Length'] = Buffer.byteLength(body);

      const req = http.request({
        host: IP, port: 80, path: uri, method, headers, timeout: 8000
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
      if (body) req.write(body);
      req.end();
    };
    doReq();
  });
}

async function syncEveningLogs() {
  const { data: fileBlob } = await supabase.storage.from('access-captures').download('config/docentes.json');
  const docentes = JSON.parse(await fileBlob.text());

  // Traer eventos de hoy noche
  const body = JSON.stringify({
    AcsEventCond: {
      searchID: "evening_" + Date.now(),
      searchResultPosition: 0,
      maxResults: 100,
      major: 5,
      minor: 75,
      startTime: '2026-09-14T17:00:00-05:00',
      endTime: '2026-09-14T23:59:59-05:00'
    }
  });
  const res = await isapiRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', body);
  const json = JSON.parse(res.data);
  const events = json.AcsEvent?.InfoList || [];

  let synced = 0;
  for (const ev of events) {
    const dni = normalizeDNI(ev.employeeNoString);
    if (!dni || dni === '0') continue;

    const eventDate = new Date(ev.time);
    const horaLima = eventDate.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });

    // Verificar si ya existe un registro de noche (después de las 17:00)
    const { data: existing } = await supabase.from('access_logs')
      .select('id, timestamp')
      .eq('employee_id', dni)
      .gte('timestamp', '2026-09-14T17:00:00-05:00')
      .limit(1);

    if (!existing || existing.length === 0) {
      const doc = docentes.find(d => normalizeDNI(d.employee_id) === dni);
      const nombre = doc ? doc.name : (ev.name || 'Docente');

      await supabase.from('access_logs').insert({
        employee_id: dni,
        employee_name: nombre,
        tipo_evento: 'ENTRADA',
        picture_url: null,
        timestamp: eventDate.toISOString()
      });
      synced++;
      console.log(`✅ [Noche Sincronizada] ${horaLima} | DNI ${dni} | ${nombre}`);
    }
  }

  console.log(`\nTotal marcaciones de noche aseguradas: ${synced}`);
}

syncEveningLogs().catch(console.error);