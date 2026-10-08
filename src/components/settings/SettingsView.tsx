'use client';

import React, { useState, useEffect } from 'react';
import { useCodia } from '../../context/CodiaContext';
import {
  Settings,
  Building,
  Clock,
  Save,
  ShieldAlert,
  Palette,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Maximize2,
  Minimize2,
  Coffee,
  CupSoda,
  Flame,
  Sparkles,
  Store,
  Check,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  ShoppingBag,
  Heart,
  Tag,
  Filter
} from 'lucide-react';
import { AuditActionType, ThemePresetKey, ThemeMode, VisualDensity, BrandLogoType, ThemeColors } from '../../types';
import { defaultPresets, getActiveThemeColors, getContrastRatio, isAccessibleContrast } from '../../lib/theme';

export const SettingsView = () => {
  const {
    config,
    updateConfig,
    updateAppearance,
    resetAppearance,
    auditLogs,
    hasPermission,
    currentUser,
    subTab,
    setSubTab
  } = useCodia();

  const activeSubTab: 'general' | 'apariencia' | 'auditoria' =
    subTab === 'auditoria' ? 'auditoria' : subTab === 'apariencia' ? 'apariencia' : 'general';
  const setActiveSubTab = (tab: 'general' | 'apariencia' | 'auditoria') => setSubTab(tab);

  // General Settings State
  const [cafeteriaName, setCafeteriaName] = useState(config.cafeteriaName);
  const [branchName, setBranchName] = useState(config.branchName);
  const [lateToleranceMinutes, setLateToleranceMinutes] = useState(config.lateToleranceMinutes);
  const [stampsPerReward, setStampsPerReward] = useState(config.stampsPerReward);
  const [address, setAddress] = useState(config.address);
  const [phone, setPhone] = useState(config.phone);

  // Appearance State (initialized from config.appearance)
  const appearance = config.appearance;
  const [activeTheme, setActiveTheme] = useState<ThemePresetKey>(appearance?.activeTheme || 'cafe');
  const [themeMode, setThemeMode] = useState<ThemeMode>(appearance?.mode || 'light');
  const [density, setDensity] = useState<VisualDensity>(appearance?.density || 'comfortable');
  const [brandName, setBrandName] = useState<string>(appearance?.brandName || config.cafeteriaName);
  const [brandLogo, setBrandLogo] = useState<BrandLogoType>(appearance?.brandLogo || 'coffee');
  const [customColors, setCustomColors] = useState<ThemeColors>(
    appearance?.customColors || defaultPresets.cafe
  );

  const [auditFilter, setAuditFilter] = useState<string>('todos');

  // Sincronizar estado local cuando cambia config
  useEffect(() => {
    if (config.appearance) {
      setActiveTheme(config.appearance.activeTheme);
      setThemeMode(config.appearance.mode);
      setDensity(config.appearance.density);
      setBrandName(config.appearance.brandName || config.cafeteriaName);
      setBrandLogo(config.appearance.brandLogo || 'coffee');
      setCustomColors(config.appearance.customColors || defaultPresets.cafe);
    }
  }, [config.appearance, config.cafeteriaName]);

  const canManage = hasPermission('settings.manage');

  const handleGeneralSubmit = (e: React.FormEvent) => {
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

  const handleThemePresetSelect = (presetKey: ThemePresetKey) => {
    if (!canManage) return;
    setActiveTheme(presetKey);
    if (presetKey !== 'personalizado') {
      const preset = defaultPresets[presetKey as keyof typeof defaultPresets] || defaultPresets.cafe;
      setCustomColors({
        primary: preset.primary,
        secondary: preset.secondary,
        accent: preset.accent,
        background: preset.background,
        surface: preset.surface,
        foreground: preset.foreground,
        button: preset.button || preset.primary
      });
      updateAppearance({
        activeTheme: presetKey,
        mode: presetKey === 'oscuro' ? 'dark' : themeMode,
        density,
        brandName,
        brandLogo
      });
    }
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    if (!canManage) return;
    const updated = { ...customColors, [key]: value };
    setCustomColors(updated);
    setActiveTheme('personalizado');
    updateAppearance({
      activeTheme: 'personalizado',
      customColors: updated,
      mode: themeMode,
      density,
      brandName,
      brandLogo
    });
  };

  const handleModeChange = (newMode: ThemeMode) => {
    if (!canManage) return;
    setThemeMode(newMode);
    updateAppearance({
      mode: newMode
    });
  };

  const handleDensityChange = (newDensity: VisualDensity) => {
    if (!canManage) return;
    setDensity(newDensity);
    updateAppearance({
      density: newDensity
    });
  };

  const handleBrandSave = () => {
    if (!canManage) return;
    updateAppearance({
      brandName,
      brandLogo,
      activeTheme,
      mode: themeMode,
      density,
      customColors
    });
  };

  const handleRestoreDefaults = () => {
    if (!canManage) return;
    resetAppearance();
  };

  // Preview Colors Active
  const previewColors = activeTheme === 'personalizado' ? customColors : (defaultPresets[activeTheme as keyof typeof defaultPresets] || defaultPresets.cafe);
  const textContrastRatio = getContrastRatio(previewColors.foreground, previewColors.background);
  const isTextAccessible = isAccessibleContrast(previewColors.foreground, previewColors.background);
  const buttonContrastRatio = getContrastRatio('#FFFFFF', previewColors.button || previewColors.primary);

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditFilter === 'todos') return true;
    return log.action === auditFilter;
  });

  const logoIcons = [
    { key: 'coffee' as BrandLogoType, label: 'Café Grano', icon: Coffee },
    { key: 'cup' as BrandLogoType, label: 'Taza / Bebida', icon: CupSoda },
    { key: 'flame' as BrandLogoType, label: 'Tostado / Fuego', icon: Flame },
    { key: 'sparkles' as BrandLogoType, label: 'Gourmet / Premium', icon: Sparkles },
    { key: 'store' as BrandLogoType, label: 'Sucursal / Local', icon: Store }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Configuración & Apariencia</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Personaliza la identidad visual, colores temáticos, parámetros operativos y bitácora de auditoría.
          </p>
        </div>

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
            onClick={() => setActiveSubTab('apariencia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'apariencia'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Apariencia & Temas</span>
          </button>
          {hasPermission('audit.view') && (
            <button
              onClick={() => setActiveSubTab('auditoria')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeSubTab === 'auditoria'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Bitácora ({auditLogs.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* SubTab 1: General */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleGeneralSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold disabled:opacity-60"
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold disabled:opacity-60"
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs disabled:opacity-60"
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs disabled:opacity-60"
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold disabled:opacity-60"
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
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {canManage && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración General</span>
            </button>
          )}
        </form>
      )}

      {/* SubTab 2: Apariencia & Temas */}
      {activeSubTab === 'apariencia' && (
        <div className="space-y-6">
          {/* Permiso Info Banner si no es Admin */}
          {!canManage && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 p-4 rounded-2xl text-xs flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Modo Consulta:</span> El rol {currentUser.role} no tiene permisos para modificar la apariencia o paleta de colores de la cafetería. Solo los administradores pueden guardar cambios de tema.
              </div>
            </div>
          )}

          {/* Temas Predeterminados Cards */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-500" />
                  <span>Temas Predeterminados</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Selecciona una identidad visual balanceada y optimizada para contraste.
                </p>
              </div>

              {canManage && (
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-medium transition"
                  title="Restaurar a tema original de fábrica"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Predeterminado</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(defaultPresets) as Array<keyof typeof defaultPresets>).map((key) => {
                const preset = defaultPresets[key];
                const isSelected = activeTheme === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleThemePresetSelect(key)}
                    disabled={!canManage}
                    className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{preset.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        {preset.description}
                      </p>
                    </div>

                    {/* Muestras de color */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: preset.primary }} title="Primario" />
                      <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: preset.secondary }} title="Secundario" />
                      <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: preset.accent }} title="Acento" />
                      <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: preset.background }} title="Fondo" />
                      <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: preset.foreground }} title="Texto" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ajustes de Modo, Densidad e Identidad Comercial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modo de Visualización & Densidad */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Modo Visual & Densidad
              </h3>

              {/* Selector Modo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Esquema de Color (Claro / Oscuro)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleModeChange('light')}
                    disabled={!canManage}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      themeMode === 'light'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('dark')}
                    disabled={!canManage}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      themeMode === 'dark'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span>Oscuro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeChange('system')}
                    disabled={!canManage}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      themeMode === 'system'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-slate-400" />
                    <span>Automático</span>
                  </button>
                </div>
              </div>

              {/* Selector Densidad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Densidad de la Interfaz
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDensityChange('comfortable')}
                    disabled={!canManage}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      density === 'comfortable'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                    <span>Cómoda (Default)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDensityChange('compact')}
                    disabled={!canManage}
                    className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition ${
                      density === 'compact'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Minimize2 className="w-4 h-4 text-blue-500" />
                    <span>Compacta (POS rápido)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Identidad Comercial & Logo */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Identidad Comercial
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Comercial en la Aplicación
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  disabled={!canManage}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ícono de Logo de la Cafetería
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {logoIcons.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (!canManage) return;
                        setBrandLogo(key);
                        updateAppearance({ brandLogo: key });
                      }}
                      disabled={!canManage}
                      title={label}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition ${
                        brandLogo === key
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              {canManage && (
                <button
                  type="button"
                  onClick={handleBrandSave}
                  className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Actualizar Identidad</span>
                </button>
              )}
            </div>
          </div>

          {/* Editor de Paleta de Colores Hexadecimal */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-500" />
                <span>Editor Fino de Colores (Variables CSS)</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Tema activo: {activeTheme}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {[
                { key: 'primary' as keyof ThemeColors, label: 'Primario' },
                { key: 'secondary' as keyof ThemeColors, label: 'Secundario' },
                { key: 'accent' as keyof ThemeColors, label: 'Acento' },
                { key: 'background' as keyof ThemeColors, label: 'Fondo' },
                { key: 'surface' as keyof ThemeColors, label: 'Tarjetas' },
                { key: 'foreground' as keyof ThemeColors, label: 'Texto' },
                { key: 'button' as keyof ThemeColors, label: 'Botones' }
              ].map(({ key, label }) => (
                <div key={key} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors[key] || '#7A4B2A'}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      disabled={!canManage}
                      className="w-7 h-7 rounded-lg cursor-pointer border border-slate-300 dark:border-slate-600 p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={customColors[key] || ''}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      disabled={!canManage}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono uppercase"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Accesibilidad y Contraste WCAG Check */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                {isTextAccessible ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Contraste Texto/Fondo: <strong className="font-mono">{textContrastRatio.toFixed(1)}:1</strong> (Nivel AA WCAG {isTextAccessible ? 'Aprobado' : 'Advertencia'})
                </span>
              </div>

              <div className="text-slate-500 text-[11px]">
                Botón Principal Contraste: <strong className="font-mono text-slate-700 dark:text-slate-300">{buttonContrastRatio.toFixed(1)}:1</strong>
              </div>
            </div>
          </div>

          {/* Vista Previa Interactiva en Vivo (Live Preview) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Eye className="w-4 h-4 text-blue-500" />
              <span>Vista Previa Interactiva en Tiempo Real</span>
            </h3>

            {/* Simulated Workspace Frame */}
            <div
              className="p-6 rounded-2xl border transition-all duration-300 space-y-6"
              style={{
                backgroundColor: previewColors.background,
                color: previewColors.foreground,
                borderColor: previewColors.secondary
              }}
            >
              {/* Header Preview */}
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: previewColors.secondary + '40' }}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: previewColors.primary }}
                  >
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: previewColors.foreground }}>{brandName}</div>
                    <div className="text-[10px] opacity-70">Sucursal Principal · Preview POS</div>
                  </div>
                </div>

                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: previewColors.accent, color: previewColors.foreground }}
                >
                  Tema: {activeTheme}
                </span>
              </div>

              {/* Grid of Preview Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. POS Product Card */}
                <div
                  className="p-4 rounded-xl shadow-sm space-y-3 border"
                  style={{
                    backgroundColor: previewColors.surface,
                    borderColor: previewColors.secondary + '40',
                    color: previewColors.foreground
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Capuccino Vainilla</span>
                    <span className="font-mono text-xs font-bold" style={{ color: previewColors.primary }}>$65.00</span>
                  </div>
                  <p className="text-[11px] opacity-75 leading-tight">
                    Espresso doble con leche texturizada y jarabe artesanal.
                  </p>
                  <button
                    type="button"
                    className="w-full py-2 rounded-lg text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition"
                    style={{ backgroundColor: previewColors.button || previewColors.primary }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Agregar al POS</span>
                  </button>
                </div>

                {/* 2. Loyalty Pass Preview */}
                <div
                  className="p-4 rounded-xl shadow-sm space-y-3 border"
                  style={{
                    backgroundColor: previewColors.surface,
                    borderColor: previewColors.secondary + '40',
                    color: previewColors.foreground
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" style={{ color: previewColors.primary }} />
                      <span>Cliente Consentido</span>
                    </span>
                    <span className="text-[10px] opacity-70 font-mono">6/8 Sellos</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
                        style={{ backgroundColor: previewColors.primary }}
                      >
                        ✓
                      </span>
                    ))}
                    {[7, 8].map((i) => (
                      <span
                        key={i}
                        className="w-5 h-5 rounded-full border border-dashed flex items-center justify-center text-[10px] opacity-40"
                        style={{ borderColor: previewColors.foreground }}
                      >
                        {i}
                      </span>
                    ))}
                  </div>

                  <div
                    className="p-2 rounded-lg text-[11px] font-medium"
                    style={{ backgroundColor: previewColors.accent + '30', color: previewColors.foreground }}
                  >
                    🎁 ¡A 2 sellos de tu bebida gratis!
                  </div>
                </div>

                {/* 3. Promo Badge Preview */}
                <div
                  className="p-4 rounded-xl shadow-sm space-y-3 border flex flex-col justify-between"
                  style={{
                    backgroundColor: previewColors.surface,
                    borderColor: previewColors.secondary + '40',
                    color: previewColors.foreground
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" style={{ color: previewColors.primary }} />
                        <span>Viernes de Sellos</span>
                      </span>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
                        style={{ backgroundColor: previewColors.accent, color: previewColors.foreground }}
                      >
                        2X1
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-1.5">
                      Doble sello en compras superiores a $100 MXN.
                    </p>
                  </div>

                  <div className="pt-2 border-t text-[10px] opacity-70 font-mono" style={{ borderColor: previewColors.secondary + '30' }}>
                    Folio: VTA-1049 · Pagado con Tarjeta
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Bitácora de Auditoría */}
      {activeSubTab === 'auditoria' && hasPermission('audit.view') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Bitácora de Auditoría de Operaciones Sensibles</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Registro inmutable de descuentos, mermas, ajustes de inventario, cambios de rol, configuraciones y cancelaciones.
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
                <option value="configuracion">Configuración & Apariencia</option>
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
