import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Send, Download, CheckCircle2, ShieldAlert, FileText, ArrowRight, UploadCloud, User } from 'lucide-react';
import { CaseRecord, UserRole, AttachedPDF, Fase2Citacion } from '../../types/desertion';
import { generateCitacionComitePDF, createMockSamplePDF } from '../../utils/pdfGenerator';
import { PDFUploader } from '../PDFUploader';

interface Fase2PanelProps {
  caso: CaseRecord;
  currentRole: UserRole;
  onUpdateCitacion: (updatedFase2: Fase2Citacion) => void;
  onAdvanceToPhase3: () => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const Fase2Panel: React.FC<Fase2PanelProps> = ({
  caso,
  currentRole,
  onUpdateCitacion,
  onAdvanceToPhase3,
  onViewPDF
}) => {
  const f2 = caso.fase2_citacion;

  // State for Citation Form (Comité)
  const [fechaAudiencia, setFechaAudiencia] = useState(f2.fechaAudiencia || '2026-02-18');
  const [horaAudiencia, setHoraAudiencia] = useState(f2.horaAudiencia || '09:00 AM');
  const [lugarOEnlace, setLugarOEnlace] = useState(f2.lugarOEnlace || 'Sala de Comités 201 / Sesión Virtual Teams');
  const [cargos, setCargos] = useState(
    f2.cargosImputados ||
      `Presunta deserción del proceso formativo en el programa ${caso.aprendiz.programa}, al configurarse inasistencia injustificada de más de tres (3) días consecutivos conforme al Art. 22 del Reglamento del Aprendiz SENA.`
  );

  // State for Descargos Form (Aprendiz / Comité)
  const [textoDescargos, setTextoDescargos] = useState(f2.textoDescargos || '');
  const [asistioAudiencia, setAsistioAudiencia] = useState(f2.asistioAudiencia ?? true);
  const [descargosPDFs, setDescargosPDFs] = useState<AttachedPDF[]>(f2.soporteDescargosPdf || []);
  const [showDescargosForm, setShowDescargosForm] = useState(false);

  // Emit Citation Handler
  const handleEmitirCitacion = () => {
    const citacionPdf = createMockSamplePDF(
      'citacion_oficial',
      `Citacion_Comite_${caso.codigoRadicado}.pdf`,
      'Secretaría Técnica del Comité',
      'Oficio de citación formal a audiencia de debido proceso con formulación de cargos y términos probatorios'
    );

    const updated: Fase2Citacion = {
      ...f2,
      citacionEmitida: true,
      fechaEmision: new Date().toISOString().split('T')[0],
      fechaAudiencia,
      horaAudiencia,
      lugarOEnlace,
      responsableCitacion: 'Comité de Evaluación y Seguimiento',
      cargosImputados: cargos,
      garantiasLegales: 'Art. 29 Constitución Política de Colombia y Arts. 22, 28 y 29 del Reglamento del Aprendiz (Acuerdo 007/2012).',
      documentoCitacionPdf: citacionPdf
    };

    onUpdateCitacion(updated);
  };

  // Submit Descargos Handler
  const handleRadicarDescargos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoDescargos.trim() && descargosPDFs.length === 0) {
      alert('Por favor ingrese el texto de descargos o adjunte un documento PDF de soporte.');
      return;
    }

    const updated: Fase2Citacion = {
      ...f2,
      descargosPresentados: true,
      fechaDescargos: new Date().toISOString().split('T')[0],
      modalidadDescargos: 'escrito',
      textoDescargos,
      asistioAudiencia,
      soporteDescargosPdf: descargosPDFs
    };

    onUpdateCitacion(updated);
    setShowDescargosForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Fase 2: Citación al Comité y Garantía del Derecho a ser Escuchado (Descargos)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              El debido proceso exige comunicación formal previa, término prudencial de defensa y audiencia o recepción de pruebas.
            </p>
          </div>
        </div>

