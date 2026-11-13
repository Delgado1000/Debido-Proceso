import React, { useState } from 'react';
import {
  X,
  Database,
  UserCheck,
  GraduationCap,
  Users,
  Scale,
  Plus,
  Search,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react';
import {
  SenaDatabase,
  AprendizRecord,
  InstructorRecord,
  ComiteMiembroRecord,
  SubdirectorRecord,
  generateRolePassword
} from '../db/database';
import { UserRole } from '../types/desertion';

interface DatabaseExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  database: SenaDatabase;
  onOpenCreateModal: (role: UserRole) => void;
  onDeleteRecord: (collection: keyof SenaDatabase, id: string) => void;
  onResetDatabase: () => void;
}

export const DatabaseExplorerModal: React.FC<DatabaseExplorerModalProps> = ({
  isOpen,
  onClose,
  database,
  onOpenCreateModal,
  onDeleteRecord,
  onResetDatabase
}) => {
  if (!isOpen) return null;

  const [activeCollection, setActiveCollection] = useState<keyof SenaDatabase>('aprendices');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswords, setShowPasswords] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPassword = (pwd: string, id: string) => {
    navigator.clipboard.writeText(pwd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SENA_BaseDatos_Roles_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter items
  const query = searchQuery.toLowerCase();

  const filteredAprendices = database.aprendices.filter(
    (a) =>
      a.nombre.toLowerCase().includes(query) ||
      a.numeroDoc.includes(query) ||
      a.ficha.includes(query) ||
      a.programa.toLowerCase().includes(query)
  );

  const filteredInstructores = database.instructores.filter(
    (i) =>
      i.nombre.toLowerCase().includes(query) ||
      i.numeroDoc.includes(query) ||
      i.area.toLowerCase().includes(query) ||
      i.correo.toLowerCase().includes(query)
  );

  const filteredComite = database.comite_miembros.filter(
    (c) =>
      c.nombre.toLowerCase().includes(query) ||
      c.numeroDoc.includes(query) ||
      c.cargoEnComite.toLowerCase().includes(query) ||
      c.resolucionDesignacion.toLowerCase().includes(query)
  );

  const filteredSubdirectores = database.subdirectores.filter(
    (s) =>
      s.nombre.toLowerCase().includes(query) ||
      s.numeroDoc.includes(query) ||
      s.centro.toLowerCase().includes(query) ||
      s.resolucionNombramiento.toLowerCase().includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Base de Datos Institucional · Registro de Roles</span>
                <span className="text-[11px] font-mono font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Storage Activo
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Almacén persistente de personas y despachos para la vinculación en debidos procesos disciplinarios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Mostrar u ocultar contraseñas de todos los roles"
            >
              {showPasswords ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{showPasswords ? 'Ocultar Claves' : 'Ver Claves'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
              title="Descargar copia de seguridad en JSON"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar JSON</span>
            </button>
            <button
              type="button"
              onClick={onResetDatabase}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
              title="Restablecer base de datos inicial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collection Selector & Search Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'aprendices', label: 'Aprendices', count: database.aprendices.length, icon: UserCheck },
              { id: 'instructores', label: 'Instructores', count: database.instructores.length, icon: GraduationCap },
              { id: 'comite_miembros', label: 'Comité', count: database.comite_miembros.length, icon: Users },
              { id: 'subdirectores', label: 'Subdirección', count: database.subdirectores.length, icon: Scale }
            ].map((col) => {
              const Icon = col.icon;
              const isSelected = activeCollection === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setActiveCollection(col.id as any)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{col.label}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {col.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar en la base de datos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const roleMap: Record<keyof SenaDatabase, UserRole> = {
                  aprendices: 'aprendiz',
                  instructores: 'instructor',
                  comite_miembros: 'comite',
                  subdirectores: 'subdirector'
                };
                onOpenCreateModal(roleMap[activeCollection]);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Registro</span>
            </button>
          </div>
        </div>

        {/* Collection Tables */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          {/* APRENDICES TABLE */}
          {activeCollection === 'aprendices' && (
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Aprendiz</th>
                    <th className="py-2.5 px-3">Documento</th>
                    <th className="py-2.5 px-3">Contraseña (3 letras + 2026)</th>
                    <th className="py-2.5 px-3">Ficha y Programa</th>
                    <th className="py-2.5 px-3">Contacto</th>
                    <th className="py-2.5 px-3">Jornada</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAprendices.map((apr) => {
                    const pwd = apr.password || generateRolePassword(apr.nombre);
                    return (
                      <tr key={apr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {apr.nombre}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {apr.tipoDoc} {apr.numeroDoc}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              {showPasswords ? pwd : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(pwd, apr.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Copiar contraseña"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {copiedId === apr.id && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-semibold text-emerald-800 dark:text-emerald-400 block">
                            Ficha {apr.ficha}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{apr.programa}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p>{apr.correo}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{apr.telefono}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          {apr.jornada} · {apr.modalidad}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteRecord('aprendices', apr.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* INSTRUCTORES TABLE */}
          {activeCollection === 'instructores' && (
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3">Documento</th>
                    <th className="py-2.5 px-3">Contraseña (3 letras + 2026)</th>
                    <th className="py-2.5 px-3">Área / Cargo</th>
                    <th className="py-2.5 px-3">Correo SENA</th>
                    <th className="py-2.5 px-3">Fichas</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredInstructores.map((inst) => {
                    const pwd = inst.password || generateRolePassword(inst.nombre);
                    return (
                      <tr key={inst.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {inst.nombre}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {inst.tipoDoc} {inst.numeroDoc}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              {showPasswords ? pwd : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(pwd, inst.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Copiar contraseña"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {copiedId === inst.id && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p className="font-semibold">{inst.cargo}</p>
                          <p className="text-[11px] text-slate-500">{inst.area}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p>{inst.correo}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{inst.telefono}</p>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                          {inst.fichasAsignadas.join(', ')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteRecord('instructores', inst.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* COMITÉ TABLE */}
          {activeCollection === 'comite_miembros' && (
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Miembro del Comité</th>
                    <th className="py-2.5 px-3">Contraseña (3 letras + 2026)</th>
                    <th className="py-2.5 px-3">Rol Estatutario</th>
                    <th className="py-2.5 px-3">Resolución Designación</th>
                    <th className="py-2.5 px-3">Contacto</th>
                    <th className="py-2.5 px-3">Vigencia</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredComite.map((com) => {
                    const pwd = com.password || generateRolePassword(com.nombre);
                    return (
                      <tr key={com.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {com.nombre}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              {showPasswords ? pwd : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(pwd, com.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Copiar contraseña"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {copiedId === com.id && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-800 dark:text-emerald-400">
                          {com.cargoEnComite}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {com.resolucionDesignacion}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p>{com.correo}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{com.telefono}</p>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                          {com.vigenciaHasta}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteRecord('comite_miembros', com.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* SUBDIRECTORES TABLE */}
          {activeCollection === 'subdirectores' && (
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Subdirector(a)</th>
                    <th className="py-2.5 px-3">Contraseña (3 letras + 2026)</th>
                    <th className="py-2.5 px-3">Centro / Regional</th>
                    <th className="py-2.5 px-3">Resolución Nombramiento</th>
                    <th className="py-2.5 px-3">Despacho Oficial</th>
                    <th className="py-2.5 px-3">Firma Digital</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubdirectores.map((sub) => {
                    const pwd = sub.password || generateRolePassword(sub.nombre);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900 dark:text-white">{sub.nombre}</p>
                          <p className="text-[11px] text-slate-500">{sub.tarjetaProfesional}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              {showPasswords ? pwd : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyPassword(pwd, sub.id)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Copiar contraseña"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            {copiedId === sub.id && (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p className="font-semibold">{sub.centro}</p>
                          <p className="text-[11px] text-slate-500">{sub.regional}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p className="font-mono text-[11px]">{sub.resolucionNombramiento}</p>
                          <p className="text-[10px] text-slate-400">Posesión: {sub.fechaPosesion}</p>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <p>{sub.correo}</p>
                          <p className="text-[11px] text-slate-400">{sub.telefono}</p>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Certificada
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteRecord('subdirectores', sub.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs text-slate-500">
          <span>Base de datos almacenada con persistencia local en su navegador</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cerrar Vista
          </button>
        </div>
      </div>
    </div>
  );
};
