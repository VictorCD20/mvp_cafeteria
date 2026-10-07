'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Settings, Building, Clock, Heart, Save, ShieldAlert, FileText, Filter, CheckCircle2, AlertTriangle, UserCheck } from 'lucide-react';
import { AuditActionType } from '../../types';

export const SettingsView = () => {
  const { config, updateConfig, auditLogs, hasPermission, subTab, setSubTab } = useCodia();

  const activeSubTab: 'general' | 'auditoria' = subTab === 'auditoria' ? 'auditoria' : 'general';
  const setActiveSubTab = (tab: 'general' | 'auditoria') => setSubTab(tab);

  const [cafeteriaName, setCafeteriaName] = useState(config.cafeteriaName);
  const [branchName, setBranchName] = useState(config.branchName);
  const [lateToleranceMinutes, setLateToleranceMinutes] = useState(config.lateToleranceMinutes);
  const [stampsPerReward, setStampsPerReward] = useState(config.stampsPerReward);
  const [address, setAddress] = useState(config.address);
  const [phone, setPhone] = useState(config.phone);

  const [auditFilter, setAuditFilter] = useState<string>('todos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      cafeteriaName,
      branchName,
      lateToleranceMinutes: Number(lateToleranceMinutes),
      stampsPerReward: Number(stampsPerReward),
      address,
      phone
    });
  };

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'todos') return true;
    return log.action === auditFilter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Configuración & Auditoría del Sistema</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Parámetros operativos de la sucursal, tolerancias y bitácora de eventos sensibles.
          </p>
        </div>

        {hasPermission('audit.view') && (
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setActiveSubTab('general')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'general'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveSubTab('auditoria')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeSubTab === 'auditoria'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Bitácora Auditoría ({auditLogs.length})</span>
            </button>
          </div>
        )}
      </div>

      {activeSubTab === 'general' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-500" />
              <span>Datos del Negocio</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Cafetería
                </label>
                <input
                  type="text"
                  value={cafeteriaName}
                  onChange={(e) => setCafeteriaName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la Sucursal
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dirección Completa
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Reglas de Asistencia & Fidelización</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tolerancia Retardos Checador (Minutos)
                </label>
                <input
                  type="number"
                  value={lateToleranceMinutes}
                  onChange={(e) => setLateToleranceMinutes(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sellos para Ganar Recompensa (Default 8)
                </label>
                <input
                  type="number"
                  value={stampsPerReward}
                  onChange={(e) => setStampsPerReward(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </form>
      )}

      {activeSubTab === 'auditoria' && hasPermission('audit.view') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Bitácora de Auditoría de Operaciones Sensibles</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Registro inmutable de descuentos, mermas, ajustes de inventario, cambios de rol y cancelaciones.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl px-3 py-1.5 font-medium"
              >
                <option value="todos">Todas las acciones ({auditLogs.length})</option>
                <option value="descuento">Descuentos</option>
                <option value="merma">Mermas</option>
                <option value="ajuste_inventario">Ajustes de Inventario</option>
                <option value="cambio_rol">Cambios de Rol</option>
                <option value="canje_recompensa">Canjes de Recompensa</option>
                <option value="configuracion">Configuración</option>
                <option value="modificacion_empleado">Modificación Personal</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Acción</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3">Entidad / ID</th>
                  <th className="p-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredAuditLogs.map((log) => {
                  const getActionBadge = (action: AuditActionType) => {
                    switch (action) {
                      case 'descuento':
                        return <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded text-[10px]">Descuento</span>;
                      case 'merma':
                        return <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded text-[10px]">Merma</span>;
                      case 'ajuste_inventario':
                        return <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded text-[10px]">Ajuste Stock</span>;
                      case 'cambio_rol':
                        return <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">Cambio de Rol</span>;
                      case 'canje_recompensa':
                        return <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">Canje Recompensa</span>;
                      case 'configuracion':
                        return <span className="bg-slate-500/10 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded text-[10px]">Configuración</span>;
                      case 'modificacion_empleado':
                        return <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded text-[10px]">Personal</span>;
                      default:
                        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">{action}</span>;
                    }
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">{getActionBadge(log.action)}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-200 font-medium max-w-xs">{log.description}</td>
                      <td className="p-3">
                        {log.targetEntity ? (
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {log.targetEntity}: {log.targetId || '-'}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white text-[11px]">{log.responsibleUserName}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{log.responsibleRole}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

