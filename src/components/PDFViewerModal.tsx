import React from 'react';
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer, Calendar, User } from 'lucide-react';
import { AttachedPDF } from '../types/desertion';

interface PDFViewerModalProps {
  pdf: AttachedPDF | null;
  onClose: () => void;
  onDownload?: (pdf: AttachedPDF) => void;
}

export const PDFViewerModal: React.FC<PDFViewerModalProps> = ({ pdf, onClose, onDownload }) => {
  if (!pdf) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {pdf.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pdf.fileSize} · Subido el {pdf.uploadDate} por {pdf.uploadedBy}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={() => onDownload(pdf)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Descargar archivo"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Imprimir vista"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Verification Banner */}
        <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Firma e integridad digital validada · Radicado procesal con validez jurídica</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
            {pdf.verificationHash}
          </span>
        </div>

        {/* PDF Simulated Sheet Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950 flex justify-center">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 p-8 rounded-sm text-slate-800 dark:text-slate-200 text-sm font-sans relative min-h-[500px]">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4 select-none">
              <span className="text-7xl font-extrabold rotate-[-30deg] tracking-widest text-slate-900 dark:text-white uppercase">
                EXPEDIENTE SENA
              </span>
            </div>

            {/* Document Header inside sheet */}
            <div className="border-b-2 border-emerald-700 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-emerald-800 dark:text-emerald-400 uppercase">
                    Servicio Nacional de Aprendizaje SENA
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dirección de Formación Profesional · Expediente de Debido Proceso
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block">
                    FOLIO 01 / {pdf.pagesCount || 1}
                  </span>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 uppercase">
                    ANEXO OFICIAL
                  </span>
                </div>
              </div>
            </div>

            {/* Document Meta grid */}
            <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 mb-6 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Tipo de documento:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                  {pdf.type.replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Identificador criptográfico:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                  {pdf.verificationHash}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Cargado por:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{pdf.uploadedBy}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Fecha y hora de radicación:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{pdf.uploadDate}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded border border-emerald-100 dark:border-emerald-900/30">
                <p className="font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                  Descripción y Resumen del Documento:
                </p>
                <p>{pdf.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-semibold text-slate-900 dark:text-slate-100">Contenido Certificado del Folio:</p>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700 font-mono text-[11px] whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300">
                  {pdf.contentPreview ||
                    `Documento electrónico PDF archivado conforme a las disposiciones del Acuerdo 007 de 2012.\n\nSoporte documental adjunto para constancia dentro del expediente disciplinario formativo.\nCertifica: Cumplimiento de términos y validación del equipo instructor.`}
                </div>
              </div>

              {/* Digital signature simulation */}
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-8 flex justify-between items-end">
                <div>
                  <div className="w-44 border-b border-slate-400 dark:border-slate-600 pb-1 mb-1 font-mono text-emerald-800 dark:text-emerald-400 text-xs italic">
                    /// FIRMADO DIGITALMENTE ///
                  </div>
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">{pdf.uploadedBy}</p>
                  <p className="text-[10px] text-slate-400">Responsable de custodia procesal</p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  SISTEMA DE GESTIÓN DOCUMENTAL<br />
                  EXPEDIENTE VERIFICADO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Visualizador de Evidencias Digitales · Formato PDF Estándar</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
