import React, { useState } from 'react';
import { Scale, FileText, Download, CheckCircle2, ShieldCheck, ArrowRight, Stamp, Send, AlertCircle } from 'lucide-react';
import { CaseRecord, UserRole, AttachedPDF, Fase4ActoAdministrativo } from '../../types/desertion';
import { generateResolucionSubdirectorPDF, createMockSamplePDF } from '../../utils/pdfGenerator';
import { PDFUploader } from '../PDFUploader';

interface Fase4PanelProps {
  caso: CaseRecord;
  currentRole: UserRole;
  onUpdateActo: (updatedFase4: Fase4ActoAdministrativo) => void;
  onAdvanceToPhase5: () => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const Fase4Panel: React.FC<Fase4PanelProps> = ({
  caso,
  currentRole,
  onUpdateActo,
  onAdvanceToPhase5,
  onViewPDF
}) => {
  const f4 = caso.fase4_acto_administrativo;

  // Form states for Subdirector
  const [resolucionNum, setResolucionNum] = useState(f4.resolucionNumero || `RES-2026-${Math.floor(Math.random() * 900 + 100)}`);
  const [subdirectorNombre, setSubdirectorNombre] = useState(f4.subdirectorNombre || 'Dr. Hernando Gómez Barreto');
  const [decision, setDecision] = useState<Fase4ActoAdministrativo['decisionSancion']>(
    f4.decisionSancion ||
      (caso.fase3_recomendacion.recomendacionFinal === 'Plan_Mejoramiento'
        ? 'Plan_Mejoramiento'
        : caso.fase3_recomendacion.recomendacionFinal === 'Archivo_Expediente'
        ? 'Exoneracion_Archivo'
        : 'Cancelacion_Matricula')
  );
  const [inhabilidadMeses, setInhabilidadMeses] = useState(f4.inhabilidadMeses || caso.fase3_recomendacion.terminoInhabilidadMeses || 6);
  const [formaNotificacion, setFormaNotificacion] = useState(f4.formaNotificacion || 'Correo_Electronico_Certificado');
  const [considerandoHechos, setConsiderandoHechos] = useState(
    f4.considerandoHechos ||
      `Que reposa en el expediente informe del instructor y acta de Comité No. ${caso.fase3_recomendacion.actaNumero || 'ACT-2026'}, donde se comprobó la inasistencia injustificada del aprendiz ${caso.aprendiz.nombre} durante ${caso.fase1_informe.diasInasistenciaConsecutivos} días consecutivos, habiéndose garantizado el derecho de defensa.`
  );
  const [considerandoDerecho, setConsiderandoDerecho] = useState(
    f4.considerandoDerecho ||
      'Que el artículo 29 de la Constitución Política garantiza el debido proceso; que el Acuerdo 007 de 2012 facultó al Subdirector de Centro para decidir las sanciones formativas mediante acto administrativo motivado.'
  );
  const [resolucionPDFs, setResolucionPDFs] = useState<AttachedPDF[]>(f4.documentoResolucionPdf ? [f4.documentoResolucionPdf] : []);

  const handleEmitirResolucion = (e: React.FormEvent) => {
    e.preventDefault();

    let resPdf = resolucionPDFs[0];
    if (!resPdf) {
      resPdf = createMockSamplePDF(
        'resolucion_subdirector',
        `Resolucion_${resolucionNum}_Subdireccion.pdf`,
        `Despacho Subdirector - ${subdirectorNombre}`,
        `Acto administrativo motivado de decisión sancionatoria con firma digital reglamentaria y notificación de recursos.`
      );
    }

    const hoy = new Date().toISOString().split('T')[0];
    // Fecha límite para interponer recurso: 5 días hábiles (~7 días calendario)
    const fechaLim = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const updated: Fase4ActoAdministrativo = {
      ...f4,
      resolucionEmitida: true,
      resolucionNumero: resolucionNum,
      fechaExpedicion: hoy,
      subdirectorNombre,
      considerandoHechos,
      considerandoDerecho,
      decisionSancion: decision,
      inhabilidadMeses: decision === 'Cancelacion_Matricula' ? inhabilidadMeses : undefined,
      resolucionFirmada: true,
      documentoResolucionPdf: resPdf,
      fechaNotificacion: hoy,
      formaNotificacion,
      fechaLimiteRecurso: fechaLim
    };

    onUpdateActo(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Fase 4: Emisión de Acto Administrativo Motivado de Decisión
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Privativo del Subdirector de Centro. Todo acto sancionatorio debe ser motivado (fáctica y jurídicamente) y notificado con indicación de recursos.
            </p>
          </div>
        </div>

        {f4.resolucionEmitida && (
          <button
            type="button"
            onClick={() => generateResolucionSubdirectorPDF(caso)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100/50 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            Descargar Resolución Oficial en PDF
          </button>
        )}
      </div>

      {f4.resolucionEmitida ? (
        /* Vista de Resolución Ya Expedida */
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stamp className="w-4 h-4 text-emerald-600" />
              <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Resolución No. {f4.resolucionNumero} · Expedida el {f4.fechaExpedicion}
              </h5>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Acto Administrativo Firmado y Notificado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Decisión de Fondo:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {f4.decisionSancion === 'Cancelacion_Matricula'
                  ? `Cancelación de Matrícula (Inhabilidad: ${f4.inhabilidadMeses || 6} meses)`
                  : f4.decisionSancion === 'Plan_Mejoramiento'
                  ? 'Plan de Mejoramiento Formativo'
                  : 'Exoneración y Archivo'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Firma Subdirector:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {f4.subdirectorNombre}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mt-0.5">
                Certificado Digital Válido
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Notificación al Aprendiz:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {f4.formaNotificacion?.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Término legal vence el: <strong className="text-rose-600 dark:text-rose-400">{f4.fechaLimiteRecurso}</strong>
              </span>
            </div>
          </div>

          {/* Considerandos */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Considerandos de Hecho:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {f4.considerandoHechos}
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Fundamentos de Derecho y Debido Proceso:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {f4.considerandoDerecho}
              </p>
            </div>
          </div>

          {/* Documento PDF adjunto */}
          {f4.documentoResolucionPdf && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Documento de Resolución Oficial (PDF):
              </span>
              <div
                onClick={() => onViewPDF(f4.documentoResolucionPdf!)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {f4.documentoResolucionPdf.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {f4.documentoResolucionPdf.fileSize} · Hash: <span className="font-mono">{f4.documentoResolucionPdf.verificationHash}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline shrink-0 ml-2">
                  Abrir Resolución en PDF
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Formulario para que el Subdirector proyecte y emita la Resolución */
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Proyección y Firma de Resolución Sancionatoria Motivada
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              Despacho de Subdirección: Fundamente la decisión con arreglo a las constancias fácticas y al Acuerdo 007 de 2012.
            </p>
          </div>

          <form onSubmit={handleEmitirResolucion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Número de Resolución Oficial
                </label>
                <input
                  type="text"
                  value={resolucionNum}
                  onChange={(e) => setResolucionNum(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre del Subdirector de Centro
                </label>
                <input
                  type="text"
                  value={subdirectorNombre}
                  onChange={(e) => setSubdirectorNombre(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Forma de Notificación Legal
                </label>
                <select
                  value={formaNotificacion}
                  onChange={(e) => setFormaNotificacion(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="Correo_Electronico_Certificado">Correo Electrónico Certificado</option>
                  <option value="Personal">Notificación Personal</option>
                  <option value="Aviso">Notificación por Aviso Web</option>
                </select>
              </div>
            </div>

            {/* Decisión del Subdirector */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Parte Resolutiva · Decisión de Fondo del Acto Administrativo:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    id: 'Cancelacion_Matricula',
                    label: 'Cancelar Matrícula',
                    desc: 'Sanción definitiva e inhabilidad para inscribirse en el SENA'
                  },
                  {
                    id: 'Plan_Mejoramiento',
                    label: 'Plan de Mejoramiento',
                    desc: 'Acepta atenuantes y ordena suscripción de compromisos'
                  },
                  {
                    id: 'Exoneracion_Archivo',
                    label: 'Exonerar y Archivar',
                    desc: 'Reconoce fuerza mayor plenamente probada'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDecision(item.id as any)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      decision === item.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-xs">{item.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>

              {decision === 'Cancelacion_Matricula' && (
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Término de Inhabilidad en Convocatorias SENA:
                  </label>
                  <select
                    value={inhabilidadMeses}
                    onChange={(e) => setInhabilidadMeses(Number(e.target.value))}
                    className="text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value={6}>6 Meses de Inhabilidad</option>
                    <option value={12}>12 Meses de Inhabilidad</option>
                  </select>
                </div>
              )}
            </div>

            {/* Considerandos textareas */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Considerandos Fácticos (Hechos probados en la instrucción)
                </label>
                <textarea
                  rows={2}
                  value={considerandoHechos}
                  onChange={(e) => setConsiderandoHechos(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Considerandos Jurídicos (Normativa aplicable y garantías procesales)
                </label>
                <textarea
                  rows={2}
                  value={considerandoDerecho}
                  onChange={(e) => setConsiderandoDerecho(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>
            </div>

            {/* Carga del PDF de Resolución (Opcional) */}
            <PDFUploader
              label="Cargar archivo PDF de la Resolución con firma manuscrita/digital (Opcional)"
              description="Si cuenta con el documento escaneado con sellos de radicación, cárguelo aquí."
              currentFiles={resolucionPDFs}
              onAddPDF={(newPdf) => setResolucionPDFs([newPdf])}
              onRemovePDF={() => setResolucionPDFs([])}
              onViewPDF={onViewPDF}
              documentType="resolucion_subdirector"
              uploaderRoleName="Despacho del Subdirector de Centro"
              sampleButtonLabel="Cargar muestra PDF de Resolución Firmada"
            />

            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Al expedir este acto administrativo, el aprendiz dispondrá de un término perentorio de <strong>cinco (5) días hábiles</strong> contados a partir de su notificación para interponer el <strong>Recurso de Reposición</strong>.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <Stamp className="w-3.5 h-3.5" />
                Firmar Digitalmente y Notificar Resolución de Decisión
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to Advance to Phase 5 */}
      {caso.currentPhase === 4 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              ¿Resolución debidamente notificada al aprendiz?
            </p>
            <p className="text-[11px] text-slate-500">
              Se abre el término legal para la interposición de recursos o declaratoria de firmeza (Fase 5).
            </p>
          </div>

          <button
            type="button"
            onClick={onAdvanceToPhase5}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>Pasar a Fase 5: Etapa de Recursos (Vía Gubernativa)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
