import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Scale,
  UserCheck,
  ShieldAlert,
  FileText,
  Search,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Building2,
  Lock,
  ChevronRight,
  Download,
  HelpCircle,
  Sparkles,
  Database,
  UserPlus,
  Video
} from 'lucide-react';
import { UserRole, CaseRecord } from '../types/desertion';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onOpenNormativa: () => void;
  onOpenCase: (caso: CaseRecord) => void;
  onStartNewComplaint: () => void;
  onOpenDatabase: () => void;
  onOpenRoleRegistration: (role: UserRole) => void;
  onOpenLogin: () => void;
  onOpenVideo: () => void;
  cases: CaseRecord[];
  pendingCounts: Record<UserRole, number>;
}

interface RoleCardData {
  id: UserRole;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  description: string;
  keyResponsibilities: string[];
  primaryAction: string;
}

const ROLES_INFO: RoleCardData[] = [
  {
    id: 'aprendiz',
    title: 'Aprendiz',
    badge: 'Derecho a la Defensa',
    icon: UserCheck,
    accentColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    description: 'Espacio exclusivo para el aprendiz matriculado. Consulte notificaciones oficiales, ejerza su derecho a la defensa y radique memoriales con soporte probatorio.',
    keyResponsibilities: [
      'Consultar citaciones y cargos formulados por presunta deserción',
      'Radicar descargos por escrito y cargar archivos PDF (Incapacidad EPS / Fuerza mayor)',
      'Interponer formalmente el Recurso de Reposición dentro de los 5 días hábiles',
      'Descargar copias oficiales de citaciones, resoluciones y actas'
    ],
    primaryAction: 'Ingresar como Aprendiz'
  },
  {
    id: 'instructor',
    title: 'Instructor / Equipo Ejecutor',
    badge: 'Radicación e Informe',
    icon: GraduationCap,
    accentColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    description: 'Canal para instructores voceros y de ficha. Permite radicar quejas formales por inasistencias injustificadas adjuntando evidencias digitales en PDF.',
    keyResponsibilities: [
      'Verificar causal de deserción (tres o más días consecutivos de inasistencia)',
      'Adjuntar archivo PDF obligatorio con reporte oficial Sofia Plus y bitácora',
      'Registrar gestiones de contacto previo y alertas tempranas institucionales',
      'Seguimiento en tiempo real del radicado y estado del caso en el Comité'
    ],
    primaryAction: 'Ingresar como Instructor'
  },
  {
    id: 'comite',
    title: 'Comité de Evaluación y Seguimiento',
    badge: 'Instrucción y Calificación',
    icon: Users,
    accentColor: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    description: 'Instancia colegiada encargada de instruir el debido proceso, convocar audiencias, evaluar pruebas y calificar la gravedad de la falta formativa.',
    keyResponsibilities: [
      'Generar y notificar Citaciones Oficiales fijando fecha, hora y sala/enlace',
      'Garantizar audiencia y recepción de descargos aportados por el aprendiz',
      'Tipificar la falta (Académica o Disciplinaria) y calificar (Leve, Grave o Gravísima)',
      'Expedir y suscribir Acta Oficial de Recomendación técnica en formato PDF'
    ],
    primaryAction: 'Ingresar como Comité'
  },
  {
    id: 'subdirector',
    title: 'Subdirector de Centro de Formación',
    badge: 'Decisión y Segunda Instancia',
    icon: Scale,
    accentColor: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
    description: 'Máxima autoridad del Centro facultada para proferir el acto administrativo motivado sancionatorio y resolver los recursos de reposición interpuestos.',
    keyResponsibilities: [
      'Revisar formalidad y garantías constitucionales del debido proceso (Art. 29 C.P.)',
      'Expedir y firmar digitalmente la Resolución Motivada (Cancelación o Plan)',
      'Notificar con indicación expresa del término legal de recursos (5 días hábiles)',
      'Resolver en vía gubernativa el Recurso de Reposición (Confirma, Modifica o Revoca)'
    ],
    primaryAction: 'Ingresar como Subdirector'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenNormativa,
  onOpenCase,
  onStartNewComplaint,
  onOpenDatabase,
  onOpenRoleRegistration,
  onOpenLogin,
  onOpenVideo,
  cases,
  pendingCounts
}) => {
  const [cedulaQuery, setCedulaQuery] = useState('');
  const [searchResult, setSearchResult] = useState<CaseRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchAprendiz = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = cedulaQuery.trim().toLowerCase();
    if (!q) {
      setSearchResult(null);
      return;
    }

    const found = cases.find(
      (c) =>
        c.aprendiz.numeroDoc.toLowerCase().includes(q) ||
        c.codigoRadicado.toLowerCase().includes(q) ||
        c.aprendiz.nombre.toLowerCase().includes(q)
    );
    setSearchResult(found || null);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-12 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span>Portal de Debido Proceso y Formación Integral SENA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Garantía del Debido Proceso en Trámites de Deserción
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Plataforma institucional para tramitar quejas e informes de inasistencias con carga obligatoria de archivos PDF, asegurando el cumplimiento estricto del <strong>Artículo 29 de la Constitución Política</strong> y del <strong>Reglamento del Aprendiz (Acuerdo 009 de 2024 y Acuerdo 02 de 2026)</strong> a través de roles definidos.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
            >
              <span>Iniciar Sesión (Credenciales)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#roles-portal"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors"
            >
              <span>Seleccionar Rol Institucional</span>
            </a>

            <button
              type="button"
              onClick={onOpenDatabase}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 rounded-xl transition-colors"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Base de Datos de Roles</span>
            </button>

            <button
              type="button"
              onClick={onOpenVideo}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-700 rounded-xl transition-colors"
            >
              <Video className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Ver Videotutorial</span>
            </button>
          </div>
        </div>

        {/* Quick Consultation Search Bar for Apprentices */}
        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/80">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-emerald-600" />
              Consulta Rápida de Expediente por Documento o Radicado
            </span>
            <form onSubmit={handleSearchAprendiz} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Ingrese número de documento (C.C. / T.I.) o Radicado (DES-2026-XXXX)..."
                  value={cedulaQuery}
                  onChange={(e) => setCedulaQuery(e.target.value)}
                  className="w-full text-xs pl-3.5 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors shrink-0"
              >
                Buscar
              </button>
            </form>

            {/* Search Result Feedback */}
            {hasSearched && (
              <div className="pt-2 animate-in fade-in duration-200">
                {searchResult ? (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                        Expediente Encontrado: {searchResult.codigoRadicado}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                        Aprendiz: <strong>{searchResult.aprendiz.nombre}</strong> · Ficha {searchResult.aprendiz.ficha} · Fase {searchResult.currentPhase} de 5
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCase(searchResult)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shrink-0 transition-colors"
                    >
                      <span>Abrir Expediente</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>No se encontraron expedientes con el criterio ingresado. Verifique el número de cédula o radicado.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. ROLES SELECTION BENTO GRID */}
      <section id="roles-portal" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            Acceso Institucional por Perfil
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Seleccione su Rol para Ingresar al Trámite
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cada rol tiene permisos específicos dentro de las 5 fases del debido proceso. Seleccione su perfil para acceder a su panel de gestión con expedientes activos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ROLES_INFO.map((role) => {
            const Icon = role.icon;
            const count = pendingCounts[role.id] || 0;

            return (
              <div
                key={role.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-emerald-500/60 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                          {role.title}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                          {role.badge}
                        </span>
                      </div>
                    </div>

                    {count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {count} pendiente(s)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Al día</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Key Responsibilities */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Actuaciones Principales en el Debido Proceso:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {role.keyResponsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <button
                    type="button"
                    onClick={() => onSelectRole(role.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-slate-900 dark:bg-slate-800 hover:bg-emerald-700 dark:hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                  >
                    <span>{role.primaryAction}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenRoleRegistration(role.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>+ Registrar Datos Básicos en BD</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. LAS 5 FASES REGLAMENTARIAS DEL DEBIDO PROCESO */}
      <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
            Ruta Jurídica Obligatoria
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Las 5 Fases del Debido Proceso Formativo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Procedimiento preestablecido por el Acuerdo 009 de 2024 y Acuerdo 02 de 2026 para garantizar la validez jurídica de toda decisión institucional y prevenir nulidades procesales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              phase: '01',
              title: 'Informe / Queja',
              role: 'Instructor / Remitente',
              desc: 'Constatación de más de 3 días de inasistencia continua. Radicación formal con anexos PDF de asistencia y bitácora de contacto previo.'
            },
            {
              phase: '02',
              title: 'Citación y Descargos',
              role: 'Comité y Aprendiz',
              desc: 'Formulación de cargos y comunicación formal. Término probatorio y derecho a presentar descargos con soporte médico EPS o fuerza mayor.'
            },
            {
              phase: '03',
              title: 'Recomendación Comité',
              role: 'Comité de Evaluación',
              desc: 'Audiencia formal, tipificación de falta (Académica/Disciplinaria), calificación de gravedad, y Acta Oficial de Recomendación.'
            },
            {
              phase: '04',
              title: 'Acto Administrativo',
              role: 'Subdirector de Centro',
              desc: 'Expedición de la Resolución Motivada en hechos y derecho, firma digital y notificación legal con cómputo de términos (5 días hábiles).'
            },
            {
              phase: '05',
              title: 'Interposición de Recursos',
              role: 'Aprendiz y Subdirector',
              desc: 'Radicación de Recurso de Reposición con memorial y nuevas pruebas. Fallo definitivo que agota la vía gubernativa y firmeza.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="font-mono text-xl font-extrabold text-emerald-700 dark:text-emerald-400 block">
                  {item.phase}
                </span>
                <p className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                  {item.title}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">
                  {item.role}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION STRIP */}
      <section className="bg-emerald-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            ¿Es instructor y necesita reportar una novedad por inasistencias?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Diligencie el formulario oficial de radicación de queja (Fase 1), anexe las constancias de inasistencia en archivo PDF y active la ruta del debido proceso.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onStartNewComplaint}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-emerald-950 bg-white hover:bg-emerald-50 rounded-xl shadow-xs transition-colors whitespace-nowrap"
          >
            Radicar Informe con PDF Ahora
          </button>
        </div>
      </section>
    </div>
  );
};
