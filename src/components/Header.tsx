import React from 'react';
import { Plus, BookOpen, Moon, Sun, Database, UserPlus, Lock, UserCheck, Video } from 'lucide-react';
import { UserRole } from '../types/desertion';

interface HeaderProps {
  onOpenNewComplaint: () => void;
  onOpenNormativa: () => void;
  onScrollToCases: () => void;
  onScrollToRoles: () => void;
  onOpenDatabase: () => void;
  onOpenRoleRegistration: () => void;
  onOpenLogin: () => void;
  onOpenVideo: () => void;
  loggedInUser?: { role: UserRole; name: string } | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentView: 'landing' | 'dashboard';
  onNavigateView: (view: 'landing' | 'dashboard') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewComplaint,
  onOpenNormativa,
  onScrollToCases,
  onScrollToRoles,
  onOpenDatabase,
  onOpenRoleRegistration,
  onOpenLogin,
  onOpenVideo,
  loggedInUser,
  isDarkMode,
  onToggleDarkMode,
  currentView,
  onNavigateView
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onNavigateView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
      >
        <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          SENA
        </span>
        <span className="hidden sm:inline">Debido Proceso Formativo</span>
        <span className="sm:hidden">Debido Proceso</span>
      </a>

      {/* Zone 2: 4-5 Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <button
          type="button"
          onClick={() => onNavigateView('landing')}
          className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'landing' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          Portal de Roles
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigateView('dashboard');
            onScrollToCases();
          }}
          className={`hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'dashboard' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''
          }`}
        >
          Bandeja de Expedientes
        </button>
        <button
          type="button"
          onClick={onOpenDatabase}
          className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Base de Datos</span>
        </button>
        <button
          type="button"
          onClick={onOpenNormativa}
          className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Normativa Acuerdos 009/02</span>
        </button>
        <button
          type="button"
          onClick={onOpenVideo}
          className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold"
        >
          <Video className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>📹 Videotutorial</span>
        </button>
      </nav>

      {/* Zone 3: Actions + Botón Verde de Modo Oscuro en la esquina superior */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Botón Iniciar Sesión / Autenticación */}
        <button
          type="button"
          onClick={onOpenLogin}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          title="Iniciar sesión con credenciales por rol"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{loggedInUser ? loggedInUser.name : 'Iniciar Sesión'}</span>
        </button>

        {/* Botón Registro Rápido */}
        <button
          type="button"
          onClick={onOpenRoleRegistration}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          title="Registrar nuevo usuario o perfil en la base de datos"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>+ Registrar Rol</span>
        </button>

        {/* Botón Verde Modo Oscuro */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Desactivar Modo Oscuro (Cambiar a Modo Claro)' : 'Activar Modo Oscuro (Pantalla Borrosa y Cambio de Color)'}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm rounded-lg border border-emerald-500 transition-all cursor-pointer whitespace-nowrap shrink-0 ring-2 ring-emerald-400/30"
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-emerald-100 animate-spin-slow" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-emerald-100" />
              <span>Modo Oscuro</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenNewComplaint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Radicar Queja</span>
        </button>
      </div>
    </header>
  );
};
