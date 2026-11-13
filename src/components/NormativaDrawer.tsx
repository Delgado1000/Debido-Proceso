import React from 'react';
import { X, BookOpen, ShieldCheck, Scale, CheckCircle2, AlertTriangle, FileText, Award } from 'lucide-react';

interface NormativaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NormativaDrawer: React.FC<NormativaDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Reglamento del Aprendiz SENA · Acuerdo 009 de 2024 y Acuerdo 02 de 2026
              </h3>
              <p className="text-xs text-slate-500">
                Marco Jurídico Actualizado: Constitución Política (Art. 29) · Nuevo Estatuto y Debido Proceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          {/* Fundamento Constitucional */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Artículo 29 de la Constitución Política: El Debido Proceso Institucional
            </h4>
            <p className="leading-relaxed text-emerald-950/80 dark:text-emerald-300/80">
              El debido proceso se aplicará a toda clase de actuaciones judiciales y administrativas. Nadie podrá ser juzgado sino conforme a leyes preexistentes al acto que se le imputa, ante juez o tribunal competente y con observancia de la plenitud de las formas propias de cada juicio. Toda persona se presume inocente mientras no se la haya declarado culpable. Quien sea sindicado tiene derecho a la defensa y a la asistencia de un representante o vocero, a presentar pruebas y a controvertir las que se alleguen en su contra, y a la impugnación de las decisiones sancionatorias.
            </p>
          </div>

          {/* Actualización Normativa: Acuerdo 009 de 2024 y Acuerdo 02 de 2026 */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Nuevo Estatuto: Acuerdo 009 de 2024 y Modificaciones del Acuerdo 02 de 2026
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">09</span>
                  <span>Acuerdo 009 de 2024 (Nuevo Reglamento)</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Actualiza de manera integral el Reglamento del Aprendiz SENA, modernizando las rutas formativas, las modalidades virtuales y presenciales, las faltas académicas/disciplinarias y fortaleciendo las garantías de defensa y contradicción.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">02</span>
                  <span>Acuerdo 02 de 2026 (Complemento y Modificación)</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Modifica y complementa recientemente el Acuerdo 009 de 2024, precisando los términos para la notificación electrónica de providencias, la interoperabilidad con Sofia Plus y los procedimientos ágiles para casos de presunta deserción.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">DES</span>
                  <span>Causales de Deserción Actualizadas</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Configurada por inasistencia injustificada durante tres (3) días consecutivos al centro o empresa, incumplimiento de reingreso tras aplazamiento, o no entrega de evidencias de etapa productiva en los plazos normativos.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">GAR</span>
                  <span>Garantías de Debido Proceso (Acuerdo 009/2024 - Art. y sgtes.)</span>
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Consagra el derecho irrenunciable a ser citado formalmente, aportar descargos por escrito o audiencia, adjuntar soportes probatorios digitales en PDF (ej. incapacidades EPS) y la doble instancia o recursos de reposición.
                </p>
              </div>
            </div>
          </div>

          {/* Las 5 Fases Detalladas del Debido Proceso */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              Las 5 Fases Operativas bajo el Acuerdo 009 de 2024 y Acuerdo 02 de 2026
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  Fase 1: Presentación del Informe o Queja (Instructor / Equipo Ejecutor)
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  El instructor o equipo ejecutor verifica que el aprendiz completa 3 o más días consecutivos de inasistencia sin justificación. Radica el informe oficial adjuntando el <strong>reporte en PDF de Sofia Plus y la bitácora de alertas tempranas</strong>, dando cumplimiento al nuevo estatuto.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  Fase 2: Citación al Comité y Garantía de Descargos (Comité y Aprendiz)
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  El Comité emite la Citación Oficial con plazos actualizados (Acuerdo 02 de 2026). El aprendiz ejerce su derecho de defensa aportando descargos por escrito y soportes probatorios digitales en formato PDF (ej. incapacidades EPS o fuerza mayor).
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  Fase 3: Recomendación del Comité según Calificación de la Falta (Comité de Evaluación)
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  El Comité sesiona, evalúa los descargos conforme al nuevo reglamento, tipifica la falta, califica su gravedad y expide el <strong>Acta de Recomendación formal en PDF dirigida al Subdirector</strong> recomendando la medida formativa o sancionatoria procedente.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  Fase 4: Emisión de Acto Administrativo Motivado (Subdirector de Centro)
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  El Subdirector expide la <strong>Resolución Motivada en derecho y con firma digital</strong>, asegurando la notificación electrónica certificada (según Acuerdo 02 de 2026) e indicando los recursos procedentes.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider">
                  Fase 5: Interposición de Recursos y Firmeza (Aprendiz y Subdirector)
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  El aprendiz interpone el <strong>Recurso de Reposición</strong> dentro de los cinco (5) días hábiles reglamentarios, adjuntando memorial y pruebas en PDF. El Subdirector resuelve en segunda instancia, agotando la vía gubernativa y dejando en firme el expediente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center text-xs text-slate-500">
          <span>SENA · Acuerdo 009 de 2024 · Modificado por Acuerdo 02 de 2026</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Entendido y Actualizado
          </button>
        </div>
      </div>
    </div>
  );
};
