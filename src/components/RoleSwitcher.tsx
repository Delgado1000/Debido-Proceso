import React from 'react';
import { UserCheck, ShieldAlert, Scale, GraduationCap, Users } from 'lucide-react';
import { UserRole } from '../types/desertion';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  pendingCounts?: Record<UserRole, number>;
}

interface RoleConfig {
  id: UserRole;
  label: string;
  roleTitle: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLES: RoleConfig[] = [
  {
    id: 'instructor',
    label: 'Instructor',
    roleTitle: 'Equipo Ejecutor / Instructor',
    badge: 'Radicación',
    description: 'Radica quejas de inasistencias, sube PDFs de soporte y monitorea alertas tempranas.',
    icon: GraduationCap
  },
  {
    id: 'comite',
    label: 'Comité de Evaluación',
    roleTitle: 'Comité de Evaluación y Seguimiento',
    badge: 'Instrucción',
    description: 'Emite citaciones formales, recepciona descargos, sesiona y califica faltas en Acta.',
    icon: Users
  },
  {
    id: 'subdirector',
    label: 'Subdirector',
    roleTitle: 'Subdirector de Centro de Formación',
    badge: 'Decisión',
    description: 'Expide el Acto Administrativo Motivado (Resolución) y resuelve Recursos de Reposición.',
    icon: Scale
  },
  {
    id: 'aprendiz',
    label: 'Aprendiz',
    roleTitle: 'Aprendiz (Interesado / Defensa)',
    badge: 'Derecho a Defensa',
    description: 'Consulta expediente, rinde descargos con soporte médico PDF y radica recursos de reposición.',
    icon: UserCheck
  }
];

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onSelectRole, pendingCounts }) => {
  const currentConfig = ROLES.find((r) => r.id === currentRole) || ROLES[0];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Current Active Role Description */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <currentConfig.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rol activo en el prototipo:
              </span>
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {currentConfig.roleTitle}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* Right: Segmented Role Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = role.id === currentRole;
            const count = pendingCounts ? pendingCounts[role.id] : 0;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => onSelectRole(role.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{role.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
