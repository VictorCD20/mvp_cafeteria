'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Coffee, ArrowLeft, Delete, KeyRound } from 'lucide-react';

const PIN_LENGTH = 4;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

/** Acceso por PIN: cada empleado entra con su PIN y ve solo los módulos de su rol. */
export const LoginView = () => {
  const { employees, roles, login } = useCodia();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const activeEmployees = employees.filter((e) => e.status === 'activo');
  const selected = activeEmployees.find((e) => e.id === selectedId);
  const roleName = (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? 'Sin rol';

  const submit = (value: string) => {
    if (!selected) return;
    if (!login(selected.id, value)) {
      setError('PIN incorrecto. Intenta de nuevo.');
      setPin('');
    }
  };

  const press = (digit: string) => {
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + digit;
    setPin(next);
    setError('');
    if (next.length === PIN_LENGTH) submit(next);
  };

  const back = () => {
    setSelectedId(null);
    setPin('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white mb-3">
            <Coffee className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">CODIA Cafetería</h1>
          <p className="text-slate-500 text-sm mt-1">{selected ? 'Escribe tu PIN de 4 dígitos' : '¿Quién va a usar el sistema?'}</p>
        </div>

        {!selected ? (
          <ul className="grid grid-cols-2 gap-3">
            {activeEmployees.map((emp) => (
              <li key={emp.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(emp.id)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex flex-col items-center text-center gap-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={emp.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-slate-900 leading-tight">{emp.name}</span>
                  <span className="text-[11px] text-slate-500">{roleName(emp.accessRoleId)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-900 truncate">{selected.name}</div>
                <div className="text-[11px] text-slate-500">{roleName(selected.accessRoleId)}</div>
              </div>
              <button type="button" onClick={back} className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Cambiar
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pin.length === PIN_LENGTH) submit(pin);
              }}
            >
              <label htmlFor="pin" className="sr-only">PIN</label>
              <input
                id="pin"
                autoFocus
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={PIN_LENGTH}
                value={pin}
                onChange={(e) => {
                  const clean = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
                  setPin(clean);
                  setError('');
                  if (clean.length === PIN_LENGTH) submit(clean);
                }}
                className="w-full text-center tracking-[0.75em] text-2xl font-bold bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-3 outline-none text-slate-900"
                placeholder="••••"
              />
            </form>

            {error && <p className="text-xs text-rose-600 text-center font-medium" role="alert">{error}</p>}

            <div className="grid grid-cols-3 gap-2">
              {KEYS.map((k) => (
                <button key={k} type="button" onClick={() => press(k)} className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-semibold text-slate-800">
                  {k}
                </button>
              ))}
              <span />
              <button type="button" onClick={() => press('0')} className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-lg font-semibold text-slate-800">
                0
              </button>
              <button
                type="button"
                onClick={() => setPin((p) => p.slice(0, -1))}
                aria-label="Borrar"
                className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
          <KeyRound className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            PINs de la demo: Laura (Administrador) <span className="font-mono font-semibold">1234</span> · Luis (Caja){' '}
            <span className="font-mono font-semibold">3333</span>. Los demás, su número repetido (Ana 2222, Sofía 4444…).
          </span>
        </div>
      </div>
    </div>
  );
};
