/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeft,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Scale,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Moon,
  Sun
} from 'lucide-react';

import { CaseRecord, UserRole, DueProcessPhaseNumber, AttachedPDF } from './types/desertion';
import { INITIAL_CASES } from './data/initialCases';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { RoleSwitcher } from './components/RoleSwitcher';
import { CaseDetailModal } from './components/CaseDetailModal';
import { NewComplaintModal } from './components/NewComplaintModal';
import { PDFViewerModal } from './components/PDFViewerModal';
import { NormativaDrawer } from './components/NormativaDrawer';
import { RoleRegistrationModal } from './components/RoleRegistrationModal';
import { DatabaseExplorerModal } from './components/DatabaseExplorerModal';
import { LoginModal } from './components/LoginModal';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import {
  loadDatabase,
  saveDatabase,
  resetDatabase,
  SenaDatabase,
  AprendizRecord,
  InstructorRecord,
  ComiteMiembroRecord,
  SubdirectorRecord
} from './db/database';
import {
  generateInformeDesercionPDF,
  generateCitacionComitePDF,
  generateActaComitePDF,
  generateResolucionSubdirectorPDF,
  generateMemorialRecursoPDF
} from './utils/pdfGenerator';

const STORAGE_KEY = 'sena_desercion_due_process_v1';
const DARK_MODE_KEY = 'sena_dark_mode_enabled';

