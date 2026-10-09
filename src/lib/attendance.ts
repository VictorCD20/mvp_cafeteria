import type { Employee, AttendanceRecord } from '../types';

export interface TimeclockResult {
  success: boolean;
  type: 'check_in' | 'check_out' | 'already_completed' | 'error';
  employee?: {
    id: string;
    code: string;
    name: string;
    role: string;
    avatar: string;
    schedule: string;
  };
  record?: AttendanceRecord;
  message: string;
  checkInTime?: string;
  checkOutTime?: string;
  status?: 'puntual' | 'retardo' | 'ausente' | 'justificado';
}

export const getMexicoCityDateTime = (customDate?: Date): { date: string; time: string } => {
  const target = customDate || new Date();
  const formatterDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const formatterTime = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return {
    date: formatterDate.format(target),
    time: formatterTime.format(target)
  };
};

export const calculatePunctuality = (
  checkInTime: string,
  schedule: string,
  toleranceMinutes: number = 15
): 'puntual' | 'retardo' => {
  const match = schedule.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return 'puntual';

  const schedH = parseInt(match[1], 10);
  const schedM = parseInt(match[2], 10);
  const schedTotalMinutes = schedH * 60 + schedM;

  const [inH, inM] = checkInTime.split(':').map((v) => parseInt(v, 10));
  const inTotalMinutes = inH * 60 + inM;

  return inTotalMinutes <= schedTotalMinutes + toleranceMinutes ? 'puntual' : 'retardo';
};

export const processTimeclockCheck = (
  code: string,
  employees: Employee[],
  attendanceList: AttendanceRecord[],
  options?: {
    date?: string;
    time?: string;
    toleranceMinutes?: number;
    branchId?: string;
  }
): { result: TimeclockResult; updatedAttendance: AttendanceRecord[] } => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return {
      result: {
        success: false,
        type: 'error',
        message: 'Por favor ingresa tu código de empleado.'
      },
      updatedAttendance: attendanceList
    };
  }

  const employee = employees.find(
    (e) => e.code.toUpperCase() === cleanCode || e.id.toLowerCase() === cleanCode.toLowerCase()
  );

  if (!employee) {
    return {
      result: {
        success: false,
        type: 'error',
        message: `El código "${code}" no corresponde a ningún colaborador registrado.`
      },
      updatedAttendance: attendanceList
    };
  }

  if (employee.status !== 'activo') {
    return {
      result: {
        success: false,
        type: 'error',
        message: `El colaborador "${employee.name}" (${employee.code}) se encuentra inactivo en el sistema. Contacta a administración.`
      },
      updatedAttendance: attendanceList
    };
  }

  const { date: todayDate, time: currentTime } = getMexicoCityDateTime();
  const effectiveDate = options?.date || todayDate;
  const effectiveTime = options?.time || currentTime;
  const tolerance = options?.toleranceMinutes ?? 15;

  const todayRecordIndex = attendanceList.findIndex(
    (r) => r.employeeId === employee.id && r.date === effectiveDate
  );

  const empSummary = {
    id: employee.id,
    code: employee.code,
    name: employee.name,
    role: employee.role,
    avatar: employee.avatar,
    schedule: employee.schedule
  };

  if (todayRecordIndex === -1) {
    // Caso 1: Registrar Entrada
    const punctuality = calculatePunctuality(effectiveTime, employee.schedule, tolerance);
    const newRecord: AttendanceRecord = {
      id: `att-${effectiveDate}-${employee.id}-${Date.now().toString(36)}`,
      employeeId: employee.id,
      date: effectiveDate,
      checkIn: effectiveTime,
      status: punctuality,
      deviceSimulated: 'Checador Online Web / QR'
    };

    const punctualityLabel = punctuality === 'puntual' ? 'a tiempo' : 'con retardo';
    return {
      result: {
        success: true,
        type: 'check_in',
        employee: empSummary,
        record: newRecord,
        checkInTime: effectiveTime,
        status: punctuality,
        message: `¡Hola, ${employee.name}! Entrada registrada con éxito a las ${effectiveTime} hrs (${punctualityLabel}).`
      },
      updatedAttendance: [newRecord, ...attendanceList]
    };
  }

  const existingRecord = attendanceList[todayRecordIndex];

  if (!existingRecord.checkOut) {
    // Caso 2: Registrar Salida
    const updatedRecord: AttendanceRecord = {
      ...existingRecord,
      checkOut: effectiveTime
    };

    const newAttendanceList = [...attendanceList];
    newAttendanceList[todayRecordIndex] = updatedRecord;

    return {
      result: {
        success: true,
        type: 'check_out',
        employee: empSummary,
        record: updatedRecord,
        checkInTime: existingRecord.checkIn,
        checkOutTime: effectiveTime,
        status: existingRecord.status,
        message: `¡Hasta luego, ${employee.name}! Salida registrada con éxito a las ${effectiveTime} hrs. Entrada previa: ${existingRecord.checkIn} hrs.`
      },
      updatedAttendance: newAttendanceList
    };
  }

  // Caso 3: Jornada ya completada
  return {
    result: {
      success: false,
      type: 'already_completed',
      employee: empSummary,
      record: existingRecord,
      checkInTime: existingRecord.checkIn,
      checkOutTime: existingRecord.checkOut,
      status: existingRecord.status,
      message: `La jornada de hoy para ${employee.name} ya está completada (Entrada: ${existingRecord.checkIn} hrs, Salida: ${existingRecord.checkOut} hrs).`
    },
    updatedAttendance: attendanceList
  };
};
