const http = require('http');
const crypto = require('crypto');
const fs = require('fs');

const CAMERA_IP = '172.16.80.12';
const USER = 'admin';
const PASS = 'Unheval2026$';

function digestAuthRequest(method, path, bodyData) {
  return new Promise((resolve, reject) => {
    const initialReq = http.request({
      hostname: CAMERA_IP,
      port: 80,
      path: path,
      method: method,
    }, (res) => {
      if (res.statusCode === 401 && res.headers['www-authenticate']) {
        const authHeader = res.headers['www-authenticate'];
        const realmMatch = authHeader.match(/realm="([^"]+)"/);
        const nonceMatch = authHeader.match(/nonce="([^"]+)"/);
        const qopMatch = authHeader.match(/qop="([^"]+)"/);
        const realm = realmMatch ? realmMatch[1] : '';
        const nonce = nonceMatch ? nonceMatch[1] : '';
        const qop = qopMatch ? qopMatch[1] : '';

        const ha1 = crypto.createHash('md5').update(USER + ':' + realm + ':' + PASS).digest('hex');
        const ha2 = crypto.createHash('md5').update(method + ':' + path).digest('hex');
        const nc = '00000001';
        const cnonce = crypto.randomBytes(8).toString('hex');
        let response;
        let authStr = 'Digest username="' + USER + '", realm="' + realm + '", nonce="' + nonce + '", uri="' + path + '"';

        if (qop) {
          response = crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2).digest('hex');
          authStr += ', qop="' + qop + '", nc=' + nc + ', cnonce="' + cnonce + '", response="' + response + '"';
        } else {
          response = crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + ha2).digest('hex');
          authStr += ', response="' + response + '"';
        }

        const headers = { 'Authorization': authStr };
        if (bodyData) {
          headers['Content-Type'] = 'application/json';
          headers['Content-Length'] = Buffer.byteLength(bodyData);
        }

        const authReq = http.request({
          hostname: CAMERA_IP,
          port: 80,
          path: path,
          method: method,
          headers: headers
        }, (authRes) => {
          let chunks = [];
          authRes.on('data', c => chunks.push(c));
          authRes.on('end', () => {
            resolve({ status: authRes.statusCode, data: Buffer.concat(chunks).toString() });
          });
        });
        authReq.on('error', reject);
        if (bodyData) authReq.write(bodyData);
        authReq.end();
      } else {
        let chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, data: Buffer.concat(chunks).toString() }));
      }
    });
    initialReq.on('error', reject);
    if (bodyData) initialReq.write(bodyData);
    initialReq.end();
  });
}

async function main() {
  console.log('=== 1. OBTENIENDO USUARIOS DE LA CAMARA ===');
  let allUsers = [];
  let pos = 0;
  while (true) {
    const searchBody = JSON.stringify({
      UserInfoSearchCond: {
        searchID: 'audit_' + Date.now(),
        searchResultPosition: pos,
        maxResults: 100
      }
    });
    const res = await digestAuthRequest('POST', '/ISAPI/AccessControl/UserInfo/Search?format=json', searchBody);
    try {
      const parsed = JSON.parse(res.data);
      const list = parsed.UserInfoSearch?.UserInfo || [];
      if (list.length === 0) break;
      allUsers.push(...list);
      const total = parsed.UserInfoSearch?.totalMatches || list.length;
      pos += list.length;
      if (pos >= total) break;
    } catch(e) {
      console.error('Error parse users:', res.data ? res.data.substring(0, 200) : e);
      break;
    }
  }
  console.log('Total usuarios registrados en camara:', allUsers.length);

  console.log('\n=== 2. OBTENIENDO EVENTOS DE HOY (2026-09-14 DESDE LAS 17:00 HASTA AHORA) ===');
  const eventBody = JSON.stringify({
    AcsEventCond: {
      searchID: 'event_' + Date.now(),
      searchResultPosition: 0,
      maxResults: 200,
      major: 5,
      minor: 75,
      startTime: '2026-09-14T17:00:00-05:00',
      endTime: '2026-09-14T23:59:59-05:00'
    }
  });
  const evRes = await digestAuthRequest('POST', '/ISAPI/AccessControl/AcsEvent?format=json', eventBody);
  let events = [];
  try {
    const parsedEv = JSON.parse(evRes.data);
    events = parsedEv.AcsEvent?.InfoList || [];
    console.log('Total marcaciones hoy entre 17:00 y ahora:', events.length);
  } catch(e) {
    console.error('Error parse events:', evRes.data ? evRes.data.substring(0, 200) : e);
  }

  // Leer docentes configurados
  const docentesRaw = fs.readFileSync('config/docentes.json', 'utf8');
  const docentes = JSON.parse(docentesRaw);

  console.log('\n=== 3. CRUCE DE LOS 26 DOCENTES ACTIVOS HOY VS CAMARA Y MARCACIONES ===');
  const results = [];
  for (const doc of docentes) {
    const apellido = doc.nombre ? doc.nombre.split(' ')[0].toUpperCase() : '';
    const camUserByDni = allUsers.find(u => u.employeeNo === doc.employee_id);
    const camUserByName = allUsers.find(u => u.name && u.name.toUpperCase().includes(apellido));
    const camUser = camUserByDni || camUserByName;
    
    const docEvents = events.filter(e => 
      e.employeeNoString === doc.employee_id || 
      (camUser && e.employeeNoString === camUser.employeeNo)
    );
    
    let estadoEnCamara = 'NO REGISTRADO';
    if (camUserByDni) {
      estadoEnCamara = `REGISTRADO (${camUserByDni.name})`;
    } else if (camUserByName) {
      estadoEnCamara = `DNI DISCREPANTE: Cam="${camUserByName.employeeNo}", Sis="${doc.employee_id}" (${camUserByName.name})`;
    }

    results.push({
      Docente: doc.nombre,
      DNI_Sistema: doc.employee_id,
      Salon: doc.salon,
      Estado_Camara: estadoEnCamara,
      Marcaciones: docEvents.map(e => e.time.substring(11, 19)).join(', ') || 'SIN MARCAR',
      Estado: docEvents.length > 0 ? 'PRESENTE' : 'FALTA/PENDIENTE'
    });
  }

  console.table(results);

  console.log('\n=== TODOS LOS EVENTOS REGISTRADOS HOY EN CAMARA DESDE 17:00 ===');
  events.forEach((e, idx) => {
    console.log(`${idx + 1}. [${e.time}] ID: ${e.employeeNoString} | Nombre: ${e.name || 'S/N'}`);
  });

  console.log('\n=== TODOS LOS USUARIOS REGISTRADOS EN CAMARA ===');
  allUsers.forEach((u, idx) => {
    console.log(`${idx + 1}. ID: "${u.employeeNo}" | Nombre: "${u.name}" | Tarjetas: ${u.numOfCard || 0} | Rostros: ${u.numOfFace || 0}`);
  });
}

main().catch(console.error);