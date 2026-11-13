import { jsPDF } from 'jspdf';
import { CaseRecord, AttachedPDF } from '../types/desertion';

// Helper to draw clean institutional header in PDF
function drawInstitutionalHeader(doc: jsPDF, title: string, subtitle: string) {
  // Brand Header Bar
  doc.setFillColor(31, 94, 53); // SENA Institutional Green #1F5E35
  doc.rect(14, 12, 182, 10, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SISTEMA INSTITUCIONAL DE FORMACIÓN PROFESIONAL INTEGRAL', 18, 18);
  doc.text('DEBIDO PROCESO', 165, 18);

  // Document Title
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 30);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 36);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);
}

function drawInstitutionalFooter(doc: jsPDF, pageNum: number = 1, radicado: string) {
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 275, 196, 275);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text(`Expediente Radicado: ${radicado} | Conforme al Reglamento del Aprendiz (Acuerdo 007 de 2012)`, 14, 281);
  doc.text(`Página ${pageNum} de ${pageNum}`, 175, 281);
}

// 1. PDF del Informe de Queja / Deserción (Fase 1)
export function generateInformeDesercionPDF(caso: CaseRecord): void {
  const doc = new jsPDF();
  drawInstitutionalHeader(
    doc,
    'INFORME DE NOVEDAD POR DESERCIÓN FORMATIVA',
    `Radicado: ${caso.codigoRadicado} · Fase 1: Remisión e Informe del Equipo Ejecutor`
  );

  let y = 48;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. INFORMACIÓN DEL APRENDIZ Y PROGRAMA', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Nombre Completo: ${caso.aprendiz.nombre}`, 14, y);
  doc.text(`Identificación: ${caso.aprendiz.tipoDoc} ${caso.aprendiz.numeroDoc}`, 110, y);
  y += 6;
  doc.text(`Programa: ${caso.aprendiz.programa}`, 14, y);
  doc.text(`Ficha de Caracterización: ${caso.aprendiz.ficha}`, 110, y);
  y += 6;
  doc.text(`Centro: ${caso.aprendiz.centro}`, 14, y);
  doc.text(`Regional: ${caso.aprendiz.regional}`, 110, y);
  y += 6;
  doc.text(`Correo Electrónico: ${caso.aprendiz.correo}`, 14, y);
  doc.text(`Teléfono Contacto: ${caso.aprendiz.telefono}`, 110, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('2. INSTRUCTOR SOLICITANTE / EQUIPO EJECUTOR', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Instructor: ${caso.instructor.nombre} (${caso.instructor.cargo})`, 14, y);
  y += 6;
  doc.text(`Área / Especialidad: ${caso.instructor.area}`, 14, y);
  doc.text(`Correo Instructor: ${caso.instructor.correo}`, 110, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('3. DESCRIPCIÓN FÁCTICA DE LA DESERCIÓN (CAUSAL ART. 22)', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Días consecutivos de inasistencia injustificada: ${caso.fase1_informe.diasInasistenciaConsecutivos} días hábiles`, 14, y);
  y += 6;
  doc.text(`Fechas reportadas de ausencia: ${caso.fase1_informe.fechasInasistencia.join(', ')}`, 14, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('Hechos y gestiones previas de alerta temprana:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const splitHechos = doc.splitTextToSize(caso.fase1_informe.resumenHechos, 180);
  doc.text(splitHechos, 14, y);
  y += splitHechos.length * 5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Comunicaciones de contacto previo con el aprendiz:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const splitComms = doc.splitTextToSize(caso.fase1_informe.comunicacionesPrevias, 180);
  doc.text(splitComms, 14, y);
  y += splitComms.length * 5 + 8;

  doc.setFont('helvetica', 'bold');
  doc.text('4. EVIDENCIAS Y ANEXOS RADICADOS (PDF)', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  if (caso.fase1_informe.documentosAdjuntos.length === 0) {
    doc.text('Sin anexos registrados en el sistema.', 14, y);
    y += 6;
  } else {
    caso.fase1_informe.documentosAdjuntos.forEach((docItem) => {
      doc.text(`• ${docItem.name} (${docItem.fileSize}) - Hash: ${docItem.verificationHash}`, 16, y);
      y += 5;
    });
  }

  y += 15;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 80, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Firma: ${caso.instructor.nombre}`, 14, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Instructor Responsable / Equipo Ejecutor', 14, y + 8);
  doc.text(`Fecha Radicación: ${caso.fase1_informe.fechaRadicacion}`, 14, y + 12);

  drawInstitutionalFooter(doc, 1, caso.codigoRadicado);
  doc.save(`Informe_Desercion_${caso.codigoRadicado}.pdf`);
}

// 2. PDF de Citación Oficial a Comité (Fase 2)
export function generateCitacionComitePDF(caso: CaseRecord): void {
  const doc = new jsPDF();
  drawInstitutionalHeader(
    doc,
    'CITACIÓN A COMITÉ DE EVALUACIÓN Y SEGUIMIENTO',
    `Garantía Constitucional del Debido Proceso (Art. 29 C.P. y Art. 29 Acuerdo 007 de 2012)`
  );

  let y = 48;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`FECHA DE EMISIÓN: ${caso.fase2_citacion.fechaEmision || new Date().toISOString().split('T')[0]}`, 14, y);
  doc.text(`EXPEDIENTE: ${caso.codigoRadicado}`, 120, y);

  y += 10;
  doc.text(`DIRIGIDO A: APRENDIZ ${caso.aprendiz.nombre.toUpperCase()}`, 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Documento de Identidad: ${caso.aprendiz.tipoDoc} ${caso.aprendiz.numeroDoc}`, 14, y);
  doc.text(`Ficha: ${caso.aprendiz.ficha} - ${caso.aprendiz.programa}`, 14, y + 5);
  doc.text(`Correo Electrónico de Notificación: ${caso.aprendiz.correo}`, 14, y + 10);

  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('ASUNTO: CITACIÓN A AUDIENCIA Y FORMULACIÓN DE CARGOS POR PRESUNTA DESERCIÓN', 14, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const textoCuerpo = `Por medio de la presente, en cumplimiento del Reglamento del Aprendiz, se le cita formalmente a la sesión del Comité de Evaluación y Seguimiento, en virtud de la queja radicada por el Instructor ${caso.instructor.nombre}, donde se constata la presunta inasistencia injustificada de más de tres (3) días hábiles consecutivos en las fechas: ${caso.fase1_informe.fechasInasistencia.join(', ')}.`;
  const splitCuerpo = doc.splitTextToSize(textoCuerpo, 180);
  doc.text(splitCuerpo, 14, y);
  y += splitCuerpo.length * 5 + 6;

  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DE LA AUDIENCIA FORMAL:', 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.text(`• Fecha de la Sesión: ${caso.fase2_citacion.fechaAudiencia || 'A definir'}`, 16, y);
  y += 5;
  doc.text(`• Hora: ${caso.fase2_citacion.horaAudiencia || '08:30 AM'}`, 16, y);
  y += 5;
  doc.text(`• Lugar / Canal: ${caso.fase2_citacion.lugarOEnlace || 'Sala de Comités del Centro / Sala Virtual'}`, 16, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('DERECHO A SER ESCUCHADO (DESCARGOS) Y APORTE DE PRUEBAS:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const derechosTexto = `En garantía de su derecho fundamental al debido proceso y defensa (Art. 29 C.P.), usted tiene derecho a ser escuchado en audiencia, presentar descargos por escrito antes o durante la diligencia, y allegar todas las pruebas pertinentes (ej. certificados médicos de EPS, soportes de fuerza mayor o caso fortuito). La no comparecencia injustificada no impedirá la continuación del trámite reglamentario.`;
  const splitDerechos = doc.splitTextToSize(derechosTexto, 180);
  doc.text(splitDerechos, 14, y);
  y += splitDerechos.length * 5 + 14;

  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 80, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Comité de Evaluación y Seguimiento', 14, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Secretaría Técnica de Coordinación Académica', 14, y + 8);

  drawInstitutionalFooter(doc, 1, caso.codigoRadicado);
  doc.save(`Citacion_Comite_${caso.codigoRadicado}.pdf`);
}

// 3. PDF del Acta y Recomendación del Comité (Fase 3)
export function generateActaComitePDF(caso: CaseRecord): void {
  const doc = new jsPDF();
  drawInstitutionalHeader(
    doc,
    'ACTA DE RECOMENDACIÓN - COMITÉ DE EVALUACIÓN Y SEGUIMIENTO',
    `Acta No. ${caso.fase3_recomendacion.actaNumero || 'ACT-2026-031'} · Calificación de Falta y Recomendación`
  );

  let y = 48;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. INSTALACIÓN Y MIEMBROS PARTICIPANTES', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`Fecha de la Sesión: ${caso.fase3_recomendacion.fechaSesion || '10/02/2026'}`, 14, y);
  y += 5;
  const miembros = caso.fase3_recomendacion.miembrosParticipantes?.join(', ') || 'Coordinador Académico, Representante Bienestar, Vocero Aprendices, Instructor del Área';
  const splitMiembros = doc.splitTextToSize(`Miembros del Comité: ${miembros}`, 180);
  doc.text(splitMiembros, 14, y);
  y += splitMiembros.length * 5 + 4;

  doc.setFont('helvetica', 'bold');
  doc.text('2. ANÁLISIS DE LA CONDUCTA Y DILIGENCIA DE DESCARGOS', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const comparecencia = caso.fase2_citacion.asistioAudiencia
    ? 'El aprendiz compareció a la diligencia e hizo uso de su derecho a la defensa.'
    : caso.fase2_citacion.descargosPresentados
    ? 'El aprendiz presentó descargos por escrito allegando soportes documentales.'
    : 'El aprendiz no compareció ni justificó su inasistencia dentro del término reglamentario concedido.';
  doc.text(`Estado de comparecencia: ${comparecencia}`, 14, y);
  y += 6;

  if (caso.fase2_citacion.textoDescargos) {
    doc.setFont('helvetica', 'bold');
    doc.text('Síntesis de los descargos presentados por el aprendiz:', 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const splitDescargos = doc.splitTextToSize(caso.fase2_citacion.textoDescargos, 180);
    doc.text(splitDescargos, 14, y);
    y += splitDescargos.length * 5 + 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.text('3. CALIFICACIÓN Y TIPIFICACIÓN DE LA FALTA', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(`• Tipificación de la Falta: ${caso.fase3_recomendacion.tipificacionFalta || 'Académica y Disciplinaria'}`, 16, y);
  y += 5;
  doc.text(`• Calificación de la Falta: ${caso.fase3_recomendacion.calificacionFalta || 'Grave'}`, 16, y);
  y += 5;
  doc.text(`• Criterios Atenuantes: ${caso.fase3_recomendacion.atenuantes?.join(', ') || 'Ninguno demostrado'}`, 16, y);
  y += 5;
  doc.text(`• Criterios Agravantes: ${caso.fase3_recomendacion.agravantes?.join(', ') || 'Afectación a la continuidad de la ruta formativa'}`, 16, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('4. RECOMENDACIÓN TÉCNICA Y MOTIVADA DEL COMITÉ AL SUBDIRECTOR', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const recoMap: Record<string, string> = {
    Cancelacion_Matricula: 'CANCELACIÓN DE LA MATRÍCULA E INHABILIDAD FORMATIVA',
    Plan_Mejoramiento: 'APROBACIÓN DE PLAN DE MEJORAMIENTO DISCIPLINARIO/ACADÉMICO',
    Llamado_Atencion: 'LLAMADO DE ATENCIÓN POR ESCRITO CON COPIA A HOJA DE VIDA',
    Archivo_Expediente: 'ARCHIVO DEFINITIVO DEL EXPEDIENTE POR JUSTIFICACIÓN DE FUERZA MAYOR'
  };
  const recoTexto = recoMap[caso.fase3_recomendacion.recomendacionFinal || 'Cancelacion_Matricula'];
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 94, 53);
  doc.text(`Recomendación: ${recoTexto}`, 14, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const justif = caso.fase3_recomendacion.justificacionRecomendacion || 'Se encuentra configurada la causal de deserción de acuerdo con el artículo 22 numeral 1 del Reglamento del Aprendiz, sin mediar justificación válida dentro del término probatorio.';
  const splitJustif = doc.splitTextToSize(justif, 180);
  doc.text(splitJustif, 14, y);
  y += splitJustif.length * 5 + 14;

  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 70, y);
  doc.line(110, y, 170, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Presidente del Comité', 14, y + 4);
  doc.text('Secretaría Técnica', 110, y + 4);

  drawInstitutionalFooter(doc, 1, caso.codigoRadicado);
  doc.save(`Acta_Comite_${caso.codigoRadicado}.pdf`);
}

// 4. PDF de Resolución de Subdirección - Acto Administrativo Motivado (Fase 4)
export function generateResolucionSubdirectorPDF(caso: CaseRecord): void {
  const doc = new jsPDF();
  drawInstitutionalHeader(
    doc,
    'RESOLUCIÓN SUBDIRECTORAL - ACTO ADMINISTRATIVO',
    `Resolución No. ${caso.fase4_acto_administrativo.resolucionNumero || 'RES-2026-059'} · Despacho de Subdirección de Centro`
  );

  let y = 48;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('EL SUBDIRECTOR DEL CENTRO DE FORMACIÓN EN USO DE SUS FACULTADES LEGALES Y REGLAMENTARIAS,', 14, y);
  y += 5;
  doc.text('EN ESPECIAL LAS CONFERIDAS POR LA LEY 119 DE 1994 Y EL ACUERDO 007 DE 2012, Y', 14, y);

  y += 8;
  doc.setFontSize(10);
  doc.text('CONSIDERANDO:', 14, y);
  y += 5;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const considerandos = [
    `1. Que el Aprendiz ${caso.aprendiz.nombre.toUpperCase()}, identificado con ${caso.aprendiz.tipoDoc} No. ${caso.aprendiz.numeroDoc}, se encuentra matriculado en el programa ${caso.aprendiz.programa}, Ficha ${caso.aprendiz.ficha}.`,
    `2. Que el Instructor del área presentó informe debidamente radicado con evidencias de inasistencia injustificada de más de tres (3) días consecutivos.`,
    `3. Que el Comité de Evaluación y Seguimiento adelantó el debido proceso, profiriendo citación con formulación de cargos y garantizando el derecho de defensa y contradicción.`,
    `4. Que el Comité de Evaluación y Seguimiento sesionó formalmente y emitió recomendación técnica fundada en los hechos y descargos valorados.`
  ];
  considerandos.forEach(c => {
    const splitC = doc.splitTextToSize(c, 180);
    doc.text(splitC, 14, y);
    y += splitC.length * 4.5 + 2;
  });

  y += 4;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('RESUELVE:', 14, y);
  y += 6;

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const dec = caso.fase4_acto_administrativo.decisionSancion === 'Plan_Mejoramiento'
    ? 'ORDENAR la suscripción y cumplimiento de Plan de Mejoramiento Formativo.'
    : caso.fase4_acto_administrativo.decisionSancion === 'Exoneracion_Archivo'
    ? 'ORDENAR el archivo de las presentes diligencias por comprobarse justificación de fuerza mayor.'
    : `ORDENAR LA CANCELACIÓN DE LA MATRÍCULA al Aprendiz ${caso.aprendiz.nombre.toUpperCase()}, con inhabilidad para registrarse en convocatorias del SENA por el término de ${caso.fase4_acto_administrativo.inhabilidadMeses || 6} meses.`;

  const articulos = [
    `ARTÍCULO PRIMERO: ${dec}`,
    `ARTÍCULO SEGUNDO: NOTIFICAR personalmente o por correo electrónico certificado el presente acto administrativo al Aprendiz, conforme al Estatuto del Aprendiz y el CPACA.`,
    `ARTÍCULO TERCERO: Contra la presente Resolución procede el RECURSO DE REPOSICIÓN ante el Subdirector de Centro, el cual deberá ser interpuesto dentro de los cinco (5) días hábiles siguientes a su notificación.`
  ];

  articulos.forEach(art => {
    const splitArt = doc.splitTextToSize(art, 180);
    doc.text(splitArt, 14, y);
    y += splitArt.length * 4.5 + 3;
  });

  y += 12;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 90, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`DR. ${caso.fase4_acto_administrativo.subdirectorNombre || 'SUBDIRECTOR DE CENTRO'}`, 14, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text('Subdirector de Centro de Formación', 14, y + 8);
  doc.text(`Fecha de Expedición: ${caso.fase4_acto_administrativo.fechaExpedicion || new Date().toISOString().split('T')[0]}`, 14, y + 12);

  drawInstitutionalFooter(doc, 1, caso.codigoRadicado);
  doc.save(`Resolucion_Subdireccion_${caso.codigoRadicado}.pdf`);
}

// 5. PDF del Recurso de Reposición y Fallo (Fase 5)
export function generateMemorialRecursoPDF(caso: CaseRecord): void {
  const doc = new jsPDF();
  drawInstitutionalHeader(
    doc,
    'MEMORIAL DE RECURSO DE REPOSICIÓN',
    `Radicado Recurso: ${caso.fase5_recursos.radicadoRecurso || 'REC-2026-012'} · Fase 5: Vía Gubernativa`
  );

  let y = 48;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`SEÑOR SUBDIRECTOR DE CENTRO DE FORMACIÓN`, 14, y);
  y += 5;
  doc.text(`REFERENCIA: RECURSO DE REPOSICIÓN CONTRA RESOLUCIÓN ${caso.fase4_acto_administrativo.resolucionNumero || ''}`, 14, y);
  y += 5;
  doc.text(`EXPEDIENTE No: ${caso.codigoRadicado}`, 14, y);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const textoPresentacion = `Yo, ${caso.aprendiz.nombre}, mayor de edad, identificado con ${caso.aprendiz.tipoDoc} No. ${caso.aprendiz.numeroDoc}, aprendiz de la Ficha ${caso.aprendiz.ficha}, estando dentro del término legal de cinco (5) días hábiles, comedidamente interpongo RECURSO DE REPOSICIÓN contra la Resolución de sanción con fundamento en las siguientes consideraciones:`;
  const splitPres = doc.splitTextToSize(textoPresentacion, 180);
  doc.text(splitPres, 14, y);
  y += splitPres.length * 4.5 + 6;

  doc.setFont('helvetica', 'bold');
  doc.text('ARGUMENTOS Y MOTIVOS DE INCONFORMIDAD:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const args = caso.fase5_recursos.argumentosRecurso || 'Solicito respetuosamente reconsiderar la sanción de cancelación de matrícula, teniendo en cuenta que mi ausencia obedeció a una calamidad doméstica de fuerza mayor debidamente soportada en los anexos que se acompañan.';
  const splitArgs = doc.splitTextToSize(args, 180);
  doc.text(splitArgs, 14, y);
  y += splitArgs.length * 4.5 + 8;

  doc.setFont('helvetica', 'bold');
  doc.text('PRUEBAS Y ANEXOS APORTADOS AL RECURSO (PDF):', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  if (!caso.fase5_recursos.pruebasNuevasPdf || caso.fase5_recursos.pruebasNuevasPdf.length === 0) {
    doc.text('• Documento de justificación y soporte médico / laboral adjunto en el sistema.', 16, y);
    y += 5;
  } else {
    caso.fase5_recursos.pruebasNuevasPdf.forEach((docItem) => {
      doc.text(`• ${docItem.name} (${docItem.fileSize})`, 16, y);
      y += 5;
    });
  }

  y += 6;
  if (caso.fase5_recursos.resuelto) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 94, 53);
    doc.text(`DECISIÓN DEL SUBDIRECTOR SOBRE EL RECURSO: ${caso.fase5_recursos.decisionRecurso?.toUpperCase()}`, 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const mot = caso.fase5_recursos.motivacionDecisionRecurso || 'El despacho evaluó las nuevas pruebas aportadas y profiere decisión motivada definitiva.';
    const splitMot = doc.splitTextToSize(mot, 180);
    doc.text(splitMot, 14, y);
    y += splitMot.length * 4.5 + 8;
  }

  y += 12;
  doc.setDrawColor(148, 163, 184);
  doc.line(14, y, 75, y);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Firma: ${caso.aprendiz.nombre}`, 14, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`C.C./T.I. ${caso.aprendiz.numeroDoc}`, 14, y + 8);
  doc.text(`Fecha Radicación: ${caso.fase5_recursos.fechaInterposicion || new Date().toISOString().split('T')[0]}`, 14, y + 12);

  drawInstitutionalFooter(doc, 1, caso.codigoRadicado);
  doc.save(`Recurso_Reposicion_${caso.codigoRadicado}.pdf`);
}

// Generate sample/simulated PDF data for instant testing
export function createMockSamplePDF(
  type: AttachedPDF['type'],
  name: string,
  uploadedBy: string,
  description: string
): AttachedPDF {
  const hash = Math.random().toString(36).substring(2, 10).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
  return {
    id: 'pdf-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    name: name.endsWith('.pdf') ? name : `${name}.pdf`,
    type,
    fileSize: `${(Math.random() * 1.5 + 0.4).toFixed(1)} MB`,
    uploadDate: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    uploadedBy,
    description,
    verificationHash: `SHA256:${hash}`,
    pagesCount: Math.floor(Math.random() * 4) + 1,
    contentPreview: `Documento PDF Oficial validado por el sistema. Radicado con integridad criptográfica ${hash}. Contiene sellos institucionales, firmas y folios reglamentarios.`
  };
}
