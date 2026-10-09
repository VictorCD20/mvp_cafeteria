'use client';

import React from 'react';
import Link from 'next/link';
import codiaBetaConfig from '../../config/codia-beta.json';
import { useModuleState } from '../../context/ModuleStateContext';
import { ModuleStatus } from '../../types';
import {
  Terminal,
  ShieldCheck,
  Layers,
  Building2,
  Clock,
  Coins,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Server,
  Activity,
  GitBranch,
  Power,
  RotateCcw,
  XCircle,
  HelpCircle
} from 'lucide-react';

const technicalAuditLogs = [
  {
    timestamp: '2026-10-08 18:45:00',
    event: 'INIT_INSTANCE',
    component: 'SystemEngine',
    detail: 'Instancia demo iniciada con éxito. Sucursal Principal (SUC-01) cargada.'
  },
  {
    timestamp: '2026-10-08 18:45:01',
    event: 'SEPARATE_SUPERADMIN',
    component: 'AccessControl',
    detail: 'Rol superadmin aislado a consola interna. Rol operativo activo: administrador.'
  },
  {
    timestamp: '2026-10-08 18:45:02',
    event: 'MODULE_STATE_INIT',
    component: 'ModuleStateManager',
    detail: 'Motor de activación modular sincronizado con reglas de dependencia técnica.'
  },
  {
    timestamp: '2026-10-08 18:45:05',
    event: 'THEME_SYNC',
    component: 'AppearanceEngine',
    detail: 'Variables de tema cafetería aplicadas en :root (Modo claro/oscuro compatible).'
  }
];

export default function CodiaAdminPage() {
  const { application, cafeteria } = codiaBetaConfig;
  const {
    modules,
    toggleModule,
    getActiveDependents,
    lastActionMessage,
    clearActionMessage,
    resetModulesToDefault
  } = useModuleState();

  const moduleList = Object.values(modules);

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'activo':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Activo
          </span>
        );
      case 'simulado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3 h-3" />
            Simulado
          </span>
        );
      case 'planeado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Planeado
          </span>
        );
      case 'inactivo':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            <Power className="w-3 h-3" />
            Inactivo
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Barra superior técnica */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 md:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">CODIA Plataforma</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
                Consola Interna
              </span>
            </div>
            <p className="text-xs text-slate-400">Administración de módulos, dependencias y plataforma</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Entorno Demo / Beta</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Regresar a la Cafetería (/)</span>
          </Link>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Banner de Rol Superadmin */}
        <section className="bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Espacio Exclusivo: Súper Administrador CODIA</span>
                <span className="text-[10px] font-mono bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded">superadmin</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Esta consola controla la activación y desactivación dinámica de módulos. Los cambios se reflejan inmediatamente
                en la barra lateral de la app operativa respetando las dependencias técnicas de cada proceso.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Perfil Activo</div>
              <div className="text-xs font-semibold text-slate-200">Soporte Técnico CODIA</div>
            </div>
          </div>
        </section>

        {/* Notificación de feedback / bloqueo de dependencias */}
        {lastActionMessage && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs transition-all ${
              lastActionMessage.type === 'error'
                ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                : lastActionMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-blue-950/40 border-blue-500/40 text-blue-300'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {lastActionMessage.type === 'error' ? (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : lastActionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{lastActionMessage.text}</span>
            </div>
            <button
              onClick={clearActionMessage}
              className="text-slate-400 hover:text-white shrink-0 font-bold px-2 py-0.5 rounded hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tarjetas de Resumen y Configuración Técnica */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Cafetería Activa</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-base font-bold text-white truncate">{cafeteria.name}</div>
            <div className="text-xs text-slate-400 font-mono">ID: {cafeteria.id}</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Sucursales</span>
              <GitBranch className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-white">{cafeteria.branches.length} configurada(s)</div>
            <div className="text-xs text-emerald-400 font-mono">
              {cafeteria.branches[0]?.name || 'SUC-01'}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Zona Horaria & Moneda</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-bold text-white">{application.timezone}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Coins className="w-3 h-3 text-slate-400" /> Moneda: {application.currency}
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium uppercase tracking-wider">Motor & Versión</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base font-bold text-white">v{codiaBetaConfig.schemaVersion} ({application.environment})</div>
            <div className="text-xs text-slate-400 font-mono">Next.js 16 + React 19</div>
          </div>
        </section>

        {/* Tabla / Matriz de Módulos Técnicos */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Activación y Estado de Módulos</h2>
                <p className="text-xs text-slate-400">Haz clic en el switch para activar o desactivar cada módulo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetModulesToDefault}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                title="Restablecer todos los módulos al estado inicial"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer predeterminados</span>
              </button>
              <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                Total: {moduleList.length} módulos
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Módulo / Clave</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Acción</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Depende De</th>
                  <th className="py-3 px-4">Módulos que Dependen</th>
                  <th className="py-3 px-4">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {moduleList.map((mod) => {
                  const isBlockedByDependents = getActiveDependents(mod.key).length > 0 && (mod.status === 'activo' || mod.status === 'simulado');
                  const isPlanned = mod.status === 'planeado';
                  const isToggleable = !isPlanned;

                  return (
                    <tr key={mod.key} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{mod.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{mod.key}</div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(mod.status)}</td>
                      <td className="py-3.5 px-4">
                        {isPlanned ? (
                          <span className="text-[11px] text-slate-500 italic">Planeado</span>
                        ) : (
                          <button
                            onClick={() => toggleModule(mod.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              mod.status === 'activo' || mod.status === 'simulado'
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'
                            }`}
                            title={
                              isBlockedByDependents
                                ? 'No se puede desactivar porque tiene módulos dependientes activos'
                                : `Cambiar estado de ${mod.name}`
                            }
                          >
                            <Power className={`w-3.5 h-3.5 ${mod.status === 'activo' || mod.status === 'simulado' ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <span>{mod.status === 'activo' || mod.status === 'simulado' ? 'Desactivar' : 'Activar'}</span>
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-300 font-medium">{mod.category}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {mod.dependencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {mod.dependencies.map((dep) => (
                              <span
                                key={dep}
                                className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                              >
                                {modules[dep]?.name || dep}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">— Ninguna</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getActiveDependents(mod.key).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {getActiveDependents(mod.key).map((depKey) => (
                              <span
                                key={depKey}
                                className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded"
                                title="Módulo activo dependiente"
                              >
                                {modules[depKey]?.name || depKey}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">— Ninguno</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs">{mod.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Registro de Auditoría Técnica de la Plataforma */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-sm font-bold text-white">Registro de Auditoría Técnica</h2>
                <p className="text-xs text-slate-400">Trazabilidad de eventos de plataforma y control modular</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-500/20">
              En memoria (Demo)
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 font-mono text-xs max-h-60 overflow-y-auto">
            {technicalAuditLogs.map((log, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-300 py-1 border-b border-slate-900 last:border-0">
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                <span className="text-blue-400 font-semibold shrink-0">[{log.event}]</span>
                <span className="text-amber-400/90 shrink-0">({log.component})</span>
                <span className="text-slate-300 text-[11px]">{log.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pie informativo */}
        <footer className="text-center text-xs text-slate-500 py-4 border-t border-slate-800/80">
          CODIA Beta System · Consola Técnica Independiente · Configuración leída de <code className="text-slate-400 font-mono">src/config/codia-beta.json</code>
        </footer>
      </main>
    </div>
  );
}