        {f2.citacionEmitida && (
          <button
            type="button"
            onClick={() => generateCitacionComitePDF(caso)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100/50 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            Descargar Citación Oficial en PDF
          </button>
        )}
      </div>

      {/* Part 1: Citación al Comité */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            1. Citación Oficial al Comité de Evaluación y Seguimiento
          </h5>

          {f2.citacionEmitida ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Citación Notificada Formalmente
            </span>
          ) : (
            <span className="text-xs text-amber-600 font-semibold">
              Pendiente de emisión por el Comité
            </span>
          )}
        </div>

        {f2.citacionEmitida ? (
          /* Citación ya emitida: Vista informativa */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Fecha y Hora de la Sesión:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {f2.fechaAudiencia} a las {f2.horaAudiencia}
              </p>
              <span className="text-[10px] text-slate-400 block">
                Emitida el: {f2.fechaEmision}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Lugar / Canal Oficial:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {f2.lugarOEnlace}
              </p>
              <span className="text-[10px] text-slate-400 block">
                Responsable: {f2.responsableCitacion}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-slate-400 block text-[11px]">Documento Anexo:</span>
              {f2.documentoCitacionPdf ? (
                <button
                  type="button"
                  onClick={() => onViewPDF(f2.documentoCitacionPdf!)}
                  className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  Ver Citación Oficial en PDF
                </button>
              ) : (
                <span className="text-slate-400">PDF en archivo físico</span>
              )}
            </div>

            <div className="md:col-span-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px] font-semibold mb-1">
                Formulación de Cargos Notificados al Aprendiz:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {f2.cargosImputados}
              </p>
            </div>
          </div>
        ) : (
          /* Formulario para emitir citación (Rol Comité) */
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Diligencie los parámetros de la sesión de audiencia para notificar formalmente al aprendiz:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fecha de la Audiencia
                </label>
                <input
                  type="date"
                  value={fechaAudiencia}
                  onChange={(e) => setFechaAudiencia(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Hora de Citación
                </label>
                <input
                  type="text"
                  value={horaAudiencia}
                  onChange={(e) => setHoraAudiencia(e.target.value)}
                  placeholder="Ej: 09:30 AM"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lugar o Enlace de Conexión
                </label>
                <input
                  type="text"
                  value={lugarOEnlace}
                  onChange={(e) => setLugarOEnlace(e.target.value)}
                  placeholder="Ej: Sala de Juntas Centro / Teams"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Formulación de Cargos y Hechos Imputados
                </label>
                <textarea
                  rows={3}
                  value={cargos}
                  onChange={(e) => setCargos(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleEmitirCitacion}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Generar Citación Oficial y Notificar al Aprendiz
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Derecho a ser Escuchado (Descargos del Aprendiz) */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              2. Derecho a ser Escuchado · Radicación de Descargos y Pruebas
            </h5>
            <p className="text-[11px] text-slate-500">
              Garantía procesal: El aprendiz puede presentar justificación verbal en audiencia o radicar escrito con soportes en PDF.
            </p>
          </div>

          {f2.descargosPresentados ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Descargos Radicados en el Expediente
            </span>
          ) : (
            <span className="text-xs text-amber-600 font-semibold">
              En término probatorio / Esperando descargos
            </span>
          )}
        </div>

        {f2.descargosPresentados ? (
          /* Descargos ya radicados: vista informativa */
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Descargos presentados el {f2.fechaDescargos} ({f2.modalidadDescargos === 'escrito' ? 'Por Escrito' : 'En Audiencia'})
                </span>
                <span className="text-slate-500">
                  Comparecencia: {f2.asistioAudiencia ? 'Asistió a la citación' : 'No compareció'}
                </span>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700">
                {f2.textoDescargos || 'Sin alegato textual registrado.'}
              </div>

              {/* Soportes PDF aportados por el aprendiz */}
              <div>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pruebas documentales en PDF aportadas por el aprendiz ({f2.soporteDescargosPdf?.length || 0}):
                </p>
                {(!f2.soporteDescargosPdf || f2.soporteDescargosPdf.length === 0) ? (
                  <p className="text-xs text-slate-400 italic">No aportó documentos PDF adicionales.</p>
                ) : (
                  <div className="space-y-1.5">
                    {f2.soporteDescargosPdf.map((pdf) => (
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
                          Visualizar PDF
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Formulario para radicar descargos */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
              <p className="text-xs text-slate-700 dark:text-slate-300 mb-3">
                {currentRole === 'aprendiz'
                  ? 'Como Aprendiz, usted se encuentra en término para exponer los motivos de su ausencia y allegar las pruebas que demuestren fuerza mayor o justificación válida (ej: incapacidad médica de EPS).'
                  : 'Registrar la recepción de descargos del aprendiz (presentados por escrito o rendidos en audiencia) y adjuntar soportes PDF.'}
              </p>

              <form onSubmit={handleRadicarDescargos} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                    Exposición de Descargos y Justificación de las Inasistencias
                  </label>
                  <textarea
                    rows={4}
                    value={textoDescargos}
                    onChange={(e) => setTextoDescargos(e.target.value)}
                    placeholder="Escriba aquí los hechos, motivos de fuerza mayor, calamidad o situación médica que impidió la asistencia..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                  />
                </div>

                {/* PDF Uploader for apprentice evidence */}
                <PDFUploader
                  label="Adjuntar archivo PDF de soporte probatorio (Incapacidad médica EPS, constancia laboral o calamidad)"
                  description="Cargue el archivo PDF emitido por la EPS o autoridad competente para validar la justificación."
                  currentFiles={descargosPDFs}
                  onAddPDF={(newPdf) => setDescargosPDFs([...descargosPDFs, newPdf])}
                  onRemovePDF={(id) => setDescargosPDFs(descargosPDFs.filter((p) => p.id !== id))}
                  onViewPDF={onViewPDF}
                  documentType="incapacidad_eps"
                  uploaderRoleName={caso.aprendiz.nombre}
                  sampleButtonLabel="Cargar muestra PDF de Incapacidad EPS"
                />

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={asistioAudiencia}
                      onChange={(e) => setAsistioAudiencia(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>El aprendiz compareció o envió apoderado a la audiencia</span>
                  </label>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Radicar Descargos y Custodiar en Expediente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Button to Advance to Phase 3 (Comité) */}
      {caso.currentPhase === 2 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              ¿Finalizada la etapa probatoria y de descargos?
            </p>
            <p className="text-[11px] text-slate-500">
              El Comité de Evaluación y Seguimiento procederá a deliberar, calificar la falta y redactar el Acta de Recomendación.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdvanceToPhase3}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>Pasar a Fase 3: Deliberación y Recomendación del Comité</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
