import React from 'react';
import { X, Play, Video, ExternalLink } from 'lucide-react';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  // Convert Google Docs / Drive watch or play link to preview/embed format if applicable
  // e.g. https://docs.google.com/videos/d/14VzNg58rTfkJSnEEQNJYfEkzLr3phVnPrvm5pOEk06s/preview
  let embedUrl = videoUrl;
  if (videoUrl.includes('/play') || videoUrl.includes('/view')) {
    embedUrl = videoUrl.replace(/\/play.*$/, '/preview').replace(/\/view.*$/, '/preview');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Videotutorial Institucional · Debido Proceso SENA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guía audiovisual sobre el trámite de quejas y fases del Reglamento del Aprendiz (Acuerdo 009 de 2024)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <span>Abrir en nueva pestaña</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="p-4 bg-slate-950 flex-1 flex flex-col items-center justify-center min-h-[420px]">
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl relative border border-slate-800 flex items-center justify-center">
            <iframe
              src={embedUrl}
              title="Videotutorial Debido Proceso SENA"
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-500">
          <span>SENA · Dirección de Formación Profesional Integral</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            Cerrar Reproductor
          </button>
        </div>
      </div>
    </div>
  );
};
