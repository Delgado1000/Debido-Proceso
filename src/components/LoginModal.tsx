import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types/desertion';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
}

interface RoleCredential {
  role: UserRole;
  title: string;
  username: string;
  defaultName: string;
  password: string; // 3 first letters of name + 2026
  badge: string;
}

const ROLE_CREDENTIALS: RoleCredential[] = [
  {
    role: 'aprendiz',
    title: 'Aprendiz',
    username: 'aprendiz',
    defaultName: 'Camila Torres',
    password: 'cam2026',
    badge: 'Derecho a la Defensa'
  },
  {
    role: 'instructor',
    title: 'Instructor / Equipo Ejecutor',
    username: 'instructor',
    defaultName: 'Wilson Garcés',
    password: 'wil2026',
    badge: 'Radicación e Informe'
  },
  {
    role: 'comite',
    title: 'Comité de Evaluación',
    username: 'comite',
    defaultName: 'Comité Evaluador',
    password: 'com2026',
    badge: 'Instrucción y Calificación'
  },
  {
    role: 'subdirector',
    title: 'Subdirector de Centro',
    username: 'subdirector',
    defaultName: 'Subdirector Centro',
    password: 'sub2026',
    badge: 'Decisión y Segunda Instancia'
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [selectedRole, setSelectedRole] = useState<UserRole>('instructor');
  const [username, setUsername] = useState('instructor');
  const [password, setPassword] = useState('wil2026');
  const [error, setError] = useState<string | null>(null);

  const handleSelectRoleCred = (cred: RoleCredential) => {
    setSelectedRole(cred.role);
    setUsername(cred.username);
    setPassword(cred.password);
    setError(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cred = ROLE_CREDENTIALS.find((c) => c.role === selectedRole);
    if (!cred) {
      setError('Rol no válido.');
      return;
    }

    if (username.trim().toLowerCase() !== cred.username && username.trim().toLowerCase() !== cred.defaultName.toLowerCase()) {
      setError('Usuario incorrecto para el rol seleccionado.');
      return;
    }

    if (password !== cred.password) {
      setError('Contraseña incorrecta.');
      return;
    }

    onLoginSuccess(cred.role, cred.defaultName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Autenticación por Rol Institucional
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistema de Debido Proceso · Acuerdo 007 de 2012
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Role Quick Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              1. Seleccione el Rol de Acceso
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {ROLE_CREDENTIALS.map((cred) => {
                const isSelected = selectedRole === cred.role;
                return (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => handleSelectRoleCred(cred)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-600 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                        {cred.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                      {cred.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Pass: {cred.password}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              2. Credenciales de Ingreso ({selectedRole.toUpperCase()})
            </label>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Usuario Institucional
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="Usuario"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Contraseña (3 primeras letras del nombre + 2026)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                    placeholder="Contraseña"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Ingresar al Sistema como {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500">
          Credenciales automáticas: Aprendiz (cam2026) · Instructor (wil2026) · Comité (com2026) · Subdirector (sub2026)
        </div>
      </div>
    </div>
  );
};
