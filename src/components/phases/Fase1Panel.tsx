import React from 'react';
import { Calendar, User, FileText, Download, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CaseRecord, UserRole, AttachedPDF } from '../../types/desertion';
import { generateInformeDesercionPDF } from '../../utils/pdfGenerator';

interface Fase1PanelProps {
  caso: CaseRecord;
  currentRole: UserRole;
  onAdvanceToPhase2?: () => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const Fase1Panel: React.FC<Fase1PanelProps> = ({
  caso,
  currentRole,
  onAdvanceToPhase2,
  onViewPDF
}) => {
  const f1 = caso.fase1_informe;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Fase 1: Presentación del Informe o Queja por Equipo Ejecutor
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Radicado oficial: <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300">{f1.radicadoOficial}</span> · Fecha: {f1.fechaRadicacion}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => generateInformeDesercionPDF(caso)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100/50 transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          Descargar Informe Oficial en PDF
        </button>
      </div>

      {/* Grid of facts and instructor data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Causales e inasistencias */}
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Configuración de la Causal (Art. 22 Reglamento)
          </h5>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Días continuos sin justificar:</span>
              <span className="text-lg font-mono font-bold text-slate-900 dark:text-slate-100">
                {f1.diasInasistenciaConsecutivos} días
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Requisito legal:</span>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Mayor a 3 días hábiles
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Fechas exactas de inasistencia reportadas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {f1.fechasInasistencia.map((fecha, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700"
                >
                  {fecha}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Resumen Fáctico y Antecedentes:
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
              {f1.resumenHechos}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Comunicaciones de Alerta Temprana y Contacto Previo:
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
              {f1.comunicacionesPrevias}
            </p>
          </div>
        </div>

        {/* Card 2: Instructor remitente y archivos PDF */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Instructor Responsable de la Radicación
            </h5>
            <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <p><strong className="text-slate-800 dark:text-slate-200">Nombre:</strong> {caso.instructor.nombre}</p>
              <p><strong className="text-slate-800 dark:text-slate-200">Cargo:</strong> {caso.instructor.cargo}</p>
              <p><strong className="text-slate-800 dark:text-slate-200">Área:</strong> {caso.instructor.area}</p>
              <p><strong className="text-slate-800 dark:text-slate-200">Correo:</strong> {caso.instructor.correo}</p>
            </div>
          </div>

          {/* Soportes en PDF cargados en Fase 1 */}
          <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Evidencias Documentales en PDF ({f1.documentosAdjuntos.length})
              </span>
              <span className="text-[11px] font-normal text-slate-400">Custodia digital</span>
            </h5>

            {f1.documentosAdjuntos.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No se han anexado documentos PDF en este informe.</p>
            ) : (
              <div className="space-y-2">
                {f1.documentosAdjuntos.map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => onViewPDF(pdf)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-all flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                          {pdf.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {pdf.fileSize} · Hash: <span className="font-mono">{pdf.verificationHash}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 underline shrink-0 ml-2">
                      Ver PDF
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action to advance if role is comite and case is still in phase 1 */}
      {caso.currentPhase === 1 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              ¿Listo para dar trámite a la queja según el debido proceso?
            </p>
            <p className="text-[11px] text-slate-500">
              El Comité de Evaluación revisa los requisitos de la queja y procede a emitir la Citación Oficial al Aprendiz.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdvanceToPhase2}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>Pasar a Fase 2: Emitir Citación a Comité</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
