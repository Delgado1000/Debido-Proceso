import React, { useState } from 'react';
import { Users, FileCheck, Download, CheckCircle2, ShieldCheck, Scale, ArrowRight, FileText } from 'lucide-react';
import { CaseRecord, UserRole, AttachedPDF, Fase3Recomendacion } from '../../types/desertion';
import { generateActaComitePDF, createMockSamplePDF } from '../../utils/pdfGenerator';
import { PDFUploader } from '../PDFUploader';

interface Fase3PanelProps {
  caso: CaseRecord;
  currentRole: UserRole;
  onUpdateRecomendacion: (updatedFase3: Fase3Recomendacion) => void;
  onAdvanceToPhase4: () => void;
  onViewPDF: (pdf: AttachedPDF) => void;
}

export const Fase3Panel: React.FC<Fase3PanelProps> = ({
  caso,
  currentRole,
  onUpdateRecomendacion,
  onAdvanceToPhase4,
  onViewPDF
}) => {
  const f3 = caso.fase3_recomendacion;

  // Form states
  const [actaNumero, setActaNumero] = useState(f3.actaNumero || `ACT-2026-${Math.floor(Math.random() * 80 + 10)}`);
  const [tipificacion, setTipificacion] = useState<'Academica' | 'Disciplinaria' | 'Mixta'>(f3.tipificacionFalta || 'Academica');
  const [calificacion, setCalificacion] = useState<'Leve' | 'Grave' | 'Gravísima'>(f3.calificacionFalta || 'Grave');
  const [recomendacionFinal, setRecomendacionFinal] = useState<Fase3Recomendacion['recomendacionFinal']>(
    f3.recomendacionFinal || 'Cancelacion_Matricula'
  );
  const [justificacion, setJustificacion] = useState(
    f3.justificacionRecomendacion ||
      'Analizadas las evidencias y descargos obrantes en el expediente, se comprueba que el aprendiz incurrió en causal de deserción reglamentaria por inasistencias injustificadas, afectando los resultados de aprendizaje proyectados.'
  );
  const [atenuanteSeleccionado, setAtenuanteSeleccionado] = useState(f3.atenuantes?.[0] || 'Ninguno demostrado');
  const [agravanteSeleccionado, setAgravanteSeleccionado] = useState(f3.agravantes?.[0] || 'Desatención a requerimientos formativos');
  const [inhabilidadMeses, setInhabilidadMeses] = useState(f3.terminoInhabilidadMeses || 6);
  const [actaPDFs, setActaPDFs] = useState<AttachedPDF[]>(f3.actaComitePdf ? [f3.actaComitePdf] : []);

  const handleEmitirRecomendacion = (e: React.FormEvent) => {
    e.preventDefault();

    let actaDoc = actaPDFs[0];
    if (!actaDoc) {
      actaDoc = createMockSamplePDF(
        'acta_comite',
        `Acta_${actaNumero}_Recomendacion_Comite.pdf`,
        'Secretaría Técnica del Comité',
        `Acta oficial del Comité con calificación de falta ${calificacion} y recomendación técnica al Subdirector.`
      );
    }

    const updated: Fase3Recomendacion = {
      ...f3,
      sesionRealizada: true,
      fechaSesion: new Date().toISOString().split('T')[0],
      actaNumero,
      miembrosParticipantes: [
        'Coordinador Académico (Presidente)',
        'Representante de Bienestar al Aprendiz',
        'Vocero de Aprendices de Centro',
        `${caso.instructor.nombre} (Instructor Técnico)`
      ],
      tipificacionFalta: tipificacion,
      calificacionFalta: calificacion,
      atenuantes: [atenuanteSeleccionado],
      agravantes: [agravanteSeleccionado],
      recomendacionFinal,
      justificacionRecomendacion: justificacion,
      terminoInhabilidadMeses: recomendacionFinal === 'Cancelacion_Matricula' ? inhabilidadMeses : undefined,
      actaComitePdf: actaDoc
    };

    onUpdateRecomendacion(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Fase 3: Recomendación del Comité según la Calificación de la Falta
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              El Comité de Evaluación y Seguimiento califica la falta según criterios de graduación y emite concepto técnico al Subdirector.
            </p>
          </div>
        </div>

        {f3.sesionRealizada && (
          <button
            type="button"
            onClick={() => generateActaComitePDF(caso)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 rounded-lg hover:bg-emerald-100/50 transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            Descargar Acta del Comité en PDF
          </button>
        )}
      </div>

      {f3.sesionRealizada ? (
        /* Vista de Dictamen Ya Emitido */
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Acta de Sesión No. {f3.actaNumero} · {f3.fechaSesion}
            </h5>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Recomendación Emitida y Notificada al Despacho
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Tipificación de la Falta:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Falta {f3.tipificacionFalta}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Calificación:</span>
              <span className="font-semibold text-rose-700 dark:text-rose-400">
                {f3.calificacionFalta}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block text-[11px]">Recomendación Final:</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                {f3.recomendacionFinal === 'Cancelacion_Matricula'
                  ? `Cancelación de Matrícula (${f3.terminoInhabilidadMeses || 6} meses)`
                  : f3.recomendacionFinal === 'Plan_Mejoramiento'
                  ? 'Plan de Mejoramiento Concertado'
                  : f3.recomendacionFinal === 'Llamado_Atencion'
                  ? 'Llamado de Atención por Escrito'
                  : 'Archivo del Expediente'}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="text-slate-400 block text-[11px] font-semibold">
              Motivación Técnica y Consideraciones del Comité:
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {f3.justificacionRecomendacion}
            </p>
          </div>

          {/* Acta PDF */}
          {f3.actaComitePdf && (
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Documento Oficial del Acta (PDF):
              </span>
              <div
                onClick={() => onViewPDF(f3.actaComitePdf!)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {f3.actaComitePdf.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {f3.actaComitePdf.fileSize} · Hash: <span className="font-mono">{f3.actaComitePdf.verificationHash}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 underline shrink-0 ml-2">
                  Abrir Acta en PDF
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Formulario para que el Comité sesione y califique */
        <div className="bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Sesión de Deliberación y Dictamen del Comité de Evaluación
            </h5>
            <p className="text-xs text-slate-500 mt-1">
              Ponderación de los hechos denunciados vs descargos presentados por el aprendiz, aplicando los criterios de los Artículos 28 y 29 del Reglamento del Aprendiz.
            </p>
          </div>

          <form onSubmit={handleEmitirRecomendacion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Número de Acta
                </label>
                <input
                  type="text"
                  value={actaNumero}
                  onChange={(e) => setActaNumero(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tipificación de la Falta
                </label>
                <select
                  value={tipificacion}
                  onChange={(e) => setTipificacion(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="Academica">Falta Académica</option>
                  <option value="Disciplinaria">Falta Disciplinaria</option>
                  <option value="Mixta">Falta Académica y Disciplinaria</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Calificación de la Falta
                </label>
                <select
                  value={calificacion}
                  onChange={(e) => setCalificacion(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-100"
                >
                  <option value="Leve">Leve</option>
                  <option value="Grave">Grave</option>
                  <option value="Gravísima">Gravísima</option>
                </select>
              </div>
            </div>

            {/* Atenuantes y Agravantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Criterio Atenuante Identificado
                </label>
                <select
                  value={atenuanteSeleccionado}
                  onChange={(e) => setAtenuanteSeleccionado(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="Ninguno demostrado">Ninguno demostrado</option>
                  <option value="Fuerza mayor o caso fortuito sobreviniente">Fuerza mayor o caso fortuito sobreviniente</option>
                  <option value="Primer requerimiento durante la formación">Primer requerimiento durante la formación</option>
                  <option value="Aporte oportuno de soporte médico EPS">Aporte oportuno de soporte médico EPS</option>
                  <option value="Voluntad manifiesta de nivelación académica">Voluntad manifiesta de nivelación académica</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Criterio Agravante Identificado
                </label>
                <select
                  value={agravanteSeleccionado}
                  onChange={(e) => setAgravanteSeleccionado(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="Desatención a requerimientos formativos">Desatención a requerimientos formativos</option>
                  <option value="No comparecencia injustificada a la citación">No comparecencia injustificada a la citación</option>
                  <option value="Afectación a la continuidad de la ruta formativa">Afectación a la continuidad de la ruta formativa</option>
                  <option value="Reincidencia en inasistencias en trimestres previos">Reincidencia en inasistencias en trimestres previos</option>
                </select>
              </div>
            </div>

            {/* Medida / Recomendación técnica */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Recomendación Formal del Comité al Subdirector de Centro:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'Cancelacion_Matricula', label: 'Cancelación de Matrícula', desc: 'Inhabilidad de 6 a 12 meses' },
                  { id: 'Plan_Mejoramiento', label: 'Plan de Mejoramiento', desc: 'Concertación y seguimiento' },
                  { id: 'Llamado_Atencion', label: 'Llamado por Escrito', desc: 'Copia a la hoja de vida' },
                  { id: 'Archivo_Expediente', label: 'Archivo del Expediente', desc: 'Justificación demostrada' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRecomendacionFinal(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      recomendacionFinal === item.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="font-semibold text-xs leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>

              {recomendacionFinal === 'Cancelacion_Matricula' && (
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Término de Inhabilidad SENA recomendado:
                  </label>
                  <select
                    value={inhabilidadMeses}
                    onChange={(e) => setInhabilidadMeses(Number(e.target.value))}
                    className="text-xs p-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value={6}>6 Meses de inhabilidad</option>
                    <option value={12}>12 Meses de inhabilidad</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Justificación Técnica de la Recomendación en el Acta
              </label>
              <textarea
                rows={3}
                value={justificacion}
                onChange={(e) => setJustificacion(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
              />
            </div>

            {/* Carga o vinculación del Acta PDF */}
            <PDFUploader
              label="Cargar archivo PDF del Acta del Comité firmada (Opcional)"
              description="Si ya cuenta con el acta firmada por los miembros, adjúntela aquí o use el generador automático."
              currentFiles={actaPDFs}
              onAddPDF={(newPdf) => setActaPDFs([newPdf])}
              onRemovePDF={() => setActaPDFs([])}
              onViewPDF={onViewPDF}
              documentType="acta_comite"
              uploaderRoleName="Comité de Evaluación y Seguimiento"
              sampleButtonLabel="Cargar muestra PDF de Acta de Comité"
            />

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Aprobar Acta y Remitir al Despacho del Subdirector
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Button to Advance to Phase 4 */}
      {caso.currentPhase === 3 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              ¿Recomendación del Comité formalizada?
            </p>
            <p className="text-[11px] text-slate-500">
              Corresponde al Subdirector de Centro proferir el Acto Administrativo Motivado que adopta la decisión de fondo.
            </p>
          </div>

          <button
            type="button"
            onClick={onAdvanceToPhase4}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>Pasar a Fase 4: Expedir Acto Administrativo Motivado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
