const http = require('http');
const crypto = require('crypto');

const IP = '172.16.80.12';
const USER = 'admin';
const PASS = 'Inf2026@';

function parseDigest(h) {
  const p = {};
  const r = /(\w+)=(?:"([^"]+)"|([^\s,]+))/g;
  let m;
  while ((m = r.exec(h)) !== null) { p[m[1]] = m[2] || m[3]; }
  return p;
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
  let response = qop === 'auth' 
    ? crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + nc + ':' + cnonce + ':' + qop + ':' + ha2).digest('hex')
    : crypto.createHash('md5').update(ha1 + ':' + nonce + ':' + ha2).digest('hex');
  let header = `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
  if (p.opaque) header += `, opaque="${p.opaque}"`;
  if (qop) header += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
  return header;
}

function isapiRequest(method, uri, body = null, contentType = 'application/xml') {
  return new Promise((resolve, reject) => {
    const doReq = (authHeader = null) => {
      const headers = { 'Content-Type': contentType };
      if (authHeader) headers['Authorization'] = authHeader;
      if (body) headers['Content-Length'] = Buffer.byteLength(body);

      const req = http.request({ host: IP, port: 80, path: uri, method, headers, timeout: 8000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
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

async function viewHosts() {
  const r = await isapiRequest('GET', '/ISAPI/Event/notification/httpHosts');
  console.log('Current HttpHosts XML:\n', r.data);
}

viewHosts();
