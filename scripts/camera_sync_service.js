const crypto = require('crypto');
const http = require('http');
const path = require('path');
const fs = require('fs');

const workspaceDir = __dirname ? path.resolve(__dirname, '..') : process.cwd();
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(workspaceDir, '.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split(/\r?\n/).forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  });
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://ttadifnnamibraysbrbm.supabase.co';
const SUPABASE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  Buffer.from('c2Jfc2VjcmV0XzNnSklqcjdoeTRpS2M0RXhGSXBDendfb2xEWWtBaDA=', 'base64').toString('utf-8');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const IP = env.HIKVISION_IP || '172.16.80.12';
const USER = env.HIKVISION_USER || 'admin';
const PASS = env.HIKVISION_PASS || 'Inf2026@';

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
        timeout: 10000
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

function fetchPhotoBufferFromCamera(picUri) {
  return new Promise((resolve) => {
    let cleanUri = picUri;
    if (cleanUri.startsWith('http://') || cleanUri.startsWith('https://')) {
      try {
        const u = new URL(cleanUri);
        cleanUri = u.pathname + u.search;
      } catch (e) {}
    }

    const doReq = (authHeader = null) => {
      const headers = {};
      if (authHeader) headers['Authorization'] = authHeader;

      const req = http.request({
        host: IP,
        port: 80,
        path: cleanUri,
        method: 'GET',
        headers,
        timeout: 12000
      }, (res) => {
        if (res.statusCode === 401 && !authHeader && res.headers['www-authenticate']) {
          const digest = getDigestAuth('GET', cleanUri, USER, PASS, res.headers['www-authenticate']);
          return doReq(digest);
        }

        if (res.statusCode !== 200) {
          return resolve(null);
        }

        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const startIdx = buffer.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]));
          if (startIdx !== -1) {
            const endIdx = buffer.lastIndexOf(Buffer.from([0xFF, 0xD9]));
            if (endIdx !== -1 && endIdx > startIdx) {
              return resolve(buffer.subarray(startIdx, endIdx + 2));
            }
            return resolve(buffer.subarray(startIdx));
          }
          resolve(buffer);
        });
      });

      req.on('error', () => resolve(null));
      req.end();
    };

    doReq();
  });
}

function clasificarMarcacionPorHorario(d) {
  const peruTimeStr = d.toLocaleTimeString('en-US', { timeZone: 'America/Lima', hour12: false });
  const [hStr, mStr] = peruTimeStr.split(':');
  const timeNum = parseInt(hStr, 10) + parseInt(mStr, 10) / 60;

  const peruDateStr = d.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
  const [pY, pM, pD] = peruDateStr.split('-').map(Number);
  const day = new Date(pY, pM - 1, pD, 12, 0, 0).getDay();

  if (day === 6) {
    if (timeNum < 11.0) return 'ENTRADA';
    if (timeNum >= 11.0 && timeNum < 14.5) return 'SALIDA';
    if (timeNum >= 14.5 && timeNum < 17.5) return 'ENTRADA';
    return 'SALIDA';
  }

  if (timeNum < 20.3) return 'ENTRADA';
  return 'SALIDA';
}

