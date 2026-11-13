import React, { useState } from 'react';
import { X, Send, AlertTriangle, FileText, CheckCircle2, User, Calendar, BookOpen, Database } from 'lucide-react';
import { CaseRecord, AttachedPDF } from '../types/desertion';
import { createMockSamplePDF } from '../utils/pdfGenerator';
import { PDFUploader } from './PDFUploader';
import { SenaDatabase } from '../db/database';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newCase: CaseRecord) => void;
  database?: SenaDatabase;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({ isOpen, onClose, onSubmit, database }) => {
  if (!isOpen) return null;

  // Form states
  const [aprendizNombre, setAprendizNombre] = useState('');
  const [tipoDoc, setTipoDoc] = useState('C.C.');
  const [numeroDoc, setNumeroDoc] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [programa, setPrograma] = useState('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
  const [ficha, setFicha] = useState('2849102');
  const [jornada, setJornada] = useState('Diurna');
  const [centro, setCentro] = useState('Centro de Biotecnología Industrial');
  const [regional, setRegional] = useState('Valle del Cauca');

  const [instructorNombre, setInstructorNombre] = useState('Ing. Wilson Alberto Garcés');
  const [instructorCargo, setInstructorCargo] = useState('Instructor Vocero de Ficha');
  const [instructorArea, setInstructorArea] = useState('Tecnologías de la Información');
  const [instructorCorreo, setInstructorCorreo] = useState('wgarces@sena.edu.co');

  const [diasConsecutivos, setDiasConsecutivos] = useState(4);
  const [fechas, setFechas] = useState('2026-02-05, 2026-02-06, 2026-02-09, 2026-02-10');
  const [resumenHechos, setResumenHechos] = useState(
    'El aprendiz no se ha presentado a las actividades presenciales del proyecto formativo durante cuatro (4) jornadas consecutivas, sin mediar comunicación escrita ni soporte médico justificado.'
  );
  const [comunicacionesPrevias, setComunicacionesPrevias] = useState(
    'Se realizó llamada telefónica el 06 de febrero sin respuesta; se envió notificación de alerta preventiva al correo registrado en Sofia Plus.'
  );

  const [uploadedPDFs, setUploadedPDFs] = useState<AttachedPDF[]>([]);

  // Auto-fill template button
  const handleFillTemplate = () => {
    setAprendizNombre('Camila Andrea Torres Valencia');
    setNumeroDoc('1094837261');
    setCorreo('camila.torres@misena.edu.co');
    setTelefono('316 489 1230');
    setFicha('2849102');
    setDiasConsecutivos(4);
    if (uploadedPDFs.length === 0) {
      setUploadedPDFs([
        createMockSamplePDF(
          'reporte_inasistencia',
          'Reporte_Asistencia_SofiaPlus_Ficha2849102.pdf',
          instructorNombre,
          'Control de asistencia y bitácora de inasistencias consecutivas del sistema Sofia Plus'
        )
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aprendizNombre.trim() || !numeroDoc.trim()) {
      alert('Por favor ingrese el nombre y documento del aprendiz.');
      return;
    }

    if (diasConsecutivos < 3) {
      alert('De acuerdo con el Art. 22 del Reglamento del Aprendiz, la causal de deserción exige tres (3) o más días consecutivos de inasistencia injustificada.');
      return;
    }

    let finalPDFs = [...uploadedPDFs];
    if (finalPDFs.length === 0) {
      finalPDFs.push(
        createMockSamplePDF(
          'reporte_inasistencia',
          `Reporte_Sofia_${ficha}_${numeroDoc}.pdf`,
          instructorNombre,
          'Reporte de inasistencia oficial generado del aplicativo Sofia Plus'
        )
      );
    }

    const radicadoNum = Math.floor(Math.random() * 900 + 100);
    const codigoRadicado = `DES-2026-0${radicadoNum}`;
    const hoy = new Date().toISOString().split('T')[0];

    const newCase: CaseRecord = {
      id: 'caso-' + Date.now(),
      codigoRadicado,
      createdAt: hoy,
      currentPhase: 1,
      status: 'informe_radicado',
      aprendiz: {
        id: 'apr-' + Date.now(),
        nombre: aprendizNombre,
        tipoDoc,
        numeroDoc,
        correo: correo || `${aprendizNombre.toLowerCase().replace(/\s+/g, '.')}@misena.edu.co`,
        telefono: telefono || '310 000 0000',
        programa,
        ficha,
        jornada,
        centro,
        regional
      },
      instructor: {
        id: 'inst-' + Date.now(),
        nombre: instructorNombre,
        correo: instructorCorreo,
        cargo: instructorCargo,
        area: instructorArea
      },
      fase1_informe: {
        fechaRadicacion: hoy,
        diasInasistenciaConsecutivos: diasConsecutivos,
        fechasInasistencia: fechas.split(',').map((f) => f.trim()).filter(Boolean),
        resumenHechos,
        comunicacionesPrevias,
        documentosAdjuntos: finalPDFs,
        radicadoOficial: `INF-2026-${radicadoNum}-EJ`
      },
      fase2_citacion: {
        citacionEmitida: false,
        descargosPresentados: false
      },
      fase3_recomendacion: {
        sesionRealizada: false
      },
      fase4_acto_administrativo: {
        resolucionEmitida: false
      },
      fase5_recursos: {
        recursoHabilitado: false,
        recursoInterpuesto: false,
        resuelto: false,
        ejecutoriadoEnFirme: false
      },
      trazabilidad: [
        {
          id: 'tz-' + Date.now(),
          fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          actor: instructorNombre,
          rol: 'instructor',
          accion: `Radicación de queja por deserción con ${finalPDFs.length} archivo(s) PDF adjunto(s).`,
          fase: 1,
          documentoRef: `INF-2026-${radicadoNum}-EJ`
        }
      ]
    };

    onSubmit(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Radicar Informe o Queja de Deserción
              </h3>
              <p className="text-xs text-slate-500">
                Fase 1 del Debido Proceso Formativo · Reglamento del Aprendiz (Acuerdo 009 de 2024 y Acuerdo 02 de 2026)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillTemplate}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-medium px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              Autocompletar datos de prueba
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Aprendiz */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                1. Datos del Aprendiz Reportado
              </h4>

              {database?.aprendices && database.aprendices.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <select
                    onChange={(e) => {
                      const sel = database.aprendices.find((a) => a.id === e.target.value);
                      if (sel) {
                        setAprendizNombre(sel.nombre);
                        setTipoDoc(sel.tipoDoc);
                        setNumeroDoc(sel.numeroDoc);
                        setCorreo(sel.correo);
                        setTelefono(sel.telefono);
                        setPrograma(sel.programa);
                        setFicha(sel.ficha);
                        setJornada(sel.jornada);
                        setCentro(sel.centro);
                        setRegional(sel.regional);
                      }
                    }}
                    className="text-[11px] p-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium"
                  >
                    <option value="">-- Seleccionar de la Base de Datos --</option>
                    {database.aprendices.map((apr) => (
                      <option key={apr.id} value={apr.id}>
                        {apr.nombre} (Ficha {apr.ficha})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nombre Completo del Aprendiz *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Laura Sofía Vargas Rincón"
                  value={aprendizNombre}
                  onChange={(e) => setAprendizNombre(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Documento de Identidad *
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={tipoDoc}
                    onChange={(e) => setTipoDoc(e.target.value)}
                    className="w-20 text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shrink-0"
                  >
                    <option value="C.C.">C.C.</option>
                    <option value="T.I.">T.I.</option>
                    <option value="P.P.T.">PPT</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="1098..."
                    value={numeroDoc}
                    onChange={(e) => setNumeroDoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Ficha de Caracterización
                </label>
                <input
                  type="text"
                  value={ficha}
                  onChange={(e) => setFicha(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Programa de Formación
                </label>
                <input
                  type="text"
                  value={programa}
                  onChange={(e) => setPrograma(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Correo Electrónico (MiSena / Personal)
                </label>
                <input
                  type="email"
                  placeholder="aprendiz@misena.edu.co"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  placeholder="315..."
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jornada Formativa
                </label>
                <select
                  value={jornada}
                  onChange={(e) => setJornada(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                >
                  <option value="Diurna">Diurna</option>
                  <option value="Nocturna">Nocturna</option>
                  <option value="Mixta">Mixta</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Inasistencias y Causal */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              2. Configuración Fáctica de la Deserción (Art. 22 Numeral 1)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Días Consecutivos Inasistencia *
                </label>
                <input
                  type="number"
                  min={3}
                  max={60}
                  required
                  value={diasConsecutivos}
                  onChange={(e) => setDiasConsecutivos(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400">Mínimo 3 días según reglamento</span>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Fechas Reportadas de Ausencia (separadas por coma)
                </label>
                <input
                  type="text"
                  value={fechas}
                  onChange={(e) => setFechas(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Resumen de los Hechos y Ausencias Injustificadas
                </label>
                <textarea
                  rows={2}
                  required
                  value={resumenHechos}
                  onChange={(e) => setResumenHechos(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Gestiones Previas de Alerta Temprana y Contacto (Llamadas / Correos)
                </label>
                <textarea
                  rows={2}
                  value={comunicacionesPrevias}
                  onChange={(e) => setComunicacionesPrevias(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Carga de Archivo PDF Obligatoria */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              3. Carga de Archivo PDF de Evidencias (Sofia Plus / Bitácora)
            </h4>

            <PDFUploader
              label="Cargar reporte o evidencias en archivo PDF"
              description="Anexe el reporte de asistencia emitido por el sistema Sofia Plus o la bitácora del instructor."
              currentFiles={uploadedPDFs}
              onAddPDF={(newPdf) => setUploadedPDFs([...uploadedPDFs, newPdf])}
              onRemovePDF={(id) => setUploadedPDFs(uploadedPDFs.filter((p) => p.id !== id))}
              documentType="reporte_inasistencia"
              uploaderRoleName={instructorNombre}
              sampleButtonLabel="Cargar PDF de Asistencia Sofia Plus de muestra"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              Radicar Informe e Iniciar Trámite Procesal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
