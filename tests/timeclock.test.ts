import test from 'node:test';
import assert from 'node:assert/strict';
import {
  processTimeclockCheck,
  calculatePunctuality,
  getMexicoCityDateTime
} from '../src/lib/attendance.ts';
import type { Employee, AttendanceRecord } from '../src/types';

const mockEmployees: Employee[] = [
  {
    id: 'emp-1',
    code: 'EMP-001',
    name: 'Laura Méndez',
    role: 'administrador',
    dailyRate: 650,
    schedule: '07:00 - 16:00',
    workDays: 'Lunes a Viernes',
    status: 'activo',
    email: 'laura@codia.com',
    phone: '55 1111 2222',
    avatar: ''
  },
  {
    id: 'emp-2',
    code: 'EMP-002',
    name: 'Ana Torres',
    role: 'barista',
    dailyRate: 430,
    schedule: '08:00 - 16:00',
    workDays: 'Lunes a Sábado',
    status: 'activo',
    email: 'ana@codia.com',
    phone: '55 2222 3333',
    avatar: ''
  },
  {
    id: 'emp-inactive',
    code: 'EMP-999',
    name: 'Mateo Peña',
    role: 'barista',
    dailyRate: 400,
    schedule: '08:00 - 16:00',
    workDays: 'Lunes a Sábado',
    status: 'inactivo',
    email: 'mateo@codia.com',
    phone: '55 9999 8888',
    avatar: ''
  }
];

test('Calcula fecha y hora en formato America/Mexico_City', () => {
  const dt = getMexicoCityDateTime();
  assert.match(dt.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(dt.time, /^\d{2}:\d{2}$/);
});

test('Calcula puntualidad dentro de la tolerancia de 15 minutos', () => {
  // Horario 08:00 -> 08:14 es puntual
  assert.equal(calculatePunctuality('08:14', '08:00 - 16:00', 15), 'puntual');
  // 08:15 exacto es puntual
  assert.equal(calculatePunctuality('08:15', '08:00 - 16:00', 15), 'puntual');
  // 08:16 es retardo
  assert.equal(calculatePunctuality('08:16', '08:00 - 16:00', 15), 'retardo');
});

test('Rechaza código vacío o inexistente con mensaje descriptivo', () => {
  const emptyRes = processTimeclockCheck('', mockEmployees, []);
  assert.equal(emptyRes.result.success, false);
  assert.match(emptyRes.result.message, /ingresa tu código/i);

  const notFoundRes = processTimeclockCheck('EMP-UNKNOWN', mockEmployees, []);
  assert.equal(notFoundRes.result.success, false);
  assert.match(notFoundRes.result.message, /no corresponde a ningún colaborador/i);
});

test('Rechaza registro para colaborador inactivo', () => {
  const inactiveRes = processTimeclockCheck('EMP-999', mockEmployees, []);
  assert.equal(inactiveRes.result.success, false);
  assert.match(inactiveRes.result.message, /se encuentra inactivo/i);
});

test('Registra entrada exitosa para colaborador activo', () => {
  const attendanceList: AttendanceRecord[] = [];
  const { result, updatedAttendance } = processTimeclockCheck('EMP-002', mockEmployees, attendanceList, {
    date: '2026-10-08',
    time: '08:05'
  });

  assert.equal(result.success, true);
  assert.equal(result.type, 'check_in');
  assert.equal(result.status, 'puntual');
  assert.equal(result.checkInTime, '08:05');
  assert.equal(updatedAttendance.length, 1);
  assert.equal(updatedAttendance[0].checkIn, '08:05');
});

test('Registra salida cuando ya existe entrada en el mismo día', () => {
  const attendanceList: AttendanceRecord[] = [
    {
      id: 'att-1',
      employeeId: 'emp-2',
      date: '2026-10-08',
      checkIn: '08:05',
      status: 'puntual',
      deviceSimulated: 'Checador Online Web / QR'
    }
  ];

  const { result, updatedAttendance } = processTimeclockCheck('EMP-002', mockEmployees, attendanceList, {
    date: '2026-10-08',
    time: '16:02'
  });

  assert.equal(result.success, true);
  assert.equal(result.type, 'check_out');
  assert.equal(result.checkOutTime, '16:02');
  assert.equal(updatedAttendance.length, 1);
  assert.equal(updatedAttendance[0].checkOut, '16:02');
});

test('Informa jornada completada y no duplica si ya tiene entrada y salida', () => {
  const attendanceList: AttendanceRecord[] = [
    {
      id: 'att-1',
      employeeId: 'emp-2',
      date: '2026-10-08',
      checkIn: '08:05',
      checkOut: '16:02',
      status: 'puntual',
      deviceSimulated: 'Checador Online Web / QR'
    }
  ];

  const { result, updatedAttendance } = processTimeclockCheck('EMP-002', mockEmployees, attendanceList, {
    date: '2026-10-08',
    time: '16:30'
  });

  assert.equal(result.success, false);
  assert.equal(result.type, 'already_completed');
  assert.match(result.message, /jornada de hoy.*ya está completada/i);
  assert.equal(updatedAttendance.length, 1);
});
