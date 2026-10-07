'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Building2, RotateCcw, PlusCircle, Bot, FlaskConical, ChevronDown, CheckCircle, ShieldCheck, Wallet, Sparkles, Menu, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

// Integraciones que en esta demo están simuladas (se agrupan en un solo indicador para no saturar la barra).
const simulatedIntegrations = [
  { icon: CheckCircle, name: 'Checador Hikvision', detail: 'Asistencia simulada (modelo DS-K1T804AM)' },
  { icon: ShieldCheck, name: 'PAC CFDI', detail: 'Facturación electrónica simulada' },
  { icon: Wallet, name: 'Google Wallet', detail: 'Tarjeta de lealtad simulada' },
  { icon: Sparkles, name: 'Asistente IA', detail: 'Respuestas automáticas con datos de la demo' }
];

const roleNames: Record<UserRole, string> = {
  superadmin: 'Superadmin',
  administrador: 'Admin',
  encargado: 'Encargado',
  empleado: 'Cajero / POS',
  cliente: 'Cliente'
};

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { config, setActiveTab, resetToSeedData, currentUser, switchRole, demoUsers, hasPermission } = useCodia();
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  return (
    <header className="h-16 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-40">
      {/* Negocio y modo demo */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Abrir menú de navegación"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 min-w-0 text-sm">
          <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="font-semibold text-slate-900 dark:text-white truncate">{config.cafeteriaName}</span>
          <span className="hidden md:inline text-slate-500 truncate">· {config.branchName}</span>
        </div>

        {/* Indicador de rol activo con selector rápido de demo */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleSwitcher((v) => !v);
              setShowIntegrations(false);
            }}
            aria-expanded={showRoleSwitcher}
            className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
            title="Cambiar rol activo para pruebas de la demo"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Rol: {roleNames[currentUser.role]}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showRoleSwitcher ? 'rotate-180' : ''}`} />
          </button>

          {showRoleSwitcher && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-3 z-50">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-wider">
                Simular Usuario en Demo
              </div>
              <div className="space-y-1">
                {demoUsers.map((u) => {
                  const isCurrent = u.role === currentUser.role;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchRole(u.role);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-800 font-bold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{u.role}</div>
                      </div>
                      {isCurrent && <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">Activo</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modo demo e integraciones */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => {
              setShowIntegrations((v) => !v);
              setShowRoleSwitcher(false);
            }}
            aria-expanded={showIntegrations}
            className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full hover:bg-amber-500/20 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Modo demo</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showIntegrations ? 'rotate-180' : ''}`} />
          </button>

          {showIntegrations && (
            <div className="absolute left-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 z-50">
              <div className="text-xs font-semibold text-slate-900 dark:text-white mb-3">Integraciones simuladas en esta demo</div>
              <ul className="space-y-3">
                {simulatedIntegrations.map(({ icon: Icon, name, detail }) => (
                  <li key={name} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{name}</div>
                      <div className="text-[11px] text-slate-500">{detail}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                En la versión final se conectan a los servicios reales.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex items-center gap-2 shrink-0">
        {(hasPermission('sales.create') || hasPermission('sales.view_own')) && (
          <button
            onClick={() => setActiveTab('ventas')}
            className="flex items-center gap-1.5 whitespace-nowrap bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva venta</span>
          </button>
        )}

        {(hasPermission('reports.operational') || hasPermission('sales.view_branch')) && (
          <button
            onClick={() => setActiveTab('asistente')}
            title="Preguntar al asistente"
            className="flex items-center gap-1.5 whitespace-nowrap text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden xl:inline">Preguntar al bot</span>
          </button>
        )}

        <button
          onClick={resetToSeedData}
          title="Reiniciar los datos de la demo a su estado original"
          className="flex items-center gap-1.5 whitespace-nowrap text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs px-3 py-2 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden xl:inline">Reiniciar demo</span>
        </button>
      </div>
    </header>
  );
};