function getPeruDateOnly(d = new Date()) {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

let syncCount = 0;

async function syncCycle() {
  try {
    const now = new Date();
    const todayPeru = getPeruDateOnly(now);
    
    const startIso = `${todayPeru}T00:00:00-05:00`;
    const endIso = `${todayPeru}T23:59:59-05:00`;

    const body = JSON.stringify({
      AcsEventCond: {
        searchID: "live_" + Date.now(),
        searchResultPosition: 0,
        maxResults: 150,
        major: 5,
        minor: 75,
        startTime: startIso,
        endTime: endIso
      }
    });

    const res = await isapiRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', body);
    if (res.status !== 200) {
      console.warn(`[SYNC] Respuesta no 200 de Hikvision: ${res.status}`);
      return;
    }

    const json = JSON.parse(res.data);
    const events = json.AcsEvent?.InfoList || [];
    syncCount++;

    if (events.length === 0) {
      if (syncCount % 12 === 0) {
        console.log(`[SYNC ${new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })}] Sin nuevos eventos en terminal (${events.length} hoy)`);
      }
      return;
    }

    const { data: existingLogs, error: dbErr } = await supabase
      .from('access_logs')
      .select('id, employee_id, timestamp, picture_url')
      .gte('timestamp', `${todayPeru}T00:00:00.000Z`);

    if (dbErr) {
      console.error('[SYNC] Error al consultar Supabase:', dbErr.message);
      return;
    }

    const existingMap = new Map();
    (existingLogs || []).forEach(log => {
      const dni = normalizeDNI(log.employee_id);
      const t = new Date(log.timestamp).getTime();
      const minBucket = Math.round(t / 60000);
      existingMap.set(`${dni}_${minBucket}`, log);
      existingMap.set(`${dni}_${minBucket - 1}`, log);
      existingMap.set(`${dni}_${minBucket + 1}`, log);
    });

    let newInserted = 0;

    for (const ev of events) {
      const rawDni = ev.employeeNoString || '';
      const dni = normalizeDNI(rawDni);
      if (!dni || dni === '0') continue;

      const eventDate = new Date(ev.time);
      const eventTimestamp = eventDate.getTime();
      const minBucket = Math.round(eventTimestamp / 60000);
      const key = `${dni}_${minBucket}`;

      let logRecord = existingMap.get(key);
      let pictureUrl = logRecord?.picture_url || null;

      if (!pictureUrl && ev.pictureURL) {
        try {
          const photoBuffer = await fetchPhotoBufferFromCamera(ev.pictureURL);
          if (photoBuffer && photoBuffer.length > 0) {
            const fileName = `captures/${eventTimestamp}_${dni}.jpg`;
            const { error: upErr } = await supabase.storage
              .from('access-captures')
              .upload(fileName, photoBuffer, {
                contentType: 'image/jpeg',
                upsert: true,
              });

            if (!upErr) {
              pictureUrl = `${SUPABASE_URL}/storage/v1/object/public/access-captures/${fileName}`;
            }
          }
        } catch (e) {
          console.warn(`[FOTO] Error subiendo foto DNI ${dni}:`, e.message);
        }
      }

      if (!logRecord) {
        const tipo = clasificarMarcacionPorHorario(eventDate);
        const peruTimeFormatted = eventDate.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
        console.log(`⚡ [NUEVA ASISTENCIA] ${peruTimeFormatted} | DNI: ${dni} | ${ev.name} | Tipo: ${tipo} | Foto: ${pictureUrl ? 'OK' : 'NO'}`);

        const { data: inserted, error: insErr } = await supabase.from('access_logs').insert({
          employee_id: dni,
          employee_name: ev.name || 'Docente Registrado',
          tipo_evento: tipo,
          picture_url: pictureUrl,
          timestamp: eventDate.toISOString()
        }).select('id').single();

        if (inserted) {
          existingMap.set(key, { id: inserted.id, picture_url: pictureUrl });
          existingMap.set(`${dni}_${minBucket - 1}`, { id: inserted.id, picture_url: pictureUrl });
          existingMap.set(`${dni}_${minBucket + 1}`, { id: inserted.id, picture_url: pictureUrl });
          newInserted++;
        }
        if (insErr) {
          console.error('[SYNC] Error al insertar marcación:', insErr.message);
        }
      } else if (!logRecord.picture_url && pictureUrl) {
        await supabase.from('access_logs').update({ picture_url: pictureUrl }).eq('id', logRecord.id);
        logRecord.picture_url = pictureUrl;
        console.log(`📷 [FOTO ACTUALIZADA] DNI: ${dni} | ${pictureUrl}`);
      }
    }

    if (newInserted > 0) {
      console.log(`✅ [SYNC] Se sincronizaron exitosamente ${newInserted} nuevas marcaciones en Supabase Cloud.`);
    }
  } catch (err) {
    console.error('❌ Error en ciclo de sync:', err.message);
  }
}

async function startDaemon() {
  console.log('🚀 DEMONIO DE SINCRONIZACIÓN AUTOMÁTICA HIKVISION INICIADO (Cada 5s)');
  console.log(`📍 IP Terminal: ${IP} | Nube: ${SUPABASE_URL}`);
  await syncCycle();
  setInterval(syncCycle, 5000);
}

startDaemon();
