import React, { useState } from 'react';
import { X, FileText, Download, User, Calendar, ShieldCheck, Clock, CheckCircle2, AlertCircle, Eye, Printer } from 'lucide-react';
import { CaseRecord, UserRole, DueProcessPhaseNumber, AttachedPDF } from '../types/desertion';
import { DueProcessTimeline } from './DueProcessTimeline';
import { Fase1Panel } from './phases/Fase1Panel';
import { Fase2Panel } from './phases/Fase2Panel';
import { Fase3Panel } from './phases/Fase3Panel';
import { Fase4Panel } from './phases/Fase4Panel';
import { Fase5Panel } from './phases/Fase5Panel';
import {
  generateInformeDesercionPDF,
  generateCitacionComitePDF,
  generateActaComitePDF,
  generateResolucionSubdirectorPDF,
  generateMemorialRecursoPDF
} from '../utils/pdfGenerator';

interface CaseDetailModalProps {
  caso: CaseRecord | null;
  onClose: () => void;
  currentRole: UserRole;
  onUpdateCase: (updatedCase: CaseRecord) => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caso,
  onClose,
  currentRole,
  onUpdateCase,
  onViewPDF
}) => {
  if (!caso) return null;

  const [selectedPhase, setSelectedPhase] = useState<DueProcessPhaseNumber>(caso.currentPhase);
  const [activeTab, setActiveTab] = useState<'actuacion' | 'expediente' | 'trazabilidad'>('actuacion');

  // Gather all PDFs across phases
  const allPDFs: AttachedPDF[] = [
    ...caso.fase1_informe.documentosAdjuntos,
    ...(caso.fase2_citacion.documentoCitacionPdf ? [caso.fase2_citacion.documentoCitacionPdf] : []),
    ...(caso.fase2_citacion.soporteDescargosPdf || []),
    ...(caso.fase3_recomendacion.actaComitePdf ? [caso.fase3_recomendacion.actaComitePdf] : []),
    ...(caso.fase4_acto_administrativo.documentoResolucionPdf ? [caso.fase4_acto_administrativo.documentoResolucionPdf] : []),
    ...(caso.fase5_recursos.pruebasNuevasPdf || []),
    ...(caso.fase5_recursos.documentoFalloRecursoPdf ? [caso.fase5_recursos.documentoFalloRecursoPdf] : [])
  ];

  // Helper to append traceability
  const addTrace = (accion: string, fase: DueProcessPhaseNumber, actor: string, documentoRef?: string) => {
    return [
      ...caso.trazabilidad,
      {
        id: 'tz-' + Date.now(),
        fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        actor,
        rol: currentRole,
        accion,
        fase,
        documentoRef
      }
    ];
  };

  // Phase transition handlers
  const handleAdvanceToPhase2 = () => {
    const updated: CaseRecord = {
      ...caso,
      currentPhase: 2,
      status: 'citacion_programada',
      trazabilidad: addTrace('Comité de Evaluación avoca conocimiento y abre trámite para citación.', 2, 'Comité de Evaluación y Seguimiento')
    };
    onUpdateCase(updated);
    setSelectedPhase(2);
  };

  const handleUpdateCitacion = (fase2: typeof caso.fase2_citacion) => {
    const isNewDescargo = !caso.fase2_citacion.descargosPresentados && fase2.descargosPresentados;
    const isNewCitacion = !caso.fase2_citacion.citacionEmitida && fase2.citacionEmitida;

    let accion = 'Actualización en trámite de citación y descargos.';
    let actor = 'Comité de Evaluación y Seguimiento';
    if (isNewCitacion) {
      accion = `Emisión formal de Citación a audiencia para el ${fase2.fechaAudiencia}.`;
    } else if (isNewDescargo) {
      accion = 'Radicación de memorial de descargos y pruebas de justificación.';
      actor = caso.aprendiz.nombre;
    }

    const updated: CaseRecord = {
      ...caso,
      fase2_citacion: fase2,
      status: fase2.descargosPresentados ? 'descargos_presentados' : 'citacion_programada',
      trazabilidad: addTrace(accion, 2, actor, fase2.documentoCitacionPdf?.name)
    };
    onUpdateCase(updated);
  };

  const handleAdvanceToPhase3 = () => {
    const updated: CaseRecord = {
      ...caso,
      currentPhase: 3,
      status: 'comite_sesionando',
      trazabilidad: addTrace('Instalación de sesión deliberatoria del Comité de Evaluación para calificar la falta.', 3, 'Comité de Evaluación y Seguimiento')
    };
    onUpdateCase(updated);
    setSelectedPhase(3);
  };

  const handleUpdateRecomendacion = (fase3: typeof caso.fase3_recomendacion) => {
    const updated: CaseRecord = {
      ...caso,
      fase3_recomendacion: fase3,
      status: 'recomendacion_emitida',
      trazabilidad: addTrace(
        `Aprobación del Acta ${fase3.actaNumero} con recomendación: ${fase3.recomendacionFinal}. Remisión al Subdirector.`,
        3,
        'Comité de Evaluación y Seguimiento',
        fase3.actaComitePdf?.name
      )
    };
    onUpdateCase(updated);
  };

  const handleAdvanceToPhase4 = () => {
    const updated: CaseRecord = {
      ...caso,
      currentPhase: 4,
      status: 'recomendacion_emitida',
      trazabilidad: addTrace('Recepción de recomendación en el Despacho de Subdirección para expedición de acto administrativo.', 4, 'Despacho de Subdirección')
    };
    onUpdateCase(updated);
    setSelectedPhase(4);
  };

  const handleUpdateActo = (fase4: typeof caso.fase4_acto_administrativo) => {
    const updated: CaseRecord = {
      ...caso,
      fase4_acto_administrativo: fase4,
      status: 'resolucion_expedida',
      trazabilidad: addTrace(
        `Expedición y firma de la Resolución ${fase4.resolucionNumero}: Sanción ${fase4.decisionSancion}. Notificación formal al aprendiz.`,
        4,
        fase4.subdirectorNombre || 'Subdirector de Centro',
        fase4.documentoResolucionPdf?.name
      )
    };
    onUpdateCase(updated);
  };

  const handleAdvanceToPhase5 = () => {
    const updated: CaseRecord = {
      ...caso,
      currentPhase: 5,
      status: 'notificado_al_aprendiz',
      fase5_recursos: {
        ...caso.fase5_recursos,
        recursoHabilitado: true
      },
      trazabilidad: addTrace('Apertura formal del término legal de cinco (5) días hábiles para interposición de recursos.', 5, 'Secretaría de Centro')
    };
    onUpdateCase(updated);
    setSelectedPhase(5);
  };

  const handleUpdateRecursos = (fase5: typeof caso.fase5_recursos) => {
    const isNewRecurso = !caso.fase5_recursos.recursoInterpuesto && fase5.recursoInterpuesto;
    const isFallo = !caso.fase5_recursos.resuelto && fase5.resuelto;

    let accion = 'Actualización en etapa de recursos.';
    let actor = 'Despacho Subdirección';
    let status = caso.status;

    if (isNewRecurso) {
      accion = `Interposición formal de Recurso de Reposición ${fase5.radicadoRecurso} por el aprendiz.`;
      actor = caso.aprendiz.nombre;
      status = 'recurso_interpuesto';
    } else if (isFallo) {
      accion = `Resolución definitiva del Recurso: Decisión ${fase5.decisionRecurso}. Agotamiento de la vía gubernativa.`;
      actor = caso.fase4_acto_administrativo.subdirectorNombre || 'Subdirector de Centro';
      status =
        fase5.decisionRecurso === 'Confirma'
          ? 'recurso_resuelto_confirmado'
          : fase5.decisionRecurso === 'Modifica'
          ? 'recurso_resuelto_modificado'
          : 'recurso_resuelto_revocado';
    }

    const updated: CaseRecord = {
      ...caso,
      fase5_recursos: fase5,
      status,
      trazabilidad: addTrace(accion, 5, actor, fase5.documentoFalloRecursoPdf?.name)
    };
    onUpdateCase(updated);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {caso.codigoRadicado.split('-')[2] || 'SENA'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {caso.codigoRadicado}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {caso.aprendiz.nombre}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({caso.aprendiz.tipoDoc} {caso.aprendiz.numeroDoc})
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ficha {caso.aprendiz.ficha} · {caso.aprendiz.programa} · {caso.aprendiz.centro}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (selectedPhase === 1) generateInformeDesercionPDF(caso);
                else if (selectedPhase === 2) generateCitacionComitePDF(caso);
                else if (selectedPhase === 3) generateActaComitePDF(caso);
                else if (selectedPhase === 4) generateResolucionSubdirectorPDF(caso);
                else generateMemorialRecursoPDF(caso);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Descargar documento de la fase actual"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              Descargar PDF Oficial
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Header (Timeline) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <DueProcessTimeline
            currentPhase={caso.currentPhase}
            activeSelectedPhase={selectedPhase}
            onSelectPhase={(phase) => {
              setSelectedPhase(phase);
              setActiveTab('actuacion');
            }}
            caso={caso}
          />
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('actuacion')}
              className={`px-4 py-2.5 font-semibold border-b-2 transition-colors ${
                activeTab === 'actuacion'
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Actuación Procesal (Fase {selectedPhase})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('expediente')}
              className={`px-4 py-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'expediente'
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>Expediente Documental (PDFs)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                {allPDFs.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trazabilidad')}
              className={`px-4 py-2.5 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'trazabilidad'
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <span>Trazabilidad Legal</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                {caso.trazabilidad.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Rol en vista: </span>
            <strong className="text-emerald-700 dark:text-emerald-400 capitalize">{currentRole}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
          {activeTab === 'actuacion' && (
            <div>
              {selectedPhase === 1 && (
                <Fase1Panel
                  caso={caso}
                  currentRole={currentRole}
                  onAdvanceToPhase2={handleAdvanceToPhase2}
                  onViewPDF={onViewPDF}
                />
              )}
              {selectedPhase === 2 && (
                <Fase2Panel
                  caso={caso}
                  currentRole={currentRole}
                  onUpdateCitacion={handleUpdateCitacion}
                  onAdvanceToPhase3={handleAdvanceToPhase3}
                  onViewPDF={onViewPDF}
                />
              )}
              {selectedPhase === 3 && (
                <Fase3Panel
                  caso={caso}
                  currentRole={currentRole}
                  onUpdateRecomendacion={handleUpdateRecomendacion}
                  onAdvanceToPhase4={handleAdvanceToPhase4}
                  onViewPDF={onViewPDF}
                />
              )}
              {selectedPhase === 4 && (
                <Fase4Panel
                  caso={caso}
                  currentRole={currentRole}
                  onUpdateActo={handleUpdateActo}
                  onAdvanceToPhase5={handleAdvanceToPhase5}
                  onViewPDF={onViewPDF}
                />
              )}
              {selectedPhase === 5 && (
                <Fase5Panel
                  caso={caso}
                  currentRole={currentRole}
                  onUpdateRecursos={handleUpdateRecursos}
                  onViewPDF={onViewPDF}
                />
              )}
            </div>
          )}

          {activeTab === 'expediente' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Custodia Digital del Expediente en PDF
                  </h4>
                  <p className="text-xs text-slate-500">
                    Todos los documentos adjuntados por el Instructor, Aprendiz, Comité y Subdirector con firma criptográfica.
                  </p>
                </div>
              </div>

              {allPDFs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No se han registrado archivos PDF en este expediente.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allPDFs.map((pdf, idx) => (
                    <div
                      key={pdf.id + '-' + idx}
                      onClick={() => onViewPDF(pdf)}
                      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                            {pdf.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {pdf.description}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">
                            {pdf.fileSize} · {pdf.uploadDate} · Subido por: {pdf.uploadedBy}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                          {pdf.verificationHash}
                        </span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 underline flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Visualizar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'trazabilidad' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Cadena de Custodia y Bitácora Procesal Inmutable
                </h4>
                <p className="text-xs text-slate-500">
                  Registro cronológico de todas las notificaciones, descargas, radicaciones y actos administrativos del expediente.
                </p>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {caso.trazabilidad.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 relative pl-1 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 z-10">
                      {item.fase}
                    </div>
                    <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.actor} <span className="font-normal text-slate-400">({item.rol})</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.fecha}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.accion}
                      </p>
                      {item.documentoRef && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                          <FileText className="w-3 h-3" />
                          <span>Anexo relacionado: {item.documentoRef}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Sistema de Gestión de Deserción y Debido Proceso Formativo · SENA</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
