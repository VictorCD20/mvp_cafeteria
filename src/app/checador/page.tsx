'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import codiaBetaConfig from '../../config/codia-beta.json';
import initialEmployeesData from '../../data/employees.json';
import initialAttendanceData from '../../data/attendance.json';
import { useModuleState } from '../../context/ModuleStateContext';
import { Employee, AttendanceRecord } from '../../types';
import {
  processTimeclockCheck,
  getMexicoCityDateTime,
  TimeclockResult
} from '../../lib/attendance';
import {
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  User,
  Coffee,
  RotateCcw,
  Sparkles,
  Calendar,
  Delete
} from 'lucide-react';

function ChecadorContent() {
  const searchParams = useSearchParams();
  const branchParam = searchParams.get('branch') || 'branch-main';

  const { isModuleActive } = useModuleState();
  const isEmployeesActive = isModuleActive('employees');
  const isTimeclockActive = isModuleActive('timeclock_online');

  const { cafeteria } = codiaBetaConfig;
  const currentBranch =
    cafeteria.branches.find((b) => b.id === branchParam || b.code === branchParam) ||
    cafeteria.branches[0] || {
      id: 'branch-main',
      name: 'Sucursal Principal',
      code: 'SUC-01',
      address: 'CDMX'
    };

  // Estado local en memoria de empleados y asistencias
  const [employees] = useState<Employee[]>(initialEmployeesData as Employee[]);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(
    initialAttendanceData as AttendanceRecord[]
  );

  const [code, setCode] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
  const [lastResult, setLastResult] = useState<TimeclockResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reloj en tiempo real en zona horaria de México
  useEffect(() => {
    const updateTime = () => {
      setCurrentDateTime(getMexicoCityDateTime());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (num: string) => {
    setCode((prev) => prev + num);
  };

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCode('');
  };

  const handlePrefix = (prefix: string) => {
    if (!code.startsWith(prefix)) {
      setCode(prefix + code.replace(/^EMP-?/i, ''));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);

    // Procesar registro con las reglas de negocio
    const { result, updatedAttendance } = processTimeclockCheck(
      code,
      employees,
      attendanceList,
      {
        branchId: currentBranch.id,
        toleranceMinutes: codiaBetaConfig.modules.employees?.settings?.lateToleranceMinutes ?? 15
      }
    );

    setLastResult(result);
    setAttendanceList(updatedAttendance);
    setIsSubmitting(false);

    if (result.success) {
      setCode('');
    }
  };

  if (!isEmployeesActive || !isTimeclockActive) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white">Módulo No Disponible</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            El checador online se encuentra inactivo porque el módulo de <strong>Personal y Empleados</strong> está deshabilitado en la configuración de la cafetería.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 transition"
            >
              Regresar a la aplicación
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Encabezado del Checador */}
      <header className="max-w-xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">{cafeteria.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 font-medium">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{currentBranch.name}</span>
              <span className="text-slate-600 font-mono">({currentBranch.code})</span>
            </div>
          </div>
        </div>

        {/* Reloj Digital en Vivo */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl text-center shadow-inner">
          <div className="text-lg font-black font-mono tracking-widest text-white flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{currentDateTime.time || '--:--'}</span>
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{currentDateTime.date || '----/--/--'}</span>
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="max-w-xl mx-auto w-full my-auto py-6 space-y-6">
        {/* Tarjeta de Entrada de Código */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-white">Registro de Asistencia</h2>
            <p className="text-xs text-slate-400">Ingresa tu código de empleado para checar entrada o salida</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="EMP-001"
                autoFocus
                className="w-full bg-slate-950 border-2 border-slate-800 focus:border-blue-500 rounded-2xl py-4 px-5 text-center text-2xl font-mono font-bold text-white tracking-widest uppercase focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-inner placeholder:text-slate-700"
              />
            </div>

            {/* Accesos rápidos de prefijo */}
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => handlePrefix('EMP-00')}
                className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition"
              >
                + EMP-00
              </button>
              <button
                type="button"
                onClick={() => handlePrefix('EMP-0')}
                className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition"
              >
                + EMP-0
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:bg-rose-500/10 px-3 py-1 rounded-lg transition"
              >
                Limpiar
              </button>
            </div>

            {/* Teclado Numérico Táctil */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(String(num))}
                  className="bg-slate-950 hover:bg-slate-800 active:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-lg font-mono transition border border-slate-800/80 shadow-sm"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handlePrefix('EMP-')}
                className="bg-slate-950 hover:bg-slate-800 active:bg-blue-600 text-blue-400 font-semibold py-3.5 rounded-xl text-xs font-mono transition border border-slate-800/80"
              >
                EMP-
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="bg-slate-950 hover:bg-slate-800 active:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-lg font-mono transition border border-slate-800/80 shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="bg-slate-950 hover:bg-slate-800 active:bg-rose-600 text-slate-400 hover:text-white py-3.5 rounded-xl flex items-center justify-center transition border border-slate-800/80"
                title="Borrar dígito"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base mt-2"
            >
              <span>Registrar Asistencia</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Tarjeta de Resultado / Feedback de Empleado */}
        {lastResult && (
          <div
            className={`rounded-3xl p-6 border transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 shadow-2xl ${
              lastResult.success
                ? lastResult.type === 'check_in'
                  ? lastResult.status === 'puntual'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                  : 'bg-blue-950/40 border-blue-500/40 text-blue-100'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-4">
              {lastResult.employee?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lastResult.employee.avatar}
                  alt={lastResult.employee.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-7 h-7" />
                </div>
              )}

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-base text-white truncate">
                    {lastResult.employee?.name || 'Aviso del Sistema'}
                  </span>
                  {lastResult.employee && (
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full uppercase">
                      {lastResult.employee.code} · {lastResult.employee.role}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed font-medium">{lastResult.message}</p>

                {lastResult.employee?.schedule && (
                  <div className="text-[11px] text-slate-300/80 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 opacity-70" />
                    <span>Turno habitual: {lastResult.employee.schedule}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {lastResult.success ? 'Registro procesado en hora local' : 'Verifica tu código'}
              </span>
              <button
                type="button"
                onClick={() => setLastResult(null)}
                className="text-xs font-semibold text-white/80 hover:text-white underline underline-offset-4"
              >
                Cerrar confirmación
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pie de Página */}
      <footer className="max-w-xl mx-auto w-full text-center text-xs text-slate-500 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>CODIA Checador Online · Superficie exclusiva de asistencia</span>
        <Link href="/" className="text-blue-400 hover:text-blue-300 hover:underline">
          Volver a la cafetería
        </Link>
      </footer>
    </div>
  );
}

export default function ChecadorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm">Cargando checador...</div>}>
      <ChecadorContent />
    </Suspense>
  );
}
