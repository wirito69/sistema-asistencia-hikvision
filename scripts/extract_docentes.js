const fs = require('fs');
const path = require('path');

const transcriptPath = path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'brain', 'e247e1ef-7a77-40df-8936-8cac74c8bd55', '.system_generated', 'logs', 'transcript_full.jsonl');
const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');

let userLine = '';
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('"type":"USER_INPUT"') && lines[i].includes('22498088')) {
    userLine = lines[i];
    break;
  }
}

if (!userLine) {
  console.log('No user input line found');
  process.exit(1);
}

const userObj = JSON.parse(userLine);
const content = typeof userObj.content === 'string' ? userObj.content : JSON.stringify(userObj.content);

// Parsear cada bloque OCR
const pageRegex = /==Start of OCR for page \d+==([\s\S]*?)==End of OCR for page \d+==/g;
let match;
const docentes = [];
const seen = new Set();

while ((match = pageRegex.exec(content)) !== null) {
  const pageText = match[1];
  const rows = pageText.split('\n').map(r => r.trim()).filter(Boolean);
  let nameParts = [];

  for (const r of rows) {
    if (r.includes('nombre_docente') || r.includes('DNI COMPLETO') || r.includes('==') || r.includes('page ')) continue;
    if (/^\d{7,8}$/.test(r)) {
      const dni = r;
      const name = nameParts.join(' ')
        .replace(/Ã‘/g, 'Ñ')
        .replace(/Ã‰/g, 'É')
        .replace(/Ã•/g, 'Í')
        .replace(/Ã“/g, 'Ó')
        .replace(/Ãš/g, 'Ú')
        .replace(/Ãœ/g, 'Ü')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (name && !seen.has(dni)) {
        seen.add(dni);
        docentes.push({ employee_id: dni, name: name.toUpperCase() });
      }
      nameParts = [];
    } else {
      nameParts.push(r);
    }
  }
}

console.log(`Total docentes extraídos exitosamente de las 38 páginas: ${docentes.length}`);
console.log('Muestra primeros 5:', docentes.slice(0, 5));
console.log('Muestra últimos 5:', docentes.slice(-5));

fs.writeFileSync(path.join(__dirname, 'padron_unheval_completo.json'), JSON.stringify(docentes, null, 2), 'utf8');
