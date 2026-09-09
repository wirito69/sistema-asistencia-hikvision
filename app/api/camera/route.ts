import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const DEFAULT_IP = process.env.HIKVISION_IP || "172.16.80.12";
const DEFAULT_USER = process.env.HIKVISION_USER || "admin";
const DEFAULT_PASS = process.env.HIKVISION_PASS || "";

function parseDigestHeader(header: string) {
  const params: Record<string, string> = {};
  const regex = /(\w+)=(?:"([^"]+)"|([^\s,]+))/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(header)) !== null) {
    params[match[1]] = match[2] || match[3];
  }
  return params;
}

function calculateDigestHeader(
  method: string,
  uri: string,
  realm: string,
  nonce: string,
  qop: string | undefined,
  nc: string,
  cnonce: string,
  user: string,
  pass: string
) {
  const ha1 = crypto.createHash("md5").update(`${user}:${realm}:${pass}`).digest("hex");
  const ha2 = crypto.createHash("md5").update(`${method}:${uri}`).digest("hex");

  let response: string;
  if (qop === "auth" || qop === "auth-int") {
    response = crypto
      .createHash("md5")
      .update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
      .digest("hex");
  } else {
    response = crypto.createHash("md5").update(`${ha1}:${nonce}:${ha2}`).digest("hex");
  }

  let authHeader = `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", response="${response}"`;
  if (qop) {
    authHeader += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
  }
  return authHeader;
}

function generatePlaceholderSvg(ip: string, title: string, subtitle: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="none">
    <rect width="640" height="360" fill="#0b0f19"/>
    <rect x="20" y="20" width="600" height="320" rx="16" stroke="#1e293b" stroke-width="2" fill="#0f172a"/>
    <circle cx="320" cy="130" r="45" fill="#1e293b"/>
    <path d="M305 125a15 15 0 1130 0 15 15 0 01-30 0z" fill="#38bdf8"/>
    <path d="M290 160c0-15 15-22 30-22s30 7 30 22" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <text x="320" y="215" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">${title}</text>
    <text x="320" y="245" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">IP Lector: ${ip}</text>
    <text x="320" y="275" fill="#eab308" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return Buffer.from(svg);
}

export async function GET(req: NextRequest) {
  const ip = req.nextUrl.searchParams.get("ip") || DEFAULT_IP;
  const user = req.nextUrl.searchParams.get("user") || DEFAULT_USER;
  const pass = req.nextUrl.searchParams.get("pass") || DEFAULT_PASS;
  
  // Priorizar canal 101 que es el verificado en el terminal Hikvision
  const uris = [
    "/ISAPI/Streaming/channels/101/picture",
    "/ISAPI/Streaming/channels/1/picture",
    "/ISAPI/Streaming/channels/102/picture",
  ];

  for (const uri of uris) {
    try {
      const url = `https://${ip}${uri}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const initialRes = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (initialRes.status === 401) {
        const authHeader = initialRes.headers.get("www-authenticate");
        if (authHeader && authHeader.toLowerCase().startsWith("digest")) {
          const digestParams = parseDigestHeader(authHeader);
          const realm = digestParams.realm || "";
          const nonce = digestParams.nonce || "";
          const qop = digestParams.qop;
          const nc = "00000001";
          const cnonce = crypto.randomBytes(8).toString("hex");

          const digestAuth = calculateDigestHeader(
            "GET",
            uri,
            realm,
            nonce,
            qop,
            nc,
            cnonce,
            user,
            pass
          );

          const digestController = new AbortController();
          const digestTimeoutId = setTimeout(() => digestController.abort(), 2000);

          const authRes = await fetch(url, {
            method: "GET",
            headers: { Authorization: digestAuth },
            signal: digestController.signal,
            cache: "no-store",
          });

          clearTimeout(digestTimeoutId);

          if (authRes.ok) {
            const imageArrayBuffer = await authRes.arrayBuffer();
            const contentType = authRes.headers.get("content-type") || "image/jpeg";
            return new NextResponse(imageArrayBuffer, {
              status: 200,
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "no-cache, no-store, must-revalidate",
              },
            });
          }
        }
      } else if (initialRes.ok) {
        const imageArrayBuffer = await initialRes.arrayBuffer();
        const contentType = initialRes.headers.get("content-type") || "image/jpeg";
        return new NextResponse(imageArrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      }
    } catch {
      // Continuar al siguiente canal
    }
  }

  // Fallback con placeholder
  const svg = generatePlaceholderSvg(
    ip,
    "Cámara Hikvision",
    "Conectando en directo con canal 101..."
  );

  return new NextResponse(svg, {
    status: 200,
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-cache" },
  });
}
