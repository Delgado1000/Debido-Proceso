/**
 * Base de Datos Institucional SENA para Roles y Usuarios del Debido Proceso
 * Proporciona almacenamiento persistente para Aprendices, Instructores,
 * Integrantes de Comité y Subdirectores de Centro.
 */

export interface AprendizRecord {
  id: string;
  nombre: string;
  password?: string;
  tipoDoc: 'C.C.' | 'T.I.' | 'P.P.T.' | 'C.E.';
  numeroDoc: string;
  correo: string;
  telefono: string;
  programa: string;
  ficha: string;
  jornada: 'Diurna' | 'Nocturna' | 'Mixta' | 'Virtual';
  modalidad: 'Lectiva' | 'Productiva';
  centro: string;
  regional: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InstructorRecord {
  id: string;
  nombre: string;
  password?: string;
  tipoDoc: 'C.C.' | 'C.E.';
  numeroDoc: string;
  correo: string;
  telefono: string;
  centro: string;
  regional: string;
  area: string;
  cargo: string;
  tipoVinculacion: 'Planta' | 'Contratista' | 'Temporal';
  fichasAsignadas: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ComiteMiembroRecord {
  id: string;
  nombre: string;
  password?: string;
  tipoDoc: 'C.C.' | 'C.E.' | 'T.I.';
  numeroDoc: string;
  correo: string;
  telefono: string;
  centro: string;
  regional: string;
  cargoEnComite:
    | 'Coordinador Académico (Presidente)'
    | 'Secretaría Técnica'
    | 'Representante de Bienestar'
    | 'Vocero de Aprendices'
    | 'Instructor del Área Técnica';
  resolucionDesignacion: string;
  vigenciaHasta: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubdirectorRecord {
  id: string;
  nombre: string;
  password?: string;
  tipoDoc: 'C.C.' | 'C.E.';
  numeroDoc: string;
  correo: string;
  telefono: string;
  centro: string;
  regional: string;
  resolucionNombramiento: string;
  fechaPosesion: string;
  firmaDigitalCertificada: boolean;
  tarjetaProfesional: string;
  secretariaNotificaciones: string;
  createdAt: string;
  updatedAt: string;
}

export interface SenaDatabase {
  aprendices: AprendizRecord[];
  instructores: InstructorRecord[];
  comite_miembros: ComiteMiembroRecord[];
  subdirectores: SubdirectorRecord[];
}

/**
 * Genera la contraseña según la regla institucional:
 * Los 3 primeros dígitos/caracteres del nombre y el número 2026.
 * Ejemplo: "Carlos" -> "Car2026", "Sandra" -> "San2026"
 */
export function generateRolePassword(nombre: string): string {
  if (!nombre || !nombre.trim()) return 'SEN2026';
  // Omitir prefijos honoríficos para obtener el nombre de pila
  const sinPrefijo = nombre
    .replace(/^(ing\.|dr\.|dra\.|lic\.|psic\.)\s+/i, '')
    .trim();
  const base = sinPrefijo.length >= 3 ? sinPrefijo : nombre.trim();
  const letras = base.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').slice(0, 3);
  if (letras.length === 0) return 'SEN2026';
  const formateado = letras.charAt(0).toUpperCase() + letras.slice(1).toLowerCase();
  return `${formateado}2026`;
}

const DB_STORAGE_KEY = 'sena_due_process_database_v2';

export const INITIAL_DATABASE: SenaDatabase = {
  aprendices: [
    {
      id: 'apr-db-1',
      nombre: 'Carlos Andrés Medina Rojas',
      password: generateRolePassword('Carlos Andrés Medina Rojas'),
      tipoDoc: 'C.C.',
      numeroDoc: '1098765432',
      correo: 'carlos.medina.aprendiz@misena.edu.co',
      telefono: '315 892 4110',
      programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      ficha: '2721845',
      jornada: 'Diurna',
      modalidad: 'Lectiva',
      centro: 'Centro de Biotecnología Industrial',
      regional: 'Valle del Cauca',
      contactoEmergencia: 'Rosa Rojas (Madre)',
      telefonoEmergencia: '316 489 1230',
      createdAt: '2026-01-15',
      updatedAt: '2026-01-15'
    },
    {
      id: 'apr-db-2',
      nombre: 'Valentina Restrepo Hincapié',
      password: generateRolePassword('Valentina Restrepo Hincapié'),
      tipoDoc: 'C.C.',
      numeroDoc: '1017849201',
      correo: 'valentina.restrepo@misena.edu.co',
      telefono: '320 644 1928',
      programa: 'Tecnólogo en Gestión Empresarial',
      ficha: '2694110',
      jornada: 'Mixta',
      modalidad: 'Lectiva',
      centro: 'Centro de Comercio y Servicios',
      regional: 'Antioquia',
      contactoEmergencia: 'Jorge Restrepo (Padre)',
      telefonoEmergencia: '311 908 1277',
      createdAt: '2026-01-10',
      updatedAt: '2026-01-10'
    },
    {
      id: 'apr-db-3',
      nombre: 'Brayan Estiven Gómez Cano',
      password: generateRolePassword('Brayan Estiven Gómez Cano'),
      tipoDoc: 'C.C.',
      numeroDoc: '1128405921',
      correo: 'brayan.gomez@misena.edu.co',
      telefono: '311 723 9984',
      programa: 'Mantenimiento Mecatrónico de Automotores',
      ficha: '2618990',
      jornada: 'Nocturna',
      modalidad: 'Lectiva',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      contactoEmergencia: 'Lucía Cano (Madre)',
      telefonoEmergencia: '314 556 2200',
      createdAt: '2026-01-08',
      updatedAt: '2026-01-08'
    },
    {
      id: 'apr-db-4',
      nombre: 'Camila Andrea Torres Valencia',
      password: generateRolePassword('Camila Andrea Torres Valencia'),
      tipoDoc: 'C.C.',
      numeroDoc: '1094837261',
      correo: 'camila.torres@misena.edu.co',
      telefono: '316 489 1230',
      programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
      ficha: '2849102',
      jornada: 'Diurna',
      modalidad: 'Lectiva',
      centro: 'Centro de Biotecnología Industrial',
      regional: 'Valle del Cauca',
      contactoEmergencia: 'Alberto Torres (Padre)',
      telefonoEmergencia: '318 765 4321',
      createdAt: '2026-02-01',
      updatedAt: '2026-02-01'
    }
  ],
  instructores: [
    {
      id: 'inst-db-1',
      nombre: 'Ing. Sandra Milena Ortiz',
      password: generateRolePassword('Ing. Sandra Milena Ortiz'),
      tipoDoc: 'C.C.',
      numeroDoc: '52890123',
      correo: 'sortiz@sena.edu.co',
      telefono: '315 220 9011',
      centro: 'Centro de Biotecnología Industrial',
      regional: 'Valle del Cauca',
      area: 'Desarrollo de Software y Base de Datos',
      cargo: 'Instructora Técnica y Vocera de Equipo',
      tipoVinculacion: 'Planta',
      fichasAsignadas: ['2721845', '2849102'],
      createdAt: '2025-11-20',
      updatedAt: '2025-11-20'
    },
    {
      id: 'inst-db-2',
      nombre: 'Dr. Fernando Duque Pardo',
      password: generateRolePassword('Dr. Fernando Duque Pardo'),
      tipoDoc: 'C.C.',
      numeroDoc: '71904512',
      correo: 'fduque@sena.edu.co',
      telefono: '320 890 1244',
      centro: 'Centro de Comercio y Servicios',
      regional: 'Antioquia',
      area: 'Administración y Finanzas',
      cargo: 'Instructor Líder de Ficha',
      tipoVinculacion: 'Contratista',
      fichasAsignadas: ['2694110'],
      createdAt: '2025-11-15',
      updatedAt: '2025-11-15'
    },
    {
      id: 'inst-db-3',
      nombre: 'Ing. Carlos Alberto Manrique',
      password: generateRolePassword('Ing. Carlos Alberto Manrique'),
      tipoDoc: 'C.C.',
      numeroDoc: '80123456',
      correo: 'cmanrique@sena.edu.co',
      telefono: '311 445 6789',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      area: 'Mecatrónica Automotriz',
      cargo: 'Instructor Técnico de Taller',
      tipoVinculacion: 'Planta',
      fichasAsignadas: ['2618990'],
      createdAt: '2025-10-30',
      updatedAt: '2025-10-30'
    }
  ],
  comite_miembros: [
    {
      id: 'com-db-1',
      nombre: 'Dra. Patricia Elena Duarte Lozada',
      password: generateRolePassword('Dra. Patricia Elena Duarte Lozada'),
      tipoDoc: 'C.C.',
      numeroDoc: '51987342',
      correo: 'pduarte@sena.edu.co',
      telefono: '310 889 0012',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      cargoEnComite: 'Coordinador Académico (Presidente)',
      resolucionDesignacion: 'RES-COORD-2025-089',
      vigenciaHasta: '2026-12-31',
      createdAt: '2025-12-01',
      updatedAt: '2025-12-01'
    },
    {
      id: 'com-db-2',
      nombre: 'Psic. Germán Andrés Botero',
      password: generateRolePassword('Psic. Germán Andrés Botero'),
      tipoDoc: 'C.C.',
      numeroDoc: '79845120',
      correo: 'gbotero@sena.edu.co',
      telefono: '313 770 1289',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      cargoEnComite: 'Representante de Bienestar',
      resolucionDesignacion: 'RES-BIEN-2025-014',
      vigenciaHasta: '2026-12-31',
      createdAt: '2025-12-01',
      updatedAt: '2025-12-01'
    },
    {
      id: 'com-db-3',
      nombre: 'Mariana Soler Cárdenas',
      password: generateRolePassword('Mariana Soler Cárdenas'),
      tipoDoc: 'T.I.',
      numeroDoc: '1078901234',
      correo: 'mariana.soler@misena.edu.co',
      telefono: '318 665 4321',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      cargoEnComite: 'Vocero de Aprendices',
      resolucionDesignacion: 'ACT-ELEC-2025-03',
      vigenciaHasta: '2026-06-30',
      createdAt: '2025-12-05',
      updatedAt: '2025-12-05'
    }
  ],
  subdirectores: [
    {
      id: 'sub-db-1',
      nombre: 'Dr. Hernando Gómez Barreto',
      password: generateRolePassword('Dr. Hernando Gómez Barreto'),
      tipoDoc: 'C.C.',
      numeroDoc: '19456789',
      correo: 'subdireccion_transporte@sena.edu.co',
      telefono: '601 546 1500 Ext. 1420',
      centro: 'Centro de Tecnologías del Transporte',
      regional: 'Distrito Capital',
      resolucionNombramiento: 'Resolución General SENA No. 1892 de 2023',
      fechaPosesion: '2023-08-15',
      firmaDigitalCertificada: true,
      tarjetaProfesional: 'T.P. 104928-ABG',
      secretariaNotificaciones: 'notificaciones.transporte@sena.edu.co',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-01'
    },
    {
      id: 'sub-db-2',
      nombre: 'Dr. Álvaro Enrique Fonseca',
      password: generateRolePassword('Dr. Álvaro Enrique Fonseca'),
      tipoDoc: 'C.C.',
      numeroDoc: '14234567',
      correo: 'subdireccion_cenigraf@sena.edu.co',
      telefono: '601 546 1500 Ext. 1822',
      centro: 'Centro para la Industria de la Comunicación Gráfica (CENIGRAF)',
      regional: 'Distrito Capital',
      resolucionNombramiento: 'Resolución General SENA No. 0451 de 2024',
      fechaPosesion: '2024-02-01',
      firmaDigitalCertificada: true,
      tarjetaProfesional: 'T.P. 89201-ING',
      secretariaNotificaciones: 'notificaciones.cenigraf@sena.edu.co',
      createdAt: '2025-10-01',
      updatedAt: '2025-10-01'
    }
  ]
};

// Database Service Functions
export function loadDatabase(): SenaDatabase {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.aprendices && parsed.instructores && parsed.comite_miembros && parsed.subdirectores) {
        // Garantizar que todos los registros tengan contraseña generada
        return {
          aprendices: parsed.aprendices.map((a: AprendizRecord) => ({
            ...a,
            password: a.password || generateRolePassword(a.nombre)
          })),
          instructores: parsed.instructores.map((i: InstructorRecord) => ({
            ...i,
            password: i.password || generateRolePassword(i.nombre)
          })),
          comite_miembros: parsed.comite_miembros.map((c: ComiteMiembroRecord) => ({
            ...c,
            password: c.password || generateRolePassword(c.nombre)
          })),
          subdirectores: parsed.subdirectores.map((s: SubdirectorRecord) => ({
            ...s,
            password: s.password || generateRolePassword(s.nombre)
          }))
        };
      }
    }
  } catch (err) {
    console.error('Error al cargar la base de datos:', err);
  }
  return INITIAL_DATABASE;
}

export function saveDatabase(db: SenaDatabase): void {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Error al guardar en la base de datos:', err);
  }
}

export function resetDatabase(): SenaDatabase {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_DATABASE));
  return INITIAL_DATABASE;
}
