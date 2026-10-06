'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Settings, Building, Clock, Save } from 'lucide-react';

export const SettingsView = () => {
  const { config, updateConfig } = useCodia();

  const [cafeteriaName, setCafeteriaName] = useState(config.cafeteriaName);
  const [branchName, setBranchName] = useState(config.branchName);
  const [lateToleranceMinutes, setLateToleranceMinutes] = useState(config.lateToleranceMinutes);
  const [stampsPerReward, setStampsPerReward] = useState(config.stampsPerReward);
  const [address, setAddress] = useState(config.address);
  const [phone, setPhone] = useState(config.phone);

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

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Configuración General del Sistema</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Parámetros operativos de la sucursal, tolerancias y reglas de fidelización.
          </p>
        </div>
      </div>

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
    </div>
  );
};
