'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { AccessRole, Employee, Permission, Role } from '../../types';
import { Modal } from '../ui/Modal';
import { latestAttendanceByEmployee } from '../../lib/attendance';
import { PERMISSION_LABELS } from '../../lib/permissions';
import {
  Users,
  Clock,
  Calculator,
  Plus,
  Edit2,
  ShieldAlert,
  Search,
  KeyRound,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

type EmployeesSubTab = 'personal' | 'asistencia' | 'prenomina' | 'roles';

const EMPTY_EMP_FORM = {
  name: '',
  role: 'barista' as Role,
  accessRoleId: 'role-caja',
  pin: '',
  dailyRate: 430,
  schedule: '07:00 - 15:00',
  workDays: 'Lunes a Sábado',
  email: '',
  phone: ''
};

export const EmployeesView = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    attendance,
    registerCheckIn,
    registerCheckOut,
    justifyAbsence,
    getPrePayroll,
    config,
    roles,
    addRole,
    updateRole,
    deleteRole,
    can,
    currentUser,
    showToast,
    subTab,
    setSubTab
  } = useCodia();

  const canManageUsers = can('usuarios');
  const activeSubTab: EmployeesSubTab =
    subTab === 'asistencia' || subTab === 'prenomina' || (subTab === 'roles' && canManageUsers)
      ? subTab
      : 'personal';
  const setActiveSubTab = (tab: EmployeesSubTab) => setSubTab(tab);
  const [search, setSearch] = useState('');

  // Employee modal (crear o editar)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [empForm, setEmpForm] = useState(EMPTY_EMP_FORM);
  const [empFormError, setEmpFormError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isJustifyModalOpen, setIsJustifyModalOpen] = useState(false);
  const [selectedEmpForJustify, setSelectedEmpForJustify] = useState<string | null>(null);
  const [absenceJustification, setAbsenceJustification] = useState('');

  // Role modal (crear o editar)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [roleFormError, setRoleFormError] = useState('');

  const openNewEmployeeModal = () => {
    setEditingEmployee(null);
    setEmpForm(EMPTY_EMP_FORM);
    setEmpFormError('');
    setShowPin(false);
    setIsEmpModalOpen(true);
  };

  const openEditEmployeeModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpForm({
      name: emp.name,
      role: emp.role,
      accessRoleId: emp.accessRoleId,
      pin: emp.pin,
      dailyRate: emp.dailyRate,
      schedule: emp.schedule,
      workDays: emp.workDays,
      email: emp.email,
      phone: emp.phone
    });
    setEmpFormError('');
    setShowPin(false);
    setIsEmpModalOpen(true);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar =
      editingEmployee?.avatar ??
      `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`;
    const payload = {
      name: empForm.name,
      role: empForm.role,
      accessRoleId: empForm.accessRoleId,
      pin: empForm.pin,
      dailyRate: Number(empForm.dailyRate),
      schedule: empForm.schedule,
      workDays: empForm.workDays,
      email: empForm.email,
      phone: empForm.phone,
      avatar
    };
    const result = editingEmployee
      ? updateEmployee(editingEmployee.id, { ...payload, status: editingEmployee.status })
      : addEmployee({ ...payload, status: 'activo' });
    if (!result.success) {
      setEmpFormError(result.message);
      return;
    }
    setIsEmpModalOpen(false);
    setEmpForm(EMPTY_EMP_FORM);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (emp: Employee) => {
    if (!window.confirm(`¿Eliminar a ${emp.name}? Sus marcajes de asistencia de la demo se conservan.`)) return;
    const result = deleteEmployee(emp.id);
    if (!result.success) showToast(result.message);
  };

  const openRoleModal = (role?: AccessRole) => {
    setEditingRole(role ?? null);
    setRoleName(role?.name ?? '');
    setRoleDescription(role?.description ?? '');
    setRolePermissions(role ? [...role.permissions] : ['ventas', 'cliente_consentido', 'vista_cliente']);
    setRoleFormError('');
    setIsRoleModalOpen(true);
  };

  const toggleRolePermission = (perm: Permission) => {
    setRolePermissions((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: roleName, description: roleDescription, permissions: rolePermissions };
    const result = editingRole ? updateRole(editingRole.id, payload) : addRole(payload);
    if (!result.success) {
      setRoleFormError(result.message);
      return;
    }
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (role: AccessRole) => {
    if (!window.confirm(`¿Eliminar el rol "${role.name}"?`)) return;
    const result = deleteRole(role.id);
    if (!result.success) showToast(result.message);
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

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase()) ||
      emp.code.toLowerCase().includes(search.toLowerCase())
  );

  const latestAttendance = latestAttendanceByEmployee(attendance);

  const prePayrollList = getPrePayroll();

  const subTabButton = (id: EmployeesSubTab, label: string) => (
    <button
      key={id}
      onClick={() => setActiveSubTab(id)}
      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
        activeSubTab === id
          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Header & Subtabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Gestión de Personal & Pre-nómina</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Empleados, roles de acceso, control de asistencia y cálculo de pre-nómina.
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
          {subTabButton('personal', `Personal (${employees.length})`)}
          {subTabButton('asistencia', 'Asistencia (Checador)')}
          {subTabButton('prenomina', 'Pre-Nómina')}
          {canManageUsers && subTabButton('roles', `Roles (${roles.length})`)}
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
            {canManageUsers && (
              <button
                onClick={openNewEmployeeModal}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Empleado</span>
              </button>
            )}
          </div>

          {/* Employees Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Código / Empleado</th>
                    <th className="p-4">Puesto</th>
                    <th className="p-4">Rol de acceso</th>
                    <th className="p-4">Pago Diario</th>
                    <th className="p-4">Horario</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Contacto</th>
                    {canManageUsers && <th className="p-4 text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">{emp.name}</div>
                            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400">{emp.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 text-[11px]">
                          <KeyRound className="w-3.5 h-3.5" />
                          {roles.find((r) => r.id === emp.accessRoleId)?.name ?? 'Sin rol'}
                          {emp.id === currentUser?.id && ' (tú)'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">${emp.dailyRate} MXN</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                        <div>{emp.schedule}</div>
                        <div className="text-[10px] text-slate-400">{emp.workDays}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-[10px] border ${
                            emp.status === 'activo'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                              : 'bg-slate-200 text-slate-500 border-slate-300'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-500 text-[11px]">
                        <div>{emp.email}</div>
                        <div>{emp.phone}</div>
                      </td>
                      {canManageUsers && (
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => openEditEmployeeModal(emp)}
                            title="Editar empleado"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {emp.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDeleteEmployee(emp)}
                              title="Eliminar empleado"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      )}
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
          <div className="bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Checador Biométrico Hikvision Simulado
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">DS-K1T804AM Terminal Biométrica IP</h3>
                <p className="text-xs text-slate-500">
                  Simula la captura automática de entrada / salida de empleados para pruebas.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-emerald-700 text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexión IP OK (192.168.1.120)</span>
            </div>
          </div>

          {/* Today Attendance Controls Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Registro de Asistencia del Día (Hoy)</h3>
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
                    const att = latestAttendance.get(emp.id);

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center space-x-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover" />
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">{emp.schedule}</td>
                        <td className="p-4 font-mono font-bold text-slate-800 dark:text-slate-200">{att?.checkIn || '—'}</td>
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
                            onClick={() => registerCheckIn(emp.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Entrada
                          </button>
                          <button
                            onClick={() => registerCheckIn(emp.id, 'retardo')}
                            className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                          >
                            Retardo
                          </button>
                          {att?.checkIn && !att.checkOut && (
                            <button
                              onClick={() => registerCheckOut(emp.id)}
                              className="bg-slate-600 hover:bg-slate-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition"
                            >
                              Salida
                            </button>
                          )}
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
                  ${prePayrollList.reduce((a, b) => a + b.netTotal, 0).toLocaleString('es-MX')} MXN
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
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">${item.dailyRate} MXN</td>
                      <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">{item.daysWorked} días</td>
                      <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{item.justifiedAbsences}</td>
                      <td className="p-3 font-bold text-rose-600 dark:text-rose-400">{item.unjustifiedAbsences}</td>
                      <td className="p-3 text-rose-500 font-semibold">-${item.deductions} MXN</td>
                      <td className="p-3 text-right font-black text-sm text-slate-900 dark:text-white">
                        ${item.netTotal.toLocaleString('es-MX')} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROLES Y ACCESOS (solo quien administra usuarios) */}
      {activeSubTab === 'roles' && canManageUsers && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Los roles definen qué módulos y acciones puede usar cada empleado al entrar con su PIN.
            </p>
            <button
              onClick={() => openRoleModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Rol</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {roles.map((role) => {
              const members = employees.filter((e) => e.accessRoleId === role.id).length;
              const moduleCount = role.permissions.length;
              return (
                <div
                  key={role.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 shrink-0">
                        <ShieldAlert className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                          {role.name}
                          {role.isSystem && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                              sistema
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                      </div>
                    </div>
                    {!role.isSystem && (
                      <div className="flex items-center shrink-0">
                        <button
                          onClick={() => openRoleModal(role)}
                          title="Editar rol"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role)}
                          title={members > 0 ? 'Reasigna a sus personas antes de eliminarlo' : 'Eliminar rol'}
                          disabled={members > 0}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {PERMISSION_LABELS.filter((p) => role.permissions.includes(p.id)).map((p) => (
                      <span
                        key={p.id}
                        className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full"
                      >
                        {p.label}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {members} persona{members === 1 ? '' : 's'} con este rol · {moduleCount} permiso{moduleCount === 1 ? '' : 's'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EMPLOYEE */}
      <Modal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        title={editingEmployee ? `Editar a ${editingEmployee.name}` : 'Registrar Nuevo Empleado'}
      >
        <form onSubmit={handleEmployeeSubmit} className="space-y-4">
          {empFormError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 font-medium">{empFormError}</p>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={empForm.name}
              onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Carlos Ramírez"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Puesto</label>
              <select
                value={empForm.role}
                onChange={(e) => setEmpForm({ ...empForm, role: e.target.value as Role })}
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
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rol de acceso</label>
              <select
                value={empForm.accessRoleId}
                onChange={(e) => setEmpForm({ ...empForm, accessRoleId: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">PIN de acceso (4 dígitos)</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  inputMode="numeric"
                  maxLength={4}
                  value={empForm.pin}
                  onChange={(e) => setEmpForm({ ...empForm, pin: e.target.value.replace(/\D/g, '') })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 pr-9 text-xs text-slate-900 dark:text-white"
                  placeholder="ej. 4587"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Lo usa para entrar a la demo. Debe ser único.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Pago Diario (MXN)</label>
              <input
                type="number"
                required
                value={empForm.dailyRate}
                onChange={(e) => setEmpForm({ ...empForm, dailyRate: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Horario</label>
              <input
                type="text"
                value={empForm.schedule}
                onChange={(e) => setEmpForm({ ...empForm, schedule: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Días Laborales</label>
              <input
                type="text"
                value={empForm.workDays}
                onChange={(e) => setEmpForm({ ...empForm, workDays: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                placeholder="empleado@codia.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
              <input
                type="text"
                value={empForm.phone}
                onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                placeholder="55 1234 5678"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow transition mt-2"
          >
            {editingEmployee ? 'Guardar Cambios' : 'Guardar Empleado'}
          </button>
        </form>
      </Modal>

      {/* MODAL: ADD / EDIT ROLE */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={editingRole ? `Editar rol ${editingRole.name}` : 'Nuevo Rol de Acceso'}
      >
        <form onSubmit={handleRoleSubmit} className="space-y-4">
          {roleFormError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 font-medium">{roleFormError}</p>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del rol</label>
            <input
              type="text"
              required
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Caja, Mesero, Administrador"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <input
              type="text"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="Qué hace este rol en la cafetería"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Permisos</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSION_LABELS.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={rolePermissions.includes(perm.id)}
                    onChange={() => toggleRolePermission(perm.id)}
                    className="accent-blue-600"
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            {editingRole ? 'Guardar Cambios' : 'Crear Rol'}
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Motivo o Justificación</label>
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
