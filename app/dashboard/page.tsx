"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";
import {
  Radio,
  Clock,
  Download,
  ShieldCheck,
  UserCheck,
  UserX,
  Activity,
  User,
  Camera,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Users,
  Calendar,
  CheckCircle2,
  KeyRound,
  GraduationCap,
  Award,
  Tv,
  Split,
  Smartphone,
  ShieldAlert,
  PhoneCall,
  Newspaper,
  FileSpreadsheet,
  History,
  Send,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  X,
  TrendingUp,
  AlertTriangle,
  Lock,
  Eye,
  Layers,
  MapPin,
  Laptop,
  QrCode,
  Trophy,
  Menu,
  AlertCircle,
  Check,
  Megaphone,
  Upload,
  Save,
  Mic,
  Square,
  CalendarClock,
  FileText,
  UserPlus,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  ZoomIn,
  Search,
  RotateCcw,
  Printer,
} from "lucide-react";
import { UNHEVAL_DOCENTES_DATA, DocenteData } from "@/lib/docentesData";

// Generador de Campana / Ding-Dong de Aeropuerto con Web Audio API
function playAirportChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Primer tono: 880Hz (La / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.55);

    // Segundo tono: 587.33Hz (Re / D5) - Ding Dong Armónico
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(587.33, now + 0.3);
    gain2.gain.setValueAtTime(0, now + 0.3);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.3);
    osc2.stop(now + 1.1);
  } catch (e) {
    console.error("No se pudo reproducir campana:", e);
  }
}

// Convertidor de Base64 PCM Int16 a Float32Array para Web Audio en Tiempo Real (<150ms latencia)
function base64ToFloat32(base64: string): Float32Array {
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }
    return float32;
  } catch {
    return new Float32Array(0);
  }
}

// Convertidor de Float32Array de micrófono a Base64 PCM Int16 para transmisión instantánea
function float32ToInt16Base64(float32: Float32Array): string {
  try {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16.buffer);
    let binary = "";
    const chunk = 8192;
    for (let i = 0; i < bytes.byteLength; i += chunk) {
      const sub = bytes.subarray(i, i + chunk);
      binary += String.fromCharCode.apply(null, Array.from(sub));
    }
    return window.btoa(binary);
  } catch {
    return "";
  }
}

interface AccessLog {
  id: number;
  employee_id: string;
  employee_name: string | null;
  tipo_evento?: string;
  picture_url: string | null;
  timestamp: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ttadifnnamibraysbrbm.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function normalizeDNI(dni: string | number | null | undefined): string {
  if (!dni) return "";
  let s = String(dni).trim();
  // Reemplazar la letra 'O' o 'o' inicial por '0'
  s = s.replace(/^[oO]/, "0").replace(/[^0-9a-zA-Z]/g, "");
  // Si son solo dígitos y tiene entre 6 y 7 caracteres, rellenar con ceros a la izquierda (ej: 7951959 -> 07951959)
  if (/^\d+$/.test(s) && s.length < 8 && s.length >= 6) {
    s = s.padStart(8, "0");
  }
  return s;
}

function matchDNI(dniA: string | number | null | undefined, dniB: string | number | null | undefined): boolean {
  const a = normalizeDNI(dniA);
  const b = normalizeDNI(dniB);
  if (!a || !b) return false;
  if (a === b) return true;
  const aClean = a.replace(/^0+/, "");
  const bClean = b.replace(/^0+/, "");
  return aClean.length > 0 && aClean === bClean;
}

function getSlotIndexForLog(isoTimestamp: string, isSaturday: boolean, isMWF: boolean): number {
  try {
    const d = new Date(isoTimestamp);
    const peruTimeStr = d.toLocaleTimeString("en-US", { timeZone: "America/Lima", hour12: false });
    const [hStr, mStr] = peruTimeStr.split(":");
    const hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);
    const timeNum = hours + minutes / 60;

    if (isSaturday) {
      if (timeNum < 6.0) return -1; // Antes de las 06:00 AM
      if (timeNum < 11.0) return 0; // Entrada Mañana (07:00)
      if (timeNum >= 11.0 && timeNum < 14.5) return 1; // Salida Mañana (14:00)
      if (timeNum >= 14.5 && timeNum < 17.5) return 2; // Entrada Tarde (15:00)
      return 3; // Salida Tarde (18:30)
    }

    if (isMWF) {
      // Turno Noche L-M-V (18:00 a 21:30)
      // Docentes que lleguen por la tarde/noche (desde las 14:00 hasta las 20:30) cuentan como Entrada (slot 0)
      if (timeNum < 14.0) return -1;
      if (timeNum < 20.3) return 0; // Entrada Noche (18:00)
      return 1; // Salida Noche (21:30)
    }

    // Fin de Semana Domingo o Regular
    if (timeNum < 6.0) return -1;
    if (timeNum < 13.0) return 0;
    return 1;
  } catch {
    return 0;
  }
}

