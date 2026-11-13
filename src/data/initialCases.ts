import { CaseRecord } from '../types/desertion';
import { createMockSamplePDF } from '../utils/pdfGenerator';

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'caso-1',
    codigoRadicado: 'DES-2026-0041',
    createdAt: '2026-02-02',
    currentPhase: 1,
    status: 'informe_radicado',
    aprendiz: {
      id: 'apr-1',
      nombre: 'Carlos Andrés Medina Rojas',
      tipoDoc: 'C.C.',
      numeroDoc: '1098765432',
      correo: 'carlos.medina.aprendiz@misena.edu.co',
      telefono: '315 892 4110',
      programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      ficha: '2721845',
      jornada: 'Diurna',
      centro: 'Centro de Biotecnología Industrial',
      regional: 'Valle del Cauca'
    },
    instructor: {
      id: 'inst-1',
      nombre: 'Ing. Sandra Milena Ortiz',
      correo: 'sortiz@sena.edu.co',
      cargo: 'Instructora Técnica y Vocera de Equipo',
      area: 'Desarrollo de Software y Base de Datos'
    },
    fase1_informe: {
      fechaRadicacion: '2026-02-02',
      diasInasistenciaConsecutivos: 4,
      fechasInasistencia: ['2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29'],
      resumenHechos:
        'El aprendiz ha dejado de asistir de manera consecutiva a las sesiones sincrónicas y presenciales de la fase de Ejecución durante 4 días continuos. Se llamó a su número telefónico de contacto registrado en Sofia Plus sin obtener respuesta, y se remitió correo de alerta preventiva el día 28 de enero sin que mediara justificación o excusa formal.',
      comunicacionesPrevias:
        'Intento de llamada telefónica (28-Ene-2026 10:15 am, sin respuesta). Envío de correo electrónico preventivo a buzón institucional misena con copia a acudiente.',
      radicadoOficial: 'INF-2026-0041-TI',
      documentosAdjuntos: [
        createMockSamplePDF(
          'reporte_inasistencia',
          'Reporte_Asistencia_SofiaPlus_Ficha2721845.pdf',
          'Ing. Sandra Milena Ortiz',
          'Planilla de firmas y registro biométrico del Centro de Formación'
        ),
        createMockSamplePDF(
          'evidencia_instructor',
          'Bitacora_Intentos_Contacto_Aprendiz.pdf',
          'Ing. Sandra Milena Ortiz',
          'Capturas de pantalla de correos institucionales y registro de llamadas sin contestar'
        )
      ]
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
        id: 'tz-1',
        fecha: '2026-02-02 09:30',
        actor: 'Ing. Sandra Milena Ortiz',
        rol: 'instructor',
        accion: 'Radicación de queja formal por deserción con 2 archivos PDF adjuntos.',
        fase: 1,
        documentoRef: 'INF-2026-0041-TI'
      }
    ]
  },
  {
    id: 'caso-2',
    codigoRadicado: 'DES-2026-0038',
    createdAt: '2026-01-25',
    currentPhase: 2,
    status: 'citacion_programada',
    aprendiz: {
      id: 'apr-2',
      nombre: 'Valentina Restrepo Hincapié',
      tipoDoc: 'C.C.',
      numeroDoc: '1017849201',
      correo: 'valentina.restrepo@misena.edu.co',
      telefono: '320 644 1928',
      programa: 'Tecnólogo en Gestión Empresarial',
      ficha: '2694110',
      jornada: 'Mixta',
      centro: 'Centro de Comercio y Servicios',
      regional: 'Antioquia'
    },
    instructor: {
      id: 'inst-2',
      nombre: 'Dr. Fernando Duque Pardo',
      correo: 'fduque@sena.edu.co',
      cargo: 'Instructor Líder de Ficha',
      area: 'Administración y Finanzas'
    },
    fase1_informe: {
      fechaRadicacion: '2026-01-25',
      diasInasistenciaConsecutivos: 5,
      fechasInasistencia: ['2026-01-19', '2026-01-20', '2026-01-21', '2026-01-22', '2026-01-23'],
      resumenHechos:
        'Inasistencia injustificada durante toda la semana correspondiente al módulo de Gestión del Talento Humano. No se recibió notificación médica previa.',
      comunicacionesPrevias: 'Mensaje vía plataforma LMS territorio y llamada a acudiente registrada en la bitácora.',
      radicadoOficial: 'INF-2026-0038-AD',
      documentosAdjuntos: [
        createMockSamplePDF(
          'reporte_inasistencia',
          'Planilla_Control_Asistencia_Semana3.pdf',
          'Dr. Fernando Duque Pardo',
          'Reporte oficial del sistema LMS con 0% de participación'
        )
      ]
    },
    fase2_citacion: {
      citacionEmitida: true,
      fechaEmision: '2026-01-29',
      fechaAudiencia: '2026-02-14',
      horaAudiencia: '10:00 AM',
      lugarOEnlace: 'Sala Virtual Teams: sesion-comite-centro-comercio',
      responsableCitacion: 'Coordinación Académica - Centro de Comercio y Servicios',
      cargosImputados:
        'Presunta comisión de falta académica contemplada en el Art. 22 del Reglamento del Aprendiz por inasistencia no justificada durante cinco (5) días hábiles continuos.',
      garantiasLegales:
        'Conforme al Art. 29 de la Constitución Política y Art. 29 del Reglamento del Aprendiz, tiene derecho a conocer las pruebas, rendir descargos y allegar soportes.',
      documentoCitacionPdf: createMockSamplePDF(
        'citacion_oficial',
        'Citacion_Comite_DES-2026-0038.pdf',
        'Coordinación Académica',
        'Oficio formal de citación a audiencia con términos legales de comparecencia'
      ),
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
        id: 'tz-2a',
        fecha: '2026-01-25 14:00',
        actor: 'Dr. Fernando Duque Pardo',
        rol: 'instructor',
        accion: 'Radicación de queja de deserción por 5 días de ausencia consecutiva.',
        fase: 1
      },
      {
        id: 'tz-2b',
        fecha: '2026-01-29 08:30',
        actor: 'Coordinador Académico',
        rol: 'comite',
        accion: 'Generación y notificación de Citación Oficial a Comité para el 14 de febrero.',
        fase: 2,
        documentoRef: 'Citacion_Comite_DES-2026-0038.pdf'
      }
    ]
  },
  {
    id: 'caso-3',
    codigoRadicado: 'DES-2026-0027',
    createdAt: '2026-01-18',
    currentPhase: 3,
    status: 'descargos_presentados',
    aprendiz: {
      id: 'apr-3',
      nombre: 'Brayan Estiven Gómez Cano',
      tipoDoc: 'C.C.',
      numeroDoc: '1128405921',
      correo: 'brayan.gomez@misena.edu.co',
      telefono: '311 723 9984',
      programa: 'Mantenimiento Mecatrónico de Automotores',
      ficha: '2618990',
      jornada: 'Nocturna',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital'
    },
    instructor: {
      id: 'inst-3',
      nombre: 'Ing. Carlos Alberto Manrique',
      correo: 'cmanrique@sena.edu.co',
      cargo: 'Instructor Técnico Taller',
      area: 'Mecatrónica Automotriz'
    },
    fase1_informe: {
      fechaRadicacion: '2026-01-18',
      diasInasistenciaConsecutivos: 6,
      fechasInasistencia: ['2026-01-11', '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16'],
      resumenHechos:
        'Inasistencia a prácticas obligatorias de taller con equipo de diagnóstico electrónico automotriz. Riesgo para la seguridad y desatención a compromisos pedagógicos.',
      comunicacionesPrevias: 'Comunicaciones enviadas por WhatsApp y correo registrado sin respuesta oportuna.',
      radicadoOficial: 'INF-2026-0027-MC',
      documentosAdjuntos: [
        createMockSamplePDF(
          'reporte_inasistencia',
          'Planilla_Taller_Control_Laboratorio.pdf',
          'Ing. Carlos Alberto Manrique',
          'Control de acceso al laboratorio de inyección electrónica'
        )
      ]
    },
    fase2_citacion: {
      citacionEmitida: true,
      fechaEmision: '2026-01-20',
      fechaAudiencia: '2026-02-05',
      horaAudiencia: '02:00 PM',
      lugarOEnlace: 'Sala de Juntas Piso 2 - Centro de Transporte',
      responsableCitacion: 'Comité de Evaluación y Seguimiento',
      cargosImputados: 'Deserción formativa por 6 días continuos sin excusa reportada.',
      garantiasLegales: 'Artículos 22, 28 y 29 del Reglamento del Aprendiz SENA.',
      descargosPresentados: true,
      fechaDescargos: '2026-02-04',
      modalidadDescargos: 'escrito',
      asistioAudiencia: true,
      textoDescargos:
        'Respetados miembros del Comité: Durante los días señalados presenté un cuadro respiratorio agudo severo que me impidió movilizarme al Centro. Lamentablemente no pude radicar la incapacidad de la EPS dentro de los 3 días hábiles debido a dificultades de conectividad en mi zona de residencia. Adjunto el certificado expedido por la EPS Compensar y solicito me permitan ponerme al día con un plan de nivelación.',
      soporteDescargosPdf: [
        createMockSamplePDF(
          'incapacidad_eps',
          'Incapacidad_Medica_EPS_Compensar.pdf',
          'Brayan Estiven Gómez Cano',
          'Certificado de incapacidad médica por 7 días expedido por médico tratante'
        )
      ]
    },
    fase3_recomendacion: {
      sesionRealizada: false,
      actaNumero: 'ACT-2026-0019',
      miembrosParticipantes: [
        'Ing. Patricia Duarte (Coordinadora Académica)',
        'Lic. Germán Botero (Bienestar al Aprendiz)',
        'Mariana Soler (Representante de Aprendices)',
        'Ing. Carlos Manrique (Instructor)'
      ]
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
        id: 'tz-3a',
        fecha: '2026-01-18 10:00',
        actor: 'Ing. Carlos Alberto Manrique',
        rol: 'instructor',
        accion: 'Radicación de informe por inasistencia en taller automotriz.',
        fase: 1
      },
      {
        id: 'tz-3b',
        fecha: '2026-01-20 15:30',
        actor: 'Comité de Evaluación',
        rol: 'comite',
        accion: 'Citación proferida al aprendiz garantizando término para presentar descargos.',
        fase: 2
      },
      {
        id: 'tz-3c',
        fecha: '2026-02-04 11:20',
        actor: 'Brayan Estiven Gómez Cano',
        rol: 'aprendiz',
        accion: 'Radicación de descargos escritos y carga de PDF de Incapacidad Médica EPS.',
        fase: 2,
        documentoRef: 'Incapacidad_Medica_EPS_Compensar.pdf'
      }
    ]
  },
  {
    id: 'caso-4',
    codigoRadicado: 'DES-2026-0019',
    createdAt: '2026-01-10',
    currentPhase: 4,
    status: 'recomendacion_emitida',
    aprendiz: {
      id: 'apr-4',
      nombre: 'Julián David Morales Quintero',
      tipoDoc: 'C.C.',
      numeroDoc: '1032489112',
      correo: 'julian.morales@misena.edu.co',
      telefono: '310 994 2817',
      programa: 'Técnico en Asistencia Administrativa',
      ficha: '2710340',
      jornada: 'Diurna',
      centro: 'Centro de Gestión Administrativa',
      regional: 'Distrito Capital'
    },
    instructor: {
      id: 'inst-4',
      nombre: 'Lic. Claudia Rocío Moreno',
      correo: 'cmoreno@sena.edu.co',
      cargo: 'Instructora de Documentación Empresarial',
      area: 'Administración'
    },
    fase1_informe: {
      fechaRadicacion: '2026-01-10',
      diasInasistenciaConsecutivos: 8,
      fechasInasistencia: [
        '2026-01-02',
        '2026-01-03',
        '2026-01-04',
        '2026-01-05',
        '2026-01-06',
        '2026-01-07',
        '2026-01-08',
        '2026-01-09'
      ],
      resumenHechos:
        'El aprendiz completó más de una semana sin presentarse a las actividades formativas ni ingresar al aula virtual.',
      comunicacionesPrevias: 'Llamadas no atendidas y correo de requerimiento preventivo enviado.',
      radicadoOficial: 'INF-2026-0019-GA',
      documentosAdjuntos: [
        createMockSamplePDF('reporte_inasistencia', 'Registro_SofiaPlus_Inasistencias.pdf', 'Lic. Claudia Rocío Moreno', 'Extracto de inasistencias Sofía')
      ]
    },
    fase2_citacion: {
      citacionEmitida: true,
      fechaEmision: '2026-01-12',
      fechaAudiencia: '2026-01-22',
      horaAudiencia: '09:00 AM',
      lugarOEnlace: 'Comité Sala A',
      responsableCitacion: 'Comité de Evaluación y Seguimiento',
      descargosPresentados: false,
      modalidadDescargos: 'no_comparecio',
      asistioAudiencia: false
    },
    fase3_recomendacion: {
      sesionRealizada: true,
      fechaSesion: '2026-01-22',
      actaNumero: 'ACT-2026-0012',
      miembrosParticipantes: [
        'Dra. Martha Lucia Bernal (Coordinadora Académica)',
        'Psic. Andrés Téllez (Bienestar)',
        'Juan Camilo Niño (Vocero)',
        'Lic. Claudia Moreno (Instructora)'
      ],
      tipificacionFalta: 'Academica',
      calificacionFalta: 'Grave',
      atenuantes: [],
      agravantes: ['No comparecencia a la diligencia citada', 'Afectación a la continuidad de la ruta formativa'],
      recomendacionFinal: 'Cancelacion_Matricula',
      justificacionRecomendacion:
        'El aprendiz no compareció ni presentó justificación alguna a pesar de haber sido notificado en debida forma. Se configura causal de deserción de acuerdo con el Art. 22 del Estatuto del Aprendiz.',
      terminoInhabilidadMeses: 6,
      actaComitePdf: createMockSamplePDF(
        'acta_comite',
        'Acta_Comite_Evaluacion_No_012.pdf',
        'Secretaría Técnica del Comité',
        'Acta formal con la calificación de falta y recomendación unánime de cancelación de matrícula'
      )
    },
    fase4_acto_administrativo: {
      resolucionEmitida: false,
      subdirectorNombre: 'Dr. Hernando Gómez Barreto'
    },
    fase5_recursos: {
      recursoHabilitado: false,
      recursoInterpuesto: false,
      resuelto: false,
      ejecutoriadoEnFirme: false
    },
    trazabilidad: [
      {
        id: 'tz-4a',
        fecha: '2026-01-10 11:00',
        actor: 'Lic. Claudia Rocío Moreno',
        rol: 'instructor',
        accion: 'Radicación de informe por 8 días de inasistencia consecutiva.',
        fase: 1
      },
      {
        id: 'tz-4b',
        fecha: '2026-01-12 08:30',
        actor: 'Comité de Evaluación',
        rol: 'comite',
        accion: 'Emisión de citación al comité con notificación al correo institucional.',
        fase: 2
      },
      {
        id: 'tz-4c',
        fecha: '2026-01-22 10:30',
        actor: 'Comité de Evaluación',
        rol: 'comite',
        accion: 'Constancia de no comparecencia y expedición de Acta ACT-2026-0012 recomendando cancelación.',
        fase: 3,
        documentoRef: 'Acta_Comite_Evaluacion_No_012.pdf'
      }
    ]
  },
  {
    id: 'caso-5',
    codigoRadicado: 'DES-2026-0008',
    createdAt: '2025-12-15',
    currentPhase: 5,
    status: 'recurso_interpuesto',
    aprendiz: {
      id: 'apr-5',
      nombre: 'Daniel Felipe Castro Lozano',
      tipoDoc: 'C.C.',
      numeroDoc: '1026589334',
      correo: 'dfcastro@misena.edu.co',
      telefono: '313 456 7890',
      programa: 'Tecnólogo en Animación Digital y 3D',
      ficha: '2650119',
      jornada: 'Diurna',
      centro: 'Centro para la Industria de la Comunicación Gráfica (CENIGRAF)',
      regional: 'Distrito Capital'
    },
    instructor: {
      id: 'inst-5',
      nombre: 'Prof. Javier Eduardo Cárdenas',
      correo: 'jcardenas@sena.edu.co',
      cargo: 'Instructor Modelado 3D',
      area: 'Multimedia y Gráficos'
    },
    fase1_informe: {
      fechaRadicacion: '2025-12-15',
      diasInasistenciaConsecutivos: 4,
      fechasInasistencia: ['2025-12-05', '2025-12-09', '2025-12-10', '2025-12-11'],
      resumenHechos: 'Inasistencia consecutiva a las entregas de proyectos del 3er trimestre.',
      comunicacionesPrevias: 'Correos enviados sin respuesta por parte del aprendiz.',
      radicadoOficial: 'INF-2025-0008-CG',
      documentosAdjuntos: [
        createMockSamplePDF('reporte_inasistencia', 'Control_Sofia_Diciembre.pdf', 'Prof. Javier Cárdenas', 'Registro Sofia')
      ]
    },
    fase2_citacion: {
      citacionEmitida: true,
      fechaEmision: '2025-12-18',
      fechaAudiencia: '2026-01-08',
      horaAudiencia: '11:00 AM',
      lugarOEnlace: 'CENIGRAF Sala 304',
      responsableCitacion: 'Comité de Evaluación CENIGRAF',
      descargosPresentados: false,
      modalidadDescargos: 'no_comparecio',
      asistioAudiencia: false
    },
    fase3_recomendacion: {
      sesionRealizada: true,
      fechaSesion: '2026-01-08',
      actaNumero: 'ACT-2026-0003',
      miembrosParticipantes: ['Dra. Beatriz Peña (Coordinadora)', 'Prof. Javier Cárdenas (Instructor)'],
      tipificacionFalta: 'Academica',
      calificacionFalta: 'Grave',
      recomendacionFinal: 'Cancelacion_Matricula',
      justificacionRecomendacion: 'Recomendación de cancelación de matrícula por falta de descargos.',
      terminoInhabilidadMeses: 6,
      actaComitePdf: createMockSamplePDF('acta_comite', 'Acta_Comite_CENIGRAF_003.pdf', 'Secretaría Técnica', 'Acta recomendación')
    },
    fase4_acto_administrativo: {
      resolucionEmitida: true,
      resolucionNumero: 'RES-2026-0042',
      fechaExpedicion: '2026-01-14',
      subdirectorNombre: 'Dr. Álvaro Enrique Fonseca',
      considerandoHechos:
        'Visto el informe y acta del Comité donde se constató inasistencia injustificada de más de 3 días.',
      considerandoDerecho: 'Facultades conferidas por la Ley 119 de 1994 y Acuerdo 007 de 2012 Reglamento del Aprendiz.',
      decisionSancion: 'Cancelacion_Matricula',
      inhabilidadMeses: 6,
      resolucionFirmada: true,
      fechaNotificacion: '2026-01-16',
      formaNotificacion: 'Correo_Electronico_Certificado',
      fechaLimiteRecurso: '2026-01-23',
      documentoResolucionPdf: createMockSamplePDF(
        'resolucion_subdirector',
        'Resolucion_0042_Cancelacion_Matricula.pdf',
        'Despacho Subdirección CENIGRAF',
        'Acto administrativo motivado de sanción con firma digital'
      )
    },
    fase5_recursos: {
      recursoHabilitado: true,
      recursoInterpuesto: true,
      fechaInterposicion: '2026-01-21',
      radicadoRecurso: 'REC-2026-0015',
      argumentosRecurso:
        'Interpongo Recurso de Reposición en tiempo hábil. Mi inasistencia se debió a un accidente de tránsito ocurrido el 04 de diciembre en el cual sufrí fractura de miembro superior derecho con incapacidad médica de 30 días expedida por la Clínica de Traumatología. No pude comparecer a la citación porque aún me encontraba en terapia de recuperación hospitalaria. Ruego revocar la sanción y permitirme reanudar mi formación.',
      pruebasNuevasPdf: [
        createMockSamplePDF(
          'incapacidad_eps',
          'Historia_Clinica_Cirugia_Incapacidad_30_Dias.pdf',
          'Daniel Felipe Castro Lozano',
          'Epicrisis de hospitalización, certificado médico y reporte de la aseguradora'
        ),
        createMockSamplePDF(
          'memorial_recurso',
          'Memorial_Recurso_Reposicion_Sustentado.pdf',
          'Daniel Felipe Castro Lozano',
          'Documento formal del recurso firmado por el aprendiz'
        )
      ],
      dentroDeTerminos: true,
      resuelto: false,
      ejecutoriadoEnFirme: false
    },
    trazabilidad: [
      {
        id: 'tz-5a',
        fecha: '2025-12-15 08:30',
        actor: 'Prof. Javier Eduardo Cárdenas',
        rol: 'instructor',
        accion: 'Radicación de queja por inasistencia.',
        fase: 1
      },
      {
        id: 'tz-5b',
        fecha: '2025-12-18 14:00',
        actor: 'Comité CENIGRAF',
        rol: 'comite',
        accion: 'Notificación de citación oficial para comparecencia en enero.',
        fase: 2
      },
      {
        id: 'tz-5c',
        fecha: '2026-01-08 12:00',
        actor: 'Comité CENIGRAF',
        rol: 'comite',
        accion: 'Acta de recomendación de cancelación por no comparecencia.',
        fase: 3
      },
      {
        id: 'tz-5d',
        fecha: '2026-01-14 16:00',
        actor: 'Dr. Álvaro Enrique Fonseca',
        rol: 'subdirector',
        accion: 'Emisión de Resolución RES-2026-0042 ordenando cancelación de matrícula.',
        fase: 4,
        documentoRef: 'Resolucion_0042_Cancelacion_Matricula.pdf'
      },
      {
        id: 'tz-5e',
        fecha: '2026-01-21 09:15',
        actor: 'Daniel Felipe Castro Lozano',
        rol: 'aprendiz',
        accion: 'Interposición de Recurso de Reposición dentro del término legal aportando incapacidad médica de urgencia.',
        fase: 5,
        documentoRef: 'REC-2026-0015'
      }
    ]
  }
];
