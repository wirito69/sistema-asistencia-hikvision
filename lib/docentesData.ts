// Base de Datos Centralizada de Docentes - Posgrado UNHEVAL
export interface DocenteData {
  employee_id: string;
  name: string;
  aula: string;
  curso: string;
  teams: string;
  modalidad: "Presencial" | "Virtual (Teams)" | string;
  tipo_horario: "Entre Semana" | "Fin de Semana" | "Ambos Horarios" | "Padrón General" | string;
  cargo?: string;
}

export const UNHEVAL_DOCENTES_DATA: DocenteData[] = [
  {
    "employee_id": "22498088",
    "name": "ABIMAEL ADAM FRANCISCO PAREDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22498088",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22412906",
    "name": "ABNER ALFEO FONSECA LIVIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22412906",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22491809",
    "name": "ADALBERTO LUCAS CABELLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22491809",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06141876",
    "name": "ADAN HUMBERTO ESTELA ESTELA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06141876",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22426817",
    "name": "ADLER AURELIO DIONISIO VARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22426817",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 401",
    "employee_id": "80165335",
    "name": "AGUIRRE MATOS, NESTOR ALEMBERT",
    "curso": "DISEÑO, CONSTRUCCIÓN Y MANTENIMIENTO DE TÚNELES",
    "teams": "TEAMS-80165335",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 503",
    "employee_id": "46429842",
    "name": "AGURTO JARA, EDGARD GIANFRANCO",
    "curso": "ANÁLISIS ECONÓMICO DEL DERECHO",
    "teams": "TEAMS-46429842",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "aula": "Virtual 4",
    "employee_id": "22674143",
    "name": "AGUSTIN RUFINO ROJAS FLORES",
    "curso": "SEMINARIO TALLER DE TESIS I: ELABORACIÓN DE PROYECTO",
    "teams": "TEAMS-22674143",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "43730740",
    "name": "AGUSTINA VALVERDE RODRIGUEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43730740",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "21572883",
    "name": "AIDA CONTRERAS YALAN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-21572883",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43475619",
    "name": "ALAN MANUEL RUBIN ROBLES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43475619",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07707595",
    "name": "ALBERTO ALAIN BERGER VIGUERAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07707595",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "47535362",
    "name": "ALBERTO FRANCO CERNA CUEVA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-47535362",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22408969",
    "name": "ALBERTO SALDAÑA PANDURO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22408969",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22505727",
    "name": "ALCIDES BERNARDO TELLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22505727",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "01289184",
    "name": "ALCIDES MELECIO COTACALLAPA VILCA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-01289184",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40828677",
    "name": "ALEACIB SOLIS BARRUETA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40828677",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407605",
    "name": "ALEJANDRO MAXIMO LIZANA ZORA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407605",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22423097",
    "name": "ALEJANDRO OCHOA ROMERO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22423097",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22755973",
    "name": "ALEJANDRO RUBINA LOPEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22755973",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "25808885",
    "name": "ALEMBER ANGULO CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-25808885",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41689009",
    "name": "ALEX CAMPOS FELIX",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41689009",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04025628",
    "name": "AMANCIO RICARDO ROJAS COTRINA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04025628",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 402",
    "employee_id": "22408967",
    "name": "AMANCIO RODOLFO VALDIVIESO ECHEVARRIA",
    "curso": "GESTIÓN ECONÓMICA Y FINANCIAMIENTO EN SALUD",
    "teams": "TEAMS-22408967",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22734761",
    "name": "AMANDA OMONTE VILCA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22734761",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43964588",
    "name": "AMARILDO TARAZONA VALERIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43964588",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07559836",
    "name": "ANA MARIA MATOS RAMIREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07559836",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "16764303",
    "name": "ANA MARIA SOTO RUEDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-16764303",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41434505",
    "name": "ANA MARIA VICTORIO VALDERRAMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41434505",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22470932",
    "name": "ANDRES AVELINO CAMARA ACERO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22470932",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07464168",
    "name": "ANGEL DAVID NATIVIDAD BARDALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07464168",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22755161",
    "name": "ANGEL ELIPIO SANTILLAN LEAÑO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22755161",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513887",
    "name": "ANGEL FRANCISCO CALERO LUIS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513887",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22508364",
    "name": "ANGEL GOMEZ VARGAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22508364",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "70264749",
    "name": "ANGEL LUIS SALAS REATEGUI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-70264749",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40429947",
    "name": "ANGEL SOBRADO GOMEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40429947",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40811672",
    "name": "ANIBAL ELEUTERIO ESPINOZA GRIJALVA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40811672",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22424381",
    "name": "ANTONIA ESMILA JERI GUERRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22424381",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 102",
    "employee_id": "07951959",
    "name": "ANTONIO SALUSTIO CORNEJO Y MALDONADO",
    "curso": "ECOLOGÍA Y SALUD",
    "teams": "TEAMS-07951959",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "47672057",
    "name": "ANTONY PAUL ESPIRITU MARTINEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-47672057",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 103",
    "employee_id": "22422838",
    "name": "ARMANDO PIZARRO ALEJANDRO",
    "curso": "SEMINARIO DE HISTORIA DEL PENSAMIENTO FILOSÓFICO-JURÍDICO",
    "teams": "TEAMS-22422838",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "10535362",
    "name": "ARMIDA MENDOZA MENDOCILLA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10535362",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22432336",
    "name": "ARNULFO ORTEGA MALLQUI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22432336",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Virtual 3",
    "employee_id": "22490418",
    "name": "ARTURO LUCAS CABELLO",
    "curso": "ESPISTEMOLOGÍA DE LAS NEURONAS",
    "teams": "TEAMS-22490418",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411131",
    "name": "ARTURO RIVERA Y CALDAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411131",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513485",
    "name": "AUGUSTO BAZAN GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513485",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22404209",
    "name": "AURELIO SIMON ROSAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22404209",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "00005798",
    "name": "AURISTELA CHAVEZ VIDALON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-00005798",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22427715",
    "name": "AYAR PONCE FLORES MANRIQUE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22427715",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08879694",
    "name": "BERNARDO CRISTOBAL DAMASO MATA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08879694",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22498760",
    "name": "BERTHA LEONOR WONG FIGUEROA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22498760",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41753598",
    "name": "BETHSY DIANA HUAPALLA CÉSPEDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41753598",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41547088",
    "name": "BETHSY LILIANA SERRANO MARIÑO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41547088",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "47474699",
    "name": "BISETH MIRAVAL ROJAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-47474699",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22417123",
    "name": "CARLOS ABELARDO VILLANUEVA Y CHANG",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22417123",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41087524",
    "name": "CARLOS ALBERTO INGA BLAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41087524",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22518950",
    "name": "CARLOS ANTONIO CARRILLO Y ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22518950",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Virtual 6",
    "employee_id": "22512114",
    "name": "CARLOS BUSTAMANTE OCHOA",
    "curso": "SEMINARIO TALLER DE TESIS I",
    "teams": "TEAMS-22512114",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "40393957",
    "name": "CARLOS EDUARDO VILLANUEVA VILLAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40393957",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22521641",
    "name": "CARLOS ENRIQUE CORDOVA FACUNDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22521641",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22431173",
    "name": "CARLOS GUSTAVO MORENO TABOADA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22431173",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22516214",
    "name": "CARLOS JOSE QUISPE CAJAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22516214",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514666",
    "name": "CARLOS MANUEL CONDEZO FIGUEROA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514666",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405454",
    "name": "CARLOS OSCAR BALLARTE ZEVALLOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405454",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514585",
    "name": "CARMEN ELVIRA ZAVALAGA BUSTOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514585",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511331",
    "name": "CARMEN ROSA CABALLERO CASTILLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511331",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07063612",
    "name": "CASIANO AGUIRRE ESCALANTE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07063612",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08631228",
    "name": "CAYTO DIDI MIRAVAL TARAZONA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08631228",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422073",
    "name": "CECILIA VILMA MARTINEZ MORALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422073",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513421",
    "name": "CESAR ALFONSO NAJAR FARRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513421",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405623",
    "name": "CESAR AUGUSTO KANASHIRO CASTAÑEDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405623",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411064",
    "name": "CESAR LINCOLN GONZALES SOTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411064",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22498521",
    "name": "CESAR LOPEZ GODOY",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22498521",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22702642",
    "name": "CESAR ORLANDO GONZALEZ AGUIRRE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22702642",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "46713262",
    "name": "CESAR ROBERT CUETO ROSALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46713262",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41559423",
    "name": "CESAR WILFREDO ROSAS ECHEVARRIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41559423",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40033614",
    "name": "CHARLES JIAMMY ALCEDO DIAZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40033614",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22527375",
    "name": "CHRISTIAN MICHAEL ESCOBEDO BAILON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22527375",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41905365",
    "name": "CHRISTIAN PAOLO MARTEL CARRANZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41905365",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22415868",
    "name": "CIRO ANGEL LAZO SALCEDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22415868",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "00118817",
    "name": "CLARA FERNANDEZ PICON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-00118817",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22463672",
    "name": "CLAYTON ALVARADO CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22463672",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422313",
    "name": "CLORINDA NATIVIDAD BARRIONUEVO TORRES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422313",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43879838",
    "name": "CONSUELO AMPARO KANASHIRO SANTILLAN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43879838",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40615874",
    "name": "DALILA ILLATOPA ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40615874",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22502336",
    "name": "DANTE JACOBO RAMIREZ MAYS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22502336",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22516780",
    "name": "DARCY EUDOMILIA ARESTEGUI DE KOHAMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22516780",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22507251",
    "name": "DAVID ABEL GONZALEZ MANRIQUE DE LARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22507251",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22474797",
    "name": "DAVID BERNARDO BERAUN SANCHEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22474797",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42267609",
    "name": "DAVID CHIHON LEON CHIANG",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42267609",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "01340680",
    "name": "DAVID COTACALLAPA VILCA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-01340680",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22421436",
    "name": "DAVID JULIO MARTEL ZEVALLOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22421436",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411102",
    "name": "DENESY PELAGIA PALACIOS JIMENEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411102",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40318885",
    "name": "DEYVI PORTOCARRERO MALPARTIDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40318885",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06927959",
    "name": "DIGNA AMABILIA MANRIQUE DE LARA SUAREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06927959",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40166013",
    "name": "DILMER ADILIO ECHEVARRIA AGUIRRE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40166013",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22640468",
    "name": "DIONICIO RUPERTO FERNANDEZ SANTA CRUZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22640468",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22485327",
    "name": "DORIS MARIA GODOY CORTEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22485327",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41432866",
    "name": "DR. ALBORNOZ FLORES, WILMER JHON",
    "aula": "Aula 506",
    "curso": "SEMINARIO TALLER: TESIS II",
    "teams": "397H 260810 SEMINARIO TALLER: TESIS II",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "09310484",
    "name": "Dr. BALLARTE BAYLON, ANTONIO ALBERTO",
    "aula": "Aula 103",
    "curso": "TALLER DE TESIS III",
    "teams": "410H 260817 TALLER DE TESIS III",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "43494291",
    "name": "DR. DAGA ALMERCO, BEKIN BAUER",
    "aula": "Virtual 3",
    "curso": "SEMINARIO TALLER DE TESIS I",
    "teams": "392H 260805 SEMINARIO TALLER DE TESIS I",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22527461",
    "name": "DR. FLORES VIDAL, JIMMY GROVER",
    "aula": "Virtual 5",
    "curso": "MÓDULO III: GESTIÓN DE PREVENCIÓN DE RIESGOS Y ESTRATEGIAS EDUCATIVAS EN LA SALUD OCUPACIONAL",
    "teams": "421H 260818 MÓDULO III: GESTIÓN DE PREVENCIÓN DE RIESGOS Y ESTRATEGIAS EDUCATIVAS EN LA SALUD OCUPACIONAL",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22429229",
    "name": "Dr. HUANUCO CARLOS, LORENZO",
    "aula": "Aula 402",
    "curso": "INTRODUCCIÓN A LA GESTIÓN PÚBLICA",
    "teams": "408H 260817 INTRODUCCIÓN A LA GESTIÓN PÚBLICA",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411045",
    "name": "DR. MENESES JARA, PABLO WALTER",
    "aula": "Aula 102",
    "curso": "MODERNIZACIÓN DE LA GESTIÓN PÚBLICA Y GOBIERNO ABIERTO",
    "teams": "407H 260817 MODERNIZACIÓN DE LA GESTIÓN PÚBLICA Y GOBIERNO ABIERTO",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "46084104",
    "name": "DR. PASQUEL CAJAS, ALEXANDER FRANK",
    "aula": "Aula 504",
    "curso": "GERENCIA DE PROYECTOS",
    "teams": "411H 260817 GERENCIA DE PROYECTOS",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "07327108",
    "name": "DR. ROMERO VELA, JORGE ERNESTO",
    "aula": "Aula 403",
    "curso": "GESTIÓN DE RIESGOS",
    "teams": "413H 260817 GESTIÓN DE RIESGOS",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "41300483",
    "name": "DR. SANTIAGO POMA, ENRIQUE ISIDRO",
    "aula": "Aula 502",
    "curso": "DERECHO PROCESAL PENAL",
    "teams": "422H 260819 DERECHO PROCESAL PENAL",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22412064",
    "name": "DR. VARGAS RONCAL, ROSARIO",
    "aula": "Virtual 2",
    "curso": "SEMINARIO TALLER DE TESIS II: VALIDACIÓN, CONFIABILIDAD DEL INSTRUMENTO Y RECOLECCIÓN DE DATOS",
    "teams": "391H 260722 SEMINARIO TALLER DE TESIS II: VALIDACIÓN, CONFIABILIDAD DEL INSTRUMENTO Y RECOLECCIÓN DE DATOS",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22490808",
    "name": "Dr. VILLAVICENCIO CABRERA, MARCO ANTONIO",
    "aula": "Sala de grados",
    "curso": "PLANEAMIENTO ESTRATÉGICO",
    "teams": "416H 260817 PLANEAMIENTO ESTRATÉGICO",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "41346240",
    "name": "Dra. GARAY CABRERA, GIANNY RAYMUNDA",
    "aula": "Virtual 4",
    "curso": "MÓDULO III: MARCO CONCEPTUAL Y NORMATIVO DE LA SEGURIDAD DEL PACIENTE Y LA CALIDAD DE ATENCIÓN",
    "teams": "398H 260810 MÓDULO III: MARCO CONCEPTUAL Y NORMATIVO DE LA SEGURIDAD DEL PACIENTE Y LA CALIDAD DE ATENCIÓN",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "45001856",
    "name": "DRA. GARCIA PONCE, SARA HERMINIA",
    "aula": "Aula 302",
    "curso": "DERECHO PENAL GENERAL",
    "teams": "404H 260817 DERECHO PENAL GENERAL",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "18032303",
    "name": "DRA. JAIMES REATEGUI, SUMAYA",
    "aula": "Aula 201",
    "curso": "SEMINARIO DE TESIS I",
    "teams": "406H 260817 SEMINARIO DE TESIS I",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "40346404",
    "name": "DRA. JESUS TOLENTINO, INES EUSEBIA",
    "aula": "Aula 304",
    "curso": "TESIS I",
    "teams": "400H 260817 TESIS I",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "42923464",
    "name": "DRA. VEGA JARA, LILIANA",
    "aula": "Aula 101",
    "curso": "GESTIÓN DE LOS CONTAMINANTES Y LOS RESIDUOS",
    "teams": "414H 260817 GESTIÓN DE LOS CONTAMINANTES Y LOS RESIDUOS",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "42140131",
    "name": "EBER ARMANDO RAMOS MOLLEHUARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42140131",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "46554205",
    "name": "EDDIE MISAEL SAMANIEGO PIMENTEL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46554205",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "46023934",
    "name": "EDDYSON MONTALVO SABINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46023934",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22484862",
    "name": "EDGAR GRIMALDO MATTO PABLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22484862",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43999854",
    "name": "EDGAR SIMON VERASTEGUI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43999854",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "29365389",
    "name": "EDILBERTO ENRIQUE SUERO ROJAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-29365389",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514860",
    "name": "EDITH HAYDEE BERAUN QUIÑONES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514860",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10377003",
    "name": "EDITH LUZ ZEVALLOS ARIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10377003",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42383718",
    "name": "EDITH UMASI RAMOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42383718",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22481180",
    "name": "EDUARDO ANATOLIO MELGAREJO LEANDRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22481180",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22491332",
    "name": "EDUARDO LAVADO IGLESIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22491332",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41222837",
    "name": "EDVER ACCILIO TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41222837",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513953",
    "name": "EDWARD LUIS ZEVALLOS CHOY",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513953",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40053010",
    "name": "EDWIN ALBERTO FIGUEROA FERRER",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40053010",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22494299",
    "name": "EDWIN LEON PONCE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22494299",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20719667",
    "name": "EDWIN ROGER ESTEBAN RIVERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20719667",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22402848",
    "name": "ELADIO FLAVIO VELEZ DE VILLA ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22402848",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "18010990",
    "name": "ELADIO GUZMAN VILLA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-18010990",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80037356",
    "name": "ELBIO FERNANDO FELIPE MATIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80037356",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20900669",
    "name": "ELIAS TITO HUAYNATE DELGADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20900669",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22527428",
    "name": "ELISA RAQUEL QUINTANILLA HERRERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22527428",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22475926",
    "name": "ELIZABETH CHAVEZ HUAMAN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22475926",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22412223",
    "name": "ELMER GLICERIO JAIMES OMONTE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22412223",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10687592",
    "name": "ELMER RICHARD NINAQUISPE CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10687592",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22751077",
    "name": "ELMER SANTIAGO CHUQUIYAURI SALDIVAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22751077",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40766277",
    "name": "ELOY MARCELO CUPE CALCINA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40766277",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22435369",
    "name": "EMIGIDIO RAMOS CORNELIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22435369",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22408286",
    "name": "ENIT IDA VILLAR CARBAJAL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22408286",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22409395",
    "name": "ENMA SOFIA REEVES HUAPAYA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22409395",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22480882",
    "name": "ENNIS SEGUNDO JARAMILLO FALCON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22480882",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22435387",
    "name": "ENRIQUE CASTRO Y CESPEDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22435387",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22418652",
    "name": "ERASMO ALEJANDRO FERNANDEZ SIXTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22418652",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22499457",
    "name": "ERICA PATRICIA ESPINOZA TELLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22499457",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22493412",
    "name": "ERNESTINA ARIZA AVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22493412",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22505454",
    "name": "ESTEBAN NAUPAY PEREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22505454",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40473632",
    "name": "ESTHER JANNET GARCIA ALEGRE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40473632",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22413494",
    "name": "EUDONIA ISABEL ALVARADO ORTEGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22413494",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22483399",
    "name": "EUDOSIO RAMIREZ TABRAJ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22483399",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411127",
    "name": "EUGENIO FAUSTO PEREZ TRUJILLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411127",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22755970",
    "name": "EUSEBIO LUNA RAMOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22755970",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "46317406",
    "name": "EVA ORIZANO PONCE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46317406",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22421796",
    "name": "EVER OSORIO FLORES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22421796",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41532365",
    "name": "EWER PORTOCARRERO MERINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41532365",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08260510",
    "name": "FANNY LOURDES ORBEGOSO FERNANDEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08260510",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22426413",
    "name": "FELIX ARMANDO JORGE CASTRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22426413",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43101007",
    "name": "FELIX DULIO SOBRADO CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43101007",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22412028",
    "name": "FERMIN POZO ORTEGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22412028",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07746441",
    "name": "FERMIN ROLANDO MONTESINOS CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07746441",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22410193",
    "name": "FERMIN VASQUEZ CIPRIANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22410193",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22461120",
    "name": "FERNAN PANDURO PANDURO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22461120",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22491216",
    "name": "FERNANDO JEREMIAS GONZALES PARIONA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22491216",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "70766532",
    "name": "FERNANDO JOAQUIN ALMANZA GARAY",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-70766532",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "46513914",
    "name": "FERNANDO SOTO PALOMINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46513914",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04021765",
    "name": "FIDEL ALBERTO GARCIA YALE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04021765",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22519502",
    "name": "FIDEL RAFAEL ROJAS INGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22519502",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22483664",
    "name": "FLELI RICARDO JARA CLAUDIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22483664",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06652046",
    "name": "FLOR MARIA AYALA ALBITES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06652046",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "45741028",
    "name": "FLORABEL LLANTOY QUISPE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-45741028",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06877195",
    "name": "FLORENCIA GUERRA CARHUAPOMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06877195",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20681625",
    "name": "FLORIAN GUALBERTO FABIAN FLORES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20681625",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22509098",
    "name": "FRANCISCO ELI ESPINOZA RAMOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22509098",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "77334650",
    "name": "FRANK CESAR CORDOVA VERGARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-77334650",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41927675",
    "name": "FRANZ KOVY ARTEAGA LIVIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41927675",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514173",
    "name": "FREDERIK LUIS ELOY JARA TORREJON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514173",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513273",
    "name": "FREDI SOTOMAYOR HERRERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513273",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511313",
    "name": "FROILAN LINARES RAMOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511313",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07130417",
    "name": "GABRIEL LEONARDO COLETTI ESCOBAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07130417",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40233758",
    "name": "GEANINNE RIOS GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40233758",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22994134",
    "name": "GELACIO POZO PINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22994134",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22429490",
    "name": "GERARDO GARAY ROBLES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22429490",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22521894",
    "name": "GERBER JOSAFATT ZAVALA ASCAÑO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22521894",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43573513",
    "name": "GERMANY YUSEP GOMEZ MARIN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43573513",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22404125",
    "name": "GLADYS LILIANA RODRIGUEZ DE LOMBARDI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22404125",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22432317",
    "name": "GLADYS LUZ HERRERA ALANIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22432317",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42282722",
    "name": "GLIZET TERESA DOMINGUEZ MONTALVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42282722",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513334",
    "name": "GREGORIO CISNEROS SANTOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513334",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22423053",
    "name": "GRIFELIO VARGAS GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22423053",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422625",
    "name": "GUADALUPE RAMIREZ REYES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422625",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22468221",
    "name": "GUILLERMO AUGUSTO BOCANGEL WEYDERT",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22468221",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22420284",
    "name": "GUILLERMO CARLOS PEÑA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22420284",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80156372",
    "name": "GUSTAVO OSCAR SOTO ALVARADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80156372",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22669203",
    "name": "HAIBER POLICARPO ECHEVARRIA RODRIGUEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22669203",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 302",
    "employee_id": "22520887",
    "name": "HAMILTON ESTACIO FLORES",
    "curso": "SEMINARIO DE DERECHO CONSTITUCIONAL COMPARADO",
    "teams": "TEAMS-22520887",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "45831158",
    "name": "HANONVER JONATHAN DIAZ JORGE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-45831158",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20716892",
    "name": "HECTOR CESAR OSPINO DAVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20716892",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22420918",
    "name": "HECTOR RAUL HUARANGA NAVARRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22420918",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41048834",
    "name": "HEIDY VELSY RIVERA VIDAL DE SANCHEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41048834",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06132916",
    "name": "HELI MARIANO SANTIAGO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06132916",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22484406",
    "name": "HENRY BRICEÑO YEN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22484406",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42757514",
    "name": "HENRY WALTER VALLE ROQUE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42757514",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22719887",
    "name": "HERIBERTO HILARION ESTRADA MUÑOZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22719887",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22468996",
    "name": "HERMILIO ASIS TRUJILLO MARTINEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22468996",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407496",
    "name": "HERNAN ABEL LOPEZ Y ROJAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407496",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "45123493",
    "name": "HERNAN WILMER GARCIA BONILLA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-45123493",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22719856",
    "name": "HILARION DELERMINO PAUCAR COZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22719856",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42016155",
    "name": "HIMBLER JACYSON ACEVAL CIENFUEGOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42016155",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422525",
    "name": "HOLGER ALEX ARANCIAGA CAMPOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422525",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "47036878",
    "name": "HUAMANÍ CALLUPE, CARLA LIZBETH",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-47036878",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80175380",
    "name": "HUGO ANSELMO CCAMA CONDORI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80175380",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407185",
    "name": "HUMBERTO BENANCIO VALDIVIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407185",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22499099",
    "name": "IBETH CATHERINE FIGUEROA SANCHEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22499099",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22428875",
    "name": "IDO LUGO VILLEGAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22428875",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22427699",
    "name": "IRENE DEZA Y FALCON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22427699",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10693551",
    "name": "IRMA EGOAVIL MEDINA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10693551",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "29676256",
    "name": "ISABEL DAVILA CARDENAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-29676256",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "25004713",
    "name": "ISAIS MERMA MOLINA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-25004713",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22418408",
    "name": "ISIDRO TEODOLFO ENCISO GUTIERREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22418408",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "19924672",
    "name": "ITALO WILE ALEJOS PATIÑO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-19924672",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 502",
    "employee_id": "42330645",
    "name": "IVAN TEODORO MANCILLA CHAMORRO",
    "curso": "PLANEAMIENTO ESTRATÉGICO",
    "teams": "TEAMS-42330645",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513883",
    "name": "JAIME GERONIMO DE LA CRUZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513883",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43046543",
    "name": "JANETH FIORELA MARTEL FIGUEREDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43046543",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22476856",
    "name": "JANETH LEYNIG TELLO CORNEJO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22476856",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04063470",
    "name": "JANI MONAGO MALPARTIDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04063470",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42043705",
    "name": "JAVIER FARIAS VERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42043705",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22416811",
    "name": "JAVIER GONZALO LOPEZ Y MORALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22416811",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511309",
    "name": "JAVIER ROMERO CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511309",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22508839",
    "name": "JEAN PAUL BERROSPI NORIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22508839",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22474248",
    "name": "JEANETTE SUSANA MENDOZA LOLI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22474248",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22497456",
    "name": "JEHNSI GUSTAVO VERAMENDI QUIÑONES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22497456",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43227744",
    "name": "JENNY ROCIO REYNOSO PALPA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43227744",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22497958",
    "name": "JEREMIAS ROJAS VELASQUEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22497958",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10610042",
    "name": "JESSICA GIOVANNA RICALDI VILLANUEVA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10610042",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22488669",
    "name": "JESSYE MIRTHA RAMOS GARCÍA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22488669",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "09356302",
    "name": "JESUS ARTURO ORTIZ MOROTE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-09356302",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08715267",
    "name": "JESUS AURELIO CALLE ILIZARBE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08715267",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "00489523",
    "name": "JESUS ENRIQUE SOSA CORI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-00489523",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20692508",
    "name": "JESUS FRANCISCO ASCENCIO CONDOR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20692508",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "28292448",
    "name": "JESUS OMAR CARDENAS CRIALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-28292448",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06553998",
    "name": "JESUS VILCHEZ GUIZADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06553998",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42150583",
    "name": "JHIMMY JESUS BERNUY PIMENTEL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42150583",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43503859",
    "name": "JHON PAUL TRUJILLO VALER",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43503859",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42365418",
    "name": "JHON WILLIAMS CORI ORTEGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42365418",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22497747",
    "name": "JHONEL NABOR ROSALES CORDOVA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22497747",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10423397",
    "name": "JHONNY HENRY PIÑAN GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10423397",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22510037",
    "name": "JIM ARTURO RIVERA VIDAL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22510037",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22521280",
    "name": "JIMMY AUGUSTO TRUJILLO OLIVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22521280",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06417017",
    "name": "JOAN LARA AMAT Y LEON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06417017",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Dirección 1",
    "employee_id": "72123814",
    "name": "JOEL (CONTROL ACADÉMICO)",
    "curso": "COORDINACIÓN GENERAL DE POSGRADO",
    "teams": "TEAMS-72123814",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513276",
    "name": "JOEL CIPRIANO TARAZONA BARDALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513276",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22415364",
    "name": "JOEL TUCTO BERRIOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22415364",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "44586962",
    "name": "JOHNNY FRANK ROJAS REYES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-44586962",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "25739524",
    "name": "JOHNY JOSE CALDERON CAHUE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-25739524",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40991755",
    "name": "JORGE ANTONIO RIOS SORIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40991755",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22418030",
    "name": "JORGE BOYLE CHAVEZ ALBORNOZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22418030",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22435351",
    "name": "JORGE EDGAR ROSALES ALBORNOZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22435351",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41739254",
    "name": "JORGE FARID GABINO GONZALEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41739254",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22502360",
    "name": "JORGE LUIS ESCALANTE SOPLIN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22502360",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43333660",
    "name": "JORGE LUIS JESUS AQUINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43333660",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22416541",
    "name": "JORGE LUIS MEYZAN BRICEÑO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22416541",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41974795",
    "name": "JORGE LUIS TORRES SAAVEDRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41974795",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07230761",
    "name": "JORGE RUBEN HILARIO CARDENAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07230761",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22414602",
    "name": "JORGE TEOFILO CHAVEZ ESTRADA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22414602",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "19836982",
    "name": "JORGE ZEVALLOS HUARANGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-19836982",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407631",
    "name": "JOSE ANGEL FALCON RIVA AGÜERO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407631",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511797",
    "name": "JOSE BARTOLOME MALLQUI ALVARADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511797",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "21797383",
    "name": "JOSE DOLORES LEVANO CRISOSTOMO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-21797383",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "02807210",
    "name": "JOSE FRANCISCO GOICOCHEA VARGAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-02807210",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "02003098",
    "name": "JOSE KALION GUERRA LU",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-02003098",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22520222",
    "name": "JOSE LUIS CLAUDIO PEREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22520222",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41879368",
    "name": "JOSE LUIS MANDUJANO RUBIN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41879368",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42463029",
    "name": "JOSE LUIS VARGAS GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42463029",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22486638",
    "name": "JOSE LUIS VILLAVICENCIO GUARDIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22486638",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10158389",
    "name": "JOSE VICENTE RAMOS LALUPU",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10158389",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22651202",
    "name": "JOSE WUENCISLAO CONDEZO MARTEL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22651202",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80089687",
    "name": "JOSUE CANCHARI DE LA CRUZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80089687",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22700083",
    "name": "JOSUE ZEVALLOS GARCIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22700083",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40445635",
    "name": "JUAN ANTONIO PICOY GONZALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40445635",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40134310",
    "name": "JUAN CARLOS ROJAS MATOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40134310",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40040333",
    "name": "JUAN EDSON VILLANUEVA TIBURCIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40040333",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42836949",
    "name": "JUAN ELIAS CARRION DIAZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42836949",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405502",
    "name": "JUAN GARCIA CESPEDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405502",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40651599",
    "name": "JUAN JUA TARAZONA TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40651599",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06111639",
    "name": "JUAN MENA PARCO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06111639",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43502497",
    "name": "JUAN MIGUEL ROJAS ASCON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43502497",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "44187179",
    "name": "JUAN SERGIO AGUIRRE TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-44187179",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22509855",
    "name": "JUANA ANDREA BERAUN DE LOPEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22509855",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22486948",
    "name": "JUDITH ESTHER GAVIDIA MEDRANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22486948",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22464940",
    "name": "JULIO AUGUSTO NACION MOYA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22464940",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04014156",
    "name": "JULIO CESAR CARHUARICRA MEZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04014156",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22512685",
    "name": "JULIO CESAR CASTRO CESPEDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22512685",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08201754",
    "name": "JULIO CESAR DIAZ ZEGARRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08201754",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "09458241",
    "name": "JULIO CESAR QUIROZ ALVARADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-09458241",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06278286",
    "name": "JULIO CONSTANTINO TUEROS ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06278286",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22513816",
    "name": "JULIO VICENTE PARDAVE BRANCACHO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22513816",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "18032294",
    "name": "JULISSA ELIZABETH REYNA GONZALEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-18032294",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22515074",
    "name": "JUSTINA ISABEL PRADO JUSCAMAITA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22515074",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22428396",
    "name": "JUVENAL AUBERTO OLIVEROS DAVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22428396",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20718040",
    "name": "JUVITA DINA SOTO HILARIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20718040",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22530263",
    "name": "KADIR JOHN MARQUEZ DAVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22530263",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511597",
    "name": "KARIN ESTACIO LAGUNA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511597",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "71539392",
    "name": "KATHERINE MELIZA MAXIMILIANO FRETEL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-71539392",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22475807",
    "name": "LAURA CARMEN BARRIONUEVO TORRES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22475807",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22720910",
    "name": "LENIN DOMINGO ALVARADO VARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22720910",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22499593",
    "name": "LEO CISNEROS MARTINEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22499593",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22409006",
    "name": "LEONCIO ENRIQUE VASQUEZ SOLIS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22409006",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40349762",
    "name": "LESTER FROILAN SALINAS ORDOÑEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40349762",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "31673863",
    "name": "LIBBA HIPOLITA QUIROZ LAGUNA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-31673863",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43691514",
    "name": "LICETH ROCIO HUAMAN LEANDRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43691514",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22409783",
    "name": "LIDA DAYS BERAUN QUIÑONES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22409783",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22401702",
    "name": "LILIA LUCY CAMPOS CORNEJO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22401702",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40861989",
    "name": "LILIANA FRETEL RAMIREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40861989",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80139394",
    "name": "LILIANA LEANDRO ZUÑIGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80139394",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "00031032",
    "name": "LIMBER PINCHI FASANANDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-00031032",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "71695147",
    "name": "LINCOL JARLY GOMEZ MEZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-71695147",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405461",
    "name": "LINVER LUCIANO VILLAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405461",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "73178414",
    "name": "LITA MELODY CHIRINOS FERRER",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-73178414",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "29538387",
    "name": "LIZANDRO OMAR SALAS ARRIARAN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-29538387",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405065",
    "name": "LIZARDO CAICEDO DAVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405065",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514539",
    "name": "LOLO PEREZ NAUPAY",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514539",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08313575",
    "name": "LOURDES LUCILA CÉSPEDES AGUIRRE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08313575",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 405",
    "employee_id": "20001670",
    "name": "LUCIO TORRES ROMERO",
    "curso": "Gestión de Proyectos de Infraestructura Vial con Metodología BIM",
    "teams": "TEAMS-20001670",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "43183838",
    "name": "LUIS ALBERTO BAMBAREN MATA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43183838",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407213",
    "name": "LUIS ALBERTO LAGUNA ARIAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407213",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "19910127",
    "name": "LUIS ALBERTO PACHECO PEÑA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-19910127",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20063064",
    "name": "LUIS ANDRES MEZA ORDOÑEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20063064",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22516264",
    "name": "LUIS ENRIQUE GARCIA PEREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22516264",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 301",
    "employee_id": "29280917",
    "name": "LUIS ERNESTO MURGUIA SANCHEZ",
    "curso": "ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA",
    "teams": "TEAMS-29280917",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "41198244",
    "name": "LUIS GERONIMO LIRA CAMARGO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41198244",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42380412",
    "name": "LUIS HENRRY BARRUETA SALAZAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42380412",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22426685",
    "name": "LUIS HERNAN MOZOMBITE CAMPOVERDE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22426685",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22409532",
    "name": "LUIS SOTO SOTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22409532",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511073",
    "name": "LUIS TARAZONA CERVANTES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511073",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411123",
    "name": "LUIS VILLODAS ROSALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411123",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07539368",
    "name": "LUPE ESTHER GRAUS CORTEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07539368",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40460777",
    "name": "LUZ MERY NOLAZCO BRAVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40460777",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422460",
    "name": "LUZVELIA GUADALUPE ALVAREZ ORTEGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422460",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22414388",
    "name": "LYNDON VICTOR SOTO COZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22414388",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "71869956",
    "name": "Mag. CASTAÑEDA ESCALANTE, FAVIO ANDRE",
    "aula": "Aula 501",
    "curso": "DERECHO CIVIL I (CONTRATOS)",
    "teams": "418H 260817 DERECHO CIVIL I (CONTRATOS)",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22486872",
    "name": "Mag. RODRIGUEZ ASPAJO, JOSE FRANCISCO",
    "aula": "Aula 303",
    "curso": "FINANCIAMIENTO EN SALUD PÚBLICA",
    "teams": "403H 260817 FINANCIAMIENTO EN SALUD PÚBLICA",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "41831780",
    "name": "Mag. SOTO ESPEJO, SIMEON",
    "aula": "Aula 505",
    "curso": "TESIS I",
    "teams": "415H 260817 TESIS I",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "44455178",
    "name": "Mag. ZEVALLOS GONZALES, CARLOS LUDWIN",
    "aula": "Aula 305",
    "curso": "CREATIVIDAD E INNOVACIÓN",
    "teams": "401H 260817 CREATIVIDAD E INNOVACIÓN",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "01235848",
    "name": "MAGNO GONGORA CHAVEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-01235848",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "71868060",
    "name": "MANUEL EMILIO REATEGUI INGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-71868060",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411038",
    "name": "MANUEL MARIN MOZOMBITE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411038",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20892344",
    "name": "MANUEL ROBERTO BLANCO ALIAGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20892344",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43739569",
    "name": "MAO TARAZONA TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43739569",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22423219",
    "name": "MARCE ULICES PEREZ SAAVEDRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22423219",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22481480",
    "name": "MARCO ALBERTO SUAREZ POZO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22481480",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07976489",
    "name": "MARCO ANTONIO ANGULO MORALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07976489",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "21786200",
    "name": "MARCO ANTONIO LUJAN PACHAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-21786200",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22462243",
    "name": "MARIA BETZABE GUTIERREZ SOLORZANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22462243",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 304",
    "employee_id": "22406474",
    "name": "MARIA DEL CARMEN VILLAVICENCIO GUARDIA",
    "curso": "SALUD PÚBLICA",
    "teams": "TEAMS-22406474",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22503110",
    "name": "MARIA DEL PILAR MELGAREJO FIGUEROA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22503110",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "19816828",
    "name": "MARIA ELENA RAMOS NAVARRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-19816828",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "29270271",
    "name": "MARIA JESUS ROSAS VALDIVIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-29270271",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 202",
    "employee_id": "22423197",
    "name": "MARIA LUZ ORTIZ DE AGUI",
    "curso": "ADMINISTRACIÓN MODERNA DE LOS SERVICIOS DE SALUD",
    "teams": "TEAMS-22423197",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22420798",
    "name": "MARIA TERESA CORCINO BARRUETA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22420798",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22500565",
    "name": "MARIELLA CATHERINE GARAY MERCADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22500565",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22418598",
    "name": "MARINA IVERCIA LLANOS DE TARAZONA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22418598",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "23811800",
    "name": "MARIO ALEJANDRO CANDIA GALLEGOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-23811800",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 101",
    "employee_id": "29379947",
    "name": "MARIO SALOMON AGUILAR PARI",
    "curso": "SEMINARIO TALLER: TESIS II",
    "teams": "TEAMS-29379947",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "43107651",
    "name": "MARISOL ROSSANA ORTEGA BUITRON",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43107651",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80001160",
    "name": "MARX DANLY LEON TRUJILLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80001160",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22487475",
    "name": "MARY LUISA MAQUE PONCE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22487475",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22428309",
    "name": "MAURO ANTONIO DOMINGUEZ MAGINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22428309",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "21088161",
    "name": "MAX JOHN ZAVALA SOLORZANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-21088161",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "81060481",
    "name": "MAYCOL KEVIN CRUZ FERNANDEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-81060481",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22480920",
    "name": "MELCHOR GUILLERMO VICENTE MALLQUI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22480920",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22400343",
    "name": "MELECIO PARAGUA MORALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22400343",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405539",
    "name": "MELIDA SARA RIVERO LAZO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405539",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10541954",
    "name": "MELINA PENELOPE TOLENTINO COTRINA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10541954",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22503206",
    "name": "MERCEDES VILMA BARRUETA SANTILLAN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22503206",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20048290",
    "name": "MERITH EVA BARDALES MENECES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20048290",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "73531875",
    "name": "MG. CAJAS AMBROCIO, YENI BELINDA",
    "aula": "Aula 503",
    "curso": "PLANIFICACIÓN Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN",
    "teams": "417H 260817 PLANIFICACIÓN Y EVALUACIÓN DE PROYECTOS DE INVERSIÓN",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 404",
    "employee_id": "23944821",
    "name": "MG. GALIMBERTI OLIVEIRA, MARIA CECILIA",
    "curso": "ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA",
    "teams": "419H 260817 ANTROPOLOGÍA MÉDICA APLICADA A LA SALUD PÚBLICA",
    "modalidad": "Presencial",
    "tipo_horario": "Ambos Horarios",
    "cargo": "Docente"
  },
  {
    "employee_id": "47036878",
    "name": "MG. HUAMANÍ CALLUPE, CARLA LIZBETH",
    "aula": "Aula 301",
    "curso": "GESTIÓN DE RIESGOS",
    "teams": "412H 260817 GESTIÓN DE RIESGOS",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511171",
    "name": "MG. ISIDRO CESPEDES, MARCO ARMANDO",
    "aula": "Aula 202",
    "curso": "SALUD PÚBLICA",
    "teams": "405H 260817 SALUD PÚBLICA",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22474338",
    "name": "MG. MARTEL SANTIAGO, ALFREDO",
    "aula": "Aula 405",
    "curso": "CRIMINOLOGÍA",
    "teams": "402H 260817 CRIMINOLOGÍA",
    "modalidad": "Presencial",
    "tipo_horario": "Entre Semana",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 303",
    "employee_id": "40976991",
    "name": "MG. PORTUGAL ESPINOZA, LISSET",
    "curso": "POLÍTICAS NACIONALES EN SALUD",
    "teams": "TEAMS-40976991",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "46640938",
    "name": "MICHAEL NEILL RUBIO GABRIEL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-46640938",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22427307",
    "name": "MIDA AGUIRRE CANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22427307",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22428046",
    "name": "MIGUEL ALFREDO CARRASCO MUÑOZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22428046",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22520461",
    "name": "MIGUEL ANGEL CHUQUIYAURI TALENAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22520461",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40856730",
    "name": "MIGUEL ANGEL JAIMES CAMPOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40856730",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 501",
    "employee_id": "46161730",
    "name": "MIGUEL ENRIQUE BASILIO GAMARRA",
    "curso": "SEMINARIO DE TESIS I",
    "teams": "TEAMS-46161730",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "20906063",
    "name": "MIGUEL NINO CHAVEZ LEANDRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20906063",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43525368",
    "name": "MIHAY YULLY ROJAS ORIHUELA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43525368",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22413751",
    "name": "MILKA NELLY TELLO VILLAVICENCIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22413751",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Fiis 403",
    "employee_id": "22521879",
    "name": "MILTON CESAR PEREZ SOLIS",
    "curso": "NUEVAS TENDENCIAS EN LA GESTIÓN EMPRESARIAL",
    "teams": "TEAMS-22521879",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22475878",
    "name": "MITSI MARLENI QUIÑONES FLORES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22475878",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22494112",
    "name": "MOISES EDGARD TORRES RAMIREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22494112",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22510578",
    "name": "NANCY DORIS CALZADA GONZALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22510578",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22494508",
    "name": "NANCY ELIZABETH CASTAÑEDA EUGENIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22494508",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22421418",
    "name": "NANCY GUILLERMINA VERAMENDI VILLAVICENCIOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22421418",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422988",
    "name": "NARDA SOCORRO TORRES MARTINEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422988",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "80067703",
    "name": "NEIL RAUL CORI VARGAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-80067703",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04000726",
    "name": "NELLY ADELA HILARIO PORRAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04000726",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08853734",
    "name": "NELLY AURORA PEREZ DIAZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08853734",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22459224",
    "name": "NERIDA DEL CARMEN PASTRANA DIAZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22459224",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04010138",
    "name": "NICEFORO BUSTAMANTE PAULINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04010138",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22416288",
    "name": "NIKER JHON SALINAS ALEJANDRO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22416288",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "01510330",
    "name": "NILDA HUAYTA ARAPA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-01510330",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514207",
    "name": "NILTON CESAR AYRA APAC",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514207",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22512749",
    "name": "NILTON OVIDIO ALVARADO CALIXTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22512749",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422094",
    "name": "NORMA SOLEDAD AGUILAR JARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422094",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20904632",
    "name": "OMAR HANS CONTRERAS CANTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20904632",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22414238",
    "name": "ORLANDO HERRERA SOLORZANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22414238",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "02003104",
    "name": "OSCAR JAVIER DIAZ RIVERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-02003104",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43392844",
    "name": "OSMAR ROBERT REYES CORDOVA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43392844",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20009861",
    "name": "OSWALDO JESÚS MARIÑO ALFARO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20009861",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40316881",
    "name": "PATRICIA KAREN PAUCAR LESCANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40316881",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 403",
    "employee_id": "22465210",
    "name": "PEDRO DAVID CORDOVA TRUJILLO",
    "curso": "TECNOLOGÍA DE PROTECCIÓN AMBIENTAL",
    "teams": "TEAMS-22465210",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22406521",
    "name": "PEDRO GETULIO VILLAVICENCIO GUARDIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22406521",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "19967277",
    "name": "PEDRO PABLO SAQUICORAY AVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-19967277",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40871315",
    "name": "PERCY RONALD GAMARRA POMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40871315",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22432324",
    "name": "PIO TRUJILLO ATAPOMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22432324",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22403766",
    "name": "QUINTIDIANO NAPOLEON CESPEDES GALARZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22403766",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22964514",
    "name": "RAUL EDGARDO NATIVIDAD FERRER",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22964514",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40384176",
    "name": "RAUL FILIOL MENDOZA TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40384176",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "21256041",
    "name": "RAUL JORGE ALIAGA CAMARENA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-21256041",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514721",
    "name": "REITER LOZANO DAVILA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514721",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22403763",
    "name": "RENE CASTRO BRAVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22403763",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "43190975",
    "name": "RENZO ALEXANDER RUIZ REYNOSO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-43190975",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "45250659",
    "name": "REYDER ALEXANDER LAMBRUSCHINI ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-45250659",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22420141",
    "name": "REYNALDO MARCIAL OSTOS MIRAVAL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22420141",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08830767",
    "name": "RICARDO SANCHEZ MURRUGARRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08830767",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42353682",
    "name": "RINA TARAZONA TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42353682",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 201",
    "employee_id": "22401132",
    "name": "RIOS CARDENAS, LUIS JAVIER",
    "curso": "CRIMINALÍSTICA",
    "teams": "TEAMS-22401132",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "71586889",
    "name": "ROBERTO ANGELO CALERO BRAVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-71586889",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41144876",
    "name": "ROBERTO SHIMABUKURO MIYASATO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41144876",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22419448",
    "name": "ROBERTO SIXTO PERALES FLORES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22419448",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22527320",
    "name": "ROCIO DEL PILAR DAVILA SOTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22527320",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04014653",
    "name": "ROCIO ELIZABETH RIVERA IBARRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04014653",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22481023",
    "name": "ROCIO ESMERALDA CHAVEZ CABELLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22481023",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "72747726",
    "name": "ROCIO MAYBEC ALBORNOZ LOARTE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-72747726",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22520752",
    "name": "ROCIO VERONICA RASMUZZEN SANTAMARIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22520752",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22503540",
    "name": "RODOLFO JOSE ESPINOZA ZEVALLOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22503540",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22403443",
    "name": "ROGELIO ALVARADO DUEÑAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22403443",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41098989",
    "name": "ROGER ESTACIO LAGUNA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41098989",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41654520",
    "name": "ROGER PAVLETICH VIDAL RAMOS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41654520",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22418335",
    "name": "ROGER WILFREDO CESPEDES REVELO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22418335",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07749696",
    "name": "ROLANDO VENTURA GONZALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07749696",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22530171",
    "name": "ROMER JUVENAL JAVIER QUIJANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22530171",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "09163100",
    "name": "RONAL NEY VISAG SALAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-09163100",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22490624",
    "name": "ROQUE VALDIVIA JARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22490624",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41607377",
    "name": "ROSA AMELIA KOHAMA ARESTEGUI",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41607377",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "10332929",
    "name": "ROSA AMELIA VALLEJOS LIZÁRRAGA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-10332929",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Virtual 2",
    "employee_id": "44256479",
    "name": "ROSA ELIZABETH BALLARDO JAPAN",
    "curso": "FUNDAMENTOS DE SEGURIDAD Y SALUD OCUPACIONAL",
    "teams": "TEAMS-44256479",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422932",
    "name": "ROSALINDA RAMÍREZ MONTALDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422932",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22474880",
    "name": "ROSARIO DEL PILAR DE LA MATA HUAPAYA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22474880",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08028269",
    "name": "ROSARIO ELVA SANCHEZ INFANTAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08028269",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "16642964",
    "name": "ROSEL APAESTEGUI LIVAQUE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-16642964",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22519495",
    "name": "ROSSY MAJINO GONZALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22519495",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "06511922",
    "name": "RUBEN MAX ROJAS PORTAL",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-06511922",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22424346",
    "name": "RUBEN VICTOR LIMAYLLA JURADO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22424346",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04002676",
    "name": "SALOMON HARRY SANTOLALLA RUIZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04002676",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22480830",
    "name": "SAMUEL SANTOS ESPINOZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22480830",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22462099",
    "name": "SANTOS SEVERINO JACOBO SALINAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22462099",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22737894",
    "name": "SEBASTIAN CAMPOS MEZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22737894",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42621898",
    "name": "SERGIO GRIMALDO MUÑOZ GARAY",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42621898",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22646145",
    "name": "SEVERO IGNACIO CARDENAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22646145",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22414911",
    "name": "SILNA TERESITA VELA LOPEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22414911",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "07107780",
    "name": "SILVESTRE ZENON DEPAZ TOLEDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-07107780",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22423118",
    "name": "SILVIA ALICIA MARTEL Y CHANG",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22423118",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "44468544",
    "name": "SONIA FIORELLA CALLUPE BECERRA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-44468544",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "72702701",
    "name": "STEFANY DAYANA SOTO PALOMINO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-72702701",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "17885392",
    "name": "SUCENA ELIZABETH MORENO MORENO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-17885392",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "18158311",
    "name": "TANIA ELIZABETH GUERRERO VEJARANO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-18158311",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22516168",
    "name": "TANIA FERNANDEZ GINES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22516168",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20713458",
    "name": "TEODOMIRO ARIAS FLORES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20713458",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22497889",
    "name": "TEOFANES ANSELMO CANCHES GONZALES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22497889",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22516259",
    "name": "TEOFILO MIGUEL PINEDA CLAUDIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22516259",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22487758",
    "name": "TERESA GUERRA CARHUAPOMA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22487758",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "04085862",
    "name": "TOMAS DALI VILLENA ANDRADE",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-04085862",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "08343126",
    "name": "TOMASA VERONICA CAJAS BRAVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-08343126",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40869824",
    "name": "TOÑO MEZA PAUCAR",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40869824",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42321381",
    "name": "ULDA CAMPOS FELIX",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42321381",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22512731",
    "name": "ULISES REENIER GUANILO LUNA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22512731",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42056322",
    "name": "VICKY JEANNINE PANDURO CORREA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42056322",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22493341",
    "name": "VICTOR ABRAHAM AZAÑEDO RAMIREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22493341",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22508415",
    "name": "VICTOR CIRO TORRES SALCEDO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22508415",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "18035215",
    "name": "VICTOR ENRIQUE CABRERA ABANTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-18035215",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22504785",
    "name": "VICTOR ENRIQUE MELGAREJO BLAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22504785",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22461263",
    "name": "VICTOR GUIDO FLORES AYALA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22461263",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "41020089",
    "name": "VICTOR HUGO MARTEL PAREDES",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-41020089",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22422226",
    "name": "VICTOR JAVIER BERROSPI CASTILLO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22422226",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22515431",
    "name": "VICTOR MANUEL GOICOCHEA VARGAS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22515431",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22468269",
    "name": "VICTOR MANUEL ROJAS RIVERA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22468269",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511531",
    "name": "VICTOR PEDRO CUADROS OJEDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511531",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22962246",
    "name": "VICTOR QUISPE SULCA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22962246",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22486830",
    "name": "VIOLETA BENIGNA ROJAS BRAVO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22486830",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22461534",
    "name": "VITALIANA VEGA MONTESILLO DE CRISPIN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22461534",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514774",
    "name": "WALTER RICHARD TASAYCO ALCANTARA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514774",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22512084",
    "name": "WALTER TEOFILO BALDEON CANCHAYA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22512084",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22469459",
    "name": "WALTER VIZCARRA ARBIZU",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22469459",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22405436",
    "name": "WERNER PINCHI RAMIREZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22405436",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42156057",
    "name": "WILBER HUAMANYAURI CORNELIO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42156057",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22489452",
    "name": "WILDER ANTONIO DOMINGUEZ ESPIRITU",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22489452",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Virtual 5",
    "employee_id": "41495526",
    "name": "WILDER JAVIER MARTEL TOLENTINO",
    "curso": "SEMINARIO TALLER DE TESIS I: ELABORACIÓN DEL PROYECTO",
    "teams": "TEAMS-41495526",
    "modalidad": "Virtual (Teams)",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22417860",
    "name": "WILFREDO ANTONIO SOTIL CORTAVARRIA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22417860",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "02006020",
    "name": "WILSON ALEXANDER TUESTA PEDRAZA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-02006020",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22674813",
    "name": "XENIA ROSARIO VERDI CHAHUA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22674813",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22489327",
    "name": "YANETH ELENA RUFINO MELENDEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22489327",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22485176",
    "name": "YENNY MIRIAM NAUPAY GONZALEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22485176",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42051986",
    "name": "YERMMY VASQUEZ SALIS",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42051986",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22507418",
    "name": "YESICA MATOS LURQUIN",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22507418",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22511575",
    "name": "YESSICA MARIA RIVERA MANSILLA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22511575",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "aula": "Aula 305",
    "employee_id": "22468386",
    "name": "YOLA ESPINOZA DE SANTIAGO",
    "curso": "GESTIÓN DE RECURSOS Y TALENTO HUMANO",
    "teams": "TEAMS-22468386",
    "modalidad": "Presencial",
    "tipo_horario": "Fin de Semana",
    "cargo": "Docente"
  },
  {
    "employee_id": "22411085",
    "name": "YONEL FORTUNATO CHOCANO FIGUEROA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22411085",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22435789",
    "name": "YONSON TARAZONA TUCTO",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22435789",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "42816455",
    "name": "YOSSARY DARILL BRAVO TABOADA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-42816455",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22475231",
    "name": "ZENON CIELO MALPARTIDA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22475231",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22416403",
    "name": "ZOCIMO REMO SERRANO COZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22416403",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22514720",
    "name": "ZOILA ELVIRA MIRAVAL TARAZONA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22514720",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "40945381",
    "name": "ZOILITA FARIDI GABINO GONZALEZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-40945381",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "20721443",
    "name": "ZONIA ELIZABETH SANTOS MUÑOZ",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-20721443",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  },
  {
    "employee_id": "22407184",
    "name": "ZOSIMO PEDRO JACHA AYALA",
    "aula": "Posgrado UNHEVAL",
    "curso": "Docente de Posgrado",
    "teams": "TEAMS-22407184",
    "modalidad": "Presencial",
    "tipo_horario": "Padrón General",
    "cargo": "Docente"
  }
];
