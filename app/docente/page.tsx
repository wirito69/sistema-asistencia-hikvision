"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  UserCheck,
  Clock,
  MapPin,
  BookOpen,
  Calendar,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Printer,
} from "lucide-react";

interface DocenteRecord {
  employee_id: string;
  name: string;
  aula: string;
  curso: string;
  modalidad?: string;
  tipo_horario: string;
  teams?: string;
}

interface AsistenciaDetalle {
  fecha: string;
  dia_semana: string;
  hora_entrada: string | null;
  hora_salida: string | null;
  estado: "ASISTIO" | "TARDANZA" | "FALTA" | "VIRTUAL";
  minutos_tardanza: number;
  horas_dictadas: number;
  foto_captura: string | null;
}

export default function DocentePortalPage() {
  const [dniInput, setDniInput] = useState<string>("");
  const [searchedDni, setSearchedDni] = useState<string>("");
  const [docente, setDocente] = useState<DocenteRecord | null>(null);
  const [historial, setHistorial] = useState<AsistenciaDetalle[]>([]);
  const [stats, setStats] = useState<{
    totalHoras: number;
    totalAsistencias: number;
    totalTardanzas: number;
    totalFaltas: number;
    porcentaje: number;
  }>({ totalHoras: 0, totalAsistencias: 0, totalTardanzas: 0, totalFaltas: 0, porcentaje: 100 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  // Leer DNI de la URL si se pasa como parámetro ?dni=XXXX
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlDni = params.get("dni");
      if (urlDni) {
        setDniInput(urlDni);
        fetchDocenteData(urlDni);
      }
    }
  }, []);

  const fetchDocenteData = async (dniToSearch: string) => {
    const clean = dniToSearch.trim().replace(/\D/g, "");
    if (clean.length < 5) {
      setErrorMsg("Ingresa un número de DNI válido.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSearchedDni(clean);

    try {
      // 1. Obtener lista de docentes
      const docRes = await fetch("/api/docentes");
      const docData = await docRes.json();
      const allDocentes: DocenteRecord[] = docData.docentes || [];

      const found = allDocentes.find((d) => {
        const aClean = d.employee_id.replace(/\D/g, "").replace(/^0+/, "");
        const bClean = clean.replace(/^0+/, "");
        return aClean === bClean || d.employee_id.includes(clean);
      });

      if (!found) {
        setDocente(null);
        setErrorMsg("No se encontró ningún docente registrado con el DNI ingresado.");
        setIsLoading(false);
        return;
      }

      setDocente(found);

      // 2. Obtener historial del mes actual desde /api/reportes
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      const repRes = await fetch(
        `/api/reportes?fecha_inicio=${startOfMonth}&fecha_fin=${endOfMonth}&q=${clean}`
      );
      const repData = await repRes.json();

      if (repData && Array.isArray(repData.detalle)) {
        const userDetails: AsistenciaDetalle[] = repData.detalle.filter((item: any) => {
          const aClean = String(item.dni).replace(/\D/g, "").replace(/^0+/, "");
          const bClean = clean.replace(/^0+/, "");
          return aClean === bClean;
        });

        setHistorial(userDetails);

        const totalH = userDetails.reduce((acc, i) => acc + (i.horas_dictadas || 0), 0);
        const asist = userDetails.filter((i) => i.estado === "ASISTIO" || i.estado === "VIRTUAL").length;
        const tard = userDetails.filter((i) => i.estado === "TARDANZA").length;
        const falt = userDetails.filter((i) => i.estado === "FALTA").length;
        const totalProg = userDetails.length;
        const pct = totalProg > 0 ? Math.round(((asist + tard) / totalProg) * 100) : 100;

        setStats({
          totalHoras: totalH,
          totalAsistencias: asist,
          totalTardanzas: tard,
          totalFaltas: falt,
          porcentaje: pct,
        });
      }
    } catch (e) {
      console.error("Error al consultar docente:", e);
      setErrorMsg("Error de conexión al consultar el portal. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dniInput.trim()) {
      fetchDocenteData(dniInput);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const latestCapture = historial.find((h) => h.foto_captura)?.foto_captura || null;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center select-none font-sans">
      {/* HEADER INSTITUCIONAL */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              UNHEVAL <span className="text-emerald-400 font-medium text-sm md:text-base">• Escuela de Posgrado</span>
            </h1>
            <p className="text-xs text-slate-400">Portal de Autoconsulta y Control de Asistencia Docente</p>
          </div>
        </div>

        <a
          href="/dashboard"
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ver Pantalla Principal</span>
        </a>
      </div>

      {/* FORMULARIO DE BÚSQUEDA */}
      <div className="w-full max-w-4xl mt-6">
        <form
          onSubmit={handleSearch}
          className="bg-slate-900/90 border border-slate-800 p-3 md:p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-3 backdrop-blur-sm"
        >
          <div className="relative w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dniInput}
              onChange={(e) => setDniInput(e.target.value)}
              placeholder="Ingresa tu número de DNI (Ej: 22511171, 41831780)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Consultando...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Consultar Mi Asistencia</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* DETALLES DEL DOCENTE ENCONTRADO */}
      {docente && !isLoading && (
        <div className="w-full max-w-4xl mt-6 flex flex-col gap-6 animate-in fade-in duration-500">
          {/* TARJETA DE PERFIL Y ASIGNACIÓN */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              {/* FOTO FACIAL HIKVISION */}
              <div className="relative">
                <div
                  onClick={() => latestCapture && setSelectedPhoto(latestCapture)}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 p-1 shadow-xl overflow-hidden flex items-center justify-center cursor-pointer group"
                >
                  {latestCapture ? (
                    <img
                      src={latestCapture}
                      alt={docente.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-all"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-slate-500">
                      <UserCheck className="w-10 h-10 text-emerald-400/80 mb-1" />
                      <span className="text-[10px] font-bold">Sin captura</span>
                    </div>
                  )}
                </div>
                {latestCapture && (
                  <span className="absolute -bottom-2 -right-2 bg-emerald-600 text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-md">
                    Facial
                  </span>
                )}
              </div>

              {/* DATOS ACADÉMICOS */}
              <div className="flex-1 text-center md:text-left flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold w-fit mx-auto md:mx-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DNI: {docente.employee_id}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white">{docente.name}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Aula Asignada</div>
                      <div className="text-xs font-black text-white">{docente.aula || "Posgrado"}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Asignatura</div>
                      <div className="text-xs font-black text-white truncate max-w-[170px]" title={docente.curso}>
                        {docente.curso || "Docencia Posgrado"}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase font-bold text-slate-400">Horario / Turno</div>
                      <div className="text-xs font-black text-white">{docente.tipo_horario}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN DESCARGAR CONSTANCIA */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                📊 Reporte generado con validación biométrica facial Hikvision.
              </span>
              <button
                type="button"
                onClick={() => setShowCertificate(true)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Generar Constancia de Asistencia</span>
              </button>
            </div>
          </div>

          {/* TARJETAS DE RESUMEN MENSUAL */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-emerald-400">{stats.totalHoras} hrs</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">Horas Dictadas</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-white">{stats.totalAsistencias}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">Clases Puntuales</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-amber-400">{stats.totalTardanzas}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">Tardanzas</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
              <span className="text-2xl md:text-3xl font-black text-teal-400">{stats.porcentaje}%</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase mt-1">% Cumplimiento</span>
            </div>
          </div>

          {/* HISTORIAL DETALLADO DE ASISTENCIAS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
            <h3 className="text-base font-black text-white flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Historial de Marcaciones del Mes</span>
            </h3>

            {historial.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-bold">
                No se registran clases programadas o marcadas en el mes actual.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-black text-slate-400 uppercase">
                      <th className="pb-3 px-2">Fecha</th>
                      <th className="pb-3 px-2">Día</th>
                      <th className="pb-3 px-2">Entrada</th>
                      <th className="pb-3 px-2">Salida</th>
                      <th className="pb-3 px-2">Horas</th>
                      <th className="pb-3 px-2">Estado</th>
                      <th className="pb-3 px-2 text-center">Foto Facial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {historial.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-2 font-mono font-bold text-slate-200">{item.fecha}</td>
                        <td className="py-3 px-2 text-slate-400">{item.dia_semana}</td>
                        <td className="py-3 px-2 font-mono text-emerald-300 font-bold">
                          {item.hora_entrada || "--:--"}
                        </td>
                        <td className="py-3 px-2 font-mono text-blue-300 font-bold">
                          {item.hora_salida || "--:--"}
                        </td>
                        <td className="py-3 px-2 font-black text-white">{item.horas_dictadas} h</td>
                        <td className="py-3 px-2">
                          {item.estado === "ASISTIO" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              PUNTUAL
                            </span>
                          )}
                          {item.estado === "TARDANZA" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              TARDANZA (+{item.minutos_tardanza}m)
                            </span>
                          )}
                          {item.estado === "VIRTUAL" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              VIRTUAL (TEAMS)
                            </span>
                          )}
                          {item.estado === "FALTA" && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              SIN REGISTRO
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.foto_captura ? (
                            <button
                              type="button"
                              onClick={() => setSelectedPhoto(item.foto_captura)}
                              className="w-7 h-7 rounded-lg overflow-hidden border border-emerald-500/50 inline-block hover:scale-110 transition-transform cursor-pointer"
                            >
                              <img src={item.foto_captura} alt="Facial" className="w-full h-full object-cover" />
                            </button>
                          ) : (
                            <span className="text-slate-600 text-[10px]">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX FOTO CAPTURA FACIAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-4 max-w-sm w-full flex flex-col items-center gap-3 shadow-2xl"
          >
            <h4 className="text-sm font-black text-white">Captura Facial Biométrica (Hikvision)</h4>
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-black">
              <img src={selectedPhoto} alt="Captura" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* MODAL / VISTA IMPRIMIBLE: CONSTANCIA DE ASISTENCIA DIGITAL */}
      {showCertificate && docente && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-auto">
            {/* BOTONES DE ACCIÓN (NO SE IMPRIMEN) */}
            <div className="flex items-center justify-end gap-2 mb-6 print:hidden">
              <button
                onClick={handlePrintCertificate}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            {/* CONTENIDO DE LA CONSTANCIA OFICIAL */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
              <h3 className="text-base font-black tracking-wide uppercase text-slate-900">
                UNIVERSIDAD NACIONAL HERMILIO VALDIZÁN
              </h3>
              <h4 className="text-sm font-bold text-emerald-800 uppercase">ESCUELA DE POSGRADO</h4>
              <p className="text-[11px] text-slate-600 mt-1">Dirección de Asuntos y Control Académico</p>
            </div>

            <div className="text-center my-6">
              <h2 className="text-xl font-black underline tracking-wider uppercase">
                CONSTANCIA DE ASISTENCIA Y CUMPLIMIENTO DOCENTE
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                N° POSGRADO-{new Date().getFullYear()}-{docente.employee_id}
              </p>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed text-justify mb-6">
              La Dirección de la Escuela de Posgrado de la Universidad Nacional Hermilio Valdizán hace constar que el
              docente <strong>{docente.name}</strong>, identificado con DNI N° <strong>{docente.employee_id}</strong>,
              ha registrado su asistencia y cumplimiento académico mediante el sistema de verificación biométrica facial
              en la asignatura <strong>{docente.curso}</strong> (Aula {docente.aula}), registrando un total de{" "}
              <strong>{stats.totalHoras} Horas Académicas</strong> con un <strong>{stats.porcentaje}%</strong> de
              cumplimiento de asistencia.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-xs grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500">Horas Dictadas:</span> <strong>{stats.totalHoras} horas</strong>
              </div>
              <div>
                <span className="text-slate-500">Clases Cumplidas:</span>{" "}
                <strong>{stats.totalAsistencias + stats.totalTardanzas} sesiones</strong>
              </div>
              <div>
                <span className="text-slate-500">Modalidad:</span>{" "}
                <strong>{docente.modalidad || "Presencial"}</strong>
              </div>
              <div>
                <span className="text-slate-500">Fecha de Emisión:</span>{" "}
                <strong>{new Date().toLocaleDateString("es-PE")}</strong>
              </div>
            </div>

            {/* FIRMAS INSTITUCIONALES */}
            <div className="grid grid-cols-2 gap-8 pt-12 mt-12 text-center text-xs border-t border-slate-300">
              <div>
                <div className="border-t border-slate-900 pt-2 font-bold">Dirección Escuela de Posgrado</div>
                <div className="text-[10px] text-slate-500">UNHEVAL</div>
              </div>
              <div>
                <div className="border-t border-slate-900 pt-2 font-bold">Control Académico y Asistencia</div>
                <div className="text-[10px] text-slate-500">UNHEVAL</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
