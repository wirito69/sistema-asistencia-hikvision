const crypto = require("crypto");
const https = require("https");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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
  const realm = p.realm || "";
  const nonce = p.nonce || "";
  const qop = p.qop;
  const nc = "00000001";
  const cnonce = crypto.randomBytes(8).toString("hex");

  const ha1 = crypto.createHash("md5").update(user + ":" + realm + ":" + pass).digest("hex");
  const ha2 = crypto.createHash("md5").update(method + ":" + uri).digest("hex");
  let response;
  if (qop === "auth" || qop === "auth-int") {
    response = crypto.createHash("md5").update(ha1 + ":" + nonce + ":" + nc + ":" + cnonce + ":" + qop + ":" + ha2).digest("hex");
  } else {
    response = crypto.createHash("md5").update(ha1 + ":" + nonce + ":" + ha2).digest("hex");
  }

  let auth = `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
  if (qop) auth += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
  return auth;
}

async function testSnapshot(user, pass) {
  const ip = "172.16.80.12";
  const channels = ["/ISAPI/Streaming/channels/101/picture", "/ISAPI/Streaming/channels/1/picture", "/ISAPI/Streaming/channels/102/picture", "/ISAPI/ContentMgmt/ImageSearch/capabilities"];

  for (const uri of channels) {
    const url = `https://${ip}${uri}`;
    console.log(`Probando ${url} ...`);
    try {
      const r1 = await fetch(url, { cache: "no-store" });
      const wwwAuth = r1.headers.get("www-authenticate");
      if (!wwwAuth) continue;
      const authHeader = getDigestAuth("GET", uri, user, pass, wwwAuth);

      const r2 = await fetch(url, {
        headers: { Authorization: authHeader },
        cache: "no-store"
      });

      console.log(`   Canal [${uri}] => Status: ${r2.status} ${r2.statusText}`);
      if (r2.ok) {
        const buf = await r2.arrayBuffer();
        console.log(`   >>> ¡ÉXITO TOTAL EN CANAL ${uri}! Imagen descargada (${buf.byteLength} bytes)`);
        return;
      }
    } catch (err) {
      console.error("   Error:", err.message);
    }
  }
}

testSnapshot("admin", "Inf2026@");
