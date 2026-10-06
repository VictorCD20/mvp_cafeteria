import { AttendanceRecord } from '../types';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + (m || 0);
};

/** Puntual o retardo según la hora de entrada del horario ("07:00 - 15:00") más la tolerancia configurada. */
export const checkInStatus = (checkIn: string, schedule: string, toleranceMinutes: number): 'puntual' | 'retardo' => {
  const start = schedule.match(/\d{1,2}:\d{2}/)?.[0];
  if (!start) return 'puntual';
  return toMinutes(checkIn) > toMinutes(start) + toleranceMinutes ? 'retardo' : 'puntual';
};

/** Registro más reciente de cada empleado (el del día si existe). */
export const latestAttendanceByEmployee = (attendance: AttendanceRecord[]): Map<string, AttendanceRecord> => {
  const latest = new Map<string, AttendanceRecord>();
  attendance.forEach((a) => {
    const current = latest.get(a.employeeId);
    if (!current || a.date >= current.date) latest.set(a.employeeId, a);
  });
  return latest;
};
