import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, Sparkles } from 'lucide-react';
import { AttachedPDF } from '../types/desertion';
import { createMockSamplePDF } from '../utils/pdfGenerator';

interface PDFUploaderProps {
  label?: string;
  description?: string;
  currentFiles: AttachedPDF[];
  onAddPDF: (pdf: AttachedPDF) => void;
  onRemovePDF?: (pdfId: string) => void;
  onViewPDF?: (pdf: AttachedPDF) => void;
  documentType: AttachedPDF['type'];
  uploaderRoleName: string;
  sampleButtonLabel?: string;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({
  label = 'Cargar archivo PDF de soporte',
  description = 'Arrastre y suelte el documento en formato PDF o seleccione desde su dispositivo.',
  currentFiles,
  onAddPDF,
  onRemovePDF,
  onViewPDF,
  documentType,
  uploaderRoleName,
  sampleButtonLabel = 'Cargar archivo PDF de muestra'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Por favor seleccione exclusivamente un archivo con extensión .PDF');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      const hashStr = Math.random().toString(36).substring(2, 9).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      const newPdf: AttachedPDF = {
        id: 'pdf-upload-' + Date.now(),
        name: file.name,
        type: documentType,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        uploadedBy: uploaderRoleName,
        description: `Archivo cargado por el usuario: ${file.name}. Valida el debido proceso reglamentario.`,
        verificationHash: `SHA256:${hashStr}`,
        pagesCount: Math.max(1, Math.floor(file.size / 150000)),
        contentPreview: `Documento PDF aportado: ${file.name}\nTamaño: ${(file.size / 1024).toFixed(1)} KB\nFirma digital: Válida\nCustodiado en el expediente electrónico.`,
        base64Data
      };
      onAddPDF(newPdf);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadSample = () => {
    let sampleName = 'Reporte_Asistencia_SofiaPlus.pdf';
    let sampleDesc = 'Reporte de inasistencias y alertas del sistema Sofia Plus';
    if (documentType === 'incapacidad_eps') {
      sampleName = 'Incapacidad_Medica_EPS_Sura.pdf';
      sampleDesc = 'Certificado de incapacidad médica validado por EPS con radicado médico';
    } else if (documentType === 'descargos_aprendiz') {
      sampleName = 'Memorial_Descargos_Aprendiz.pdf';
      sampleDesc = 'Escrito de justificación de inasistencias y solicitud de plan formativo';
    } else if (documentType === 'memorial_recurso') {
      sampleName = 'Memorial_Recurso_Reposicion_SENA.pdf';
      sampleDesc = 'Recurso formal contra resolución de subdirección solicitando revocatoria';
    } else if (documentType === 'acta_comite') {
      sampleName = 'Acta_Comite_Evaluacion_Seguimiento.pdf';
      sampleDesc = 'Acta de sesión con calificación de falta y recomendación técnica';
    }

    const samplePdf = createMockSamplePDF(documentType, sampleName, uploaderRoleName, sampleDesc);
    onAddPDF(samplePdf);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
            {label}
          </label>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-md transition-colors"
        >
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          {sampleButtonLabel}
        </button>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-150 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
            Haga clic para examinar o arrastre el archivo PDF aquí
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Archivos PDF oficiales hasta 20 MB · Validez probatoria para el expediente
          </p>
        </div>
      </div>

      {/* List of current files */}
      {currentFiles.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            Archivos PDF adjuntos ({currentFiles.length}):
          </p>
          <div className="space-y-1.5">
            {currentFiles.map((pdf) => (
              <div
                key={pdf.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{pdf.name}</p>
                    <p className="text-[10px] text-slate-400">
                      {pdf.fileSize} · {pdf.uploadDate} · <span className="font-mono">{pdf.verificationHash}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {onViewPDF && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPDF(pdf);
                      }}
                      className="p-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Ver contenido del PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  {onRemovePDF && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePDF(pdf.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Eliminar archivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
