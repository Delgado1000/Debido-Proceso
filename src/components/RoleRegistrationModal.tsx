import React, { useState } from 'react';
import {
  X,
  UserCheck,
  GraduationCap,
  Users,
  Scale,
  Save,
  CheckCircle2,
  Sparkles,
  Database,
  Building2,
  Mail,
  Phone,
  CreditCard,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import {
  AprendizRecord,
  InstructorRecord,
  ComiteMiembroRecord,
  SubdirectorRecord,
  SenaDatabase,
  generateRolePassword
} from '../db/database';
import { UserRole } from '../types/desertion';

interface RoleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSaveAprendiz: (data: AprendizRecord) => void;
  onSaveInstructor: (data: InstructorRecord) => void;
  onSaveComite: (data: ComiteMiembroRecord) => void;
  onSaveSubdirector: (data: SubdirectorRecord) => void;
}

export const RoleRegistrationModal: React.FC<RoleRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'aprendiz',
  onSaveAprendiz,
  onSaveInstructor,
  onSaveComite,
  onSaveSubdirector
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<UserRole>(defaultRole);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password visibility & clipboard state
  const [showPassword, setShowPassword] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);

  const handleCopyPassword = (pwd: string, roleKey: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedRole(roleKey);
    setTimeout(() => setCopiedRole(null), 1500);
  };

  // Form 1: Aprendiz
  const [aprNombre, setAprNombre] = useState('');
  const [aprPassword, setAprPassword] = useState('');
  const [aprTipoDoc, setAprTipoDoc] = useState<AprendizRecord['tipoDoc']>('C.C.');
  const [aprNumDoc, setAprNumDoc] = useState('');
  const [aprCorreo, setAprCorreo] = useState('');
  const [aprTelefono, setAprTelefono] = useState('');
  const [aprPrograma, setAprPrograma] = useState('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
  const [aprFicha, setAprFicha] = useState('2849102');
  const [aprJornada, setAprJornada] = useState<AprendizRecord['jornada']>('Diurna');
  const [aprModalidad, setAprModalidad] = useState<AprendizRecord['modalidad']>('Lectiva');
  const [aprCentro, setAprCentro] = useState('Centro de Biotecnología Industrial');
  const [aprRegional, setAprRegional] = useState('Valle del Cauca');
  const [aprContacto, setAprContacto] = useState('');
  const [aprTelEmergencia, setAprTelEmergencia] = useState('');

  // Form 2: Instructor
  const [instNombre, setInstNombre] = useState('');
  const [instPassword, setInstPassword] = useState('');
  const [instTipoDoc, setInstTipoDoc] = useState<InstructorRecord['tipoDoc']>('C.C.');
  const [instNumDoc, setInstNumDoc] = useState('');
  const [instCorreo, setInstCorreo] = useState('');
  const [instTelefono, setInstTelefono] = useState('');
  const [instArea, setInstArea] = useState('Tecnologías de la Información y Software');
  const [instCargo, setInstCargo] = useState('Instructor Técnico / Vocero de Equipo');
  const [instVinculacion, setInstVinculacion] = useState<InstructorRecord['tipoVinculacion']>('Planta');
  const [instFichas, setInstFichas] = useState('2849102, 2721845');
  const [instCentro, setInstCentro] = useState('Centro de Biotecnología Industrial');
  const [instRegional, setInstRegional] = useState('Valle del Cauca');

  // Form 3: Comité
  const [comNombre, setComNombre] = useState('');
  const [comPassword, setComPassword] = useState('');
  const [comTipoDoc, setComTipoDoc] = useState<ComiteMiembroRecord['tipoDoc']>('C.C.');
  const [comNumDoc, setComNumDoc] = useState('');
  const [comCorreo, setComCorreo] = useState('');
  const [comTelefono, setComTelefono] = useState('');
  const [comCargo, setComCargo] = useState<ComiteMiembroRecord['cargoEnComite']>('Coordinador Académico (Presidente)');
  const [comResolucion, setComResolucion] = useState('RES-COMITE-2026-004');
  const [comVigencia, setComVigencia] = useState('2026-12-31');
  const [comCentro, setComCentro] = useState('Centro de Biotecnología Industrial');
  const [comRegional, setComRegional] = useState('Valle del Cauca');

  // Form 4: Subdirector
  const [subNombre, setSubNombre] = useState('');
  const [subPassword, setSubPassword] = useState('');
  const [subTipoDoc, setSubTipoDoc] = useState<SubdirectorRecord['tipoDoc']>('C.C.');
  const [subNumDoc, setSubNumDoc] = useState('');
  const [subCorreo, setSubCorreo] = useState('');
  const [subTelefono, setSubTelefono] = useState('');
  const [subResolucion, setSubResolucion] = useState('Resolución General SENA No. 0842 de 2024');
  const [subPosesion, setSubPosesion] = useState('2024-03-01');
  const [subTarjeta, setSubTarjeta] = useState('T.P. 129048-COL');
  const [subSecretaria, setSubSecretaria] = useState('notificaciones.subdireccion@sena.edu.co');
  const [subCentro, setSubCentro] = useState('Centro de Biotecnología Industrial');
  const [subRegional, setSubRegional] = useState('Valle del Cauca');

  // Demo auto-fill helpers
  const handleAutoFill = () => {
    if (activeTab === 'aprendiz') {
      const nombre = 'María Alejandra Pardo Gómez';
      setAprNombre(nombre);
      setAprPassword(generateRolePassword(nombre));
      setAprNumDoc('1098456123');
      setAprCorreo('maria.pardo@misena.edu.co');
      setAprTelefono('318 920 4455');
      setAprPrograma('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
      setAprFicha('2849102');
      setAprContacto('Elena Gómez (Madre)');
      setAprTelEmergencia('312 400 9988');
    } else if (activeTab === 'instructor') {
      const nombre = 'Ing. Wilson Alberto Garcés Morales';
      setInstNombre(nombre);
      setInstPassword(generateRolePassword(nombre));
      setInstNumDoc('79890123');
      setInstCorreo('wgarces@sena.edu.co');
      setInstTelefono('316 778 9900');
      setInstArea('Ingeniería de Software y Calidad');
      setInstCargo('Instructor Líder de Especialidad');
      setInstFichas('2849102, 2721845');
    } else if (activeTab === 'comite') {
      const nombre = 'Dra. Cecilia Andrade Beltrán';
      setComNombre(nombre);
      setComPassword(generateRolePassword(nombre));
      setComNumDoc('52489012');
      setComCorreo('candrade@sena.edu.co');
      setComTelefono('314 889 0022');
      setComCargo('Coordinador Académico (Presidente)');
      setComResolucion('RES-COMITE-2026-015');
      setComVigencia('2026-12-31');
    } else if (activeTab === 'subdirector') {
      const nombre = 'Dr. Jairo Augusto Ramírez';
      setSubNombre(nombre);
      setSubPassword(generateRolePassword(nombre));
      setSubNumDoc('19456780');
      setSubCorreo('subdireccion_biotecnologia@sena.edu.co');
      setSubTelefono('602 444 8000 Ext 201');
      setSubResolucion('Resolución Dirección General SENA No. 1102 de 2023');
      setSubPosesion('2023-09-01');
      setSubTarjeta('T.P. 98402-ABG');
      setSubSecretaria('notificaciones.biotecnologia@sena.edu.co');
    }
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hoy = new Date().toISOString().split('T')[0];

    if (activeTab === 'aprendiz') {
      if (!aprNombre.trim() || !aprNumDoc.trim()) {
        alert('Por favor ingrese nombre y documento del aprendiz.');
        return;
      }
      const pwd = aprPassword.trim() || generateRolePassword(aprNombre);
      const record: AprendizRecord = {
        id: 'apr-db-' + Date.now(),
        nombre: aprNombre,
        password: pwd,
        tipoDoc: aprTipoDoc,
        numeroDoc: aprNumDoc,
        correo: aprCorreo || `${aprNombre.toLowerCase().replace(/\s+/g, '.')}@misena.edu.co`,
        telefono: aprTelefono || '310 000 0000',
        programa: aprPrograma,
        ficha: aprFicha,
        jornada: aprJornada,
        modalidad: aprModalidad,
        centro: aprCentro,
        regional: aprRegional,
        contactoEmergencia: aprContacto,
        telefonoEmergencia: aprTelEmergencia,
        createdAt: hoy,
        updatedAt: hoy
      };
      onSaveAprendiz(record);
      setSuccessMessage(`Aprendiz ${aprNombre} registrado con contraseña [${pwd}].`);
    } else if (activeTab === 'instructor') {
      if (!instNombre.trim() || !instNumDoc.trim()) {
        alert('Por favor ingrese nombre y documento del instructor.');
        return;
      }
      const pwd = instPassword.trim() || generateRolePassword(instNombre);
      const record: InstructorRecord = {
        id: 'inst-db-' + Date.now(),
        nombre: instNombre,
        password: pwd,
        tipoDoc: instTipoDoc,
        numeroDoc: instNumDoc,
        correo: instCorreo || `${instNombre.toLowerCase().replace(/\s+/g, '.')}@sena.edu.co`,
        telefono: instTelefono || '310 000 0000',
        centro: instCentro,
        regional: instRegional,
        area: instArea,
        cargo: instCargo,
        tipoVinculacion: instVinculacion,
        fichasAsignadas: instFichas.split(',').map((f) => f.trim()).filter(Boolean),
        createdAt: hoy,
        updatedAt: hoy
      };
      onSaveInstructor(record);
      setSuccessMessage(`Instructor ${instNombre} registrado con contraseña [${pwd}].`);
    } else if (activeTab === 'comite') {
      if (!comNombre.trim() || !comNumDoc.trim()) {
        alert('Por favor ingrese nombre y documento del miembro del comité.');
        return;
      }
      const pwd = comPassword.trim() || generateRolePassword(comNombre);
      const record: ComiteMiembroRecord = {
        id: 'com-db-' + Date.now(),
        nombre: comNombre,
        password: pwd,
        tipoDoc: comTipoDoc,
        numeroDoc: comNumDoc,
        correo: comCorreo || `${comNombre.toLowerCase().replace(/\s+/g, '.')}@sena.edu.co`,
        telefono: comTelefono || '310 000 0000',
        centro: comCentro,
        regional: comRegional,
        cargoEnComite: comCargo,
        resolucionDesignacion: comResolucion,
        vigenciaHasta: comVigencia,
        createdAt: hoy,
        updatedAt: hoy
      };
      onSaveComite(record);
      setSuccessMessage(`Miembro de Comité ${comNombre} registrado con contraseña [${pwd}].`);
    } else if (activeTab === 'subdirector') {
      if (!subNombre.trim() || !subNumDoc.trim()) {
        alert('Por favor ingrese nombre y documento del subdirector.');
        return;
      }
      const pwd = subPassword.trim() || generateRolePassword(subNombre);
      const record: SubdirectorRecord = {
        id: 'sub-db-' + Date.now(),
        nombre: subNombre,
        password: pwd,
        tipoDoc: subTipoDoc,
        numeroDoc: subNumDoc,
        correo: subCorreo,
        telefono: subTelefono,
        centro: subCentro,
        regional: subRegional,
        resolucionNombramiento: subResolucion,
        fechaPosesion: subPosesion,
        firmaDigitalCertificada: true,
        tarjetaProfesional: subTarjeta,
        secretariaNotificaciones: subSecretaria,
        createdAt: hoy,
        updatedAt: hoy
      };
      onSaveSubdirector(record);
      setSuccessMessage(`Subdirector ${subNombre} registrado con contraseña [${pwd}].`);
    }

    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Registro de Usuario en la Base de Datos</span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Persistencia Local
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Seleccione el rol para ingresar los datos básicos institucionales que se almacenarán en la base de datos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAutoFill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autocompletar Ejemplo</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Segmented Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 p-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 gap-1 text-xs">
          {[
            { id: 'aprendiz', label: 'Rol Aprendiz', icon: UserCheck },
            { id: 'instructor', label: 'Rol Instructor', icon: GraduationCap },
            { id: 'comite', label: 'Rol Comité', icon: Users },
            { id: 'subdirector', label: 'Rol Subdirector', icon: Scale }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as UserRole);
                  setSuccessMessage(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-semibold transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-2 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* ==================== FORM 1: APRENDIZ ==================== */}
          {activeTab === 'aprendiz' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Datos Básicos del Aprendiz (Ficha Formativa)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Se registrará en la tabla de aprendices para consulta de expedientes, citaciones a comités y recepción de descargos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombres y Apellidos Completos *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Daniel Felipe Castro Lozano"
                    value={aprNombre}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAprNombre(v);
                      setAprPassword(generateRolePassword(v));
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento de Identidad *
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={aprTipoDoc}
                      onChange={(e) => setAprTipoDoc(e.target.value as any)}
                      className="w-20 text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0"
                    >
                      <option value="C.C.">C.C.</option>
                      <option value="T.I.">T.I.</option>
                      <option value="P.P.T.">PPT</option>
                      <option value="C.E.">C.E.</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="1026589334"
                      value={aprNumDoc}
                      onChange={(e) => setAprNumDoc(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Contraseña Institucional Aprendiz */}
                <div className="md:col-span-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Contraseña de Acceso del Aprendiz *</span>
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
                      Regla: 3 primeros dígitos del nombre + 2026 (ej: {generateRolePassword(aprNombre || 'Aprendiz')})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={aprPassword || generateRolePassword(aprNombre || 'Aprendiz')}
                      onChange={(e) => setAprPassword(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 pr-20 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 tracking-wider"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(aprPassword || generateRolePassword(aprNombre || 'Aprendiz'), 'apr')}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>
                      Contraseña activa: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-xs">{aprPassword || generateRolePassword(aprNombre || 'Aprendiz')}</strong>
                    </span>
                    {copiedRole === 'apr' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in">
                        ✓ Copiada al portapapeles
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Institucional (@misena.edu.co)
                  </label>
                  <input
                    type="email"
                    placeholder="nombre.apellido@misena.edu.co"
                    value={aprCorreo}
                    onChange={(e) => setAprCorreo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    type="text"
                    placeholder="315 892 4110"
                    value={aprTelefono}
                    onChange={(e) => setAprTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Ficha de Caracterización *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2849102"
                    value={aprFicha}
                    onChange={(e) => setAprFicha(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Programa de Formación
                  </label>
                  <input
                    type="text"
                    value={aprPrograma}
                    onChange={(e) => setAprPrograma(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Jornada
                  </label>
                  <select
                    value={aprJornada}
                    onChange={(e) => setAprJornada(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Diurna">Diurna</option>
                    <option value="Nocturna">Nocturna</option>
                    <option value="Mixta">Mixta</option>
                    <option value="Virtual">Virtual</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Modalidad Formativa
                  </label>
                  <select
                    value={aprModalidad}
                    onChange={(e) => setAprModalidad(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Lectiva">Etapa Lectiva</option>
                    <option value="Productiva">Etapa Productiva</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Centro de Formación
                  </label>
                  <input
                    type="text"
                    value={aprCentro}
                    onChange={(e) => setAprCentro(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Regional SENA
                  </label>
                  <input
                    type="text"
                    value={aprRegional}
                    onChange={(e) => setAprRegional(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Contacto de Emergencia / Acudiente
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre y Parentesco"
                    value={aprContacto}
                    onChange={(e) => setAprContacto(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono Contacto Emergencia
                  </label>
                  <input
                    type="text"
                    placeholder="311 000 0000"
                    value={aprTelEmergencia}
                    onChange={(e) => setAprTelEmergencia(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== FORM 2: INSTRUCTOR ==================== */}
          {activeTab === 'instructor' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Datos Básicos del Instructor / Equipo Ejecutor
                </h4>
                <p className="text-[11px] text-slate-500">
                  Perfil de instructor facultado para radicar quejas e informes de inasistencia con soporte probatorio PDF.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombres y Apellidos del Instructor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ing. Sandra Milena Ortiz"
                    value={instNombre}
                    onChange={(e) => {
                      const v = e.target.value;
                      setInstNombre(v);
                      setInstPassword(generateRolePassword(v));
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="52890123"
                    value={instNumDoc}
                    onChange={(e) => setInstNumDoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                {/* Contraseña Institucional Instructor */}
                <div className="md:col-span-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Contraseña de Acceso del Instructor *</span>
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
                      Regla: 3 primeros dígitos del nombre + 2026 (ej: {generateRolePassword(instNombre || 'Instructor')})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={instPassword || generateRolePassword(instNombre || 'Instructor')}
                      onChange={(e) => setInstPassword(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 pr-20 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 tracking-wider"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(instPassword || generateRolePassword(instNombre || 'Instructor'), 'inst')}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>
                      Contraseña activa: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-xs">{instPassword || generateRolePassword(instNombre || 'Instructor')}</strong>
                    </span>
                    {copiedRole === 'inst' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in">
                        ✓ Copiada al portapapeles
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Institucional (@sena.edu.co) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="instructor@sena.edu.co"
                    value={instCorreo}
                    onChange={(e) => setInstCorreo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono Celular
                  </label>
                  <input
                    type="text"
                    placeholder="315 220 9011"
                    value={instTelefono}
                    onChange={(e) => setInstTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tipo de Vinculación
                  </label>
                  <select
                    value={instVinculacion}
                    onChange={(e) => setInstVinculacion(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Planta">Carrera Administrativa / Planta</option>
                    <option value="Contratista">Contratista de Prestación de Servicios</option>
                    <option value="Temporal">Planta Temporal</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Área Temática / Especialidad
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Análisis y Desarrollo de Software"
                    value={instArea}
                    onChange={(e) => setInstArea(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Cargo o Rol en el Equipo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Instructor Vocero / Técnico"
                    value={instCargo}
                    onChange={(e) => setInstCargo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fichas Asignadas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="2721845, 2849102, 2694110"
                    value={instFichas}
                    onChange={(e) => setInstFichas(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== FORM 3: COMITÉ ==================== */}
          {activeTab === 'comite' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Datos Básicos de Integrante del Comité de Evaluación y Seguimiento
                </h4>
                <p className="text-[11px] text-slate-500">
                  Registra los miembros oficiales del Comité con su rol estatutario según el Acuerdo 007 de 2012.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombre Completo del Integrante *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Dra. Patricia Elena Duarte Lozada"
                    value={comNombre}
                    onChange={(e) => {
                      const v = e.target.value;
                      setComNombre(v);
                      setComPassword(generateRolePassword(v));
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="51987342"
                    value={comNumDoc}
                    onChange={(e) => setComNumDoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                {/* Contraseña Institucional Comité */}
                <div className="md:col-span-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Contraseña de Acceso de Integrante de Comité *</span>
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
                      Regla: 3 primeros dígitos del nombre + 2026 (ej: {generateRolePassword(comNombre || 'Comité')})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={comPassword || generateRolePassword(comNombre || 'Comité')}
                      onChange={(e) => setComPassword(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 pr-20 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 tracking-wider"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(comPassword || generateRolePassword(comNombre || 'Comité'), 'com')}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>
                      Contraseña activa: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-xs">{comPassword || generateRolePassword(comNombre || 'Comité')}</strong>
                    </span>
                    {copiedRole === 'com' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in">
                        ✓ Copiada al portapapeles
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Rol / Calidad Estatutaria en el Comité *
                  </label>
                  <select
                    value={comCargo}
                    onChange={(e) => setComCargo(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  >
                    <option value="Coordinador Académico (Presidente)">Coordinador Académico (Presidente)</option>
                    <option value="Secretaría Técnica">Secretaría Técnica</option>
                    <option value="Representante de Bienestar">Representante de Bienestar al Aprendiz</option>
                    <option value="Vocero de Aprendices">Vocero de Aprendices de Centro</option>
                    <option value="Instructor del Área Técnica">Instructor del Área Técnica</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Resolución de Designación
                  </label>
                  <input
                    type="text"
                    placeholder="RES-COORD-2025-089"
                    value={comResolucion}
                    onChange={(e) => setComResolucion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Electrónico Institucional
                  </label>
                  <input
                    type="email"
                    placeholder="miembro.comite@sena.edu.co"
                    value={comCorreo}
                    onChange={(e) => setComCorreo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="310 889 0012"
                    value={comTelefono}
                    onChange={(e) => setComTelefono(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Vigencia de la Designación
                  </label>
                  <input
                    type="date"
                    value={comVigencia}
                    onChange={(e) => setComVigencia(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================== FORM 4: SUBDIRECTOR ==================== */}
          {activeTab === 'subdirector' && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  Datos Básicos del Despacho de Subdirección de Centro
                </h4>
                <p className="text-[11px] text-slate-500">
                  Autoridad competente para proferir los Actos Administrativos Motivados (Resoluciones) y fallar los Recursos de Reposición.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombres y Apellidos del Subdirector(a) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Dr. Hernando Gómez Barreto"
                    value={subNombre}
                    onChange={(e) => {
                      const v = e.target.value;
                      setSubNombre(v);
                      setSubPassword(generateRolePassword(v));
                    }}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="19456789"
                    value={subNumDoc}
                    onChange={(e) => setSubNumDoc(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                {/* Contraseña Institucional Subdirector */}
                <div className="md:col-span-3 p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>Contraseña de Acceso de Subdirección *</span>
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
                      Regla: 3 primeros dígitos del nombre + 2026 (ej: {generateRolePassword(subNombre || 'Subdirector')})
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={subPassword || generateRolePassword(subNombre || 'Subdirector')}
                      onChange={(e) => setSubPassword(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 pr-20 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 tracking-wider"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(subPassword || generateRolePassword(subNombre || 'Subdirector'), 'sub')}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                        title="Copiar contraseña"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>
                      Contraseña activa: <strong className="font-mono text-emerald-700 dark:text-emerald-400 text-xs">{subPassword || generateRolePassword(subNombre || 'Subdirector')}</strong>
                    </span>
                    {copiedRole === 'sub' && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold animate-in fade-in">
                        ✓ Copiada al portapapeles
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Resolución / Decreto de Nombramiento o Encargo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Resolución Dirección General SENA No. 1892 de 2023"
                    value={subResolucion}
                    onChange={(e) => setSubResolucion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fecha de Posesión
                  </label>
                  <input
                    type="date"
                    value={subPosesion}
                    onChange={(e) => setSubPosesion(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Matrícula / Tarjeta Profesional
                  </label>
                  <input
                    type="text"
                    placeholder="T.P. 104928-ABG"
                    value={subTarjeta}
                    onChange={(e) => setSubTarjeta(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Correo Oficial del Despacho
                  </label>
                  <input
                    type="email"
                    placeholder="subdireccion_centro@sena.edu.co"
                    value={subCorreo}
                    onChange={(e) => setSubCorreo(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Buzón para Notificaciones Oficiales
                  </label>
                  <input
                    type="email"
                    placeholder="notificaciones.judiciales@sena.edu.co"
                    value={subSecretaria}
                    onChange={(e) => setSubSecretaria(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar en la Base de Datos</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
