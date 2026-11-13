import React, { useState } from 'react';
import { ShieldCheck, FileText, Download, CheckCircle2, AlertCircle, Scale, Send, CheckCheck, XCircle, RotateCcw } from 'lucide-react';
import { CaseRecord, UserRole, AttachedPDF, Fase5Recursos } from '../../types/desertion';
import { generateMemorialRecursoPDF, createMockSamplePDF } from '../../utils/pdfGenerator';
import { PDFUploader } from '../PDFUploader';

interface Fase5PanelProps {
  caso: CaseRecord;
  currentRole: UserRole;
  onUpdateRecursos: (updatedFase5: Fase5Recursos) => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const Fase5Panel: React.FC<Fase5PanelProps> = ({
  caso,
  currentRole,
  onUpdateRecursos,
  onViewPDF
}) => {
  const f5 = caso.fase5_recursos;
  const f4 = caso.fase4_acto_administrativo;

  // Interponer Recurso Form states (Aprendiz)
  const [argumentos, setArgumentos] = useState(
    f5.argumentosRecurso ||
      `Por medio del presente memorial, en mi condición de aprendiz matriculado, interpongo en tiempo hábil RECURSO DE REPOSICIÓN contra la Resolución No. ${f4.resolucionNumero || ''}, solicitando respetuosamente su revocatoria o modificación, con fundamento en que mi inasistencia obedeció a hechos sobrevinientes de fuerza mayor acreditados mediante los documentos PDF que se adjuntan.`
  );
  const [recursoPDFs, setRecursoPDFs] = useState<AttachedPDF[]>(f5.pruebasNuevasPdf || []);

  // Resolver Recurso Form states (Subdirector)
  const [decisionRecurso, setDecisionRecurso] = useState<'Confirma' | 'Modifica' | 'Revoca'>(f5.decisionRecurso || 'Modifica');
  const [motivacionFallo, setMotivacionFallo] = useState(
    f5.motivacionDecisionRecurso ||
      'Evaluados los nuevos soportes probatorios allegados por el recurrente en el memorial de reposición, se encuentra acreditada la concurrencia de fuerza mayor / situación de salud no imputable a negligencia, por lo cual este despacho procede a pronunciarse de fondo.'
  );

  // Submit Recurso Handler (Aprendiz)
  const handleRadicarRecurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentos.trim()) {
      alert('Por favor detalle los argumentos y motivos de inconformidad del recurso.');
      return;
    }

    const radicadoRec = `REC-2026-${Math.floor(Math.random() * 900 + 100)}`;
    let docs = [...recursoPDFs];
    if (docs.length === 0) {
      docs.push(
        createMockSamplePDF(
          'memorial_recurso',
          `Memorial_Recurso_Reposicion_${caso.aprendiz.numeroDoc}.pdf`,
          caso.aprendiz.nombre,
          'Memorial sustentado de recurso de reposición con pruebas sobrevinientes'
        )
      );
    }

    const updated: Fase5Recursos = {
      ...f5,
      recursoHabilitado: true,
      recursoInterpuesto: true,
      fechaInterposicion: new Date().toISOString().split('T')[0],
      radicadoRecurso: radicadoRec,
      argumentosRecurso: argumentos,
      pruebasNuevasPdf: docs,
      dentroDeTerminos: true,
      resuelto: false,
      ejecutoriadoEnFirme: false
    };