// Ordenamiento natural de Aulas (Aula 101, 102... 506, Fiis, Sala de Grados, Virtuales)
function sortAulasNatural(a: DocenteData, b: DocenteData): number {
  const parseAulaRank = (aulaStr?: string): number => {
    if (!aulaStr) return 9999;
    const clean = aulaStr.trim().toLowerCase();
    const match = clean.match(/aula\s*(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
    if (clean.includes("fiis")) return 2000;
    if (clean.includes("grados")) return 2100;
    if (clean.includes("direcc")) return 2200;
    const vMatch = clean.match(/virtual\s*(\d+)/);
    if (vMatch) {
      return 3000 + parseInt(vMatch[1], 10);
    }
    if (clean.includes("virtual")) return 3000;
    return 5000;
  };

  const rankA = parseAulaRank(a.aula);
  const rankB = parseAulaRank(b.aula);
  if (rankA !== rankB) return rankA - rankB;
  return (a.aula || "").localeCompare(b.aula || "", undefined, { numeric: true, sensitivity: "base" });
}

// Función auxiliar para calcular el semáforo de 4 estados en cada slot
function getSlotStatus(slotIdx: number, log: AccessLog | null | undefined, isSat: boolean, curHour: number) {
  if (log) {
    const isExit = String(log.tipo_evento).toUpperCase() === "SALIDA" || (slotIdx % 2 === 1);
    if (isExit) {
      return {
        status: "salida",
        label: "Salida ✅",
        badgeLabel: "Salida ✅",
        colorClass: "bg-blue-950/60 border-blue-500/50 text-blue-300",
        bgClass: "bg-blue-600 text-white",
        isMissed: false,
      };
    }

    // Calcular si la ENTRADA fue puntual o con tardanza (+30m)
    let isLate = false;
    if (log.timestamp) {
      const d = new Date(log.timestamp);
      const peruTimeStr = d.toLocaleTimeString("en-US", { timeZone: "America/Lima", hour12: false });
      const [hStr, mStr] = peruTimeStr.split(":");
      const timeNum = parseInt(hStr, 10) + parseInt(mStr, 10) / 60;
      if (isSat) {
        if (slotIdx === 0 && timeNum > 7.5) isLate = true; // Mañana tolerada hasta 07:30
        if (slotIdx === 2 && timeNum > 15.5) isLate = true; // Tarde tolerada hasta 15:30
      } else {
        if (slotIdx === 0 && timeNum > 18.5) isLate = true; // Noche tolerada hasta 18:30
      }
    }

    if (isLate) {
      return {
        status: "tardanza",
        label: "Entrada (+30m) ⚠️",
        badgeLabel: "Tarde (+30m) ⚠️",
        colorClass: "bg-amber-950/60 border-amber-500/50 text-amber-300",
        bgClass: "bg-amber-500 text-slate-950",
        isMissed: false,
      };
    }

    return {
      status: "presente",
      label: "Puntual ✅",
      badgeLabel: "Puntual ✅",
      colorClass: "bg-emerald-950/60 border-emerald-500/50 text-emerald-300",
      bgClass: "bg-emerald-600 text-white",
      isMissed: false,
    };
  }

  // Si aún no hay marcaje: evaluar si ya venció el tiempo de tolerancia (+30m)
  let slotTime = 24;
  if (isSat) {
    slotTime = [7.5, 13.5, 15.5, 20.5][slotIdx] || 24;
  } else {
    slotTime = [18.5, 22.0][slotIdx] || 24;
  }
  const isMissed = curHour > slotTime;

  return {
    status: isMissed ? "sin_registro" : "esperando",
    label: isMissed ? "Sin Registro 🔴" : "Esperando...",
    badgeLabel: isMissed ? "Sin Registro 🔴" : "Pendiente",
    colorClass: isMissed ? "bg-rose-950/50 border-rose-500/40 text-rose-300" : "bg-slate-900/60 border-slate-800 text-slate-500",
    bgClass: isMissed ? "bg-rose-600 text-white" : "bg-slate-800/80 text-slate-500",
    isMissed,
  };
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [docentes, setDocentes] = useState<DocenteData[]>(UNHEVAL_DOCENTES_DATA);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentHourDecimal, setCurrentHourDecimal] = useState<number>(12);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  // Modo Pantalla Alumnos (Limpio para TV de 42") vs Modo Administrativo
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  // Menú Hamburguesa Drawer Lateral Desplegable
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  // Modo Pantalla Dividida / Cartelera Digital para Smart TV 4K
  const [isCarteleraMode, setIsCarteleraMode] = useState<boolean>(false);
  const [carruselIndex, setCarruselIndex] = useState<number>(0);
  const [gestorSearch, setGestorSearch] = useState<string>("");
  const [selectedHorario, setSelectedHorario] = useState<string>("todos");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"timeline" | "aulas" | "gestor" | "faltan" | "presentes" | "historial" | "reportes" | "ranking">("aulas");
  const [horarioFilter, setHorarioFilter] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gestorFilter, setGestorFilter] = useState<string>("todos");
  const [flashGlow, setFlashGlow] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>("");
  const [showVerificarAulasModal, setShowVerificarAulasModal] = useState<boolean>(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState<boolean>(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("+51999999999");
  const [callmebotApiKey, setCallmebotApiKey] = useState<string>("");
  const [isSendingBot, setIsSendingBot] = useState<boolean>(false);
  const [botStatusMsg, setBotStatusMsg] = useState<string>("");
  const [zoomedImage, setZoomedImage] = useState<{
    url: string;
    name: string;
    id: string;
    time: string;
    tipo: string;
  } | null>(null);


  // Estado para el modal de carga de horarios en PDF
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Estado para el modal de agregar nuevo docente
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDni, setNewDni] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newAula, setNewAula] = useState<string>("");
  const [newCurso, setNewCurso] = useState<string>("");
  const [newTeams, setNewTeams] = useState<string>("");
  const [newModalidad, setNewModalidad] = useState<"Presencial" | "Virtual (Teams)">("Presencial");
  const [newTipoHorario, setNewTipoHorario] = useState<"Entre Semana" | "Fin de Semana" | "Ambos Horarios" | "Padrón General">("Fin de Semana");

  // Estado para editar un docente existente inline / modal
  

  // Estados para el Módulo de Reportes y Liquidación de Asistencia
  const [reporteFechaInicio, setReporteFechaInicio] = useState<string>(() => {
    const d = new Date();
    d.setDate(1); // Primer día del mes
    return d.toISOString().split("T")[0];
  });

  const [reporteFechaFin, setReporteFechaFin] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [reporteTipoHorario, setReporteTipoHorario] = useState<"todos" | "sd" | "lmv">("todos");
  const [reporteSearch, setReporteSearch] = useState<string>("");
  const [reporteViewMode, setReporteViewMode] = useState<"detalle" | "consolidado">("detalle");
  const [reporteData, setReporteData] = useState<any | null>(null);
  const [isGeneratingReporte, setIsGeneratingReporte] = useState<boolean>(false);

  // Carrusel automático para la Cartelera Digital en Smart TV
  useEffect(() => {
    if (!isCarteleraMode) return;
    const interval = setInterval(() => {
      setCarruselIndex((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarteleraMode]);

  // Cargar reporte automáticamente al abrir la pestaña de reportes
  const handleFetchReporte = async () => {
    setIsGeneratingReporte(true);
    try {
      const res = await fetch(
        `/api/reportes?fecha_inicio=${reporteFechaInicio}&fecha_fin=${reporteFechaFin}&tipo_horario=${reporteTipoHorario}&q=${encodeURIComponent(
          reporteSearch
        )}`
      );
      const data = await res.json();
      setReporteData(data);
    } catch (err) {
      console.error("Error al generar reporte:", err);
      alert("Error de conexión al generar reporte.");
    } finally {
      setIsGeneratingReporte(false);
    }
  };

  // Exportar Reporte a Excel (.xlsx) con SheetJS
  const handleExportExcel = () => {
    if (!reporteData) {
      alert("Por favor genera el reporte primero antes de exportar.");
      return;
    }

    try {
      // 1. Hoja Consolidado
      const wsConsolidadoData = (reporteData.consolidado || []).map((c: any) => ({
        DNI: c.dni,
        "NOMBRES Y APELLIDOS": c.docente,
        AULA: c.aula,
        ASIGNATURA: c.curso,
        TURNO: c.tipo_horario,
        "DIAS PROGRAMADOS": c.total_dias_programados,
        "ASISTENCIAS PUNTUALES": c.total_asistencias,
        TARDANZAS: c.total_tardanzas,
        FALTAS: c.total_faltas,
        "MINUTOS TARDANZA ACUMULADOS": c.minutos_tardanza_acumulados,
        "HORAS DICTADAS": c.total_horas_dictadas,
        "% ASISTENCIA": `${c.porcentaje_asistencia}%`,
      }));

      // 2. Hoja Detalle Día a Día
      const wsDetalleData = (reporteData.detalle || []).map((d: any) => ({
        FECHA: d.fecha,
        DIA: d.dia_semana,
        DNI: d.dni,
        DOCENTE: d.docente,
        AULA: d.aula,
        CURSO: d.curso,
        "HORA ENTRADA": d.hora_entrada || "--:--",
        "HORA SALIDA": d.hora_salida || "--:--",
        ESTADO: d.estado,
        "MIN. TARDANZA": d.minutos_tardanza,
        "HORAS DICTADAS": d.horas_dictadas,
      }));

      const wb = XLSX.utils.book_new();
      const wsConsolidado = XLSX.utils.json_to_sheet(wsConsolidadoData);
      const wsDetalle = XLSX.utils.json_to_sheet(wsDetalleData);

      XLSX.utils.book_append_sheet(wb, wsConsolidado, "Consolidado_Docentes");
      XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle_Marcaciones");

      XLSX.writeFile(
        wb,
        `Reporte_Asistencia_Posgrado_UNHEVAL_${reporteFechaInicio}_al_${reporteFechaFin}.xlsx`
      );
    } catch (e) {
      console.error("Error al exportar a Excel:", e);
      alert("Error al exportar el archivo Excel.");
    }
  };

  const [showMegaphoneModal, setShowMegaphoneModal] = useState<boolean>(false);
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [megaphoneTitle, setMegaphoneTitle] = useState<string>("COMUNICADO DE DIRECCIÓN");
  const [megaphoneTab, setMegaphoneTab] = useState<"live" | "record" | "text">("live");
  const [megaphoneText, setMegaphoneText] = useState<string>("");
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastStatus, setBroadcastStatus] = useState<string>("");
  const [incomingBroadcast, setIncomingBroadcast] = useState<{
    title: string;
    text?: string;
    audioBase64?: string;
    timestamp: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Estados y Referencias de Streaming en Tiempo Real (Walkie-Talkie Push-to-Talk)
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const liveAudioCtxRef = useRef<AudioContext | null>(null);
  const liveProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const liveMicStreamRef = useRef<MediaStream | null>(null);
  const liveStreamIdRef = useRef<string>("");

  // Referencias para el Receptor de Audio en Tiempo Real (Smart TVs / Laptops)
  const receiverCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const activeStreamIdRef = useRef<string | null>(null);
  const broadcastChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const tabClientIdRef = useRef<string>(typeof window !== "undefined" ? "tab_" + Math.random().toString(36).substring(2, 9) : "tab_0");

  const voiceEnabledRef = useRef(voiceEnabled);
  voiceEnabledRef.current = voiceEnabled;
  const hasInitialLogsLoadedRef = useRef<boolean>(false);
  const lastAnnouncedTimestampRef = useRef<string>("");

  // Cargar asignaciones sincronizadas de la nube (Supabase) y localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWsp = localStorage.getItem("hik_wsp_number");
      const savedApiKey = localStorage.getItem("hik_callmebot_key");
      if (savedWsp) setWhatsappNumber(savedWsp);
      if (savedApiKey) setCallmebotApiKey(savedApiKey);

      const DOCENTES_VERSION = "v5_ranking_drawer_both_horarios";
      const storedVersion = localStorage.getItem("unheval_docentes_version");

      if (storedVersion !== DOCENTES_VERSION) {
        // Purgar caché antiguo de celulares/navegadores
        localStorage.removeItem("unheval_docentes_custom");
        localStorage.setItem("unheval_docentes_version", DOCENTES_VERSION);
      } else {
        const savedDocentes = localStorage.getItem("unheval_docentes_custom");
        if (savedDocentes) {
          try {
            const parsed = JSON.parse(savedDocentes);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const uniqueMap = new Map<string, DocenteData>();
              parsed.forEach((d: DocenteData) => {
                if (d && d.employee_id && !uniqueMap.has(d.employee_id)) {
                  uniqueMap.set(d.employee_id, d);
                }
              });
              setDocentes(Array.from(uniqueMap.values()));
            }
          } catch (e) {
            console.error("Error al cargar docentes de localStorage", e);
          }
        }
      }
    }

    // Cargar última versión de la nube (Supabase) con cache buster para que celular, PC y TV compartan la misma lista
    fetch(`/api/docentes?_v=v5&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.docentes) && data.docentes.length > 0) {
          const uniqueMap = new Map<string, DocenteData>();
          data.docentes.forEach((d: DocenteData) => {
            if (d && d.employee_id && !uniqueMap.has(d.employee_id)) {
              uniqueMap.set(d.employee_id, d);
            }
          });
          const cloudDocentes = Array.from(uniqueMap.values());
          setDocentes(cloudDocentes);
          if (typeof window !== "undefined") {
            localStorage.setItem("unheval_docentes_custom", JSON.stringify(cloudDocentes));
            localStorage.setItem("unheval_docentes_version", "v5_ranking_drawer_both_horarios");
          }
        }
      })
      .catch((err) => console.error("Error al sincronizar docentes de la nube:", err));
  }, []);

  // Función auxiliar para persistir en la nube (Supabase) y en local
  const syncDocentesCloud = async (updatedList: DocenteData[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("unheval_docentes_custom", JSON.stringify(updatedList));
      }
      const res = await fetch("/api/docentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docentes: updatedList }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error("Error al guardar docentes en la nube:", data.error);
      }
    } catch (e) {
      console.error("Error al guardar docentes en la nube:", e);
    }
  };

  // Guardar cambios en asignaciones
  const handleUpdateDocenteSchedule = async (dni: string, newTipo: string, newAula?: string, newModalidad?: string) => {
    const updated = docentes.map((d) => {
      if (matchDNI(d.employee_id, dni) || d.employee_id === dni) {
        return {
          ...d,
          tipo_horario: newTipo,
          aula: newAula !== undefined ? newAula : d.aula,
          modalidad: newModalidad !== undefined ? newModalidad : d.modalidad,
        };
      }
      return d;
    });

    setDocentes(updated);
    await syncDocentesCloud(updated);

    setSaveSuccessMsg("✅ Sincronizado en la nube (PC, Celular y TV).");
    setTimeout(() => setSaveSuccessMsg(""), 2500);
  };

  // Estado para subida de PDF
  const [isUploadingPdf, setIsUploadingPdf] = useState<boolean>(false);
  const [selectedPdfSchedule, setSelectedPdfSchedule] = useState<"Fin de Semana" | "Entre Semana">("Fin de Semana");
  const [pdfUploadResult, setPdfUploadResult] = useState<string>("");

  const handleProcessPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setPdfUploadResult("⏳ Leyendo y extrayendo docentes, aulas y cursos del PDF...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetSchedule", selectedPdfSchedule);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.docentes)) {
        setDocentes(data.docentes);
        await syncDocentesCloud(data.docentes);
        setPdfUploadResult(`✅ ${data.message}`);
        setSaveSuccessMsg(`✅ ${data.message}`);
        setTimeout(() => {
          setShowUploadModal(false);
          setPdfUploadResult("");
        }, 2000);
      } else {
        setPdfUploadResult(`❌ Error: ${data.error || "No se pudo procesar el archivo"}`);
      }
    } catch (err: unknown) {
      setPdfUploadResult("❌ Error al procesar el archivo PDF.");
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Registrar Nuevo Docente Manualmente
  const handleCreateDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDni.trim() || !newName.trim()) {
      alert("Por favor ingresa al menos el DNI y el Nombre del docente.");
      return;
    }

    const cleanDni = newDni.trim();
    const cleanName = newName.trim().toUpperCase();

    const newDocObj: DocenteData = {
      employee_id: cleanDni,
      name: cleanName,
      aula: newAula.trim() || "Posgrado UNHEVAL",
      curso: newCurso.trim() || "Docencia Posgrado",
      teams: `TEAMS-${cleanDni}`,
      modalidad: newModalidad,
      tipo_horario: newTipoHorario,
      cargo: "Docente",
    };

    const filtered = docentes.filter((d) => !matchDNI(d.employee_id, cleanDni) && d.employee_id !== cleanDni);
    const updated = [newDocObj, ...filtered];
    setDocentes(updated);
    await syncDocentesCloud(updated);

    setNewDni("");
    setNewName("");
    setNewCurso("");
    setShowAddModal(false);
    setSaveSuccessMsg(`✅ Docente ${cleanName} guardado y sincronizado en la nube.`);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  // Estado y Handler para Editar Docente Completo (DNI, Nombre, Aula, Curso, Modalidad, Horario)
  const [editingDocente, setEditingDocente] = useState<{
    originalDni: string;
    employee_id: string;
    name: string;
    aula: string;
    curso: string;
    modalidad: string;
    tipo_horario: string;
  } | null>(null);

  const handleSaveEditDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocente) return;
    if (!editingDocente.employee_id.trim() || !editingDocente.name.trim()) {
      alert("El DNI y el Nombre no pueden estar vacíos.");
      return;
    }

    const cleanDni = editingDocente.employee_id.trim();
    const cleanName = editingDocente.name.trim().toUpperCase();
    const oldDni = editingDocente.originalDni;

    const updated = docentes.map((d) => {
      const isMatchDni = matchDNI(d.employee_id, oldDni) || d.employee_id === oldDni;
      const isMatchName =
        d.name.trim().toUpperCase() === editingDocente.name.trim().toUpperCase() ||
        d.name.trim().toUpperCase() === cleanName;
      if (isMatchDni || isMatchName) {
        return {
          ...d,
          employee_id: cleanDni,
          name: cleanName,
          aula: editingDocente.aula.trim() || "Posgrado UNHEVAL",
          curso: editingDocente.curso.trim() || "Docencia Posgrado",
          modalidad: editingDocente.modalidad,
          tipo_horario: editingDocente.tipo_horario,
        };
      }
      return d;
    });

    setDocentes(updated);
    await syncDocentesCloud(updated);

    // Si cambió el DNI, actualizar logs en memoria para que no se pierdan sus asistencias de hoy
    if (oldDni !== cleanDni) {
      setLogs((prev) =>
        prev.map((l) => {
          if (matchDNI(l.employee_id, oldDni) || l.employee_id === oldDni) {
            return { ...l, employee_id: cleanDni, employee_name: cleanName };
          }
          return l;
        })
      );
    }

    setEditingDocente(null);
    setSaveSuccessMsg(`✅ Docente ${cleanName} actualizado y guardado en la base de datos.`);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleDeleteDocente = async (dniToDelete: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar a "${name}" del directorio de Posgrado?`)) {
      const updated = docentes.filter((d) => !matchDNI(d.employee_id, dniToDelete) && d.employee_id !== dniToDelete);
      setDocentes(updated);
      await syncDocentesCloud(updated);
      setEditingDocente(null);
      setSaveSuccessMsg(`🗑️ Docente ${name} eliminado.`);
      setTimeout(() => setSaveSuccessMsg(""), 3000);
    }
  };

  // Restaurar asignaciones de fábrica
  const handleResetDocentes = () => {
    if (confirm("¿Deseas restaurar las asignaciones de docentes originales del documento oficial?")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("unheval_docentes_custom");
      }
      setDocentes(UNHEVAL_DOCENTES_DATA);
      syncDocentesCloud(UNHEVAL_DOCENTES_DATA);
      setSaveSuccessMsg("🔄 Asignaciones restauradas en la nube.");
      setTimeout(() => setSaveSuccessMsg(""), 2500);
    }
  };

  // Cooldown de voz inteligente (120 segundos de bloqueo para el mismo evento/docente)
  const lastSpokenMapRef = useRef<Map<string, { time: number; tipo: string }>>(new Map());

  // Voz de bienvenida y despedida en la Smart TV con Grado Académico
  const speakGreeting = (name: string, tipo: string = "ENTRADA", dni?: string) => {
    if (!voiceEnabledRef.current || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const now = new Date();
    const day = now.getDay();
    const isSaturday = day === 6;
    const hoursDecimal = now.getHours() + now.getMinutes() / 60;
    const isMWFDay = day === 1 || day === 3 || day === 5;

    // En días de semana L-M-V, las clases inician a las 18:00 (habilitado desde 17:30).
    // Si el docente pasa por la facultad en la mañana/tarde (<17:30), NO emitir bienvenida a clase.
    if (isMWFDay && hoursDecimal < 17.5) {
      return;
    }

    // Determinación precisa del tipo de evento según horario oficial:
    let isSalida = false;
    if (isSaturday) {
      // Sábado: Salidas son 11:30-14:30 y >= 17:00
      isSalida = (hoursDecimal >= 11.5 && hoursDecimal < 14.5) || hoursDecimal >= 17.0;
    } else {
      // Días de semana (L-M-V): Entrada de clases es 17:30 a 20:15. Salida es >= 20:15
      isSalida = hoursDecimal >= 20.25;
    }

    // Si viene un tipo forzado y concuerda con las ventanas horarias
    if (tipo && String(tipo).toUpperCase() === "SALIDA" && hoursDecimal >= 20.0) {
      isSalida = true;
    }
    if (tipo && String(tipo).toUpperCase() === "ENTRADA" && hoursDecimal < 20.25) {
      isSalida = false;
    }

    const cleanDni = dni ? normalizeDNI(dni) : normalizeDNI(name);

    // Si ya se anunció este mismo evento (ENTRADA o SALIDA) para este docente en los últimos 2 minutos, NO repetir la voz
    const lastSpoken = lastSpokenMapRef.current.get(cleanDni);
    if (lastSpoken) {
      const elapsed = Date.now() - lastSpoken.time;
      if (lastSpoken.tipo === (isSalida ? "SALIDA" : "ENTRADA") && elapsed < 120000) {
        return; // Ya se anunció su salida/entrada, no repetir
      }
      if (elapsed < 8000) {
        return; // Antirrebote general de 8s
      }
    }
    lastSpokenMapRef.current.set(cleanDni, { time: Date.now(), tipo: isSalida ? "SALIDA" : "ENTRADA" });

    try {
      window.speechSynthesis.cancel();

      // 1. Buscar información oficial del docente en el padrón por DNI
      const matchedDoc =
        docentes.find((d) => matchDNI(d.employee_id, cleanDni)) ||
        UNHEVAL_DOCENTES_DATA.find((d) => matchDNI(d.employee_id, cleanDni));

      let rawName = (matchedDoc?.name || name || "").trim();

      // 2. Extraer y normalizar grado académico (Doctor, Magíster, Ingeniero, etc.)
      let gradoTitle = "";
      let isFemale = false;

      if (/^DRA\b/i.test(rawName) || /\bDOCTORA\b/i.test(rawName)) {
        gradoTitle = "Doctora";
        isFemale = true;
        rawName = rawName.replace(/^DRA\.?\s*/i, "").replace(/\bDOCTORA\s*/i, "");
      } else if (/^DR\b/i.test(rawName) || /\bDOCTOR\b/i.test(rawName) || /\bPH\.?D\b/i.test(rawName)) {
        gradoTitle = "Doctor";
        rawName = rawName.replace(/^DR\.?\s*/i, "").replace(/\bDOCTOR\s*/i, "").replace(/\bPH\.?D\.?\s*/i, "");
      } else if (/^(MAG|MG|MGTR|MSC|MASTER)\b/i.test(rawName) || /\bMAG[ÍI]STER\b/i.test(rawName)) {
        gradoTitle = "Magíster";
        rawName = rawName.replace(/^(MAG|MG|MGTR|MSC|MASTER)\.?\s*/i, "").replace(/\bMAG[ÍI]STER\s*/i, "");
      } else if (/^INGA\b/i.test(rawName) || /\bINGENIERA\b/i.test(rawName)) {
        gradoTitle = "Ingeniera";
        isFemale = true;
        rawName = rawName.replace(/^INGA\.?\s*/i, "").replace(/\bINGENIERA\s*/i, "");
      } else if (/^ING\b/i.test(rawName) || /\bINGENIERO\b/i.test(rawName)) {
        gradoTitle = "Ingeniero";
        rawName = rawName.replace(/^ING\.?\s*/i, "").replace(/\bINGENIERO\s*/i, "");
      } else if (/^LICA\b/i.test(rawName) || /\bLICENCIADA\b/i.test(rawName)) {
        gradoTitle = "Licenciada";
        isFemale = true;
        rawName = rawName.replace(/^LICA\.?\s*/i, "").replace(/\bLICENCIADA\s*/i, "");
      } else if (/^LIC\b/i.test(rawName) || /\bLICENCIADO\b/i.test(rawName)) {
        gradoTitle = "Licenciado";
        rawName = rawName.replace(/^LIC\.?\s*/i, "").replace(/\bLICENCIADO\s*/i, "");
      } else if (/^ABOG\b/i.test(rawName) || /\bABOGAD[OA]\b/i.test(rawName)) {
        gradoTitle = "Abogado";
        rawName = rawName.replace(/^ABOG\.?\s*/i, "").replace(/\bABOGAD[OA]\s*/i, "");
      } else if (/^CPC\b/i.test(rawName) || /\bCONTADOR\b/i.test(rawName)) {
        gradoTitle = "Contador";
        rawName = rawName.replace(/^CPC\.?\s*/i, "").replace(/\bCONTADOR\s*/i, "");
      } else {
        // En Posgrado UNHEVAL, si no tiene grado explícito, se le saluda respetuosamente como Docente
        gradoTitle = "Docente";
      }

      // 3. Formatear nombre para locución fluida ("APELLIDOS, NOMBRES" -> "NOMBRES APELLIDOS")
      let spokenName = rawName;
      if (rawName.includes(",")) {
        const parts = rawName.split(",");
        const apellidos = parts[0]?.trim() || "";
        const nombres = parts[1]?.trim() || "";
        spokenName = nombres ? `${nombres} ${apellidos}` : apellidos;
      }

      // 4. Construir frase con grado correspondiente
      const msg = isSalida
        ? `Hasta luego, ${gradoTitle} ${spokenName}`
        : `${isFemale ? "Bienvenida" : "Bienvenido"} a posgrado, ${gradoTitle} ${spokenName}`;

      if ("speechSynthesis" in window) {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(msg);
        utterance.lang = "es-PE";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        
        // Seleccionar voz en español disponible si existe
        const voices = window.speechSynthesis.getVoices();
        const esVoice = voices.find(v => v.lang.startsWith("es") || v.lang.includes("es-"));
        if (esVoice) utterance.voice = esVoice;

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio
    }
  };

  // Reloj
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const peruTimeStr = now.toLocaleTimeString("en-US", { timeZone: "America/Lima", hour12: false });
      const [hStr, mStr] = peruTimeStr.split(":");
      setCurrentHourDecimal(parseInt(hStr, 10) + parseInt(mStr, 10) / 60);
      setCurrentTime(
        now.toLocaleTimeString("es-PE", {
          timeZone: "America/Lima",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("es-PE", {
          timeZone: "America/Lima",
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Carga inicial y suscripción Supabase Realtime (Carga hasta 500 registros para permitir ver días anteriores)
  useEffect(() => {
    const fetchLogs = async () => {
      // 1. Obtener logs desde la API interna del servidor (100% garantizado)
      try {
        const res = await fetch("/api/hikvision");
        if (res.ok) {
          const apiData = await res.json();
          if (apiData.success && Array.isArray(apiData.logs) && apiData.logs.length > 0) {
            const validLogs = apiData.logs.filter(
              (l: AccessLog) =>
                l.employee_id &&
                !l.employee_id.startsWith("DEV-") &&
                l.employee_name !== "Personal Registrado" &&
                l.employee_name !== "Marcación Terminal"
            );
            setLogs(validLogs);
            setIsConnected(true);

            // Respaldo de locución si no se disparó por Realtime
            if (validLogs.length > 0) {
              const topLog = validLogs[0];
              const topTime = topLog.timestamp || "";
              if (!hasInitialLogsLoadedRef.current) {
                hasInitialLogsLoadedRef.current = true;
                lastAnnouncedTimestampRef.current = topTime;
              } else if (topTime && topTime !== lastAnnouncedTimestampRef.current) {
                lastAnnouncedTimestampRef.current = topTime;
                const recTime = new Date(topTime);
                const recHourDec = recTime.getHours() + recTime.getMinutes() / 60;
                const recDay = recTime.getDay();
                const isSat = recDay === 6;
                let infTipo: "ENTRADA" | "SALIDA" = "ENTRADA";
                if (isSat) {
                  infTipo = (recHourDec >= 11.5 && recHourDec < 14.5) || recHourDec >= 17.0 ? "SALIDA" : "ENTRADA";
                } else {
                  infTipo = recHourDec >= 20.25 ? "SALIDA" : "ENTRADA";
                }
                if (topLog.tipo_evento === "ENTRADA" || topLog.tipo_evento === "SALIDA") {
                  infTipo = topLog.tipo_evento;
                }
                speakGreeting(topLog.employee_name, infTipo, topLog.employee_id);
              }
            }
            return;
          }
        }
      } catch (err) {
        console.warn("Fallo fetch /api/hikvision, intentando Supabase cliente directo...", err);
      }

      // 2. Intento directo con cliente Supabase
      try {
        const { data, error } = await supabase
          .from("access_logs")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(500);

        if (!error && data) {
          const validLogs = data.filter(
            (l) =>
              l.employee_id &&
              !l.employee_id.startsWith("DEV-") &&
              l.employee_name !== "Personal Registrado" &&
              l.employee_name !== "Marcación Terminal"
          );
          setLogs(validLogs);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Error al obtener logs de Supabase:", err);
      }
    };

    fetchLogs();
    // Respaldo de refresco automático cada 3 segundos
    const pollInterval = setInterval(fetchLogs, 3000);

    const channel = supabase
      .channel("realtime_access_logs_add_docente")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "access_logs",
        },
        (payload) => {
          const newRecord = payload.new as AccessLog;
          if (newRecord.employee_id === "CONFIG_DOCENTES_UNHEVAL" && newRecord.picture_url) {
            try {
              const cloudParsed = JSON.parse(newRecord.picture_url);
              if (Array.isArray(cloudParsed)) {
                setDocentes(cloudParsed);
                if (typeof window !== "undefined") {
                  localStorage.setItem("unheval_docentes_custom", JSON.stringify(cloudParsed));
                }
              }
            } catch (e) {
              console.error("Error al parsear config realtime:", e);
            }
            return;
          }

          const isJunk =
            !newRecord.employee_id ||
            newRecord.employee_id.startsWith("DEV-") ||
            newRecord.employee_id.startsWith("CONFIG_") ||
            newRecord.employee_name === "Personal Registrado" ||
            newRecord.employee_name === "Marcación Terminal";

          if (!isJunk) {
            const normDni = normalizeDNI(newRecord.employee_id);
            setLogs((prev) => {
              const recTime = newRecord.timestamp ? new Date(newRecord.timestamp) : new Date();
              const recDay = recTime.getDay();
              const recHourDec = recTime.getHours() + recTime.getMinutes() / 60;
              const isSat = recDay === 6;

              let inferredTipo: "ENTRADA" | "SALIDA" = "ENTRADA";
              if (isSat) {
                inferredTipo = (recHourDec >= 11.5 && recHourDec < 14.5) || recHourDec >= 17.0 ? "SALIDA" : "ENTRADA";
              } else {
                inferredTipo = recHourDec >= 20.25 ? "SALIDA" : "ENTRADA";
              }

              if (newRecord.tipo_evento && (newRecord.tipo_evento === "ENTRADA" || newRecord.tipo_evento === "SALIDA")) {
                inferredTipo = newRecord.tipo_evento;
              }

              const enrichedRecord: AccessLog = {
                ...newRecord,
                tipo_evento: inferredTipo,
              };

              if (enrichedRecord.employee_name) {
                speakGreeting(enrichedRecord.employee_name, inferredTipo, normDni);
              }

              return [enrichedRecord, ...prev.filter((l) => l.id !== newRecord.id).slice(0, 499)];
            });

            setFlashGlow(true);
            setTimeout(() => setFlashGlow(false), 2500);
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    // CANAL DE TRANSMISIÓN DE VOZ / MEGÁFONO EN VIVO (Persistente con self: true)
    const broadcastChannel = supabase.channel("posgrado_live_broadcast", {
      config: { broadcast: { self: true } },
    });
    broadcastChannelRef.current = broadcastChannel;

    // 1. Receptor de Streaming de Micrófono EN TIEMPO REAL (<150ms latencia)
    broadcastChannel
      .on("broadcast", { event: "live_audio_stream" }, async ({ payload }) => {
        const { clientId, streamId, isStart, isEnd, pcmBase64, sampleRate = 16000, title } = payload;

        // Si este paquete fue transmitido por esta misma pestaña/computadora, NO reproducirlo localmente para evitar eco y retroalimentación
        if (clientId && clientId === tabClientIdRef.current) {
          if (isEnd) {
            setIncomingBroadcast(null);
            activeStreamIdRef.current = null;
          }
          return;
        }

        if (isStart) {
          playAirportChime();
          setIncomingBroadcast({
            title: title || "TRANSMISIÓN EN VIVO POR MICRÓFONO",
            text: "🎙️ El Administrador está hablando por el micrófono en vivo...",
            timestamp: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
          });
          activeStreamIdRef.current = streamId;

          try {
            const AudioContextClass =
              window.AudioContext ||
              (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!receiverCtxRef.current || receiverCtxRef.current.state === "closed") {
              receiverCtxRef.current = new AudioContextClass({ sampleRate });
            }
            if (receiverCtxRef.current.state === "suspended") {
              await receiverCtxRef.current.resume();
            }
            nextPlayTimeRef.current = receiverCtxRef.current.currentTime + 0.08;
          } catch (e) {
            console.error("Error iniciando receptor de audio:", e);
          }
        }

        if (pcmBase64 && receiverCtxRef.current) {
          try {
            const ctx = receiverCtxRef.current;
            if (ctx.state === "suspended") await ctx.resume();
            const float32 = base64ToFloat32(pcmBase64);
            if (float32.length > 0) {
              const audioBuffer = ctx.createBuffer(1, float32.length, sampleRate);
              audioBuffer.getChannelData(0).set(float32);

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;

              // Amplificador de ganancia para volumen alto y nítido en parlantes
              const gainNode = ctx.createGain();
              gainNode.gain.setValueAtTime(2.2, ctx.currentTime);
              source.connect(gainNode);
              gainNode.connect(ctx.destination);

              // Evitar acumulación de retraso (Anti-Drift): no permitir más de 200ms de cola
              let startAt = Math.max(ctx.currentTime, nextPlayTimeRef.current);
              if (startAt - ctx.currentTime > 0.2) {
                startAt = ctx.currentTime + 0.04;
              }
              source.start(startAt);
              nextPlayTimeRef.current = startAt + audioBuffer.duration;
            }
          } catch (e) {
            console.error("Error reproduciendo stream PCM:", e);
          }
        }

        if (isEnd) {
          nextPlayTimeRef.current = 0;
          setIncomingBroadcast(null);
          activeStreamIdRef.current = null;
          if (receiverCtxRef.current && receiverCtxRef.current.state === "running") {
            receiverCtxRef.current.suspend().catch(() => {});
          }
        }
      })
      .on("broadcast", { event: "megaphone_announcement" }, async ({ payload }) => {
        // 1. Suena campana de aeropuerto / atención
        playAirportChime();

        setIncomingBroadcast({
          title: payload.title || "COMUNICADO EN VIVO",
          text: payload.text || "",
          audioBase64: payload.audioBase64 || undefined,
          timestamp: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
        });

        // 2. Reproducir audio grabado del micrófono
        if (payload.audioBase64) {
          try {
            const audio = new Audio(payload.audioBase64);
            setTimeout(() => {
              audio.play().catch((e) => console.log("Autoplay de audio esperando interacción:", e));
            }, 600);
            audio.onended = () => {
              setTimeout(() => setIncomingBroadcast(null), 3500);
            };
          } catch (e) {
            console.error("Error al reproducir audio broadcast:", e);
            setTimeout(() => setIncomingBroadcast(null), 7000);
          }
        } else if (payload.text) {
          // Si fue texto, usar síntesis de voz en español
          setTimeout(() => {
            if ("speechSynthesis" in window) {
              const ut = new SpeechSynthesisUtterance(payload.text);
              ut.lang = "es-ES";
              ut.rate = 0.95;
              ut.pitch = 1.0;
              window.speechSynthesis.speak(ut);
              ut.onend = () => {
                setTimeout(() => setIncomingBroadcast(null), 3000);
              };
            }
          }, 800);
        }
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
      supabase.removeChannel(broadcastChannel);
    };
  }, []);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("es-PE", {
        timeZone: "America/Lima",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handlePrintAulas = () => {
    window.print();
  };

  // ====================================================
  // 🔴 TRANSMISIÓN DE MICRÓFONO EN TIEMPO REAL (PUSH-TO-TALK / EN VIVO)
  // ====================================================
  const handleStartLiveStream = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Tu navegador no soporta captura de micrófono.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      liveMicStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      liveAudioCtxRef.current = audioCtx;

      const streamId = "stream_" + Date.now();
      liveStreamIdRef.current = streamId;
      setIsLiveStreaming(true);

      const source = audioCtx.createMediaStreamSource(stream);
      // ScriptProcessorNode con 2048 muestras (~128ms por paquete a 16kHz)
      const processor = audioCtx.createScriptProcessor(2048, 1, 1);
      liveProcessorRef.current = processor;

      // Enviar paquete inicial de inicio (start)
      await broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "live_audio_stream",
        payload: {
          clientId: tabClientIdRef.current,
          streamId,
          isStart: true,
          isEnd: false,
          sampleRate: 16000,
          title: megaphoneTitle.trim() || "COMUNICADO DE DIRECCIÓN",
        },
      });

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Calcular nivel de volumen RMS para el medidor VU visual
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const volPercent = Math.min(100, Math.round(rms * 320));
        setLiveVolume(volPercent);

        // Codificar a PCM Int16 Base64 y transmitir inmediatamente por Realtime (<150ms)
        const pcmBase64 = float32ToInt16Base64(inputData);
        if (pcmBase64) {
          broadcastChannelRef.current?.send({
            type: "broadcast",
            event: "live_audio_stream",
            payload: {
              clientId: tabClientIdRef.current,
              streamId,
              isStart: false,
              isEnd: false,
              pcmBase64,
              sampleRate: 16000,
            },
          });
        }
      };

      source.connect(processor);
      // Conectar a destination con ganancia 0 para bombear el pipeline de Web Audio en Chrome sin eco
      const silentGain = audioCtx.createGain();
      silentGain.gain.setValueAtTime(0, audioCtx.currentTime);
      processor.connect(silentGain);
      silentGain.connect(audioCtx.destination);
    } catch (err) {
      console.error("Error al iniciar transmisión en vivo:", err);
      alert("No se pudo acceder al micrófono. Por favor permite los permisos en tu navegador.");
      setIsLiveStreaming(false);
    }
  };

  const handleStopLiveStream = async () => {
    setIsLiveStreaming(false);
    setLiveVolume(0);

    if (liveProcessorRef.current) {
      try {
        liveProcessorRef.current.disconnect();
      } catch {}
      liveProcessorRef.current = null;
    }
    if (liveMicStreamRef.current) {
      try {
        liveMicStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch {}
      liveMicStreamRef.current = null;
    }
    if (liveAudioCtxRef.current) {
      try {
        liveAudioCtxRef.current.close();
      } catch {}
      liveAudioCtxRef.current = null;
    }

    try {
      await broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "live_audio_stream",
        payload: {
          clientId: tabClientIdRef.current,
          streamId: liveStreamIdRef.current,
          isStart: false,
          isEnd: true,
        },
      });
    } catch (e) {
      console.error("Error enviando fin de stream:", e);
    }
  };

  // ====================================================
  // 🎙️ FUNCIONES DE GRABACIÓN PREVIA Y COMUNICADO
  // ====================================================
  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Tu navegador no soporta grabación de micrófono.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      liveMicStreamRef.current = stream;

      // Conectar AnalyserNode para que las ondas bailen en tiempo real mientras grabas
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      liveAudioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const pcmData = new Uint8Array(analyser.frequencyBinCount);
      const timerInt = setInterval(() => {
        analyser.getByteFrequencyData(pcmData);
        let sum = 0;
        for (let i = 0; i < pcmData.length; i++) sum += pcmData[i];
        const avg = sum / pcmData.length;
        setLiveVolume(Math.min(100, Math.round((avg / 128) * 100)));
      }, 50);

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        clearInterval(timerInt);
        setLiveVolume(0);
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        setRecordedAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedAudioBase64(reader.result as string);
        };

        // Detener micrófono
        stream.getTracks().forEach((track) => track.stop());
        if (liveAudioCtxRef.current) {
          try {
            liveAudioCtxRef.current.close();
          } catch {}
          liveAudioCtxRef.current = null;
        }
      };

      mediaRecorder.start(100);
      setIsRecordingMic(true);
      setRecordingSeconds(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      alert("No se pudo acceder al micrófono. Por favor permite el acceso en tu navegador.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const handleDiscardAudio = () => {
    handleStopRecording();
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordedAudioBase64(null);
    setRecordingSeconds(0);
  };

  const handleSendBroadcast = async () => {
    if (!recordedAudioBase64 && !megaphoneText.trim()) {
      alert("Por favor graba un audio con tu micrófono o escribe un mensaje para transmitir.");
      return;
    }

    setIsBroadcasting(true);
    setBroadcastStatus("📢 Transmitiendo a todas las pantallas...");

    try {
      await broadcastChannelRef.current?.send({
        type: "broadcast",
        event: "megaphone_announcement",
        payload: {
          title: megaphoneTitle.trim() || "COMUNICADO DE DIRECCIÓN",
          text: megaphoneText.trim() || undefined,
          audioBase64: recordedAudioBase64 || undefined,
          timestamp: new Date().toISOString(),
        },
      });

      // Reproducir localmente de confirmación
      playAirportChime();
      if (recordedAudioBase64) {
        const audio = new Audio(recordedAudioBase64);
        setTimeout(() => audio.play(), 600);
      }

      setBroadcastStatus("✅ ¡Comunicado transmitido con éxito a todas las pantallas!");
      setTimeout(() => {
        setBroadcastStatus("");
        setShowMegaphoneModal(false);
        handleDiscardAudio();
        setMegaphoneText("");
      }, 2200);
    } catch (e) {
      console.error("Error al transmitir broadcast:", e);
      setBroadcastStatus("❌ Error al transmitir. Verifica tu conexión.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Simulación de marcación
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const activeList = activeDocentesForToday.length > 0 ? activeDocentesForToday : docentes;
      const randomDoc = activeList[Math.floor(Math.random() * activeList.length)];
      await fetch("/api/hikvision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeNo: randomDoc.employee_id,
          name: randomDoc.name,
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const [manualPresentIds, setManualPresentIds] = useState<Set<string>>(new Set());
  const [manualExitedIds, setManualExitedIds] = useState<Set<string>>(new Set());

  // Marcaje Manual con 1 Clic (Check In / Check Out Manual para contingencia)
  const handleToggleManualAttendance = async (dni: string, name: string) => {
    const norm = normalizeDNI(dni);
    const docLogs = todayLogs.filter((l) => matchDNI(l.employee_id, dni));

    // Si ya tiene salida o 2 marcajes o está en manualExitedIds
    const isExited = manualExitedIds.has(norm) || docLogs.length >= 2;
    if (isExited) {
      // Si ya finalizó su jornada y registró salida, bloquear cualquier re-activación
      return;
    }

    const isCurrentlyInAula = docLogs.length > 0 || manualPresentIds.has(norm);

    let targetTipo = "ENTRADA";
    if (isCurrentlyInAula) {
      // Estaba en aula -> MARCA SALIDA DEFINITIVA
      targetTipo = "SALIDA";
      setManualExitedIds((prev) => new Set(prev).add(norm));
      setManualPresentIds((prev) => {
        const next = new Set(prev);
        next.delete(norm);
        return next;
      });
    } else {
      // Estaba en espera -> MARCA ENTRADA
      targetTipo = "ENTRADA";
      setManualPresentIds((prev) => new Set(prev).add(norm));
      setManualExitedIds((prev) => {
        const next = new Set(prev);
        next.delete(norm);
        return next;
      });
    }

    const newManualLog: AccessLog = {
      id: Date.now(),
      employee_id: dni,
      employee_name: name,
      tipo_evento: targetTipo,
      picture_url: null,
      timestamp: new Date().toISOString(),
    };

    // Actualizar estado en pantalla de inmediato sin esperar la red
    setLogs((prev) => [newManualLog, ...prev]);
    setFlashGlow(true);
    setTimeout(() => setFlashGlow(false), 2000);
    speakGreeting(name, targetTipo, norm);

    // Enviar a la base de datos de fondo
    try {
      await fetch("/api/hikvision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeNo: dni,
          name: name,
          tipo_evento: targetTipo,
        }),
      });
    } catch (e) {
      console.error("Error al persistir marcaje manual:", e);
    }
  };

  // ==========================================
  // 🏆 CÁLCULO DE RANKING DE PUNTUALIDAD & KPIS (OPCIÓN 5)
  // ==========================================
  const rankingData = useMemo(() => {
    const teacherMap = new Map<string, {
      dni: string;
      name: string;
      aula: string;
      curso: string;
      totalAsistencias: number;
      puntuales: number;
      tardanzas: number;
      totalMinutosTardanza: number;
      ultimoMarcaje?: string;
      picture_url?: string;
    }>();

    docentes.forEach((d) => {
      const normDni = normalizeDNI(d.employee_id);
      if (!teacherMap.has(normDni)) {
        teacherMap.set(normDni, {
          dni: d.employee_id,
          name: d.name,
          aula: d.aula || "Posgrado",
          curso: d.curso || "Docencia",
          totalAsistencias: 0,
          puntuales: 0,
          tardanzas: 0,
          totalMinutosTardanza: 0,
        });
      }
    });

    logs.forEach((l) => {
      if (!l.timestamp || !l.employee_id) return;
      const normDni = normalizeDNI(l.employee_id);
      const teacher = teacherMap.get(normDni);
      if (!teacher) return;

      const d = new Date(l.timestamp);
      const peruDateStr = d.toLocaleDateString("en-CA", { timeZone: "America/Lima" });
      const peruTimeStr = d.toLocaleTimeString("en-US", { timeZone: "America/Lima", hour12: false });
      const [hStr, mStr] = peruTimeStr.split(":");
      const hours = parseInt(hStr, 10);
      const mins = parseInt(mStr, 10);
      const timeNum = hours + mins / 60;
      const [pY, pM, pD] = peruDateStr.split("-").map(Number);
      const dayOfWeek = new Date(pY, pM - 1, pD, 12, 0, 0).getDay();
      const isSat = dayOfWeek === 6;
      const isSun = dayOfWeek === 0;

      let isEntrada = false;
      let minTardanza = 0;

      if (isSat || isSun) {
        if (timeNum >= 6.0 && timeNum < 11.0) {
          isEntrada = true;
          if (timeNum > 7.5) minTardanza = Math.round((timeNum - 7.5) * 60);
        } else if (timeNum >= 14.0 && timeNum < 17.5) {
          isEntrada = true;
          if (timeNum > 15.5) minTardanza = Math.round((timeNum - 15.5) * 60);
        }
      } else {
        if (timeNum >= 14.0 && timeNum < 20.3) {
          isEntrada = true;
          if (timeNum > 18.5) minTardanza = Math.round((timeNum - 18.5) * 60);
        }
      }

      if (isEntrada) {
        teacher.totalAsistencias++;
        if (minTardanza > 0) {
          teacher.tardanzas++;
          teacher.totalMinutosTardanza += minTardanza;
        } else {
          teacher.puntuales++;
        }
        if (!teacher.picture_url && l.picture_url) teacher.picture_url = l.picture_url;
        if (!teacher.ultimoMarcaje || new Date(l.timestamp) > new Date(teacher.ultimoMarcaje)) {
          teacher.ultimoMarcaje = l.timestamp;
        }
      }
    });

    const list = Array.from(teacherMap.values())
      .filter((t) => t.totalAsistencias > 0)
      .map((t) => {
        const score = t.totalAsistencias > 0 ? Math.round((t.puntuales / t.totalAsistencias) * 100) : 100;
        const avgTardanza = t.tardanzas > 0 ? Math.round(t.totalMinutosTardanza / t.tardanzas) : 0;
        return { ...t, score, avgTardanza };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.totalAsistencias !== a.totalAsistencias) return b.totalAsistencias - a.totalAsistencias;
        return a.totalMinutosTardanza - b.totalMinutosTardanza;
      });

    const totalPunches = list.reduce((acc, curr) => acc + curr.totalAsistencias, 0);
    const totalPuntuales = list.reduce((acc, curr) => acc + curr.puntuales, 0);
    const globalPuntualidad = totalPunches > 0 ? Math.round((totalPuntuales / totalPunches) * 100) : 100;
    const totalMinutos = list.reduce((acc, curr) => acc + curr.totalMinutosTardanza, 0);
    const totalTardanzasCount = list.reduce((acc, curr) => acc + curr.tardanzas, 0);
    const avgGlobalTardanza = totalTardanzasCount > 0 ? Math.round(totalMinutos / totalTardanzasCount) : 0;

    return {
      rankingList: list,
      topDocente: list[0] || null,
      globalPuntualidad,
      avgGlobalTardanza,
      totalSesionesDictadas: totalPunches,
    };
  }, [logs, docentes]);

  // Horario y Fecha de Control en Zona Horaria de Perú (America/Lima)
  const isViewingHistory = !!selectedDate;
  const getPeruDateStr = (date: Date = new Date()) => {
    return date.toLocaleDateString("en-CA", { timeZone: "America/Lima" }); // "YYYY-MM-DD"
  };

  const todayPeruStr = getPeruDateStr(new Date());
  const effectiveDateStr = selectedDate || todayPeruStr;

  // Filtrar marcaciones estrictamente del día correspondiente en hora de Perú
  const todayLogs = logs.filter((l) => {
    if (!l.timestamp) return false;
    const d = new Date(l.timestamp);
    if (isNaN(d.getTime())) return false;
    const logPeruDate = getPeruDateStr(d);
    return logPeruDate === effectiveDateStr;
  });

  const presentIds = new Set(todayLogs.map((l) => normalizeDNI(l.employee_id)));

  const [effY, effM, effD] = effectiveDateStr.split("-").map(Number);
  const targetDateObj = new Date(effY, effM - 1, effD, 12, 0, 0);
  const dayOfWeek = targetDateObj.getDay();
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;
  const isWeekend = isSaturday || isSunday;
  const isMWF = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  const maxPunchesExpected = isSaturday ? 4 : 2;

  // Filtrar docentes presenciales activos según el día seleccionado/actual
  const currentScheduleType = isWeekend ? "Fin de Semana (Presencial)" : (isMWF ? "Entre Semana (Presencial)" : "Presencial");

  const activeDocentesForToday = docentes.filter((d) => {
    const isVirtual = d.modalidad?.toLowerCase().includes("virtual") || d.aula?.toLowerCase().includes("virtual");
    if (isVirtual) return false;

    // Si el docente ya registró marcación hoy en el terminal, incluirlo siempre para mostrar su tarjeta y estado verde
    const hasLogToday = todayLogs.some((l) => matchDNI(l.employee_id, d.employee_id));
    if (hasLogToday) return true;

    // Docentes que dictan en ambos turnos (S-D y L-M-V) o en padrón general
    const isBoth =
      d.tipo_horario === "Ambos Horarios" ||
      d.tipo_horario === "Todos los Horarios" ||
      d.tipo_horario === "Ambos" ||
      d.tipo_horario === "Padrón General";
    if (isBoth) return true;

    if (isWeekend) return d.tipo_horario === "Fin de Semana";
    if (isMWF) return d.tipo_horario === "Entre Semana";
    return d.tipo_horario === "Fin de Semana";
  });

  const getHorarioInfo = () => {
    if (isMWF) {
      return {
        turno: "Lun / Mié / Vie (18:00 a 21:30)",
        badge: "Turno Noche • 2 Marcajes",
        slots: [
          { label: "1. Entrada Noche", hora: "18:00 (Tol: 18:30)" },
          { label: "2. Salida Noche", hora: "21:30 (±30m)" },
        ],
      };
    }
    if (isSaturday) {
      return {
        turno: "Sábado (Mañana 07:00-14:00 | Tarde 15:00-18:30)",
        badge: "Sábado Completo • 4 Marcajes",
        slots: [
          { label: "1. Entrada M.", hora: "07:00 (Tol: 07:30)" },
          { label: "2. Salida M.", hora: "14:00 (±30m)" },
          { label: "3. Entrada T.", hora: "15:00 (Tol: 15:30)" },
          { label: "4. Salida T.", hora: "18:30 (±30m)" },
        ],
      };
    }
    return {
      turno: "Fin de Semana • Posgrado UNHEVAL",
      badge: "Turno Regular • 2 Marcajes",
      slots: [
        { label: "1. Entrada", hora: "--:--" },
        { label: "2. Salida", hora: "--:--" },
      ],
    };
  };

  const horarioActual = getHorarioInfo();

  // Mapear los docentes que dictan hoy con su estado
  const docentesWithAttendance = activeDocentesForToday.map((docente) => {
    const docLogs = todayLogs.filter((l) => matchDNI(l.employee_id, docente.employee_id));
    const slotsData: (AccessLog | null)[] = Array(maxPunchesExpected).fill(null);

    docLogs.forEach((log) => {
      const slotIdx = getSlotIndexForLog(log.timestamp, isSaturday, isMWF);
      if (slotIdx >= 0 && slotIdx < maxPunchesExpected) {
        const isEntradaSlot = slotIdx % 2 === 0;
        if (!slotsData[slotIdx]) {
          slotsData[slotIdx] = log;
        } else {
          const prevTime = new Date(slotsData[slotIdx]!.timestamp).getTime();
          const currTime = new Date(log.timestamp).getTime();
          if (isEntradaSlot) {
            // Para ENTRADA: guardar el primer marcaje (más temprano)
            if (currTime < prevTime) slotsData[slotIdx] = log;
          } else {
            // Para SALIDA: guardar el último marcaje (más exacto al momento de retirarse)
            if (currTime > prevTime) slotsData[slotIdx] = log;
          }
        }
      }
    });

    const punchCount = slotsData.filter((s) => s !== null).length;
    const isCompleted = punchCount >= maxPunchesExpected;

    // Determinación precisa del estado según el horario del día
    let isPresent = false;
    let hasRegisteredSalida = false;

    if (isSaturday) {
      // Sábado (4 marcajes: Slot 0 Entrada M, Slot 1 Salida M, Slot 2 Entrada T, Slot 3 Salida T)
      if (slotsData[3] !== null) {
        // Marcó salida de la tarde: Jornada completa finalizada
        isPresent = false;
        hasRegisteredSalida = true;
      } else if (slotsData[2] !== null) {
        // Marcó entrada de la tarde: En aula (Turno Tarde)
        isPresent = true;
        hasRegisteredSalida = false;
      } else if (slotsData[1] !== null) {
        // Marcó salida de la mañana: Salió del turno mañana (receso)
        isPresent = false;
        hasRegisteredSalida = true;
      } else if (slotsData[0] !== null) {
        // Marcó entrada de la mañana: En aula (Turno Mañana)
        isPresent = true;
        hasRegisteredSalida = false;
      }
    } else {
      // Días de semana (2 marcajes: Slot 0 Entrada, Slot 1 Salida)
      if (slotsData[1] !== null) {
        isPresent = false;
        hasRegisteredSalida = true;
      } else if (slotsData[0] !== null) {
        isPresent = true;
        hasRegisteredSalida = false;
      }
    }

    if (manualPresentIds.has(normalizeDNI(docente.employee_id))) {
      isPresent = true;
      hasRegisteredSalida = false;
    }
    if (manualExitedIds.has(normalizeDNI(docente.employee_id))) {
      isPresent = false;
      hasRegisteredSalida = true;
    }

    const lastPunch = docLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return {
      ...docente,
      slotsData,
      docLogs,
      punchCount,
      isCompleted,
      hasRegisteredSalida,
      isPresent,
      lastPunch,
      lastPicture: docLogs.find((l) => l.picture_url)?.picture_url || null,
    };
  });

  // Cálculo de Aulas Desatendidas para Verificador Proactivo de WhatsApp
  const aulasSinDocente = activeDocentesForToday.filter((d) => {
    const isPresent = docentesWithAttendance.some(
      (da) => (matchDNI(da.employee_id, d.employee_id) || da.employee_id === d.employee_id) && da.isPresent
    );
    return !isPresent;
  });

  // ORDENAMIENTO DINÁMICO EN CONTROL DE ASISTENCIA:
  // 1. Los que llegan/marcan se colocan primero arriba por orden de llegada (más reciente en el puesto #1).
  // 2. Los que aún no marcan quedan abajo ordenados estrictamente por aula (Aula 101, 102...).
  const docentesWithAttendanceSorted = [...docentesWithAttendance].sort((a, b) => {
    if (a.lastPunch && b.lastPunch) {
      return new Date(b.lastPunch.timestamp).getTime() - new Date(a.lastPunch.timestamp).getTime();
    }
    if (a.lastPunch && !b.lastPunch) return -1;
    if (!a.lastPunch && b.lastPunch) return 1;
    return sortAulasNatural(a, b);
  });

  const completedDocentes = docentesWithAttendance.filter((d) => d.isCompleted);
  const presentDocentes = docentesWithAttendance.filter((d) => d.isPresent);
  const missingDocentes = docentesWithAttendance.filter((d) => !d.isPresent).sort(sortAulasNatural);

  const totalDocentes = Math.max(activeDocentesForToday.length, presentIds.size);
  const percentAttendance = totalDocentes > 0 ? Math.round((presentDocentes.length / totalDocentes) * 100) : 0;

  // Historial Único
  const uniqueDocenteHistoryMap = new Map<string, AccessLog>();
  logs.forEach((log) => {
    const id = normalizeDNI(log.employee_id);
    if (!uniqueDocenteHistoryMap.has(id)) {
      uniqueDocenteHistoryMap.set(id, log);
    }
  });
  const uniqueLogs = Array.from(uniqueDocenteHistoryMap.values());

  // Último Marcado
  const latestLog = logs[0] || null;
  const latestDocente = latestLog
    ? docentes.find((d) => matchDNI(d.employee_id, latestLog.employee_id))
    : null;
  const latestDocenteName = latestDocente?.name || latestLog?.employee_name || "Docente";

  const latestLogNormDni = latestLog ? normalizeDNI(latestLog.employee_id) : "";
  const latestLogDocLogs = latestLog ? todayLogs.filter((l) => matchDNI(l.employee_id, latestLog.employee_id)) : [];
  const latestLogSortedLogs = [...latestLogDocLogs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const latestLogIsMultiPunch = latestLogSortedLogs.length >= 2;
  const latestLogIsExplicitExited = manualExitedIds.has(latestLogNormDni) || (latestLog && String(latestLog.tipo_evento).toUpperCase() === "SALIDA");
  const isLatestLogSalida = !manualPresentIds.has(latestLogNormDni) && (latestLogIsExplicitExited || latestLogIsMultiPunch);
  const latestLogEventType = isLatestLogSalida ? "SALIDA" : "ENTRADA";

  // Filtro de Aulas para Estudiantes (Ordenado naturalmente por Aula)
  const filteredAulas = docentes
    .filter((d) => {
      let matchTipo = true;
      const hasLogToday = todayLogs.some((l) => matchDNI(l.employee_id, d.employee_id));

      if (!isAdminMode) {
        // En Modo Alumnos: mostrar automáticamente los docentes programados para el turno de hoy (incluyendo Ambos Horarios y quienes hayan marcado hoy)
        const isBoth =
          d.tipo_horario === "Ambos Horarios" ||
          d.tipo_horario === "Todos los Horarios" ||
          d.tipo_horario === "Ambos" ||
          d.tipo_horario === "Padrón General";
        if (hasLogToday) matchTipo = true;
        else if (isWeekend) matchTipo = d.tipo_horario === "Fin de Semana" || isBoth;
        else if (isMWF) matchTipo = d.tipo_horario === "Entre Semana" || isBoth;
        else matchTipo = d.tipo_horario === "Entre Semana" || isBoth;
      } else {
        if (horarioFilter === "Entre Semana") matchTipo = d.tipo_horario === "Entre Semana" || d.tipo_horario === "Ambos Horarios" || hasLogToday;
        else if (horarioFilter === "Fin de Semana") matchTipo = d.tipo_horario === "Fin de Semana" || d.tipo_horario === "Ambos Horarios" || hasLogToday;
        else if (horarioFilter === "Ambos Horarios") matchTipo = d.tipo_horario === "Ambos Horarios";
        else matchTipo = true;
      }

      const q = searchQuery.toLowerCase().trim();
      const normQ = normalizeDNI(q);
      const matchQuery =
        !searchQuery ||
        d.name.toLowerCase().includes(q) ||
        matchDNI(d.employee_id, q) ||
        d.employee_id.includes(q) ||
        (normQ && matchDNI(d.employee_id, normQ)) ||
        (d.aula && d.aula.toLowerCase().includes(q)) ||
        (d.curso && d.curso.toLowerCase().includes(q));
      return matchTipo && matchQuery;
    })
    .sort(sortAulasNatural);

  // Filtro de Gestor de Docentes (Ordenado estrictamente por Aula)
  const filteredGestorDocentes = docentes
    .filter((d) => {
      if (gestorFilter === "sd" && d.tipo_horario !== "Fin de Semana" && d.tipo_horario !== "Ambos Horarios") return false;
      if (gestorFilter === "lmv" && d.tipo_horario !== "Entre Semana" && d.tipo_horario !== "Ambos Horarios") return false;
      if (gestorFilter === "ambos" && d.tipo_horario !== "Ambos Horarios") return false;
      if (gestorFilter === "inactivos" && d.tipo_horario !== "Padrón General") return false;

      const q = gestorSearch.toLowerCase().trim();
      const normQ = normalizeDNI(q);
      return (
        !gestorSearch ||
        d.name.toLowerCase().includes(q) ||
        matchDNI(d.employee_id, q) ||
        d.employee_id.includes(q) ||
        (normQ && matchDNI(d.employee_id, normQ)) ||
        (d.aula && d.aula.toLowerCase().includes(q))
      );
    })
    .sort(sortAulasNatural);

  // Generador de Mensaje de WhatsApp Completo con Horas de Entrada de Todos
  const generateWhatsappMessage = () => {
    let msg = `📋 *UNHEVAL POSGRADO - REPORTE DE ASISTENCIA Y HORAS DE ENTRADA*\n`;
    msg += `📅 *Fecha:* ${currentDate}\n`;
    msg += `⏰ *Hora de Emisión:* ${currentTime}\n`;
    msg += `🏫 *Turno:* ${horarioActual.turno}\n\n`;
    msg += `📊 *RESUMEN DE ASISTENCIA:*\n`;
    msg += `✅ *Docentes en Aula (Presentes):* ${presentDocentes.length} de ${totalDocentes} (${percentAttendance}%)\n`;
    msg += `⏳ *Docentes Pendientes:* ${missingDocentes.length} docentes\n\n`;

    // 1. SECCIÓN: DOCENTES PRESENCIALES Y VIRTUALES CON HORA DE INGRESO
    if (presentDocentes.length > 0) {
      // Ordenar por hora de entrada cronológica (los primeros que llegaron arriba)
      const sortedPresent = [...presentDocentes].sort((a, b) => {
        const timeA = a.docLogs.length > 0 ? new Date(a.docLogs[a.docLogs.length - 1].timestamp).getTime() : 0;
        const timeB = b.docLogs.length > 0 ? new Date(b.docLogs[b.docLogs.length - 1].timestamp).getTime() : 0;
        return timeA - timeB;
      });

      const presenciales = sortedPresent.filter((d) => !d.modalidad?.includes("Virtual") && !d.aula?.toLowerCase().includes("virtual"));
      const virtuales = sortedPresent.filter((d) => d.modalidad?.includes("Virtual") || d.aula?.toLowerCase().includes("virtual"));

      if (presenciales.length > 0) {
        msg += `🟢 *DOCENTES PRESENCIALES EN AULA (${presenciales.length}):*\n`;
        presenciales.forEach((d, i) => {
          const firstEntry = d.docLogs[d.docLogs.length - 1];
          const horaEntrada = firstEntry ? formatDate(firstEntry.timestamp) : "--:--";
          const lastPunch = d.docLogs[0];
          const tieneSalida = d.docLogs.length > 1 && lastPunch && lastPunch.tipo_evento === "SALIDA";
          const horaSalida = tieneSalida ? ` | Salida: ${formatDate(lastPunch.timestamp)}` : "";

          msg += `${i + 1}. 🕒 *[Entrada: ${horaEntrada}${horaSalida}]*\n`;
          msg += `   👨‍🏫 *${d.name}*\n`;
          msg += `   📍 *${d.aula || "Posgrado"}* • 📚 ${d.curso || "Asignatura"} (DNI: ${d.employee_id})\n\n`;
        });
      }

      if (virtuales.length > 0) {
        msg += `💻 *DOCENTES CONECTADOS VIRTUALMENTE - TEAMS (${virtuales.length}):*\n`;
        virtuales.forEach((d, i) => {
          const firstEntry = d.docLogs[d.docLogs.length - 1];
          const horaConexion = firstEntry ? formatDate(firstEntry.timestamp) : "Registrado";

          msg += `${i + 1}. 💻 *[Conectado: ${horaConexion}]*\n`;
          msg += `   👨‍🏫 *${d.name}*\n`;
          msg += `   🌐 *Microsoft Teams* • 📚 ${d.curso || "Asignatura"} (DNI: ${d.employee_id})\n\n`;
        });
      }
    }

    // 2. SECCIÓN: DOCENTES PENDIENTES
    if (missingDocentes.length > 0) {
      msg += `⏳ *DOCENTES PENDIENTES DE MARCAR:* (${missingDocentes.length})\n`;
      missingDocentes.forEach((d, i) => {
        msg += `${i + 1}. ❌ ${d.name} -> *${d.aula || "Sin aula"}* (${d.curso || "Curso"})\n`;
      });
      msg += `\n`;
    } else {
      msg += `🎉 *¡100% de Asistencia Registrada hoy en Posgrado!*\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🏛️ _Universidad Nacional Hermilio Valdizán • Escuela de Posgrado_`;

    return msg;
  };

  const handleSendWhatsapp = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(generateWhatsappMessage());
      const cleanPhone = whatsappNumber.replace(/[^0-9]/g, "");
      const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
      window.open(url, "_blank");
    }
  };

  const handleSendCallmebot = async () => {
    if (!whatsappNumber || !callmebotApiKey) {
      setBotStatusMsg("⚠️ Ingresa el número de teléfono y la API Key gratuita de CallMeBot.");
      return;
    }
    setIsSendingBot(true);
    setBotStatusMsg("Enviando notificación por CallMeBot...");
    try {
      const res = await fetch("/api/notificar-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: whatsappNumber,
          apikey: callmebotApiKey,
          customMessage: generateWhatsappMessage(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        const botDetail = data.callMeBotResults?.[0]?.response || "Mensaje encolado en CallMeBot";
        setBotStatusMsg(`✅ ¡Notificación enviada a WhatsApp! (${botDetail})`);
      } else {
        setBotStatusMsg("❌ Error: " + (data.error || "No se pudo enviar"));
      }
    } catch (err: unknown) {
      setBotStatusMsg("❌ Error de conexión al enviar WhatsApp.");
    } finally {
      setIsSendingBot(false);
    }
  };

  return (
    <>
      {/* 🍔 MENÚ HAMBURGUESA LATERAL (DRAWER SLIDEOVER MODERNO) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md transition-all animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-80 sm:w-96 bg-slate-950/95 border-r border-amber-500/30 h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300 relative p-5 overflow-y-auto cursor-default"
          >
            <div className="flex flex-col gap-5">
              {/* Encabezado del Menú */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/30 shadow-inner">
                    <GraduationCap className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm tracking-wide">POSGRADO UNHEVAL</h3>
                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Menú Ejecutivo</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-2 rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* SECCIÓN 1: VISTAS PRINCIPALES */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                  Monitoreo & Asistencia
                </span>

                <button
                  onClick={() => {
                    setActiveTab("aulas");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "aulas"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-950/60 font-black"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <div className="text-left">
                    <p className="font-bold">Salones en Vivo (Smart TV)</p>
                    <p className="text-[10px] opacity-70">Distribución por aulas en tiempo real</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveTab("timeline");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "timeline"
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/60 font-black"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <div className="text-left">
                    <p className="font-bold">Control de Asistencia</p>
                    <p className="text-[10px] opacity-70">Orden dinámico por llegada facial</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveTab("gestor");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "gestor"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/60 font-black"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <p className="font-bold">Directorio & Gestor Docentes</p>
                    <p className="text-[10px] opacity-70">Editar aulas, cursos y horarios</p>
                  </div>
                </button>
              </div>

              {/* SECCIÓN 2: ANALÍTICA & REPORTES */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                  Analítica & Rendimiento
                </span>

                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveTab("ranking");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "ranking"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg font-black"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <p className="font-bold">🏆 Ranking de Puntualidad & KPIs</p>
                    <p className="text-[10px] opacity-70">Top 10 docentes y métricas de asistencia</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsAdminMode(true);
                    setActiveTab("reportes");
                    handleFetchReporte();
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "reportes"
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60 font-black"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div className="text-left">
                    <p className="font-bold">Reportes & Liquidación</p>
                    <p className="text-[10px] opacity-70">Exportar Excel & PDF oficial UNHEVAL</p>
                  </div>
                </button>

                <a
                  href="/docente"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-sky-300 hover:bg-sky-950/50 hover:text-white border border-sky-500/20 transition-all"
                >
                  <QrCode className="w-4 h-4 text-sky-400" />
                  <div className="text-left">
                    <p className="font-bold">📱 Portal Docente (Autoconsulta)</p>
                    <p className="text-[10px] opacity-70">Consulta por DNI & Constancia Digital</p>
                  </div>
                </a>
              </div>

              {/* SECCIÓN 3: HERRAMIENTAS RÁPIDAS */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                  Acciones Rápidas
                </span>

                <button
                  onClick={() => {
                    setShowVerificarAulasModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Verificar Aulas Vacías</span>
                  </div>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {aulasSinDocente.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setShowMegaphoneModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all cursor-pointer"
                >
                  <Megaphone className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>Megáfono / Locución en Vivo</span>
                </button>

                <button
                  onClick={() => {
                    setShowUploadModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>Subir Horario en PDF</span>
                </button>

                <button
                  onClick={() => {
                    setShowAddModal(true);
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Registrar Nuevo Docente</span>
                </button>
              </div>
            </div>

            {/* Pie del Menú Lateral */}
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Voz Inteligente:</span>
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 text-[10px] ${
                    voiceEnabled ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-900 text-slate-500"
                  }`}
                >
                  {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  <span>{voiceEnabled ? "Activada" : "Silenciada"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Hikvision Facial Cloud</span>
                <span className="text-emerald-400 font-bold">● V5.0 Online</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <main
      className={`min-h-screen h-screen max-h-screen bg-slate-950 text-slate-100 p-3 md:p-5 flex flex-col justify-between select-none transition-all duration-700 w-full overflow-hidden ${
        flashGlow ? "ring-8 ring-emerald-500/80 bg-slate-900" : ""
      }`}
    >
      {/* 📢 BANNER FLOTANTE DE COMUNICADO EN VIVO POR MEGÁFONO */}
      {incomingBroadcast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl p-3.5 shadow-2xl border-2 border-yellow-300 animate-bounce flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl border border-white/40 flex-shrink-0">
              <Megaphone className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-black/40 px-2 py-0.5 rounded text-yellow-200">
                  📢 COMUNICADO EN VIVO ({incomingBroadcast.timestamp})
                </span>
              </div>
              <h4 className="text-sm md:text-base font-black tracking-tight leading-snug">{incomingBroadcast.title}</h4>
              {incomingBroadcast.text && (
                <p className="text-xs md:text-sm text-yellow-100 font-semibold mt-0.5">{incomingBroadcast.text}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIncomingBroadcast(null)}
            className="bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full transition-all flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

            {/* MODAL: VERIFICADOR DE AULAS Y ALERTAS PROACTIVAS WHATSAPP */}
      {showVerificarAulasModal && (
        <div
          onClick={() => setShowVerificarAulasModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-2xl w-full flex flex-col gap-4 shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/40">
                  <ShieldAlert className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Verificador Proactivo de Aulas</h3>
                  <p className="text-xs text-slate-400">
                    Aulas programadas para hoy que aún no registran presencia docente
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerificarAulasModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {aulasSinDocente.length === 0 ? (
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-6 rounded-2xl text-center flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                <h4 className="text-base font-black text-white">¡Todas las Aulas Atendidas!</h4>
                <p className="text-xs text-emerald-300">
                  El 100% de los docentes programados para el turno de hoy ya se encuentran en el aula.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <span className="text-amber-300 font-bold">
                    ⚠️ Se detectaron {aulasSinDocente.length} salones esperando docente:
                  </span>
                  <button
                    onClick={() => {
                      const msg = `⚠️ *ALERTA POSGRADO UNHEVAL - AULAS SIN DOCENTE (${aulasSinDocente.length})*:\n\n` +
                        aulasSinDocente.map((d, i) => `${i+1}. 📍 *${d.aula}*: ${d.name} (${d.curso})`).join("\n") +
                        `\n\n⏰ Hora: ${currentTime} | Por favor coordinar llegada.`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] rounded-lg flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Alerta Grupal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {aulasSinDocente.map((d, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-amber-500/30 p-3 rounded-2xl flex flex-col justify-between gap-2 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                            {d.aula}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">DNI: {d.employee_id}</span>
                        </div>
                        <h5 className="text-xs font-black text-white mt-1.5 line-clamp-1">{d.name}</h5>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{d.curso}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                        <span className="text-[10px] text-rose-400 font-bold">⏳ Pendiente de ingreso</span>
                        <button
                          onClick={() => {
                            const msg = `Estimado(a) ${d.name}, le saludamos de la Escuela de Posgrado UNHEVAL. Le recordamos que su clase en el *${d.aula}* (${d.curso}) está programada para hoy. ¿Tiene algún inconveniente con su llegada?`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-[10px] rounded-lg border border-slate-700 flex items-center gap-1"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>Notificar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MEGÁFONO Y TRANSMISIÓN DE MICRÓFONO EN VIVO */}
      {showMegaphoneModal && (
        <div
          onClick={() => !isBroadcasting && !isRecordingMic && setShowMegaphoneModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl relative"
          >
            <button
              onClick={() => !isBroadcasting && !isRecordingMic && setShowMegaphoneModal(false)}
              disabled={isBroadcasting || isRecordingMic}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/40">
                <Megaphone className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Megáfono / Comunicado en Vivo</h3>
                <p className="text-xs text-slate-400">
                  Transmite tu voz por micrófono a todas las pantallas y Smart TVs al instante
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Título del Comunicado:</label>
                <input
                  type="text"
                  value={megaphoneTitle}
                  onChange={(e) => setMegaphoneTitle(e.target.value)}
                  placeholder="Ej: AVISO URGENTE DE DIRECCIÓN"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-rose-500"
                />
              </div>

              {/* 🎛️ SELECTOR DE PESTAÑAS DEL MEGÁFONO */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    handleStopLiveStream();
                    setMegaphoneTab("live");
                  }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    megaphoneTab === "live"
                      ? "bg-rose-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>En Vivo Directo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleStopLiveStream();
                    setMegaphoneTab("record");
                  }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    megaphoneTab === "record"
                      ? "bg-purple-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Grabar Audio</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleStopLiveStream();
                    setMegaphoneTab("text");
                  }}
                  className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    megaphoneTab === "text"
                      ? "bg-indigo-600 text-white shadow-md font-black"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Texto a Voz</span>
                </button>
              </div>

              {/* 🔴 PESTAÑA 1: TRANSMISIÓN EN VIVO DIRECTO (WALKIE-TALKIE) */}
              {megaphoneTab === "live" && (
                <div
                  className={`border-2 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center transition-all ${
                    isLiveStreaming
                      ? "bg-rose-950/70 border-rose-500 shadow-2xl shadow-rose-950 ring-4 ring-rose-500/30"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        isLiveStreaming ? "bg-rose-500 animate-ping" : "bg-slate-600"
                      }`}
                    />
                    <span
                      className={`text-xs font-black uppercase tracking-wider ${
                        isLiveStreaming ? "text-rose-300 animate-pulse" : "text-slate-400"
                      }`}
                    >
                      {isLiveStreaming
                        ? "🔴 EN VIVO • TRANSMITIENDO POR EL MICRÓFONO"
                        : "HABLAR EN TIEMPO REAL (SIN ESPERAS)"}
                    </span>
                  </div>

                  {/* Medidor VU / Ecualizador animado */}
                  {isLiveStreaming && (
                    <div className="flex items-center justify-center gap-1.5 h-10 w-full py-1">
                      {[15, 30, 55, 80, 100, 75, 45, 20].map((h, i) => {
                        const dynamicHeight = Math.max(12, Math.min(40, Math.round((liveVolume / 100) * h + 10)));
                        return (
                          <div
                            key={i}
                            style={{ height: `${dynamicHeight}px` }}
                            className="w-2.5 bg-gradient-to-t from-rose-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-75 shadow-sm"
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* BOTÓN PUSH-TO-TALK / MANTENER PRESIONADO */}
                  <button
                    type="button"
                    onMouseDown={handleStartLiveStream}
                    onMouseUp={handleStopLiveStream}
                    onTouchStart={handleStartLiveStream}
                    onTouchEnd={handleStopLiveStream}
                    className={`w-40 h-40 rounded-full font-black flex flex-col items-center justify-center gap-2 transition-all select-none shadow-2xl cursor-pointer active:scale-95 border-4 ${
                      isLiveStreaming
                        ? "bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 border-yellow-300 text-white shadow-rose-900/80 animate-pulse scale-105"
                        : "bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950/60 hover:from-rose-900 hover:to-rose-800 border-rose-500/50 text-rose-200 hover:text-white"
                    }`}
                    title="Mantén presionado para hablar en vivo a todas las pantallas"
                  >
                    <Mic className={`w-12 h-12 ${isLiveStreaming ? "text-yellow-300 animate-bounce" : "text-rose-400"}`} />
                    <span className="text-xs uppercase font-extrabold tracking-tight px-2 text-center leading-tight">
                      {isLiveStreaming ? "HABLANDO EN VIVO..." : "MANTÉN PRESIONADO PARA HABLAR"}
                    </span>
                  </button>

                  {/* O BOTÓN ALTERNATIVO DE CLIC CONTINUO */}
                  <button
                    type="button"
                    onClick={isLiveStreaming ? handleStopLiveStream : handleStartLiveStream}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                      isLiveStreaming
                        ? "bg-slate-900 hover:bg-slate-800 text-rose-300 border-rose-500/50"
                        : "bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {isLiveStreaming ? (
                      <>
                        <Square className="w-3.5 h-3.5 text-rose-400" />
                        <span>Detener Transmisión en Vivo</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                        <span>O haz 1 Clic para Hablar Continuo</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* 📼 PESTAÑA 2: GRABAR AUDIO, ESCUCHAR Y TRANSMITIR */}
              {megaphoneTab === "record" && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-4 text-center">
                  <span className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-purple-400" /> Grabar Mensaje de Voz y Escucharlo
                  </span>

                  {!isRecordingMic && !recordedAudioUrl && (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-black px-6 py-3.5 rounded-2xl transition-all text-sm flex items-center gap-2 shadow-lg shadow-purple-950 border border-purple-400 cursor-pointer"
                    >
                      <Mic className="w-5 h-5 animate-pulse" /> 🎙️ Iniciar Grabación de Voz
                    </button>
                  )}

                  {isRecordingMic && (
                    <div className="flex flex-col items-center gap-3 w-full">
                      {/* Medidor VU / Ecualizador animado mientras grabas */}
                      <div className="flex items-center justify-center gap-1.5 h-10 w-full py-1">
                        {[15, 30, 55, 80, 100, 75, 45, 20].map((h, i) => {
                          const dynamicHeight = Math.max(12, Math.min(40, Math.round((liveVolume / 100) * h + 10)));
                          return (
                            <div
                              key={i}
                              style={{ height: `${dynamicHeight}px` }}
                              className="w-2.5 bg-gradient-to-t from-purple-600 via-pink-400 to-amber-300 rounded-full transition-all duration-75 shadow-sm"
                            />
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-purple-300 font-mono font-black text-lg bg-purple-950/60 px-5 py-2 rounded-full border border-purple-500/40 animate-pulse">
                        <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping"></span>
                        <span>Grabando: 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 01:00</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
                      >
                        <Square className="w-4 h-4 text-purple-400" /> ⏹️ Detener Grabación
                      </button>
                    </div>
                  )}

                  {recordedAudioUrl && (
                    <div className="flex flex-col items-center gap-3 w-full bg-slate-900/90 p-4 rounded-2xl border border-purple-500/40">
                      <span className="text-xs text-emerald-400 font-bold">✅ Audio grabado listo. Escúchalo antes de transmitir:</span>
                      <audio src={recordedAudioUrl} controls className="w-full h-10 rounded-lg" />
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          type="button"
                          onClick={handleSendBroadcast}
                          disabled={isBroadcasting}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md cursor-pointer border border-purple-400"
                        >
                          <Send className="w-4 h-4" /> {isBroadcasting ? "Transmitiendo..." : "🚀 TRANSMITIR AUDIO A TODAS LAS PANTALLAS"}
                        </button>
                        <button
                          type="button"
                          onClick={handleDiscardAudio}
                          className="text-xs text-slate-400 hover:text-rose-400 transition-all underline cursor-pointer"
                        >
                          Descartar y grabar otro
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ✍️ PESTAÑA 3: ESCRIBIR TEXTO (VOZ SINTETIZADA) */}
              {megaphoneTab === "text" && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                  <label className="text-[11px] font-bold text-slate-300 uppercase">
                    Escribe el mensaje para locución en voz alta:
                  </label>
                  <textarea
                    value={megaphoneText}
                    onChange={(e) => setMegaphoneText(e.target.value)}
                    placeholder="Ej: Atención alumnos de las aulas 201 y 202, por favor acercarse a la mesa de control de posgrado..."
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:border-indigo-500 resize-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendBroadcast}
                    disabled={isBroadcasting || !megaphoneText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" /> {isBroadcasting ? "Transmitiendo..." : "📢 Transmitir Mensaje de Voz"}
                  </button>
                </div>
              )}

              {broadcastStatus && (
                <div
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    broadcastStatus.includes("❌")
                      ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                      : "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  <span>{broadcastStatus}</span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    handleStopLiveStream();
                    setShowMegaphoneModal(false);
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: SUBIR PDF Y AUTO-ASIGNAR HORARIO */}
      {showUploadModal && (
        <div
          onClick={() => !isUploadingPdf && setShowUploadModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-indigo-500/60 rounded-3xl p-6 max-w-xl w-full flex flex-col gap-4 shadow-2xl relative"
          >
            <button
              onClick={() => !isUploadingPdf && setShowUploadModal(false)}
              disabled={isUploadingPdf}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/40">
                <Upload className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Subir Horario PDF y Auto-Asignar</h3>
                <p className="text-xs text-slate-400">
                  El sistema lee automáticamente el PDF y auto-coloca las aulas, docentes y cursos
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  1. Selecciona a qué horario corresponde este archivo PDF:
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPdfSchedule("Fin de Semana")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      selectedPdfSchedule === "Fin de Semana"
                        ? "bg-purple-600 border-purple-400 text-white shadow-md"
                        : "bg-slate-950 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" /> Sábados y Domingos (S-D)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPdfSchedule("Entre Semana")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      selectedPdfSchedule === "Entre Semana"
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-md"
                        : "bg-slate-950 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <CalendarClock className="w-3.5 h-3.5" /> Lun, Mié y Vie (L-M-V)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  2. Selecciona o arrastra el archivo PDF oficial:
                </label>
                <div className="mt-1 border-2 border-dashed border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-indigo-950/20 hover:bg-indigo-950/40 transition-all cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf"
                    disabled={isUploadingPdf}
                    onChange={handleProcessPdf}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    id="pdf-upload-input"
                  />
                  <FileText className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                  <p className="text-sm font-bold text-white">Haz clic aquí para seleccionar el archivo PDF</p>
                  <p className="text-xs text-slate-400 mt-0.5">Soporta cualquier formato de distribución de aulas UNHEVAL</p>
                </div>
              </div>

              {pdfUploadResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                    pdfUploadResult.includes("❌")
                      ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                      : pdfUploadResult.includes("⏳")
                      ? "bg-indigo-950/60 border-indigo-500/40 text-indigo-200"
                      : "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  }`}
                >
                  {isUploadingPdf && <Activity className="w-4 h-4 animate-spin text-indigo-400 flex-shrink-0" />}
                  <span>{pdfUploadResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 max-w-lg w-full flex flex-col gap-4 shadow-2xl relative"
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/40">
                <UserPlus className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Añadir Nuevo Docente</h3>
                <p className="text-xs text-slate-400">Registrar un docente y asignarlo al horario</p>
              </div>
            </div>

            <form onSubmit={handleCreateDocente} className="flex flex-col gap-3 mt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">DNI del Docente (8 dígitos):</label>
                <input
                  type="text"
                  required
                  value={newDni}
                  onChange={(e) => setNewDni(e.target.value)}
                  placeholder="Ej: 22498088"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: DR. CORNEJO Y MALDONADO, ANTONIO"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm uppercase focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Aula Asignada:</label>
                  <input
                    type="text"
                    value={newAula}
                    onChange={(e) => setNewAula(e.target.value)}
                    placeholder="Ej: Aula 102"
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold text-sm focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Modalidad:</label>
                  <select
                    value={newModalidad}
                    onChange={(e) => setNewModalidad(e.target.value as any)}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500"
                  >
                    <option value="Presencial">🏫 Presencial</option>
                    <option value="Virtual (Teams)">💻 Virtual (Teams)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Curso / Asignatura:</label>
                <input
                  type="text"
                  value={newCurso}
                  onChange={(e) => setNewCurso(e.target.value)}
                  placeholder="Ej: ECOLOGÍA Y SALUD"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Asignar a Fecha / Horario:</label>
                <select
                  value={newTipoHorario}
                  onChange={(e) => setNewTipoHorario(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold text-sm focus:border-emerald-500"
                >
                  <option value="Fin de Semana">📅 Fin de Semana (Sábados y Domingos)</option>
                  <option value="Entre Semana">📅 Entre Semana (Lunes, Miércoles, Viernes)</option>
                  <option value="Ambos Horarios">🔥 Ambos Horarios (Dicta S-D y L-M-V)</option>
                  <option value="Padrón General">💤 Sin Asignación Hoy (Solo Padrón)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                >
                  <Save className="w-4 h-4" /> Guardar y Asignar Docente
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR DOCENTE Y CORREGIR DNI / ASIGNACIÓN */}
      {editingDocente && (
        <div
          onClick={() => setEditingDocente(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-lg w-full flex flex-col gap-3 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Corregir DNI y Datos del Docente</span>
              </h3>
              <button
                onClick={() => setEditingDocente(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDocente} className="flex flex-col gap-3 mt-1">
              <div>
                <label className="text-[11px] font-bold text-amber-300 uppercase">
                  DNI del Docente (Corregir DNI / ej: con o sin cero inicial):
                </label>
                <input
                  type="text"
                  required
                  value={editingDocente.employee_id}
                  onChange={(e) =>
                    setEditingDocente({ ...editingDocente, employee_id: e.target.value })
                  }
                  placeholder="Ej: 07951959 o 22498088"
                  className="w-full mt-1 bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold text-sm focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Nombre Completo y Grado:</label>
                <input
                  type="text"
                  required
                  value={editingDocente.name}
                  onChange={(e) =>
                    setEditingDocente({ ...editingDocente, name: e.target.value })
                  }
                  placeholder="Ej: DRA. VEGA JARA, LILIANA"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm uppercase focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Aula Asignada:</label>
                  <input
                    type="text"
                    value={editingDocente.aula}
                    onChange={(e) =>
                      setEditingDocente({ ...editingDocente, aula: e.target.value })
                    }
                    placeholder="Ej: Aula 102"
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold text-sm focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Modalidad:</label>
                  <select
                    value={editingDocente.modalidad?.includes("Virtual") ? "Virtual (Teams)" : "Presencial"}
                    onChange={(e) =>
                      setEditingDocente({ ...editingDocente, modalidad: e.target.value })
                    }
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-amber-500"
                  >
                    <option value="Presencial">🏫 Presencial</option>
                    <option value="Virtual (Teams)">💻 Virtual (Teams)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Curso / Asignatura:</label>
                <input
                  type="text"
                  value={editingDocente.curso}
                  onChange={(e) =>
                    setEditingDocente({ ...editingDocente, curso: e.target.value })
                  }
                  placeholder="Ej: SEMINARIO DE TESIS"
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Horario de Dictado:</label>
                <select
                  value={editingDocente.tipo_horario}
                  onChange={(e) =>
                    setEditingDocente({ ...editingDocente, tipo_horario: e.target.value as any })
                  }
                  className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold text-sm focus:border-amber-500"
                >
                  <option value="Entre Semana">📅 Entre Semana (Lunes, Miércoles, Viernes)</option>
                  <option value="Fin de Semana">📅 Fin de Semana (Sábados y Domingos)</option>
                  <option value="Ambos Horarios">🔥 Ambos Horarios (Dicta S-D y L-M-V)</option>
                  <option value="Padrón General">💤 Sin Asignación Hoy (Solo Padrón)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950"
                >
                  <Save className="w-4 h-4" /> Guardar Correcciones
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteDocente(editingDocente.originalDni, editingDocente.name)}
                  className="bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 px-3 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1"
                  title="Eliminar del sistema"
                >
                  <UserX className="w-4 h-4" /> Eliminar
                </button>

                <button
                  type="button"
                  onClick={() => setEditingDocente(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX: ZOOM DE FOTO EN HD */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 max-w-lg w-full flex flex-col items-center gap-4 shadow-2xl relative"
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-72 h-88 md:w-96 md:h-[420px] rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-black flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage.url}
                alt={zoomedImage.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center w-full">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                    zoomedImage.tipo === "SALIDA"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {zoomedImage.tipo || "ENTRADA"}
                </span>
                <span className="text-xs font-mono text-slate-400">{zoomedImage.time}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white">{zoomedImage.name}</h3>
              <p className="text-emerald-400 font-mono text-base font-bold mt-1">DNI: {zoomedImage.id}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER INSTITUCIONAL: MODO ALUMNOS (KIOSCO TV LIMPIO) vs MODO ADMINISTRATIVO */}
      {!isAdminMode ? (
        // ==========================================
        // 🏛️ PANTALLA PÚBLICA PARA ALUMNOS (100% LIMPIA Y MODERNA)
        // ==========================================
        <header className="border-b border-slate-800/80 pb-2.5 flex items-center justify-between gap-3 flex-shrink-0 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-800">
          {/* 1. Identidad Institucional */}
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 rounded-2xl shadow-lg shadow-emerald-950/50">
              <div className="bg-slate-950 p-2 rounded-[14px]">
                <GraduationCap className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  UNHEVAL • POSGRADO
                </span>
                <span className="text-[11px] bg-slate-950 border border-slate-800 text-indigo-300 font-bold px-2 py-0.5 rounded-md">
                  {horarioActual.turno}
                </span>
              </div>
              <h1 className="text-lg md:text-xl font-black tracking-tight text-white mt-0.5">
                DISTRIBUCIÓN DE AULAS Y LLEGADA DE DOCENTES
              </h1>
            </div>
          </div>

          {/* 2. Centro: Estado En Vivo & Fecha */}
          <div className="hidden xl:flex items-center gap-3 bg-slate-950/80 border border-slate-800/90 px-3.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    isConnected ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                {isConnected ? "EN VIVO" : "CONECTANDO"}
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <span className="text-xs font-bold text-slate-400 capitalize">{currentDate}</span>
          </div>

          {/* 3. Derecha: Reloj & Herramientas Rápidas */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shadow-md">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-lg font-mono font-black text-white tracking-wider">
                {currentTime}
              </span>
            </div>

            {/* Grupo de Acceso Rápido */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setIsCarteleraMode(!isCarteleraMode)}
                className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isCarteleraMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md font-black"
                    : "text-purple-300 hover:bg-slate-900 hover:text-white"
                }`}
                title="Modo Cartelera Dividida en Smart TV"
              >
                <Tv className="w-4 h-4" />
                <span className="hidden lg:inline">{isCarteleraMode ? "Cartelera Activa" : "Cartelera 4K"}</span>
              </button>

              <a
                href="/docente"
                target="_blank"
                className="p-2 rounded-lg text-xs font-bold text-cyan-300 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 transition-all"
                title="Portal Móvil para Docentes"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="hidden lg:inline">Portal Docente</span>
              </a>

              <button
                onClick={() => setShowMegaphoneModal(true)}
                className="p-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 transition-all"
                title="Transmitir audio por micrófono a todas las pantallas"
              >
                <Megaphone className="w-4 h-4 text-rose-400 animate-pulse" />
                <span className="hidden lg:inline">Megáfono</span>
              </button>

              <button
                onClick={() => setIsAdminMode(true)}
                className="p-2 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white flex items-center gap-1.5 transition-all"
                title="Acceder al Panel Administrativo"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">Admin</span>
              </button>

              <button
                onClick={toggleFullScreen}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                title="Pantalla Completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      ) : (
        // ==========================================
        // ⚙️ PANEL ADMINISTRATIVO (ORDENADO Y MODULAR)
        // ==========================================
        <header className="border-b border-slate-800 pb-2.5 flex flex-col gap-2.5 flex-shrink-0 bg-slate-900/90 p-3.5 rounded-2xl border border-amber-500/30 shadow-2xl backdrop-blur-md">
          {/* FILA 1: IDENTIDAD + SELECTOR DE FECHA + RELOJ + SALIR DE ADMIN */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-amber-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-black/40 cursor-pointer active:scale-95"
                title="Abrir Menú Principal"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-black uppercase hidden sm:inline">Menú</span>
              </button>
              <div className="bg-amber-500/10 p-2 rounded-2xl border border-amber-500/30">
                <GraduationCap className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-md">
                    PANEL DE GESTIÓN Y CONTROL ACADÉMICO
                  </span>
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-purple-300 font-bold px-2 py-0.5 rounded-md">
                    👥 {activeDocentesForToday.length} Docentes Presenciales Hoy
                  </span>
                  {saveSuccessMsg && (
                    <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full animate-bounce">
                      {saveSuccessMsg}
                    </span>
                  )}
                </div>
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white mt-0.5">
                  CONTROL DE ASISTENCIA BIOMÉTRICA FACIAL • POSGRADO UNHEVAL
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {/* Selector Rápido de Fecha */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setSelectedDate("")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
                    !selectedDate ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>Hoy</span>
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-xs font-bold px-2 py-1 rounded-lg border border-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>

              {/* Reloj */}
              <div className="flex items-center space-x-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shadow-md">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-mono font-bold text-white tracking-wider">
                  {currentTime}
                </span>
              </div>

              {/* Botón Salir a Pantalla Alumnos */}
              <button
                onClick={() => {
                  setIsAdminMode(false);
                  setActiveTab("aulas");
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all active:scale-95 cursor-pointer"
                title="Volver a la vista limpia de salones para los alumnos"
              >
                <Eye className="w-4 h-4" />
                <span>📺 Vista Alumnos (TV)</span>
              </button>
            </div>
          </div>

          {/* FILA 2: BARRA MODULAR DE PESTAÑAS Y HERRAMIENTAS */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            {/* GRUPO 1: PESTAÑAS PRINCIPALES SEGMENTADAS */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab("aulas")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "aulas"
                    ? "bg-purple-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Salones (TV)</span>
              </button>

              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "timeline"
                    ? "bg-indigo-600 text-white shadow-md font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Control de Asistencia</span>
              </button>

              <button
                onClick={() => setActiveTab("ranking")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "ranking"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-amber-300 hover:text-white"
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>🏆 Ranking & KPIs</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("reportes");
                  handleFetchReporte();
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "reportes"
                    ? "bg-emerald-600 text-white shadow-md font-black"
                    : "text-emerald-400 hover:text-white"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reportes & Liquidación</span>
              </button>

              <button
                onClick={() => setActiveTab("gestor")}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  activeTab === "gestor"
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-amber-300 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestor Docentes</span>
              </button>
            </div>

            {/* GRUPO 2: HERRAMIENTAS OPERATIVAS */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowVerificarAulasModal(true)}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Escanear aulas vacías y alertar por WhatsApp"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Verificar Aulas ({aulasSinDocente.length})</span>
              </button>

              <button
                onClick={() => setShowMegaphoneModal(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-rose-950 cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5 animate-pulse" />
                <span>Megáfono</span>
              </button>

              <button
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Subir PDF</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Docente</span>
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  voiceEnabled ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300" : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
                title="Activar/Desactivar Voz"
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* LEYENDA INSTITUCIONAL DE 3 ESTADOS (SOLO VISIBLE EN MODO ADMIN) */}
      {isAdminMode && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1 my-1 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase text-[11px]">Control de Asistencia:</span>
            <span className="text-[10px] text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Orden dinámico por llegada
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-emerald-300">Verde: Puntual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              <span className="text-amber-300">Amarillo: Entrada (+30m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="text-rose-400">Rojo: Sin Registro</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />
              <span className="text-blue-300">Azul: Salida</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFICACIÓN WHATSAPP Y COMPARTIR A CUALQUIER GRUPO */}
      {showWhatsappModal && (
        <div className="my-2 bg-slate-900/95 border-2 border-emerald-500/50 rounded-2xl p-5 flex flex-col gap-3 animate-in fade-in shadow-2xl z-30">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" /> Enviar y Compartir Reporte de Asistencia por WhatsApp
            </h3>
            <button onClick={() => setShowWhatsappModal(false)} className="text-xs text-slate-400 hover:text-white font-bold">
              ✕ Cerrar
            </button>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-200">
            💡 <strong>Opciones de Envío:</strong> Puedes compartir el reporte a <strong>cualquier grupo de WhatsApp o contacto</strong> con el botón verde de compartir (sin restricciones de API), o enviar automático con el Bot a los números que tengan su API Key.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-bold uppercase">Enviar a Cualquier Número WhatsApp:</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="Ej: 51946207347 o 987654321"
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> API Key CallMeBot (Para envío automático)
              </label>
              <input
                type="text"
                value={callmebotApiKey}
                onChange={(e) => setCallmebotApiKey(e.target.value)}
                placeholder="7238443"
                className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleSendWhatsapp}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
            >
              <Send className="w-4 h-4" /> 📲 Enviar a WhatsApp / Compartir a Grupo (Sin Límite)
            </button>

            <button
              onClick={() => {
                if (typeof navigator !== "undefined") {
                  navigator.clipboard.writeText(generateWhatsappMessage());
                  setBotStatusMsg("📋 ¡Reporte copiado al portapapeles! Ya puedes pegarlo en cualquier chat de WhatsApp.");
                  setTimeout(() => setBotStatusMsg(""), 3500);
                }
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <FileText className="w-4 h-4 text-amber-400" /> Copiar Texto
            </button>

            <button
              onClick={handleSendCallmebot}
              disabled={isSendingBot}
              className="bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold py-2.5 px-4 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" /> {isSendingBot ? "Enviando..." : "Envío Directo con Bot (+51 946207347)"}
            </button>
          </div>

          {botStatusMsg && (
            <p className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/40">
              {botStatusMsg}
            </p>
          )}

          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
            {generateWhatsappMessage()}
          </div>
        </div>
      )}

      {/* 2. BARRA DE MÉTRICAS */}
      <div className="grid grid-cols-3 gap-2.5 my-1 flex-shrink-0">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Docentes Presentes</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl md:text-3xl font-black text-emerald-400 font-mono">{presentDocentes.length}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {percentAttendance}% Asistencia
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Faltan Marcar</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl md:text-3xl font-black text-amber-400 font-mono">{missingDocentes.length}</span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Pendientes
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-md">
          <span className="text-xs font-bold text-slate-400 uppercase">Programados Hoy</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">{activeDocentesForToday.length}</span>
            <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              {currentScheduleType}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BLOQUE SUPERIOR DESTACADO: ÚLTIMO REGISTRO EN PANTALLA */}
      <section
        className={`border-2 rounded-2xl p-3.5 shadow-2xl relative overflow-hidden flex flex-col my-1 flex-shrink-0 transition-all ${
          isLatestLogSalida
            ? "bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/70 border-blue-500/60"
            : "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-emerald-500/50"
        }`}
      >
        <div
          className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none ${
            isLatestLogSalida ? "bg-blue-500/15" : "bg-emerald-500/10"
          }`}
        />

        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2">
            <Radio
              className={`w-4 h-4 animate-pulse ${
                isLatestLogSalida ? "text-blue-400" : "text-emerald-400"
              }`}
            />
            <h2
              className={`text-sm md:text-base font-extrabold tracking-wide uppercase ${
                isLatestLogSalida ? "text-blue-300" : "text-emerald-300"
              }`}
            >
              {isLatestLogSalida
                ? "Salida Registrada en el Lector • Hasta Luego"
                : "Último Docente Registrado en el Lector"}
            </h2>
          </div>
          {latestLog && (
            <span
              className={`text-xs font-bold px-3 py-0.5 rounded-full uppercase flex items-center gap-1 ${
                isLatestLogSalida
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isLatestLogSalida ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {latestLogEventType}
            </span>
          )}
        </div>

        {latestLog ? (
          <div className="flex items-center gap-5 py-0.5 animate-in fade-in">
            <div
              onClick={() => {
                if (latestLog.picture_url) {
                  setZoomedImage({
                    url: latestLog.picture_url,
                    name: latestDocenteName,
                    id: latestLog.employee_id,
                    time: formatDate(latestLog.timestamp),
                    tipo: latestLogEventType,
                  });
                }
              }}
              className={`group relative w-24 h-28 md:w-32 md:h-36 bg-slate-950 rounded-2xl overflow-hidden border-2 shadow-inner flex items-center justify-center flex-shrink-0 cursor-pointer transition-all ${
                isLatestLogSalida
                  ? "border-blue-400/60 hover:border-blue-400"
                  : "border-emerald-400/50 hover:border-emerald-400"
              }`}
              title="Haz clic para agrandar la foto"
            >
              {latestLog.picture_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={latestLog.picture_url}
                  alt={latestDocenteName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-600">
                  <User className="w-12 h-12 mb-1" />
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Captura</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <ZoomIn className="w-8 h-8 text-white" />
              </div>
              <div
                className={`absolute bottom-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono flex items-center gap-1 ${
                  isLatestLogSalida ? "text-blue-300" : "text-emerald-400"
                }`}
              >
                <Camera className="w-3 h-3" /> AMPLIAR
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <p
                className={`text-xs md:text-sm font-black uppercase tracking-wider ${
                  isLatestLogSalida ? "text-blue-300" : "text-emerald-400"
                }`}
              >
                {isLatestLogSalida
                  ? "👋 ¡Hasta luego! • Salida Registrada"
                  : "👋 ¡Bienvenido(a) a Posgrado!"}
              </p>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">
                {latestDocenteName}
              </h3>
              {latestDocente && (
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs bg-purple-950/80 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-lg font-bold">
                    📍 {latestDocente.aula || "Posgrado UNHEVAL"}
                  </span>
                  <span className="text-xs text-slate-300 font-medium truncate max-w-lg">
                    📚 {latestDocente.curso}
                  </span>
                </div>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <div className="bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs">DNI: </span>
                  <span
                    className={`text-base md:text-lg font-mono font-bold ${
                      isLatestLogSalida ? "text-blue-400" : "text-emerald-400"
                    }`}
                  >
                    {latestLog.employee_id}
                  </span>
                </div>
                <div className="bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs">Hora: </span>
                  <span className="text-base md:text-lg font-mono font-bold text-white">
                    {formatDate(latestLog.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-slate-500">
            <Activity className="w-8 h-8 animate-pulse mb-1 text-slate-600" />
            <p className="text-xs font-semibold text-slate-400">Esperando registro en el lector facial...</p>
          </div>
        )}
      </section>

      {/* 4. BLOQUE PRINCIPAL: CONTROL DE ASISTENCIA / GESTOR DE ASIGNACIONES */}
      <section className="flex-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex flex-col shadow-xl min-h-0 overflow-hidden my-1">
        {/* Selector de Pestañas (SOLO VISIBLE EN MODO ADMIN) */}
        {isAdminMode && (
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 mb-1 gap-1.5 flex-shrink-0">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "timeline"
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Control de Asistencia ({activeDocentesForToday.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("gestor")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "gestor"
                    ? "bg-amber-500 text-slate-950 font-black shadow"
                    : "text-amber-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>⚙️ Modificar Asignaciones (Editor)</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Docente</span>
              </button>

              <button
                onClick={() => setActiveTab("aulas")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "aulas"
                    ? "bg-purple-600 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Directorio de Aulas (Alumnos)</span>
              </button>

              <button
                onClick={() => setActiveTab("faltan")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "faltan"
                    ? "bg-rose-500 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Faltan Marcar ({missingDocentes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("presentes")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "presentes"
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Presentes ({presentDocentes.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("reportes");
                  handleFetchReporte();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "reportes"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950 font-black"
                    : "text-emerald-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>📊 Reporte de Fechas</span>
              </button>
              <button
                onClick={() => setActiveTab("historial")}
                className={`px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === "historial"
                    ? "bg-slate-700 text-white shadow"
                    : "text-slate-400 hover:text-white bg-slate-800/50"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Últimos Marcajes ({uniqueLogs.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 4.1 PESTAÑA: LÍNEA DE MARCAJES CON ORDEN DINÁMICO POR LLEGADA */}
        {activeTab === "timeline" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 text-slate-400 font-bold text-xs uppercase px-3 py-2 border-b border-slate-800 flex-shrink-0">
              <div className="col-span-4 md:col-span-3">Docente / Aula</div>
              <div className="col-span-8 md:col-span-9">
                <div className={`grid ${isSaturday ? "grid-cols-4" : "grid-cols-2"} gap-1.5 text-center`}>
                  {horarioActual.slots.map((s, idx) => (
                    <div key={idx} className="truncate">
                      <span className="text-xs text-slate-200 font-bold">{s.label}</span>
                      <span className="hidden md:inline text-[11px] text-slate-400 ml-1">({s.hora})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto pr-1">
              {docentesWithAttendanceSorted.map((docente, idx) => {
                const hasPunchedToday = docente.isPresent;
                return (
                  <div
                    key={docente.employee_id}
                    className={`grid grid-cols-12 items-center px-3 py-2 hover:bg-slate-800/50 transition-all gap-2 ${
                      hasPunchedToday ? "bg-emerald-950/20 border-l-4 border-emerald-400" : ""
                    }`}
                  >
                    <div className="col-span-4 md:col-span-3 flex items-center gap-2.5">
                      <div
                        onClick={() => {
                          if (docente.lastPicture) {
                            setZoomedImage({
                              url: docente.lastPicture,
                              name: docente.name,
                              id: docente.employee_id,
                              time: docente.lastPunch ? formatDate(docente.lastPunch.timestamp) : "--:--",
                              tipo: docente.lastPunch?.tipo_evento || "ENTRADA",
                            });
                          }
                        }}
                        className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 cursor-pointer hover:scale-105 transition-all relative"
                        title={docente.lastPicture ? "Clic para ampliar foto" : "Sin foto"}
                      >
                        {docente.lastPicture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={docente.lastPicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-500" />
                        )}
                        {hasPunchedToday && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-black text-xs md:text-sm text-white truncate flex items-center gap-1.5">
                          <span>{docente.name}</span>
                          {idx === 0 && hasPunchedToday && (
                            <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                              ÚLTIMO
                            </span>
                          )}
                        </p>
                        <p className="font-mono text-xs text-purple-400 font-bold">
                          {docente.aula || `DNI: ${docente.employee_id}`}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-8 md:col-span-9">
                      <div className={`grid ${isSaturday ? "grid-cols-4" : "grid-cols-2"} gap-1.5 text-center`}>
                        {horarioActual.slots.map((slot, punchIdx) => {
                          const log = docente.slotsData[punchIdx];
                          const hasPunched = !!log;
                          const status = getSlotStatus(punchIdx, log, isSaturday, currentHourDecimal);

                          return (
                            <div
                              key={punchIdx}
                              onClick={() => {
                                if (log && log.picture_url) {
                                  setZoomedImage({
                                    url: log.picture_url,
                                    name: docente.name,
                                    id: docente.employee_id,
                                    time: formatDate(log.timestamp),
                                    tipo: log.tipo_evento || (punchIdx % 2 === 0 ? "ENTRADA" : "SALIDA"),
                                  });
                                } else if (!log) {
                                  handleToggleManualAttendance(docente.employee_id, docente.name);
                                }
                              }}
                              className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer hover:brightness-125 ${
                                status.colorClass
                              }`}
                              title={hasPunched ? "Clic para ver foto ampliada" : "Clic para registrar marcaje manual inmediato"}
                            >
                              <div className="flex items-center gap-1">
                                {hasPunched ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                                ) : status.isMissed ? (
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-slate-700" />
                                )}
                                <span className="font-mono text-xs md:text-sm font-bold tracking-tight">
                                  {hasPunched ? formatDate(log.timestamp) : "--:--"}
                                </span>
                              </div>
                              <span className="text-[9px] md:text-[10px] uppercase font-bold mt-0.5 tracking-wider">
                                {status.badgeLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4.2 PESTAÑA: GESTOR DE ASIGNACIONES (ORDENADO ESTRICTAMENTE POR AULAS: 101, 102...) */}
        {activeTab === "gestor" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setGestorFilter("sd")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    gestorFilter === "sd" ? "bg-purple-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  📅 Sábados y Domingos (S-D)
                </button>
                <button
                  onClick={() => setGestorFilter("lmv")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    gestorFilter === "lmv" ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  📅 Lunes, Mié y Vie (L-M-V)
                </button>
                <button
                  onClick={() => setGestorFilter("ambos")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    gestorFilter === "ambos" ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  🔥 Ambos Horarios
                </button>
                <button
                  onClick={() => setGestorFilter("todos")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    gestorFilter === "todos" ? "bg-amber-500 text-slate-950 font-black" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  📋 Todos ({docentes.length})
                </button>
                <button
                  onClick={() => setGestorFilter("inactivos")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    gestorFilter === "inactivos" ? "bg-slate-700 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  💤 Sin Asignación Hoy
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={gestorSearch}
                    onChange={(e) => setGestorSearch(e.target.value)}
                    placeholder="Buscar docente o DNI para asignar..."
                    className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-56 md:w-72 focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir
                </button>
                <button
                  onClick={handleResetDocentes}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700"
                  title="Restaurar lista original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl divide-y divide-slate-800/80 pr-1">
              <div className="grid grid-cols-12 text-slate-400 font-bold text-xs uppercase px-3 py-2 bg-slate-900/90 sticky top-0 border-b border-slate-800">
                <div className="col-span-3 md:col-span-3">Aula Asignada (Ordenada)</div>
                <div className="col-span-4 md:col-span-4">Docente / DNI</div>
                <div className="col-span-2 md:col-span-2">Modalidad</div>
                <div className="col-span-3 md:col-span-3 text-right">Asignación a Fecha</div>
              </div>

              {filteredGestorDocentes.slice(0, 150).map((d) => (
                <div
                  key={d.employee_id}
                  className={`grid grid-cols-12 items-center px-3 py-2.5 text-xs transition-all hover:bg-slate-800/40 gap-2 ${
                    d.tipo_horario === "Fin de Semana"
                      ? "bg-purple-950/20 border-l-2 border-purple-500"
                      : d.tipo_horario === "Entre Semana"
                      ? "bg-indigo-950/20 border-l-2 border-indigo-500"
                      : ""
                  }`}
                >
                  <div className="col-span-3 md:col-span-3">
                    <input
                      type="text"
                      defaultValue={d.aula}
                      onBlur={(e) => handleUpdateDocenteSchedule(d.employee_id, d.tipo_horario, e.target.value, d.modalidad)}
                      placeholder="Ej: Aula 101"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold w-full focus:border-amber-500"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-4 flex items-center justify-between gap-1 pr-1">
                    <div className="truncate">
                      <p className="font-bold text-white text-xs truncate">{d.name}</p>
                      <p className="text-[10px] text-purple-400 font-mono">DNI: {d.employee_id}</p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingDocente({
                          originalDni: d.employee_id,
                          employee_id: d.employee_id,
                          name: d.name,
                          aula: d.aula || "",
                          curso: d.curso || "",
                          modalidad: d.modalidad || "Presencial",
                          tipo_horario: d.tipo_horario,
                        })
                      }
                      className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 rounded-lg text-[10px] font-bold border border-amber-500/40 flex items-center gap-1 transition-all flex-shrink-0"
                      title="Corregir DNI, nombre o asignación del docente"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <div className="col-span-2 md:col-span-2">
                    <select
                      value={d.modalidad?.includes("Virtual") ? "Virtual" : "Presencial"}
                      onChange={(e) => handleUpdateDocenteSchedule(d.employee_id, d.tipo_horario, d.aula, e.target.value === "Virtual" ? "Virtual (Teams)" : "Presencial")}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 w-full focus:border-amber-500"
                    >
                      <option value="Presencial">🏫 Presencial</option>
                      <option value="Virtual">💻 Virtual</option>
                    </select>
                  </div>

                  <div className="col-span-3 md:col-span-3 text-right">
                    <select
                      value={d.tipo_horario}
                      onChange={(e) => handleUpdateDocenteSchedule(d.employee_id, e.target.value, d.aula, d.modalidad)}
                      className={`font-bold rounded-lg px-2 py-1 text-xs border focus:ring-2 focus:ring-amber-500 transition-all ${
                        d.tipo_horario === "Fin de Semana"
                          ? "bg-purple-900/80 border-purple-500 text-purple-200"
                          : d.tipo_horario === "Entre Semana"
                          ? "bg-indigo-900/80 border-indigo-500 text-indigo-200"
                          : d.tipo_horario === "Ambos Horarios"
                          ? "bg-emerald-900/80 border-emerald-500 text-emerald-200"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      }`}
                    >
                      <option value="Fin de Semana">📅 Dicta S-D (Fin de Semana)</option>
                      <option value="Entre Semana">📅 Dicta L-M-V (Entre Semana)</option>
                      <option value="Ambos Horarios">🔥 Dicta Ambos (S-D y L-M-V)</option>
                      <option value="Padrón General">💤 Sin Asignación Hoy</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4.3 PESTAÑA: PANEL DE SALONES PARA ALUMNOS (CUADRÍCULA 3xN) */}
        {activeTab === "aulas" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-2">
            {/* Barra de Filtros y Búsqueda (SOLO EN MODO ADMINISTRATIVO) */}
            {isAdminMode ? (
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setHorarioFilter("Entre Semana")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      horarioFilter === "Entre Semana"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    📅 Lun, Mié y Vie (18:00 a 21:30)
                  </button>
                  <button
                    onClick={() => setHorarioFilter("Fin de Semana")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      horarioFilter === "Fin de Semana"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    📅 Sábados y Domingos (07:00 a 18:30)
                  </button>
                  <button
                    onClick={() => setHorarioFilter("Todos")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      horarioFilter === "Todos"
                        ? "bg-slate-700 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    📋 Todos ({docentes.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar docente, aula o curso..."
                      className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 w-48 md:w-56 focus:border-purple-500"
                    />
                  </div>
                  <button
                    onClick={handlePrintAulas}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-slate-700"
                    title="Imprimir Directorio"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprimir
                  </button>
                </div>
              </div>
            ) : (
              // Barra Ultra-Limpia para Estudiantes con Semáforo de 4 Estados
              <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span className="uppercase text-[11px] tracking-wider text-amber-300 font-extrabold">Salones Asignados Hoy ({activeDocentesForToday.length})</span>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-[11px]">
                  <div className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                    <span>🟢 En Aula (Ingresó)</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                    <span>🔵 Salió del Aula</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-300">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span>🟡 En Espera (Por llegar)</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span>🔴 Sin Registro (+30m)</span>
                  </div>
                </div>
              </div>
            )}

            {/* CUADRÍCULA 3xN DE SALONES PARA ALUMNOS */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-2">
                {filteredAulas.map((item, idx) => {
                  const normDni = normalizeDNI(item.employee_id);
                  const isVirtual = item.modalidad?.includes("Virtual") || item.aula?.toLowerCase().includes("virtual");
                  const docLogs = todayLogs.filter((l) => matchDNI(l.employee_id, item.employee_id));
                  const sortedLogsAsc = [...docLogs].sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                  );
                  const firstLog = sortedLogsAsc[0] || null; // primer marcaje (entrada)
                  const lastLog = sortedLogsAsc[sortedLogsAsc.length - 1] || null; // último marcaje

                  // Conexión idéntica con el módulo de Control de Asistencia
                  const matchedDoc = docentesWithAttendance.find((d) => matchDNI(d.employee_id, item.employee_id));
                  const hasExited = matchedDoc
                    ? matchedDoc.hasRegisteredSalida
                    : (!manualPresentIds.has(normDni) && (manualExitedIds.has(normDni) || docLogs.length >= 2));
                  const hasEntered = matchedDoc
                    ? matchedDoc.isPresent
                    : ((docLogs.length > 0 || manualPresentIds.has(normDni)) && !hasExited);

                  // Determinar hora de inicio del turno
                  let horaInicioTurno = 18.0; // 18:00 (Noche)
                  if (isSaturday) {
                    horaInicioTurno = currentHourDecimal >= 14.5 ? 15.0 : 7.0;
                  }
                  const horaLimiteTolerancia = horaInicioTurno + 0.5; // +30m (ej: 18:30)

                  const isBeforeStartTime = currentHourDecimal < horaInicioTurno;
                  const isWithinTolerance = currentHourDecimal >= horaInicioTurno && currentHourDecimal <= horaLimiteTolerancia;
                  const isLateLimitPassed = currentHourDecimal > horaLimiteTolerancia;

                  let statusCard = {
                    bgBorder: "bg-slate-900/90 border-slate-700/70 hover:border-slate-500",
                    badgeBg: "bg-slate-800 text-slate-300 border border-slate-700",
                    badgeText: "⏳ PROGRAMADO",
                    subText: `Clase inicia ${isSaturday ? (currentHourDecimal >= 14.5 ? "15:00" : "07:00") : "18:00"}`,
                    dotColor: "bg-slate-400",
                  };

                  if (hasExited) {
                    // Docente ya marcó salida -> YA NO ESTÁ EN EL AULA
                    const exitTimeStr = lastLog ? formatDate(lastLog.timestamp) : "";
                    const entryTimeStr = firstLog ? formatDate(firstLog.timestamp) : "";
                    statusCard = {
                      bgBorder: "bg-blue-950/30 border-blue-500/60 hover:border-blue-400 shadow-md shadow-blue-950/20",
                      badgeBg: "bg-blue-600 text-white font-black shadow",
                      badgeText: isVirtual ? "🔵 CLASE VIRTUAL FINALIZADA" : "🔵 SALIÓ DEL AULA (FINALIZÓ)",
                      subText: `Salió a las ${exitTimeStr} (Ingreso: ${entryTimeStr})`,
                      dotColor: "bg-blue-300",
                    };
                  } else if (isVirtual) {
                    if (hasEntered) {
                      const timeStr = firstLog ? formatDate(firstLog.timestamp) : "";
                      statusCard = {
                        bgBorder: "bg-indigo-950/60 border-emerald-500/70 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40",
                        badgeBg: "bg-emerald-500 text-slate-950 font-black",
                        badgeText: "🟢 EN SESIÓN VIRTUAL",
                        subText: timeStr ? `Conectado Teams a las ${timeStr}` : "Docente en clase virtual Teams",
                        dotColor: "bg-emerald-300",
                      };
                    } else {
                      statusCard = {
                        bgBorder: "bg-indigo-950/40 border-indigo-500/40 hover:border-indigo-400",
                        badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                        badgeText: "💻 VIRTUAL TEAMS",
                        subText: item.teams || "Enlace Teams de Posgrado",
                        dotColor: "bg-indigo-400",
                      };
                    }
                  } else if (hasEntered) {
                    const timeStr = firstLog ? formatDate(firstLog.timestamp) : "";
                    let isEntryLate = false;
                    if (firstLog && firstLog.timestamp) {
                      const d = new Date(firstLog.timestamp);
                      const peruTimeStr = d.toLocaleTimeString("en-US", { timeZone: "America/Lima", hour12: false });
                      const [hStr, mStr] = peruTimeStr.split(":");
                      const timeNum = parseInt(hStr, 10) + parseInt(mStr, 10) / 60;
                      if (isSaturday) {
                        if (currentHourDecimal >= 14.5 ? timeNum > 15.5 : timeNum > 7.5) isEntryLate = true;
                      } else {
                        if (timeNum > 18.5) isEntryLate = true;
                      }
                    }

                    if (isEntryLate) {
                      statusCard = {
                        bgBorder: "bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-950/40 hover:border-amber-400 ring-1 ring-amber-500/30",
                        badgeBg: "bg-amber-500 text-slate-950 font-black",
                        badgeText: "🟡 EN AULA (TARDE +30M)",
                        subText: `Ingresó a las ${timeStr} (Tardanza)`,
                        dotColor: "bg-amber-300",
                      };
                    } else {
                      statusCard = {
                        bgBorder: "bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-950/40 hover:border-emerald-400 ring-1 ring-emerald-500/30",
                        badgeBg: "bg-emerald-500 text-slate-950 font-black",
                        badgeText: "🟢 EN AULA (PUNTUAL)",
                        subText: `Ingresó a las ${timeStr}`,
                        dotColor: "bg-emerald-300",
                      };
                    }
                  } else if (isWithinTolerance) {
                    // Pasado las 18:00 y hasta las 18:30 -> AMARILLO (En espera con tolerancia)
                    const minsPasados = Math.max(1, Math.round((currentHourDecimal - horaInicioTurno) * 60));
                    statusCard = {
                      bgBorder: "bg-amber-950/30 border-amber-500/60 hover:border-amber-400 shadow-md shadow-amber-950/20",
                      badgeBg: "bg-amber-500/20 text-amber-300 border border-amber-500/50",
                      badgeText: `🟡 EN ESPERA (+${minsPasados}m)`,
                      subText: "Tolerancia (+30m máx)",
                      dotColor: "bg-amber-400 animate-pulse",
                    };
                  } else if (isLateLimitPassed) {
                    // Pasado los 30 minutos (después de 18:30) y sin registro -> ROJO
                    statusCard = {
                      bgBorder: "bg-rose-950/40 border-rose-500/60 shadow-md shadow-rose-950/30 hover:border-rose-400 ring-1 ring-rose-500/30",
                      badgeBg: "bg-rose-600 text-white font-black shadow",
                      badgeText: "🔴 SIN REGISTRO",
                      subText: "Docente no ingresó (+30m de tolerancia)",
                      dotColor: "bg-rose-400 animate-ping",
                    };
                  }

                  return (
                    <div
                      key={`${item.employee_id}-${idx}`}
                      className={`rounded-2xl border-2 p-3.5 flex flex-col justify-between transition-all relative overflow-hidden ${statusCard.bgBorder}`}
                    >
                      {/* Cabecera de la Tarjeta de Salón */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-950 border border-slate-700 px-3 py-1 rounded-xl shadow-inner">
                            <span className="text-base md:text-lg font-black text-amber-300 tracking-wide uppercase">
                              {item.aula}
                            </span>
                          </div>
                        </div>

                        {/* Badge de Estado para Alumnos */}
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-[10px] md:text-xs font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 shadow-sm ${statusCard.badgeBg}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${statusCard.dotColor} ${hasEntered ? "animate-ping" : ""}`} />
                            <span>{statusCard.badgeText}</span>
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                            {statusCard.subText}
                          </span>
                        </div>
                      </div>

                      {/* Información del Docente y Asignatura */}
                      <div className="mt-2.5 flex flex-col gap-1">
                        <p className="text-sm md:text-base font-black text-white leading-tight tracking-tight uppercase">
                          {item.name}
                        </p>
                        <p className="text-xs text-indigo-300 font-semibold leading-tight line-clamp-2">
                          📚 {item.curso || "Asignatura de Posgrado"}
                        </p>
                      </div>

                      {/* Pie de Tarjeta con Botón de Check Manual */}
                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 gap-2">
                        <span className="font-mono text-purple-400 text-[10px]">
                          DNI: {item.employee_id}
                        </span>

                        <div className="flex items-center gap-2">
                          {lastLog?.picture_url && (
                            <button
                              onClick={() =>
                                setZoomedImage({
                                  url: lastLog.picture_url!,
                                  name: item.name,
                                  id: item.employee_id,
                                  time: formatDate(lastLog.timestamp),
                                  tipo: lastLog.tipo_evento || "Marcación",
                                })
                              }
                              className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold hover:underline"
                            >
                              <Camera className="w-3 h-3" /> Ver Foto
                            </button>
                          )}

                          {/* BOTÓN CHECK MANUAL / VIRTUAL TEAMS / SALIDA */}
                          <button
                            onClick={() => !hasExited && handleToggleManualAttendance(item.employee_id, item.name)}
                            disabled={hasExited}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                              hasExited
                                ? "bg-blue-950/40 border-blue-500/30 text-blue-300/90 cursor-default opacity-90 select-none"
                                : hasEntered
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-blue-900/60 hover:text-blue-200 hover:border-blue-500/40 cursor-pointer"
                                : isVirtual
                                ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400 shadow-md shadow-indigo-950 cursor-pointer"
                                : "bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white border-slate-700 hover:border-emerald-500 cursor-pointer"
                            }`}
                            title={
                              hasExited
                                ? "Salida registrada con éxito. Jornada concluida."
                                : hasEntered
                                ? "Hacer clic para registrar salida del aula"
                                : isVirtual
                                ? "Marcar asistencia virtual en Microsoft Teams"
                                : "Hacer clic para registrar ingreso al aula"
                            }
                          >
                            {hasExited ? (
                              <CheckCircle2 className="w-3 h-3 text-blue-400" />
                            ) : isVirtual ? (
                              <Laptop className="w-3 h-3 text-indigo-300" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                            <span>
                              {hasExited
                                ? "🔵 Salida Registrada ✅"
                                : hasEntered
                                ? (isVirtual ? "Conectado Teams (Marcar Fin)" : "En Aula (Marcar Salida)")
                                : (isVirtual ? "💻 Check Virtual Teams" : "Check Ingreso")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4.4 PESTAÑA: FALTAN MARCAR */}
        {activeTab === "faltan" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 text-slate-400 font-bold text-xs uppercase px-3 py-2 border-b border-slate-800 flex-shrink-0">
              <div className="col-span-3">Aula</div>
              <div className="col-span-6">Docente Pendiente</div>
              <div className="col-span-3 text-right">Estado</div>
            </div>

            <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto pr-1">
              {missingDocentes.length === 0 ? (
                <div className="text-center py-16 text-emerald-400 text-base font-bold flex flex-col items-center">
                  <CheckCircle2 className="w-10 h-10 mb-2 text-emerald-400" />
                  ¡Todos los docentes presenciales han registrado su asistencia hoy!
                </div>
              ) : (
                missingDocentes.map((docente) => (
                  <div
                    key={docente.employee_id}
                    className="grid grid-cols-12 items-center px-3 py-3 hover:bg-slate-800/40 text-slate-300"
                  >
                    <div className="col-span-3 font-bold text-xs md:text-sm text-purple-400">
                      {docente.aula || docente.employee_id}
                    </div>
                    <div className="col-span-6 text-xs md:text-sm font-semibold truncate pr-2">
                      {docente.name}
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="bg-rose-500/15 border border-rose-500/40 text-rose-300 text-[10px] md:text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Sin Registro
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4.5 PESTAÑA: PRESENTES */}
        {activeTab === "presentes" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 text-slate-400 font-bold text-xs uppercase px-3 py-2 border-b border-slate-800 flex-shrink-0">
              <div className="col-span-2">Foto</div>
              <div className="col-span-3">Aula</div>
              <div className="col-span-4">Docente</div>
              <div className="col-span-3 text-right">Pases Hoy</div>
            </div>

            <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto pr-1">
              {presentDocentes.length === 0 ? (
                <div className="text-center py-16 text-slate-600 text-sm font-medium">
                  Aún no hay docentes registrados hoy
                </div>
              ) : (
                presentDocentes.map((docente) => (
                  <div
                    key={docente.employee_id}
                    className="grid grid-cols-12 items-center px-3 py-2.5 hover:bg-slate-800/40 text-slate-200"
                  >
                    <div className="col-span-2">
                      <div
                        onClick={() => {
                          if (docente.lastPicture) {
                            setZoomedImage({
                              url: docente.lastPicture,
                              name: docente.name,
                              id: docente.employee_id,
                              time: docente.lastPunch ? formatDate(docente.lastPunch.timestamp) : "--:--",
                              tipo: docente.lastPunch?.tipo_evento || "ENTRADA",
                            });
                          }
                        }}
                        className="w-9 h-9 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
                      >
                        {docente.lastPicture ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={docente.lastPicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 font-bold text-xs md:text-sm text-purple-400">
                      {docente.aula || docente.employee_id}
                    </div>
                    <div className="col-span-4 text-xs md:text-sm font-semibold truncate pr-2">
                      {docente.name}
                    </div>
                    <div className="col-span-3 text-right">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md">
                        {docente.punchCount} / {maxPunchesExpected} pases
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        
          {/* 4.7 PESTAÑA: 🏆 RANKING DE PUNTUALIDAD & ANALÍTICA EJECUTIVA (OPCIÓN 5) */}
          {activeTab === "ranking" && (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto gap-4 p-1">
              {/* TARJETAS DE KPIS PRINCIPALES */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
                <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/40 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                  <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/50 shadow-inner">
                    <Trophy className="w-7 h-7 text-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-amber-400">Puntualidad Global</p>
                    <h3 className="text-2xl lg:text-3xl font-black text-white">{rankingData.globalPuntualidad}%</h3>
                    <p className="text-[10px] text-emerald-400 font-bold">● Dentro de la tolerancia oficial</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                  <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/40 shadow-inner">
                    <Clock className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Promedio de Tardanza</p>
                    <h3 className="text-2xl lg:text-3xl font-black text-white">{rankingData.avgGlobalTardanza} min</h3>
                    <p className="text-[10px] text-purple-300 font-bold">Por docente impuntual</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/40 shadow-inner">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Clases Registradas</p>
                    <h3 className="text-2xl lg:text-3xl font-black text-white">{rankingData.totalSesionesDictadas}</h3>
                    <p className="text-[10px] text-emerald-300 font-bold">Sesiones biométricas Hikvision</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 p-4 rounded-2xl shadow-xl flex items-center gap-3.5">
                  <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/50 shadow-inner">
                    <Award className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-black tracking-wider text-indigo-400">Docente Destacado</p>
                    <h4 className="text-xs font-black text-white truncate">
                      {rankingData.topDocente ? rankingData.topDocente.name : "Calculando..."}
                    </h4>
                    <p className="text-[10px] text-amber-300 font-bold">
                      🥇 {rankingData.topDocente ? rankingData.topDocente.score : 100}% Puntual
                    </p>
                  </div>
                </div>
              </div>

              {/* PODIO DE HONOR: TOP 3 DOCENTES MÁS PUNTUALES */}
              {rankingData.rankingList.length >= 3 && (
                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shadow-2xl flex-shrink-0">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm font-black text-white uppercase tracking-wider">
                        Podio de Honor • Excelencia en Asistencia
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Posgrado UNHEVAL</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end pt-2">
                    {/* 🥈 2DO LUGAR */}
                    {rankingData.rankingList[1] && (
                      <div className="bg-slate-900 border-2 border-slate-400/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
                        <div className="absolute -top-3 bg-slate-400 text-slate-950 font-black text-xs px-3 py-0.5 rounded-full shadow-md">
                          🥈 2do Lugar
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-300 mt-2 bg-slate-800 flex items-center justify-center">
                          {rankingData.rankingList[1].picture_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rankingData.rankingList[1].picture_url} alt="2do" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                        <h5 className="text-xs font-black text-white mt-2 line-clamp-1">{rankingData.rankingList[1].name}</h5>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{rankingData.rankingList[1].curso}</p>
                        <div className="mt-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 w-full flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Puntualidad:</span>
                          <span className="text-emerald-400 font-black">{rankingData.rankingList[1].score}%</span>
                        </div>
                      </div>
                    )}

                    {/* 🥇 1ER LUGAR */}
                    {rankingData.rankingList[0] && (
                      <div className="bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900 border-2 border-amber-500 rounded-3xl p-5 flex flex-col items-center text-center shadow-2xl shadow-amber-950/60 relative scale-105 z-10">
                        <div className="absolute -top-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-xl flex items-center gap-1">
                          👑 🥇 1er Lugar (Líder)
                        </div>
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-amber-400 mt-2 bg-slate-800 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          {rankingData.rankingList[0].picture_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rankingData.rankingList[0].picture_url} alt="1ro" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-10 h-10 text-amber-400" />
                          )}
                        </div>
                        <h5 className="text-sm font-black text-white mt-2.5 line-clamp-1">{rankingData.rankingList[0].name}</h5>
                        <p className="text-[11px] text-amber-300/80 font-bold line-clamp-1">{rankingData.rankingList[0].curso}</p>
                        <div className="mt-2.5 bg-amber-950/60 px-4 py-1.5 rounded-xl border border-amber-500/40 w-full flex justify-between text-xs font-black">
                          <span className="text-amber-200">Récord:</span>
                          <span className="text-emerald-300 font-black">{rankingData.rankingList[0].score}% ({rankingData.rankingList[0].totalAsistencias} clases)</span>
                        </div>
                      </div>
                    )}

                    {/* 🥉 3ER LUGAR */}
                    {rankingData.rankingList[2] && (
                      <div className="bg-slate-900 border-2 border-amber-700/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
                        <div className="absolute -top-3 bg-amber-700 text-white font-black text-xs px-3 py-0.5 rounded-full shadow-md">
                          🥉 3er Lugar
                        </div>
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-600 mt-2 bg-slate-800 flex items-center justify-center">
                          {rankingData.rankingList[2].picture_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={rankingData.rankingList[2].picture_url} alt="3ro" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-amber-500" />
                          )}
                        </div>
                        <h5 className="text-xs font-black text-white mt-2 line-clamp-1">{rankingData.rankingList[2].name}</h5>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{rankingData.rankingList[2].curso}</p>
                        <div className="mt-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 w-full flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Puntualidad:</span>
                          <span className="text-emerald-400 font-black">{rankingData.rankingList[2].score}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TABLA COMPLETA DE CLASIFICACIÓN GENERAL (LEADERBOARD) */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Tabla General de Puntualidad ({rankingData.rankingList.length} Docentes Evaluados)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-bold">Tolerancia oficial: 30 minutos</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/90 text-slate-400 font-black text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 text-center">Posición</th>
                        <th className="py-2.5 px-3">Docente</th>
                        <th className="py-2.5 px-3">Aula / Curso</th>
                        <th className="py-2.5 px-3 text-center">Total Clases</th>
                        <th className="py-2.5 px-3 text-center">A Tiempo</th>
                        <th className="py-2.5 px-3 text-center">Tardanzas</th>
                        <th className="py-2.5 px-3 text-center">Índice de Puntualidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {rankingData.rankingList.map((doc: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition-all">
                          <td className="py-3 px-3 text-center">
                            {idx === 0 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                                1
                              </span>
                            ) : idx === 1 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs shadow-md">
                                2
                              </span>
                            ) : idx === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs shadow-md">
                                3
                              </span>
                            ) : (
                              <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center">
                                {doc.picture_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={doc.picture_url} alt={doc.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-4 h-4 text-slate-500" />
                                )}
                              </div>
                              <div>
                                <h6 className="font-bold text-white leading-tight">{doc.name}</h6>
                                <p className="text-[10px] text-slate-400 font-mono">DNI: {doc.dni}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                              {doc.aula}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">{doc.curso}</p>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-200">
                            {doc.totalAsistencias}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-400">
                            {doc.puntuales}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-rose-400">
                            {doc.tardanzas > 0 ? (doc.tardanzas + " (" + doc.avgTardanza + "m)") : "0"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className={
                                    "h-full rounded-full " +
                                    (doc.score >= 90
                                      ? "bg-emerald-500"
                                      : doc.score >= 70
                                      ? "bg-amber-400"
                                      : "bg-rose-500")
                                  }
                                  style={{ width: doc.score + "%" }}
                                />
                              </div>
                              <span
                                className={
                                  "font-black text-xs " +
                                  (doc.score >= 90
                                    ? "text-emerald-400"
                                    : doc.score >= 70
                                    ? "text-amber-300"
                                    : "text-rose-400")
                                }
                              >
                                {doc.score}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          
        {/* 4.8 PESTAÑA: 📊 GENERADOR DE INFORMES Y REPORTES POR RANGO DE FECHAS */}
        {activeTab === "reportes" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden gap-3">
            {/* PANEL DE CONTROL Y FILTROS POR FECHA */}
            <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Desde:</span>
                  <input
                    type="date"
                    value={reporteFechaInicio}
                    onChange={(e) => setReporteFechaInicio(e.target.value)}
                    className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Hasta:</span>
                  <input
                    type="date"
                    value={reporteFechaFin}
                    onChange={(e) => setReporteFechaFin(e.target.value)}
                    className="bg-transparent text-white text-xs font-mono font-bold focus:outline-none cursor-pointer"
                  />
                </div>

                <select
                  value={reporteTipoHorario}
                  onChange={(e) => setReporteTipoHorario(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700/80 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="todos">Todos los Turnos</option>
                  <option value="lmv">L-M-V (Entre Semana)</option>
                  <option value="sd">S-D (Fin de Semana)</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar docente o DNI..."
                    value={reporteSearch}
                    onChange={(e) => setReporteSearch(e.target.value)}
                    className="bg-slate-900 border border-slate-700/80 text-white text-xs px-3 py-2 rounded-xl w-48 focus:outline-none placeholder-slate-500 font-medium"
                  />
                </div>

                <button
                  onClick={handleFetchReporte}
                  disabled={isGeneratingReporte}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingReporte ? "Generando..." : "Consultar Fechas"}</span>
                </button>
              </div>

              {/* BOTONES DE EXPORTACIÓN Y VISTA */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    onClick={() => setReporteViewMode("detalle")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      reporteViewMode === "detalle"
                        ? "bg-indigo-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📅 Detalle Día a Día
                  </button>
                  <button
                    onClick={() => setReporteViewMode("consolidado")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      reporteViewMode === "consolidado"
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📋 Consolidado Total
                  </button>
                </div>

                <button
                  onClick={handleExportExcel}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Descargar archivo Excel con ambas hojas (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                  <span>Descargar Excel</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  title="Imprimir o Guardar en PDF"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            {/* RESUMEN DE MÉTRICAS DEL REPORTE */}
            {reporteData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-shrink-0">
                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Registros en Rango</span>
                    <p className="text-xl font-black text-white font-mono">{reporteData.resumen?.total_registros_evaluados || (reporteData.detalle || []).length}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 opacity-80" />
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Puntuales</span>
                    <p className="text-xl font-black text-emerald-400 font-mono">
                      {(reporteData.detalle || []).filter((d: any) => d.estado === "PUNTUAL" || d.estado === "ASISTIO").length}
                    </p>
                  </div>
                  <UserCheck className="w-6 h-6 text-emerald-400 opacity-80" />
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Tardanzas (+30m)</span>
                    <p className="text-xl font-black text-amber-400 font-mono">
                      {(reporteData.detalle || []).filter((d: any) => d.estado === "TARDANZA").length}
                    </p>
                  </div>
                  <Clock className="w-6 h-6 text-amber-400 opacity-80" />
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Sin Registro (Faltas)</span>
                    <p className="text-xl font-black text-rose-400 font-mono">
                      {(reporteData.detalle || []).filter((d: any) => d.estado === "FALTA").length}
                    </p>
                  </div>
                  <UserX className="w-6 h-6 text-rose-400 opacity-80" />
                </div>
              </div>
            )}

            {/* TABLA PRINCIPAL DE DATOS */}
            <div className="flex-1 bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-0">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 flex-shrink-0">
                <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>
                    {reporteViewMode === "detalle"
                      ? `Detalle de Marcaciones por Fecha (${(reporteData?.detalle || []).length} Registros)`
                      : `Consolidado General de Docentes (${(reporteData?.consolidado || []).length} Docentes)`}
                  </span>
                </span>
                <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  Periodo: {reporteFechaInicio} al {reporteFechaFin}
                </span>
              </div>

              <div className="flex-1 overflow-auto">
                {reporteViewMode === "detalle" ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900/95 text-slate-400 font-black text-[10px] uppercase sticky top-0 z-10 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Docente / Aula</th>
                        <th className="py-2.5 px-3 text-center min-w-[160px]">1. Entrada Noche (18:00 - Tol: 18:30)</th>
                        <th className="py-2.5 px-3 text-center min-w-[160px]">2. Salida Noche (21:30)</th>
                        <th className="py-2.5 px-3 text-center">Estado del Docente</th>
                        <th className="py-2.5 px-3 text-center">Tardanza</th>
                        <th className="py-2.5 px-3 text-center">Foto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {(reporteData?.detalle || []).length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-slate-500">
                            {isGeneratingReporte ? "Cargando registros..." : "No se encontraron registros para el rango de fechas seleccionado."}
                          </td>
                        </tr>
                      ) : (
                        (reporteData?.detalle || []).map((row: any, rIdx: number) => {
                          const hasEntered = !!row.hora_entrada;
                          const hasExited = !!row.hora_salida;
                          const isPuntual = row.estado === "PUNTUAL";
                          const isTardanza = row.estado === "TARDANZA";
                          const isVirtual = row.estado === "VIRTUAL";

                          return (
                            <tr key={rIdx} className="hover:bg-slate-800/40 transition-all">
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="font-mono font-bold text-white text-xs">{row.fecha}</span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{row.dia_semana}</p>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="bg-slate-900 text-amber-300 font-black px-2 py-0.5 rounded-lg border border-slate-700 text-[11px]">
                                    {row.aula}
                                  </span>
                                  <div>
                                    <p className="font-black text-white text-xs leading-tight">{row.docente}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                      <span className="font-mono text-purple-400 font-bold">DNI: {row.dni}</span>
                                      <span className="truncate max-w-xs text-indigo-300 font-medium">• {row.curso}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* SLOT 1: ENTRADA (IDÉNTICO A CONTROL DE ASISTENCIA) */}
                              <td className="py-2 px-3 text-center">
                                <div className={`py-1.5 px-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  hasEntered
                                    ? isPuntual
                                      ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                                      : "bg-amber-950/60 border-amber-500/50 text-amber-300"
                                    : isVirtual
                                    ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300"
                                    : "bg-rose-950/50 border-rose-500/40 text-rose-300"
                                }`}>
                                  <span className="font-mono text-xs font-black tracking-tight">
                                    {row.hora_entrada || "--:--:--"}
                                  </span>
                                  <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">
                                    {hasEntered ? (isPuntual ? "Puntual ✅" : `Tardanza (+30m) ⚠️`) : (isVirtual ? "Virtual Teams" : "Sin Registro 🔴")}
                                  </span>
                                </div>
                              </td>

                              {/* SLOT 2: SALIDA (IDÉNTICO A CONTROL DE ASISTENCIA) */}
                              <td className="py-2 px-3 text-center">
                                <div className={`py-1.5 px-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                                  hasExited
                                    ? "bg-blue-950/60 border-blue-500/50 text-blue-300"
                                    : hasEntered
                                    ? "bg-slate-900/90 border-slate-700/80 text-amber-300"
                                    : "bg-slate-900/60 border-slate-800 text-slate-500"
                                }`}>
                                  <span className="font-mono text-xs font-black tracking-tight">
                                    {row.hora_salida || "--:--:--"}
                                  </span>
                                  <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">
                                    {hasExited ? "Salida ✅" : hasEntered ? "En Aula (Esperando Salida)" : "Pendiente"}
                                  </span>
                                </div>
                              </td>

                              {/* ESTADO INSTITUCIONAL */}
                              <td className="py-2.5 px-3 text-center">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase border shadow-sm ${
                                  hasExited
                                    ? "bg-blue-600 text-white border-blue-400"
                                    : hasEntered
                                    ? isPuntual
                                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black"
                                      : "bg-amber-500 text-slate-950 border-amber-400 font-black"
                                    : isVirtual
                                    ? "bg-indigo-600 text-white border-indigo-400"
                                    : "bg-rose-600 text-white border-rose-400"
                                }`}>
                                  {row.badge_estado || (hasExited ? "🔵 Salió del Aula ✅" : hasEntered ? (isPuntual ? "🟢 En Aula (Puntual)" : "🟡 En Aula (+30m)") : "🔴 Sin Registro")}
                                </span>
                              </td>

                              <td className="py-2.5 px-3 text-center font-mono font-bold text-xs">
                                {row.minutos_tardanza > 0 ? (
                                  <span className="text-rose-400">+{row.minutos_tardanza} min</span>
                                ) : (
                                  <span className="text-emerald-400">0</span>
                                )}
                              </td>

                              <td className="py-2.5 px-3 text-center">
                                {row.foto_captura ? (
                                  <button
                                    onClick={() => setZoomedImage({
                                      url: row.foto_captura,
                                      name: row.docente,
                                      id: row.dni,
                                      time: row.hora_entrada || row.fecha,
                                      tipo: row.estado,
                                    })}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-all cursor-pointer shadow"
                                    title="Ver foto capturada en el biométrico"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-slate-600 text-[10px]">--</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-900/90 text-slate-400 font-black text-[10px] uppercase sticky top-0 z-10 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">DNI</th>
                        <th className="py-2.5 px-3">Docente</th>
                        <th className="py-2.5 px-3">Aula</th>
                        <th className="py-2.5 px-3">Curso</th>
                        <th className="py-2.5 px-3 text-center">Programados</th>
                        <th className="py-2.5 px-3 text-center">Asistencias</th>
                        <th className="py-2.5 px-3 text-center">Tardanzas</th>
                        <th className="py-2.5 px-3 text-center">Faltas</th>
                        <th className="py-2.5 px-3 text-center">Min. Tardanza</th>
                        <th className="py-2.5 px-3 text-center">% Asistencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-medium">
                      {(reporteData?.consolidado || []).length === 0 ? (
                        <tr>
                          <td colSpan={10} className="text-center py-16 text-slate-500">
                            No hay consolidado generado.
                          </td>
                        </tr>
                      ) : (
                        (reporteData?.consolidado || []).map((row: any, cIdx: number) => (
                          <tr key={cIdx} className="hover:bg-slate-800/40 transition-all">
                            <td className="py-2.5 px-3 font-mono font-bold text-purple-400">{row.dni}</td>
                            <td className="py-2.5 px-3 font-bold text-white">{row.docente}</td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-800 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-700">
                                {row.aula}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{row.curso}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-white font-mono">{row.total_dias_programados}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-emerald-400 font-mono">{row.total_asistencias}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-amber-400 font-mono">{row.total_tardanzas}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-rose-400 font-mono">{row.total_faltas}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-300 font-mono">
                              {row.minutos_tardanza_acumulados > 0 ? `${row.minutos_tardanza_acumulados}m` : "0"}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`font-black text-xs px-2 py-0.5 rounded ${
                                row.porcentaje_asistencia >= 90 ? "bg-emerald-500/20 text-emerald-300" : row.porcentaje_asistencia >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/20 text-rose-300"
                              }`}>
                                {row.porcentaje_asistencia}%
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4.6 PESTAÑA: HISTORIAL CRONOLÓGICO */}
        {activeTab === "historial" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-12 text-slate-400 font-bold text-xs uppercase px-3 py-2 border-b border-slate-800 flex-shrink-0">
              <div className="col-span-2">Foto</div>
              <div className="col-span-3">DNI / ID</div>
              <div className="col-span-4">Docente</div>
              <div className="col-span-3 text-right">Hora / Tipo</div>
            </div>

            <div className="flex-1 divide-y divide-slate-800/60 overflow-y-auto pr-1">
              {uniqueLogs.map((log, index) => {
                const docInfo = docentes.find((d) => String(d.employee_id) === String(log.employee_id));
                const docName = docInfo?.name || log.employee_name || "Docente";
                return (
                  <div
                    key={log.id || `${log.employee_id}-${index}`}
                    className={`grid grid-cols-12 items-center px-3 py-2.5 transition-all ${
                      index === 0
                        ? "bg-emerald-500/10 border-l-4 border-emerald-400 text-white"
                        : "hover:bg-slate-800/40 text-slate-200"
                    }`}
                  >
                    <div className="col-span-2">
                      <div
                        onClick={() => {
                          if (log.picture_url) {
                            setZoomedImage({
                              url: log.picture_url,
                              name: docName,
                              id: log.employee_id,
                              time: formatDate(log.timestamp),
                              tipo: log.tipo_evento || "ENTRADA",
                            });
                          }
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
                        title="Clic para agrandar foto"
                      >
                        {log.picture_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={log.picture_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 font-mono text-xs md:text-sm font-bold text-emerald-400">
                      {log.employee_id}
                    </div>
                    <div className="col-span-4 text-xs md:text-sm font-semibold truncate pr-2">
                      {docName}
                    </div>
                    <div className="col-span-3 text-right flex flex-col items-end">
                      <span className="font-mono text-xs md:text-sm font-bold text-slate-300">
                        {formatDate(log.timestamp)}
                      </span>
                      <span
                        className={`text-[9px] md:text-[10px] font-bold uppercase ${
                          log.tipo_evento === "SALIDA" ? "text-blue-400" : "text-emerald-400"
                        }`}
                      >
                        {log.tipo_evento || "ENTRADA"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-slate-500 text-xs font-medium flex-shrink-0">
        <p>UNHEVAL Escuela de Posgrado • Orden Dinámico por Llegada en Control</p>
        <p>Salones Ordenados (101 a 506) • Semáforo de Control 3 Estados</p>
      </footer>
          {/* 📢 CINTILLO DE NOTICIAS DE ÚLTIMA HORA (NEWS TICKER) */}
      <footer className="mt-2 bg-slate-900/90 border border-slate-800 py-1.5 px-4 rounded-xl flex items-center gap-3 overflow-hidden shadow-lg flex-shrink-0">
        <div className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0 animate-pulse">
          <Newspaper className="w-3 h-3" />
          <span>ÚLTIMA HORA</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap text-xs text-slate-300 font-medium">
          <div className="inline-block animate-marquee">
            🏛️ Escuela de Posgrado UNHEVAL • Asistencia registrada hoy: {percentAttendance}% ({presentDocentes.length} de {totalDocentes} docentes en aula) • Recordatorio: Las clases del turno noche inician a las 18:00 hrs • Los docentes pueden consultar su registro biométrico ingresando a /docente con su DNI • Sistema Facial Hikvision Operativo al 100%
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}