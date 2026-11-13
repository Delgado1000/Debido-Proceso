import React from 'react';
import { CheckCircle2, Clock, CircleDot, AlertCircle, ShieldAlert } from 'lucide-react';
import { DueProcessPhaseNumber, CaseRecord } from '../types/desertion';

interface DueProcessTimelineProps {
  currentPhase: DueProcessPhaseNumber;
  activeSelectedPhase: DueProcessPhaseNumber;
  onSelectPhase: (phase: DueProcessPhaseNumber) => void;
  caso: CaseRecord;
}

interface PhaseDefinition {
  number: DueProcessPhaseNumber;
  title: string;
  subtitle: string;
  responsibleRole: string;
}

const PHASES: PhaseDefinition[] = [
  {
    number: 1,
    title: '1. Presentación de Queja / Informe',
    subtitle: 'Análisis de inasistencias y remisión de evidencias PDF',
    responsibleRole: 'Instructor / Equipo Ejecutor'
  },
  {
    number: 2,
    title: '2. Citación y Descargos',
    subtitle: 'Garantía del derecho a ser escuchado y justificación',
    responsibleRole: 'Comité y Aprendiz'
  },
  {
    number: 3,
    title: '3. Recomendación del Comité',
    subtitle: 'Calificación de falta y dictamen técnico motivado',
    responsibleRole: 'Comité de Evaluación'
  },
  {
    number: 4,
    title: '4. Acto Administrativo',
    subtitle: 'Expedición y notificación de Resolución de Decisión',
    responsibleRole: 'Subdirector de Centro'
  },
  {
    number: 5,
    title: '5. Interposición de Recursos',
    subtitle: 'Recurso de Reposición y agotamiento de vía gubernativa',
    responsibleRole: 'Aprendiz y Subdirector'
  }
];

export const DueProcessTimeline: React.FC<DueProcessTimelineProps> = ({
  currentPhase,
  activeSelectedPhase,
  onSelectPhase,
  caso
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Ruta del Debido Proceso Formativo</span>
            <span className="text-xs font-normal text-slate-500">· Acuerdo 007 de 2012</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Haga clic en cualquiera de las 5 fases para consultar actuaciones, requisitos o registrar avances.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Fase activa procesal:</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            Fase {currentPhase} de 5
          </span>
        </div>
      </div>

      {/* Stepper container */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {PHASES.map((phase) => {
          const isCompleted = phase.number < currentPhase || (phase.number === 5 && caso.fase5_recursos.resuelto);
          const isCurrent = phase.number === currentPhase && !(phase.number === 5 && caso.fase5_recursos.resuelto);
          const isSelected = phase.number === activeSelectedPhase;

          return (
            <button
              key={phase.number}
              type="button"
              onClick={() => onSelectPhase(phase.number)}
              className={`text-left p-3 rounded-lg border transition-all duration-150 flex flex-col justify-between relative ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                  : isCurrent
                  ? 'border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-850 hover:border-emerald-400'
                  : isCompleted
                  ? 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Paso {phase.number}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <CircleDot className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>

                <p className={`text-xs font-semibold leading-snug ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>
                  {phase.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-tight">
                  {phase.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                <span>{phase.responsibleRole}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
