'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModuleStatus, ModuleTechnicalInfo } from '../types';
import { INITIAL_MODULES, getActiveDependents, canToggleModule } from '../lib/moduleState';

interface ModuleStateContextType {
  modules: Record<string, ModuleTechnicalInfo>;
  isModuleActive: (moduleKey: string) => boolean;
  getModuleStatus: (moduleKey: string) => ModuleStatus;
  getModuleDependents: (moduleKey: string) => string[];
  getActiveDependents: (moduleKey: string) => string[];
  toggleModule: (moduleKey: string) => { success: boolean; message?: string };
  resetModulesToDefault: () => void;
  lastActionMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  clearActionMessage: () => void;
}

const ModuleStateContext = createContext<ModuleStateContextType | undefined>(undefined);

export const ModuleStateProvider = ({ children }: { children: ReactNode }) => {
  const [modules, setModules] = useState<Record<string, ModuleTechnicalInfo>>(INITIAL_MODULES);
  const [lastActionMessage, setLastActionMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const clearActionMessage = () => setLastActionMessage(null);

  const isModuleActive = (moduleKey: string): boolean => {
    const mod = modules[moduleKey];
    if (!mod) return true;
    return mod.status === 'activo' || mod.status === 'simulado';
  };

  const getModuleStatus = (moduleKey: string): ModuleStatus => {
    return modules[moduleKey]?.status || 'activo';
  };

  const getModuleDependents = (moduleKey: string): string[] => {
    return Object.values(modules)
      .filter((m) => m.dependencies.includes(moduleKey))
      .map((m) => m.key);
  };

  const getActiveDeps = (moduleKey: string): string[] => {
    return getActiveDependents(modules, moduleKey);
  };

  const toggleModule = (moduleKey: string): { success: boolean; message?: string } => {
    const check = canToggleModule(modules, moduleKey);
    if (!check.canToggle || !check.newStatus) {
      const msg = check.message || 'Acción no permitida.';
      setLastActionMessage({ type: 'error', text: msg });
      return { success: false, message: msg };
    }

    const target = modules[moduleKey];
    setModules((prev) => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        status: check.newStatus!
      }
    }));

    const msg =
      check.newStatus === 'inactivo'
        ? `Módulo "${target.name}" desactivado.`
        : `Módulo "${target.name}" activado correctamente.`;

    setLastActionMessage({ type: 'success', text: msg });
    return { success: true, message: msg };
  };

  const resetModulesToDefault = () => {
    setModules(INITIAL_MODULES);
    setLastActionMessage({ type: 'info', text: 'Estado de módulos restablecido a la configuración base.' });
  };

  return (
    <ModuleStateContext.Provider
      value={{
        modules,
        isModuleActive,
        getModuleStatus,
        getModuleDependents,
        getActiveDependents: getActiveDeps,
        toggleModule,
        resetModulesToDefault,
        lastActionMessage,
        clearActionMessage
      }}
    >
      {children}
    </ModuleStateContext.Provider>
  );
};

export const useModuleState = (): ModuleStateContextType => {
  const context = useContext(ModuleStateContext);
  if (!context) {
    throw new Error('useModuleState debe usarse dentro de un ModuleStateProvider');
  }
  return context;
};