export default function App() {
  // Navigation view: 'landing' (role portal) vs 'dashboard' (dossier manager)
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Dark mode state with screen blur transition
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem(DARK_MODE_KEY);
      if (savedTheme !== null) {
        return savedTheme === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const [isBlurring, setIsBlurring] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDarkMode));
    } catch (e) {
      console.error('Error saving theme preference', e);
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    // Activate screen blur effect and trigger color change
    setIsBlurring(true);
    setIsDarkMode((prev) => !prev);
    setTimeout(() => {
      setIsBlurring(false);
    }, 900);
  };

  // Cases state with localStorage persistence
  const [cases, setCases] = useState<CaseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cases from storage', e);
    }
    return INITIAL_CASES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Error saving cases to storage', e);
    }
  }, [cases]);

  // Database State with localStorage persistence
  const [database, setDatabase] = useState<SenaDatabase>(() => loadDatabase());

  // Role Registration & DB Explorer Modal states
  const [isRoleRegOpen, setIsRoleRegOpen] = useState(false);
  const [roleRegDefaultRole, setRoleRegDefaultRole] = useState<UserRole>('aprendiz');
  const [isDbExplorerOpen, setIsDbExplorerOpen] = useState(false);

  // Handlers for registering records in the database
  const handleSaveAprendiz = (record: AprendizRecord) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        aprendices: [record, ...prev.aprendices]
      };
      saveDatabase(updated);
      return updated;
    });
  };

  const handleSaveInstructor = (record: InstructorRecord) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        instructores: [record, ...prev.instructores]
      };
      saveDatabase(updated);
      return updated;
    });
  };

  const handleSaveComite = (record: ComiteMiembroRecord) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        comite_miembros: [record, ...prev.comite_miembros]
      };
      saveDatabase(updated);
      return updated;
    });
  };

  const handleSaveSubdirector = (record: SubdirectorRecord) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        subdirectores: [record, ...prev.subdirectores]
      };
      saveDatabase(updated);
      return updated;
    });
  };

  const handleDeleteDbRecord = (collection: keyof SenaDatabase, id: string) => {
    setDatabase((prev) => {
      const updated = {
        ...prev,
        [collection]: (prev[collection] as Array<{ id: string }>).filter((item) => item.id !== id)
      };
      saveDatabase(updated);
      return updated;
    });
  };

  const handleResetDb = () => {
    if (confirm('¿Desea restablecer la base de datos institucional a los registros predeterminados?')) {
      const freshDb = resetDatabase();
      setDatabase(freshDb);
    }
  };

  // Current Active Role & Authentication Session
  const [currentRole, setCurrentRole] = useState<UserRole>('instructor');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ role: UserRole; name: string } | null>({
    role: 'instructor',
    name: 'Wilson Garcés'
  });

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setCurrentRole(role);
    setLoggedInUser({ role, name });
    setCurrentView('dashboard');
  };

  // Modals & Drawers
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isNormativaOpen, setIsNormativaOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [viewingPDF, setViewingPDF] = useState<AttachedPDF | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPhase, setFilterPhase] = useState<number | 'all'>('all');
  const [roleFilterOnly, setRoleFilterOnly] = useState(false);

  // Pending counts for each role
  const pendingCounts = useMemo(() => {
    const counts: Record<UserRole, number> = {
      instructor: 0,
      comite: 0,
      subdirector: 0,
      aprendiz: 0
    };

    cases.forEach((c) => {
      if (c.currentPhase === 1) counts.instructor++;
      if (c.currentPhase === 2 && !c.fase2_citacion.citacionEmitida) counts.comite++;
      if (c.currentPhase === 2 && c.fase2_citacion.citacionEmitida && !c.fase2_citacion.descargosPresentados) {
        counts.aprendiz++;
        counts.comite++;
      }
      if (c.currentPhase === 3 && !c.fase3_recomendacion.sesionRealizada) counts.comite++;
      if (c.currentPhase === 4 && !c.fase4_acto_administrativo.resolucionEmitida) counts.subdirector++;
      if (c.currentPhase === 5 && !c.fase5_recursos.recursoInterpuesto && !c.fase5_recursos.ejecutoriadoEnFirme) {
        counts.aprendiz++;
      }
      if (c.currentPhase === 5 && c.fase5_recursos.recursoInterpuesto && !c.fase5_recursos.resuelto) {
        counts.subdirector++;
      }
    });

    return counts;
  }, [cases]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        c.codigoRadicado.toLowerCase().includes(q) ||
        c.aprendiz.nombre.toLowerCase().includes(q) ||
        c.aprendiz.numeroDoc.includes(q) ||
        c.aprendiz.ficha.includes(q) ||
        c.aprendiz.programa.toLowerCase().includes(q) ||
        c.instructor.nombre.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Phase filter
      if (filterPhase !== 'all' && c.currentPhase !== filterPhase) {
        return false;
      }

      // Role filter
      if (roleFilterOnly) {
        if (currentRole === 'instructor' && c.currentPhase !== 1) return false;
        if (currentRole === 'comite' && c.currentPhase !== 2 && c.currentPhase !== 3) return false;
        if (currentRole === 'subdirector' && c.currentPhase !== 4 && (c.currentPhase !== 5 || !c.fase5_recursos.recursoInterpuesto || c.fase5_recursos.resuelto)) return false;
        if (currentRole === 'aprendiz' && c.currentPhase !== 2 && (c.currentPhase !== 5 || c.fase5_recursos.recursoInterpuesto)) return false;
      }

      return true;
    });
  }, [cases, searchQuery, filterPhase, roleFilterOnly, currentRole]);

  // Update case in state
  const handleUpdateCase = (updated: CaseRecord) => {
    setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedCase && selectedCase.id === updated.id) {
      setSelectedCase(updated);
    }
  };

  // Add new case
  const handleAddNewCase = (newCase: CaseRecord) => {
    setCases((prev) => [newCase, ...prev]);
    setSelectedCase(newCase);
  };

  // Reset to initial sample cases
  const handleResetCases = () => {
    if (confirm('¿Desea restablecer los casos de prueba iniciales del debido proceso? Se reiniciarán los datos locales.')) {
      setCases(INITIAL_CASES);
      localStorage.removeItem(STORAGE_KEY);
      setSelectedCase(null);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans flex flex-col transition-colors duration-500 relative ${isBlurring ? 'blur-theme-transition' : ''}`}>
      {/* Screen Blur Overlay when Dark Mode is toggled */}
      {isBlurring && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center backdrop-blur-xl bg-slate-950/30 transition-all duration-700 animate-in fade-in">
          <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white px-6 py-4 rounded-2xl border-2 border-emerald-500 shadow-2xl flex items-center gap-3.5 backdrop-blur-2xl animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              {isDarkMode ? <Moon className="w-5 h-5 text-emerald-100" /> : <Sun className="w-5 h-5 text-emerald-100" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {isDarkMode ? 'Pantalla borrosa · Aplicando paleta oscura...' : 'Restableciendo paleta clara institucional...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
        onOpenNormativa={() => setIsNormativaOpen(true)}
        onScrollToCases={() => {
          setCurrentView('dashboard');
          setTimeout(() => {
            document.getElementById('casos-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onScrollToRoles={() => {
          setCurrentView('landing');
          setTimeout(() => {
            document.getElementById('roles-portal')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenDatabase={() => setIsDbExplorerOpen(true)}
        onOpenRoleRegistration={() => {
          setRoleRegDefaultRole('aprendiz');
          setIsRoleRegOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenVideo={() => setIsVideoModalOpen(true)}
        loggedInUser={loggedInUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentView={currentView}
        onNavigateView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {currentView === 'landing' ? (
          <LandingPage
            cases={cases}
            pendingCounts={pendingCounts}
            onSelectRole={(role) => {
              setCurrentRole(role);
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenNormativa={() => setIsNormativaOpen(true)}
            onOpenCase={(c) => setSelectedCase(c)}
            onStartNewComplaint={() => setIsNewComplaintOpen(true)}
            onOpenDatabase={() => setIsDbExplorerOpen(true)}
            onOpenRoleRegistration={(role) => {
              setRoleRegDefaultRole(role);
              setIsRoleRegOpen(true);
            }}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenVideo={() => setIsVideoModalOpen(true)}
          />
        ) : (
          <>
            {/* Return Bar to Landing */}
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                <span>← Volver al Portal de Inicio y Roles</span>
              </button>

              <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-2">
                <span>Panel Activo:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  Bandeja de Expedientes y Actuaciones
                </strong>
              </div>
            </div>

            {/* Institutional Hero Banner */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                <span>Procedimiento de Formación Profesional Integral</span>
                <span aria-hidden="true">·</span>
                <span>Acuerdo 007 de 2012</span>
                <span aria-hidden="true">·</span>
                <span>Art. 29 C.P.</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Gestión Integral de Deserción y Debido Proceso
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Plataforma institucional para radicar quejas de inasistencias con carga de archivos PDF, gestionar las 5 fases obligatorias del debido proceso y coordinar las actuaciones entre Instructor, Aprendiz, Comité y Subdirector de Centro.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsNormativaOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Ver Guía del Debido Proceso</span>
              </button>
              <button
                type="button"
                onClick={() => setIsNewComplaintOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Radicar Nuevo Informe (Fase 1)</span>
              </button>
            </div>
          </div>

          {/* 5-Step Process Summary Strip */}
          <div id="fases" className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                num: 1,
                title: '1. Informe / Queja',
                role: 'Instructor',
                desc: 'Causal >= 3 días y carga de reporte PDF Sofia Plus'
              },
              {
                num: 2,
                title: '2. Citación y Descargos',
                role: 'Comité y Aprendiz',
                desc: 'Notificación oficial y recepción de descargos / EPS'
              },
              {
                num: 3,
                title: '3. Recomendación Comité',
                role: 'Comité de Evaluación',
                desc: 'Calificación de la falta y expedición de Acta PDF'
              },
              {
                num: 4,
                title: '4. Acto Administrativo',
                role: 'Subdirector',
                desc: 'Resolución motivada de decisión y notificación'
              },
              {
                num: 5,
                title: '5. Recursos',
                role: 'Aprendiz y Subdirector',
                desc: 'Recurso de reposición y resolución definitiva'
              }
            ].map((step) => (
              <div
                key={step.num}
                onClick={() => {
                  setFilterPhase(step.num);
                  document.getElementById('casos-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  filterPhase === step.num
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                  <span>FASE {step.num}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{step.role}</span>
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{step.title}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-Role Switcher Toolbar */}
        <section id="roles-section">
          <RoleSwitcher
            currentRole={currentRole}
            onSelectRole={(role) => setCurrentRole(role)}
            pendingCounts={pendingCounts}
          />
        </section>

        {/* Cases Management Dashboard */}
        <section id="casos-section" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          {/* Header of Table: Search, Filter Tabs, Actions */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Expedientes de Deserción en Trámite</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    {filteredCases.length} expedientes
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Seleccione un caso para ver la línea de tiempo, revisar y cargar documentos PDF o avanzar en la actuación.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRoleFilterOnly(!roleFilterOnly)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    roleFilterOnly
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {roleFilterOnly ? '✓ Solo pendientes para mi rol' : 'Filtrar por mi rol'}
                </button>

                <button
                  type="button"
                  onClick={handleResetCases}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                  title="Restablecer casos de prueba predeterminados"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre de aprendiz, documento, número de ficha, programa o radicado..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>

              {/* Segmented Phase Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => setFilterPhase('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    filterPhase === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Todas las Fases
                </button>
                {[1, 2, 3, 4, 5].map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setFilterPhase(pNum)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                      filterPhase === pNum
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Fase {pNum}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cases High-Density Grid / Table */}
          {filteredCases.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No se encontraron expedientes con los criterios seleccionados
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Intente ajustar el término de búsqueda o haga clic en "Todas las Fases" para ver el listado general.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setFilterPhase('all');
                  setRoleFilterOnly(false);
                }}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Radicado</th>
                    <th className="py-3 px-4">Aprendiz e Identificación</th>
                    <th className="py-3 px-4">Ficha y Programa</th>
                    <th className="py-3 px-4">Inasistencias</th>
                    <th className="py-3 px-4">Fase Procesal Activa</th>
                    <th className="py-3 px-4">Evidencias PDF</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCases.map((caso) => {
                    const totalPdfs =
                      caso.fase1_informe.documentosAdjuntos.length +
                      (caso.fase2_citacion.documentoCitacionPdf ? 1 : 0) +
                      (caso.fase2_citacion.soporteDescargosPdf?.length || 0) +
                      (caso.fase3_recomendacion.actaComitePdf ? 1 : 0) +
                      (caso.fase4_acto_administrativo.documentoResolucionPdf ? 1 : 0) +
                      (caso.fase5_recursos.pruebasNuevasPdf?.length || 0) +
                      (caso.fase5_recursos.documentoFalloRecursoPdf ? 1 : 0);

                    const phaseNames: Record<number, string> = {
                      1: 'Fase 1: Informe Radicado',
                      2: 'Fase 2: Citación y Descargos',
                      3: 'Fase 3: Recomendación Comité',
                      4: 'Fase 4: Acto Administrativo',
                      5: 'Fase 5: Recursos / Firmeza'
                    };

                    return (
                      <tr
                        key={caso.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCase(caso)}
                      >
                        {/* Radicado */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {caso.codigoRadicado}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            {caso.createdAt}
                          </span>
                        </td>

                        {/* Aprendiz */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {caso.aprendiz.nombre}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {caso.aprendiz.tipoDoc} {caso.aprendiz.numeroDoc}
                          </p>
                        </td>

                        {/* Ficha & Programa */}
                        <td className="py-3.5 px-4 max-w-[220px]">
                          <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-400 block">
                            Ficha {caso.aprendiz.ficha}
                          </span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400 truncate block" title={caso.aprendiz.programa}>
                            {caso.aprendiz.programa}
                          </span>
                        </td>

                        {/* Inasistencias */}
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {caso.fase1_informe.diasInasistenciaConsecutivos} días
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {caso.fase1_informe.fechasInasistencia.length} fechas reportadas
                          </span>
                        </td>

                        {/* Fase Procesal (Clean unboxed metadata) */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                              {caso.currentPhase}
                            </span>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                {phaseNames[caso.currentPhase]}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {caso.currentPhase === 5 && caso.fase5_recursos.ejecutoriadoEnFirme
                                  ? 'Cerrado en firme'
                                  : 'En curso'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Evidencias PDF */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstPdf =
                                caso.fase1_informe.documentosAdjuntos[0] ||
                                caso.fase2_citacion.documentoCitacionPdf ||
                                caso.fase3_recomendacion.actaComitePdf ||
                                caso.fase4_acto_administrativo.documentoResolucionPdf;
                              if (firstPdf) setViewingPDF(firstPdf);
                              else setSelectedCase(caso);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-red-500" />
                            <span>{totalPdfs} PDF(s)</span>
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCase(caso);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800/60"
                          >
                            <span>Gestionar Caso</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              <span>Mostrando <strong>{filteredCases.length}</strong> de <strong>{cases.length}</strong> expedientes registrados</span>
            </div>
            <div className="flex items-center gap-4">
              <span>SENA · Dirección General · Formación Profesional</span>
              <button
                type="button"
                onClick={() => setIsNormativaOpen(true)}
                className="font-medium text-emerald-700 dark:text-emerald-400 underline"
              >
                Consultar Estatuto del Aprendiz
              </button>
            </div>
          </div>
        </section>
      </>
    )}
  </main>

      {/* Case Detail Modal (Phase Operations, Stepper, PDF Repository, Traceability) */}
      <CaseDetailModal
        caso={selectedCase}
        onClose={() => setSelectedCase(null)}
        currentRole={currentRole}
        onUpdateCase={handleUpdateCase}
        onViewPDF={(pdf) => setViewingPDF(pdf)}
      />

      {/* New Complaint Modal (Instructor Phase 1) */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmit={handleAddNewCase}
        database={database}
      />

      {/* Authentication Login Modal per Role */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Basic Data Registration Modal for Every Role (Aprendiz, Instructor, Comite, Subdirector) */}
      <RoleRegistrationModal
        isOpen={isRoleRegOpen}
        onClose={() => setIsRoleRegOpen(false)}
        defaultRole={roleRegDefaultRole}
        onSaveAprendiz={handleSaveAprendiz}
        onSaveInstructor={handleSaveInstructor}
        onSaveComite={handleSaveComite}
        onSaveSubdirector={handleSaveSubdirector}
      />

      {/* Database Explorer Modal (Inspector, Search, Records, Backup Export, Restore) */}
      <DatabaseExplorerModal
        isOpen={isDbExplorerOpen}
        onClose={() => setIsDbExplorerOpen(false)}
        database={database}
        onOpenCreateModal={(role) => {
          setIsDbExplorerOpen(false);
          setRoleRegDefaultRole(role);
          setIsRoleRegOpen(true);
        }}
        onDeleteRecord={handleDeleteDbRecord}
        onResetDatabase={handleResetDb}
      />

      {/* Full PDF Viewer Modal */}
      <PDFViewerModal
        pdf={viewingPDF}
        onClose={() => setViewingPDF(null)}
        onDownload={(pdf) => {
          if (selectedCase) {
            if (pdf.type === 'reporte_inasistencia' || pdf.type === 'evidencia_instructor') {
              generateInformeDesercionPDF(selectedCase);
            } else if (pdf.type === 'citacion_oficial') {
              generateCitacionComitePDF(selectedCase);
            } else if (pdf.type === 'acta_comite') {
              generateActaComitePDF(selectedCase);
            } else if (pdf.type === 'resolucion_subdirector') {
              generateResolucionSubdirectorPDF(selectedCase);
            } else {
              generateMemorialRecursoPDF(selectedCase);
            }
          }
        }}
      />

      {/* Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="https://docs.google.com/videos/d/14VzNg58rTfkJSnEEQNJYfEkzLr3phVnPrvm5pOEk06s/play?usp=sharing"
      />

      {/* Normativa & Due Process Guide Drawer */}
      <NormativaDrawer
        isOpen={isNormativaOpen}
        onClose={() => setIsNormativaOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Prototipo de Gestión de Deserción y Debido Proceso Formativo · SENA
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Cumple con las 5 fases obligatorias: 1. Presentación de queja con PDF · 2. Citación y Descargos · 3. Recomendación del Comité · 4. Acto Administrativo Motivado · 5. Interposición de Recursos
        </p>
      </footer>
    </div>
  );
}
