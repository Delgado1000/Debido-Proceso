export type UserRole = 'instructor' | 'aprendiz' | 'comite' | 'subdirector';

export type DueProcessPhaseNumber = 1 | 2 | 3 | 4 | 5;

export type CaseStatus =
  | 'informe_radicado'
  | 'citacion_programada'
  | 'descargos_presentados'
  | 'comite_sesionando'
  | 'recomendacion_emitida'
  | 'resolucion_expedida'
  | 'notificado_al_aprendiz'
  | 'recurso_interpuesto'
  | 'recurso_resuelto_confirmado'
  | 'recurso_resuelto_modificado'
  | 'recurso_resuelto_revocado'
  | 'cerrado_en_firme';

export interface AttachedPDF {
  id: string;
  name: string;
  type:
    | 'reporte_inasistencia'
    | 'evidencia_instructor'
    | 'descargos_aprendiz'
    | 'incapacidad_eps'
    | 'citacion_oficial'
    | 'acta_comite'
    | 'resolucion_subdirector'
    | 'memorial_recurso'
    | 'otro';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  description: string;
  contentPreview?: string;
  base64Data?: string;
  verificationHash: string;
  pagesCount?: number;
}

export interface AprendizInfo {
  id: string;
  nombre: string;
  tipoDoc: string;
  numeroDoc: string;
  correo: string;
  telefono: string;
  programa: string;
  ficha: string;
  jornada: string;
  centro: string;
  regional: string;
}

export interface InstructorInfo {
  id: string;
  nombre: string;
  correo: string;
  cargo: string;
  area: string;
}

export interface Fase1Informe {
  fechaRadicacion: string;
  diasInasistenciaConsecutivos: number;
  fechasInasistencia: string[];
  resumenHechos: string;
  comunicacionesPrevias: string;
  documentosAdjuntos: AttachedPDF[];
  radicadoOficial: string;
}

export interface Fase2Citacion {
  citacionEmitida: boolean;
  fechaEmision?: string;
  fechaAudiencia?: string;
  horaAudiencia?: string;
  lugarOEnlace?: string;
  responsableCitacion?: string;
  cargosImputados?: string;
  garantiasLegales?: string;
  documentoCitacionPdf?: AttachedPDF;
  // Descargos del aprendiz
  descargosPresentados: boolean;
  fechaDescargos?: string;
  modalidadDescargos?: 'escrito' | 'audiencia_verbal' | 'no_comparecio';
  textoDescargos?: string;
  soporteDescargosPdf?: AttachedPDF[];
  asistioAudiencia?: boolean;
}

export interface Fase3Recomendacion {
  sesionRealizada: boolean;
  fechaSesion?: string;
  actaNumero?: string;
  miembrosParticipantes?: string[];
  tipificacionFalta?: 'Academica' | 'Disciplinaria' | 'Mixta';
  calificacionFalta?: 'Leve' | 'Grave' | 'Gravísima';
  atenuantes?: string[];
  agravantes?: string[];
  recomendacionFinal?: 'Cancelacion_Matricula' | 'Plan_Mejoramiento' | 'Llamado_Atencion' | 'Archivo_Expediente';
  justificacionRecomendacion?: string;
  condicionesPlanMejoramiento?: string;
  terminoInhabilidadMeses?: number;
  actaComitePdf?: AttachedPDF;
}

export interface Fase4ActoAdministrativo {
  resolucionEmitida: boolean;
  resolucionNumero?: string;
  fechaExpedicion?: string;
  subdirectorNombre?: string;
  considerandoHechos?: string;
  considerandoDerecho?: string;
  decisionSancion?: 'Cancelacion_Matricula' | 'Plan_Mejoramiento' | 'Exoneracion_Archivo';
  inhabilidadMeses?: number;
  resolucionFirmada?: boolean;
  documentoResolucionPdf?: AttachedPDF;
  fechaNotificacion?: string;
  formaNotificacion?: 'Personal' | 'Correo_Electronico_Certificado' | 'Aviso';
  fechaLimiteRecurso?: string;
}

export interface Fase5Recursos {
  recursoHabilitado: boolean;
  recursoInterpuesto: boolean;
  fechaInterposicion?: string;
  radicadoRecurso?: string;
  argumentosRecurso?: string;
  pruebasNuevasPdf?: AttachedPDF[];
  dentroDeTerminos?: boolean;
  // Fallo del Subdirector
  resuelto: boolean;
  fechaResolucionRecurso?: string;
  resolucionRecursoNumero?: string;
  decisionRecurso?: 'Confirma' | 'Modifica' | 'Revoca';
  motivacionDecisionRecurso?: string;
  documentoFalloRecursoPdf?: AttachedPDF;
  ejecutoriadoEnFirme: boolean;
}

export interface TrazabilidadItem {
  id: string;
  fecha: string;
  actor: string;
  rol: UserRole;
  accion: string;
  fase: DueProcessPhaseNumber;
  documentoRef?: string;
}

export interface CaseRecord {
  id: string;
  codigoRadicado: string;
  createdAt: string;
  currentPhase: DueProcessPhaseNumber;
  status: CaseStatus;
  aprendiz: AprendizInfo;
  instructor: InstructorInfo;
  fase1_informe: Fase1Informe;
  fase2_citacion: Fase2Citacion;
  fase3_recomendacion: Fase3Recomendacion;
  fase4_acto_administrativo: Fase4ActoAdministrativo;
  fase5_recursos: Fase5Recursos;
  trazabilidad: TrazabilidadItem[];
}
