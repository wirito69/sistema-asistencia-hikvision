const fs = require('fs');
const path = require('path');

const userObj = JSON.parse(fs.readFileSync(path.join(__dirname, 'user_input_ocr.txt'), 'utf8'));
const content = typeof userObj.content === 'string' ? userObj.content : JSON.stringify(userObj.content);

// Parsear cada bloque OCR de las 38 páginas
const pageRegex = /==Start of OCR for page \d+==([\s\S]*?)==End of OCR for page \d+==/g;
let match;
const padronMap = new Map();

// También importar las aulas conocidas
const knownAulas = {
  "07951959": { aula: "Aula 102", curso: "ECOLOGÍA Y SALUD", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "42334082": { aula: "Aula 506", curso: "CRIMINOLOGÍA", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "71648605": { aula: "Aula 505", curso: "DERECHO PROCESAL PENAL", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "09532543": { aula: "Aula 504", curso: "MODERNIZACIÓN DE LA GESTIÓN PÚBLICA", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22435357": { aula: "Sala de grados", curso: "EVALUACIÓN Y PROTECCIÓN AMBIENTAL", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "20001670": { aula: "Aula 405", curso: "Gestión de Proyectos de Infraestructura Vial", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "29379947": { aula: "Aula 101", curso: "SEMINARIO TALLER: TESIS II", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22422838": { aula: "Aula 103", curso: "SEMINARIO DE HISTORIA DEL PENSAMIENTO", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22423197": { aula: "Aula 202", curso: "ADMINISTRACIÓN MODERNA DE SALUD", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "29280917": { aula: "Aula 301", curso: "ANTROPOLOGÍA MÉDICA APLICADA", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22520887": { aula: "Aula 302", curso: "SEMINARIO DE DERECHO CONSTITUCIONAL", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22468386": { aula: "Aula 305", curso: "GESTIÓN DE RECURSOS Y TALENTO HUMANO", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22408967": { aula: "Aula 402", curso: "GESTIÓN ECONÓMICA Y FINANCIAMIENTO", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22465210": { aula: "Aula 403", curso: "TECNOLOGÍA DE PROTECCIÓN AMBIENTAL", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "23944821": { aula: "Aula 404", curso: "TALLER DE TESIS III", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "46161730": { aula: "Aula 501", curso: "SEMINARIO DE TESIS I", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "42330645": { aula: "Aula 502", curso: "PLANEAMIENTO ESTRATÉGICO", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22527461": { aula: "Fiis A26", curso: "TESIS I", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "40346404": { aula: "Fiis A27", curso: "GESTIÓN DE LA INNOVACIÓN", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22521879": { aula: "Fiis 403", curso: "NUEVAS TENDENCIAS EMPRESARIALES", modalidad: "Presencial", tipo_horario: "Fin de Semana" },
  "22490418": { aula: "Virtual 3", curso: "EPISTEMOLOGÍA DE LAS NEUROCIENCIAS", modalidad: "Virtual", tipo_horario: "Fin de Semana" },
  "22674143": { aula: "Virtual 4", curso: "SEMINARIO TALLER DE TESIS I", modalidad: "Virtual", tipo_horario: "Fin de Semana" },
  "41495526": { aula: "Virtual 5", curso: "SEMINARIO TALLER DE TESIS I", modalidad: "Virtual", tipo_horario: "Fin de Semana" },
  "22512114": { aula: "Virtual 6", curso: "SEMINARIO TALLER DE TESIS I", modalidad: "Virtual", tipo_horario: "Fin de Semana" },
  "72123814": { aula: "Dirección 1", curso: "COORDINACIÓN GENERAL DE POSGRADO", modalidad: "Presencial", tipo_horario: "Fin de Semana" }
};

while ((match = pageRegex.exec(content)) !== null) {
  const pageText = match[1];
  const rows = pageText.split('\n').map(r => r.trim()).filter(Boolean);
  let nameParts = [];

  for (const r of rows) {
    if (r.includes('nombre_docente') || r.includes('DNI COMPLETO') || r.includes('==') || r.includes('page ')) continue;
    if (/^\d{7,8}$/.test(r)) {
      const dni = r;
      const cleanName = nameParts.join(' ')
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
        .replace(/â€“/g, '-')
        .replace(/\\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanName && dni.length >= 7) {
        const extra = knownAulas[dni] || {};
        padronMap.set(dni, {
          employee_id: dni,
          name: cleanName.toUpperCase(),
          aula: extra.aula || "Posgrado UNHEVAL",
          curso: extra.curso || "Docente de Posgrado",
          teams: extra.teams || `TEAMS-${dni}`,
          modalidad: extra.modalidad || "Presencial",
          tipo_horario: extra.tipo_horario || "Fin de Semana",
          cargo: "Docente",
        });
      }
      nameParts = [];
    } else {
      nameParts.push(r);
    }
  }
}

const allDocentesList = Array.from(padronMap.values());
console.log(`¡Éxito total! Se extrajeron ${allDocentesList.length} docentes oficiales con su DNI.`);

// Generar lib/docentesData.ts
const tsContent = `export interface DocenteData {
  employee_id: string;
  name: string;
  aula: string;
  curso: string;
  teams: string;
  modalidad: string;
  tipo_horario: "Fin de Semana" | "Entre Semana" | string;
  cargo: string;
}

export const UNHEVAL_DOCENTES_DATA: DocenteData[] = ${JSON.stringify(allDocentesList, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'docentesData.ts'), tsContent, 'utf8');
console.log('lib/docentesData.ts actualizado con el padrón general completo!');