    onUpdateRecursos(updated);
  };

  // Resolve Recurso Handler (Subdirector)
  const handleResolverRecurso = (e: React.FormEvent) => {
    e.preventDefault();

    const falloDoc = createMockSamplePDF(
      'resolucion_subdirector',
      `Fallo_Recurso_${caso.codigoRadicado}.pdf`,
      'Despacho Subdirector de Centro',
      `Acto administrativo definitivo que resuelve el Recurso de Reposición ${f5.radicadoRecurso}: Decisión ${decisionRecurso}.`
    );

    const updated: Fase5Recursos = {
      ...f5,
      resuelto: true,
      fechaResolucionRecurso: new Date().toISOString().split('T')[0],
      resolucionRecursoNumero: `RES-FALLO-2026-${Math.floor(Math.random() * 800 + 100)}`,
      decisionRecurso,
      motivacionDecisionRecurso: motivacionFallo,
      documentoFalloRecursoPdf: falloDoc,
      ejecutoriadoEnFirme: true
    };

    onUpdateRecursos(updated);
  };

  // Cierre en Firme por no interposición de recurso
  const handleCerrarEnFirme = () => {
    if (confirm('¿Desea certificar la ejecutoria y firmeza de la resolución por no interposición de recursos en el término legal?')) {
      const updated: Fase5Recursos = {
        ...f5,
        recursoInterpuesto: false,
        resuelto: true,
        ejecutoriadoEnFirme: true,
        fechaResolucionRecurso: new Date().toISOString().split('T')[0],
        motivacionDecisionRecurso: 'Vencido el término de cinco (5) días hábiles sin que se hubiere interpuesto recurso de reposición, la Resolución cobra fuerza ejecutoria y queda en firme.'
      };
      onUpdateRecursos(updated);
    }
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
              Fase 5: Interposición de Recursos (Vía Gubernativa) y Firmeza
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Garantía de doble revisión ante la misma autoridad (Recurso de Reposición) dentro de los 5 días hábiles siguientes a la notificación.
            </p>
          </div>
        </div>

        {f5.recursoInterpuesto && (
          <button
            type="button"
            onClick={() => generateMemorialRecursoPDF(caso)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100/50 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            Descargar Memorial del Recurso en PDF
          </button>
        )}
      </div>

      {/* Case Final State Card (if executed) */}
      {f5.ejecutoriadoEnFirme && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                PROCESO CERRADO EN FIRME · VÍA GUBERNATIVA AGOTADA
              </p>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Decisión Definitiva: <strong>{f5.decisionRecurso ? f5.decisionRecurso.toUpperCase() : 'RESOLUCIÓN EN FIRME POR VENCIMIENTO DE TÉRMINOS'}</strong>. El debido proceso se encuentra plenamente surtido.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-800 dark:text-emerald-300">
            {f5.fechaResolucionRecurso}
          </span>
        </div>
      )}

      {/* Sub-step A: Interposición del Recurso por el Aprendiz */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            1. Radicación del Recurso de Reposición por el Aprendiz
          </h5>

          {f5.recursoInterpuesto ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recurso Interpuesto en Término Legal ({f5.radicadoRecurso})
            </span>
          ) : f5.ejecutoriadoEnFirme ? (
            <span className="text-xs text-slate-500 font-medium">Término fenecido sin recurso</span>
          ) : (
            <span className="text-xs text-amber-600 font-semibold">
              Término abierto para interponer recurso
            </span>
          )}
        </div>

        {f5.recursoInterpuesto ? (
          /* Recurso ya radicado: vista detallada */
          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">Radicado Oficial del Recurso:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {f5.radicadoRecurso}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Fecha de radicación: {f5.fechaInterposicion}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 block text-[11px]">Oportunidad Procesal:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {f5.dentroDeTerminos ? 'Interpuesto oportunamente dentro de los 5 días hábiles' : 'Extemporáneo'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Argumentos de Inconformidad y Motivos de Reposición:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {f5.argumentosRecurso}
              </p>
            </div>

            {/* PDFs aportados en el recurso */}
            <div>
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nuevas pruebas documentales en PDF aportadas al recurso ({f5.pruebasNuevasPdf?.length || 0}):
              </p>
              {(!f5.pruebasNuevasPdf || f5.pruebasNuevasPdf.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No se allegaron PDFs nuevos.</p>
              ) : (
                <div className="space-y-1.5">
                  {f5.pruebasNuevasPdf.map((pdf) => (
                    <div
                      key={pdf.id}
                      onClick={() => onViewPDF(pdf)}
                      className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between text-xs group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                          {pdf.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({pdf.fileSize})</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline shrink-0 ml-2">
                        Abrir PDF
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : !f5.ejecutoriadoEnFirme ? (
          /* Formulario para interponer recurso (Rol Aprendiz o Comité) */
          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-4">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {currentRole === 'aprendiz'
                ? 'Como Aprendiz, usted tiene derecho a solicitar la reposición de la decisión al Subdirector dentro de los cinco (5) días hábiles siguientes a la notificación.'
                : 'Permite radicar formalmente el recurso de reposición interpuesto por el aprendiz o su apoderado con nuevas pruebas.'}
            </p>

            <form onSubmit={handleRadicarRecurso} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Fundamento del Recurso y Agravios Causados
                </label>
                <textarea
                  rows={4}
                  value={argumentos}
                  onChange={(e) => setArgumentos(e.target.value)}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>

              {/* PDF Uploader for Recurso evidence */}
              <PDFUploader
                label="Adjuntar archivo PDF del Memorial y Nuevas Pruebas"
                description="Anexe el memorial escaneado o certificados médicos adicionales no valorados."
                currentFiles={recursoPDFs}
                onAddPDF={(newPdf) => setRecursoPDFs([...recursoPDFs, newPdf])}
                onRemovePDF={(id) => setRecursoPDFs(recursoPDFs.filter((p) => p.id !== id))}
                onViewPDF={onViewPDF}
                documentType="memorial_recurso"
                uploaderRoleName={caso.aprendiz.nombre}
                sampleButtonLabel="Cargar muestra PDF de Memorial de Recurso"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleCerrarEnFirme}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                  No interponer recurso · Dejar en firme resolución
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Radicar Formalmente Recurso de Reposición
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>

      {/* Sub-step B: Decisión del Subdirector sobre el Recurso */}
      {f5.recursoInterpuesto && (
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              2. Fallo y Decisión del Subdirector sobre el Recurso de Reposición
            </h5>

            {f5.resuelto ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Recurso Resuelto Definitivamente ({f5.decisionRecurso?.toUpperCase()})
              </span>
            ) : (
              <span className="text-xs text-amber-600 font-semibold">
                Pendiente de fallo por el Subdirector
              </span>
            )}
          </div>

          {f5.resuelto ? (
            /* Vista del fallo emitido */
            <div className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Sentido de la Decisión:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase">
                    {f5.decisionRecurso}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Resolución que Resuelve:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {f5.resolucionRecursoNumero}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[11px]">Fecha del Fallo:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {f5.fechaResolucionRecurso}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Motivación Definitiva del Despacho:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {f5.motivacionDecisionRecurso}
                </p>
              </div>

              {f5.documentoFalloRecursoPdf && (
                <div className="pt-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Acto Administrativo Definitivo del Recurso (PDF):
                  </span>
                  <div
                    onClick={() => onViewPDF(f5.documentoFalloRecursoPdf!)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between text-xs group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                        {f5.documentoFalloRecursoPdf.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline shrink-0 ml-2">
                      Abrir PDF del Fallo
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Formulario para que el Subdirector resuelva el recurso */
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Como Subdirector de Centro, analice las nuevas pruebas y dicte providencia motivada que agota la vía administrativa:
              </p>

              <form onSubmit={handleResolverRecurso} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Sentido del Fallo sobre el Recurso de Reposición:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      {
                        id: 'Modifica',
                        label: 'MODIFICAR LA SANCIÓN',
                        desc: 'Conmuta a Plan de Mejoramiento concertado con matrícula condicional.',
                        icon: RotateCcw,
                        color: 'text-amber-700'
                      },
                      {
                        id: 'Revoca',
                        label: 'REVOCAR LA RESOLUCIÓN',
                        desc: 'Deja sin efectos la sanción y ordena reintegro formativo inmediato.',
                        icon: CheckCircle2,
                        color: 'text-emerald-700'
                      },
                      {
                        id: 'Confirma',
                        label: 'CONFIRMAR LA RESOLUCIÓN',
                        desc: 'Desestima el recurso y ratifica la cancelación de matrícula.',
                        icon: XCircle,
                        color: 'text-rose-700'
                      }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDecisionRecurso(opt.id as any)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          decisionRecurso === opt.id
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <p className={`font-bold text-xs ${opt.color}`}>{opt.label}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Motivación Jurídica y Fáctica del Fallo Definitivo
                  </label>
                  <textarea
                    rows={3}
                    value={motivacionFallo}
                    onChange={(e) => setMotivacionFallo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Expedir Fallo Definitivo y Dejar en Firme Proceso
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
