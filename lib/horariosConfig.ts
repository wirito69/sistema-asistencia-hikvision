export interface RangoTurno {
  horaInicioEntrada: string; // "14:00"
  horaFinEntrada: string;    // "20:30"
  horaInicioSalida: string;   // "20:30"
  horaFinSalida: string;     // "23:59"
  horaOficial: string;       // "18:00"
  toleranciaMinutos: number; // 30
}

export interface HorariosConfig {
  version: string;
  entreSemana: RangoTurno;
  sabadoManana: RangoTurno;
  sabadoTarde: RangoTurno;
  voz: {
    habilitarVoz: boolean;
    habilitarEntrada: boolean;
    habilitarSalida: boolean;
    horaMinimaVoz: string; // "14:00"
    horaMaximaVoz: string; // "23:00"
  };
}

export const DEFAULT_HORARIOS_CONFIG: HorariosConfig = {
  version: "v1_2026",
  entreSemana: {
    horaInicioEntrada: "14:00",
    horaFinEntrada: "20:30",
    horaInicioSalida: "20:30",
    horaFinSalida: "23:59",
    horaOficial: "18:00",
    toleranciaMinutos: 30,
  },
  sabadoManana: {
    horaInicioEntrada: "06:00",
    horaFinEntrada: "11:00",
    horaInicioSalida: "11:00",
    horaFinSalida: "14:30",
    horaOficial: "07:00",
    toleranciaMinutos: 30,
  },
  sabadoTarde: {
    horaInicioEntrada: "14:30",
    horaFinEntrada: "17:30",
    horaInicioSalida: "17:30",
    horaFinSalida: "22:00",
    horaOficial: "15:00",
    toleranciaMinutos: 30,
  },
  voz: {
    habilitarVoz: true,
    habilitarEntrada: true,
    habilitarSalida: true,
    horaMinimaVoz: "06:00",
    horaMaximaVoz: "23:00",
  },
};

export function timeStringToDecimal(timeStr: string): number {
  if (!timeStr) return 0;
  const [hStr, mStr] = timeStr.split(":");
  const h = parseInt(hStr || "0", 10);
  const m = parseInt(mStr || "0", 10);
  return h + m / 60;
}

export function decimalToTimeString(dec: number): string {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
