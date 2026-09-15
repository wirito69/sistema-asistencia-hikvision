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

async function main() {
  let allUsers = [];
  let position = 0;
  let totalMatches = 1;

  while (position < totalMatches) {
    const body = JSON.stringify({
      UserInfoSearchCond: {
        searchID: "audit_users_" + Date.now(),
        searchResultPosition: position,
        maxResults: 50
      }
    });

    const res = await isapiRequest('POST', '/ISAPI/AccessControl/UserInfo/Search?format=json', body);
    const json = JSON.parse(res.data);
    totalMatches = json.UserInfoSearch?.totalMatches || 0;
    const list = json.UserInfoSearch?.UserInfo || [];
    if (list.length === 0) break;
    allUsers.push(...list);
    position += list.length;
    if (position >= totalMatches) break;
  }

  console.log('=== TODOS LOS USUARIOS REGISTRADOS EN LA CÁMARA (' + allUsers.length + ') ===');
  allUsers.forEach((u, i) => {
    console.log(`${(i+1).toString().padStart(2, '0')}. ID: [${u.employeeNo}] - Nombre: "${u.name}" (Rostros: ${u.numOfFace || 0})`);
  });
}

main().catch(console.error);