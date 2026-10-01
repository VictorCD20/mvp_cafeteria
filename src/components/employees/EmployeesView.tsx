'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Employee, Role } from '../../types';
import { Modal } from '../ui/Modal';
import {
  Users,
  Clock,
  Calculator,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Search,
  Calendar
} from 'lucide-react';

export const EmployeesView = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    attendance,
    registerCheckIn,
    registerCheckOut,
    justifyAbsence,
    getPrePayroll,
    config
  } = useCodia();

  const [activeSubTab, setActiveSubTab] = useState<'personal' | 'asistencia' | 'prenomina'>('personal');
  const [search, setSearch] = useState('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [selectedEmpForJustify, setSelectedEmpForJustify] = useState<string | null>(null);
  const [absenceJustification, setAbsenceJustification] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('barista');
  const [dailyRate, setDailyRate] = useState(430);
  const [schedule, setSchedule] = useState('07:00 - 15:00');
  const [workDays, setWorkDays] = useState('Lunes a Sábado');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee({
      name,
      role,
      dailyRate: Number(dailyRate),
      schedule,
      workDays,
      status: 'activo',
      email,
      phone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`
    });
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleJustifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmpForJustify && absenceJustification) {
      justifyAbsence(selectedEmpForJustify, absenceJustification);
      setIsJustifyModalOpen(false);
      setAbsenceJustification('');
      setSelectedEmpForJustify(null);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.role.toLowerCase().includes(search.toLowerCase()) ||
    emp.code.toLowerCase().includes(search.toLowerCase())
  );

  const prePayrollList = getPrePayroll();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Gestión de Personal & Pre-nómina</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administra empleados, control de asistencia Hikvision y cálculo pre-nómina.
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('personal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'personal'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Personal ({employees.length})
          </button>
          <button
            onClick={() => setActiveSubTab('asistencia')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'asistencia'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Asistencia (Checador)
          </button>
          <button
            onClick={() => setActiveSubTab('prenomina')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'prenomina'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Pre-Nómina
          </button>
        </div>
      </div>

      {/* TAB 1: PERSONAL LIST */}
      {activeSubTab === 'personal' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar empleado o puesto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Empleado</span>
            </button>
          </div>

          {/* Employees Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Código / Empleado</th>
                    <th className="p-4">Puesto</th>
                    <th className="p-4">Pago Diario</th>
                    <th className="p-4">Horario</th>
                    <th className="p-4">Días Laborales</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Contacto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {emp.name}
                            </div>
                            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                              {emp.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        ${emp.dailyRate} MXN
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                        {emp.schedule}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                        {emp.workDays}
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-500/20">
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-500 text-[11px]">
                        <div>{emp.email}</div>
                        <div>{emp.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASISTENCIA & CHECADOR HIKVISION SIMULADO */}
      {activeSubTab === 'asistencia' && (
        <div className="space-y-6">
          {/* Hikvision Simulator Card */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-6 rounded-2xl text-white border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Checador Biométrico Hikvision Simulado
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  DS-K1T804AM Terminal Biométrica IP
                </h3>
                <p className="text-xs text-slate-400">
                  Simula la captura automática de entrada / salida de empleados para pruebas.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-400 text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexión IP OK (192.168.1.120)</span>
            </div>
          </div>

          {/* Today Attendance Controls Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Registro de Asistencia del Día (Hoy)
              </h3>
              <span className="text-xs text-slate-500 font-mono">Tolerancia retardos: {config.lateToleranceMinutes} mins</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Empleado</th>
                    <th className="p-4">Horario Esperado</th>
                    <th className="p-4">Hora Entrada</th>
                    <th className="p-4">Hora Salida</th>
                    <th className="p-4">Estado Checador</th>
                    <th className="p-4 text-right">Acción Simulación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {employees.map((emp) => {
                    const att = attendance.find((a) => a.employeeId === emp.id);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center space-x-2">
                            <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{emp.schedule}</td>
                        <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {att?.checkIn || '—'}
                        </td>
                        <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {att?.checkOut || '—'}
                        </td>
                        <td className="p-4">
                          {att ? (
                            <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                                att.status === 'puntual'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                  : att.status === 'retardo'
                                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                  : att.status === 'justificado'
                                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                  : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              }`}
                            >
                              {att.status}
                              {att.notes ? ` (${att.notes})` : ''}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              Sin Marcaje
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => registerCheckIn(emp.id, 'puntual')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Entrada OK
                          </button>
                          <button
                            onClick={() => registerCheckIn(emp.id, 'retardo')}
                            className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Retardo
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmpForJustify(emp.id);
                              setIsJustifyModalOpen(true);
                            }}
                            className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Justificar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRE-NÓMINA */}
      {activeSubTab === 'prenomina' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  <span>Cálculo Transparente de Pre-Nómina</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-nómina administrativa estimada en base a asistencias, retardo y faltas notificadas.
                </p>
              </div>
              <div className="text-right bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-slate-500 font-semibold uppercase">Total Estimado</div>
                <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                  ${prePayrollList.reduce((a, b) => a + b.netTotal, 0).toLocaleString()} MXN
                </div>
              </div>
            </div>

            {/* PrePayroll Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-3">Empleado</th>
                    <th className="p-3">Pago Diario</th>
                    <th className="p-3">Días Asistidos</th>
                    <th className="p-3">Faltas Justif.</th>
                    <th className="p-3">Faltas Injustif.</th>
                    <th className="p-3">Descuentos</th>
                    <th className="p-3 text-right">Pago Estimado Neto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {prePayrollList.map((item) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{item.employeeName}</div>
                        <div className="text-[11px] text-slate-400 capitalize">{item.role}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        ${item.dailyRate} MXN
                      </td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {item.daysWorked} días
                      </td>
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                        {item.justifiedAbsences}
                      </td>
                      <td className="p-3 font-bold text-rose-600 dark:text-rose-400">
                        {item.unjustifiedAbsences}
                      </td>
                      <td className="p-3 text-rose-500 font-semibold">
                        -${item.deductions} MXN
                      </td>
                      <td className="p-3 text-right font-black text-sm text-slate-900 dark:text-white">
                        ${item.netTotal.toLocaleString()} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD EMPLOYEE */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Registrar Nuevo Empleado">
        <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Carlos Ramírez"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Puesto</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="barista">Barista</option>
                <option value="cajero">Cajero</option>
                <option value="cocina">Cocina</option>
                <option value="encargado">Encargado</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pago Diario (MXN)</label>
              <input
                type="number"
                required
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Horario</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Días Laborales</label>
              <input
                type="text"
                value={workDays}
                onChange={(e) => setWorkDays(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                placeholder="empleado@codia.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                placeholder="55 1234 5678"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow transition mt-2"
          >
            Guardar Empleado
          </button>
        </form>
      </Modal>

      {/* MODAL: JUSTIFY ABSENCE */}
      <Modal isOpen={isJustifyModalOpen} onClose={() => setIsJustifyModalOpen(false)} title="Justificar Falta de Empleado">
        <form onSubmit={handleJustifySubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Ingresa la razón o justificante médico / permiso para evitar el descuento en pre-nómina.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Motivo o Justificación
            </label>
            <textarea
              required
              rows={3}
              value={absenceJustification}
              onChange={(e) => setAbsenceJustification(e.target.value)}
              placeholder="ej. Permiso médico presentado folio IMSS #991"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Confirmar Falta Justificada
          </button>
        </form>
      </Modal>
    </div>
  );
};
