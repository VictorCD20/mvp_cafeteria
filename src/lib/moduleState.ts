import codiaBetaConfig from '../config/codia-beta.json' with { type: 'json' };
import type { ModuleStatus, ModuleTechnicalInfo } from '../types';

export const INITIAL_MODULES: Record<string, ModuleTechnicalInfo> = {
  auth: {
    key: 'auth',
    name: 'Autenticación y Sesiones',
    version: '1.0.0',
    status: codiaBetaConfig.modules.auth?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Gestión de roles y control de acceso basado en permisos.',
    category: 'core'
  },
  catalog: {
    key: 'catalog',
    name: 'Catálogo de Productos',
    version: '1.0.0',
    status: codiaBetaConfig.modules.catalog?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Definición de productos, categorías y precios base.',
    category: 'core'
  },
  pos: {
    key: 'pos',
    name: 'Punto de Venta (POS)',
    version: '1.0.0',
    status: codiaBetaConfig.modules.pos?.enabled ? 'activo' : 'inactivo',
    dependencies: ['catalog'],
    description: 'Cobro rápido, tickets, descuentos y múltiples formas de pago.',
    category: 'core'
  },
  cash: {
    key: 'cash',
    name: 'Control de Caja',
    version: '1.0.0',
    status: codiaBetaConfig.modules.cash?.enabled ? 'activo' : 'inactivo',
    dependencies: ['pos'],
    description: 'Apertura, arqueos y cierre de turno de caja.',
    category: 'core'
  },
  inventory: {
    key: 'inventory',
    name: 'Inventario y Recetas',
    version: '1.0.0',
    status: codiaBetaConfig.modules.inventory?.enabled ? 'activo' : 'inactivo',
    dependencies: ['catalog'],
    description: 'Deducción automática de insumos por receta y control de mermas.',
    category: 'operativo'
  },
  customers: {
    key: 'customers',
    name: 'Gestión de Clientes',
    version: '1.0.0',
    status: codiaBetaConfig.modules.customers?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Base de clientes para asignación de ventas y fidelización.',
    category: 'operativo'
  },
  loyalty: {
    key: 'loyalty',
    name: 'Cliente Consentido (Lealtad)',
    version: '1.0.0',
    status: codiaBetaConfig.modules.loyalty?.enabled ? 'activo' : 'inactivo',
    dependencies: ['customers', 'pos'],
    description: 'Acumulación de sellos (meta de 8) y canje de recompensas.',
    category: 'operativo'
  },
  promotions: {
    key: 'promotions',
    name: 'Promociones',
    version: '1.0.0',
    status: codiaBetaConfig.modules.promotions?.enabled ? 'activo' : 'inactivo',
    dependencies: ['pos'],
    description: 'Descuentos por categoría, combos y bono de viernes.',
    category: 'operativo'
  },
  employees: {
    key: 'employees',
    name: 'Personal y Pre-Nómina',
    version: '1.0.0',
    status: codiaBetaConfig.modules.employees?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Gestión de expedientes y cálculo estimativo de pre-nómina (no fiscal).',
    category: 'administrativo'
  },
  finances: {
    key: 'finances',
    name: 'Finanzas y Flujo de Caja',
    version: '1.0.0',
    status: codiaBetaConfig.modules.finances?.enabled ? 'activo' : 'inactivo',
    dependencies: ['pos'],
    description: 'Registro de egresos y balance operativo neto en memoria.',
    category: 'administrativo'
  },
  reports: {
    key: 'reports',
    name: 'Reportes y Métricas',
    version: '1.0.0',
    status: codiaBetaConfig.modules.reports?.enabled ? 'activo' : 'inactivo',
    dependencies: ['pos', 'finances'],
    description: 'Métricas de venta, turnos, ticket promedio y productos estrella.',
    category: 'administrativo'
  },
  ocr_invoice: {
    key: 'ocr_invoice',
    name: 'Escaneo OCR de Comprobantes',
    version: '1.0.0-demo',
    status: 'simulado',
    dependencies: ['finances'],
    description: 'Lectura automatizada de tickets/facturas con temporizador simulado.',
    category: 'simulado'
  },
  wallet_whatsapp: {
    key: 'wallet_whatsapp',
    name: 'Billeteras Digitales y WhatsApp',
    version: '1.0.0-demo',
    status: 'simulado',
    dependencies: ['loyalty'],
    description: 'Pases Apple/Google Wallet y notificaciones (botones demostrativos).',
    category: 'simulado'
  },
  assistant: {
    key: 'assistant',
    name: 'Asistente Virtual CODIA',
    version: '1.0.0-demo',
    status: 'simulado',
    dependencies: [],
    description: 'Asistente interactivo con base de respuestas predefinidas de demo.',
    category: 'simulado'
  },
  settings: {
    key: 'settings',
    name: 'Configuración del Sistema',
    version: '1.0.0',
    status: codiaBetaConfig.modules.settings?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Personalización visual de colores, logos y tipografías.',
    category: 'core'
  },
  audit: {
    key: 'audit',
    name: 'Auditoría',
    version: '1.0.0',
    status: codiaBetaConfig.modules.audit?.enabled ? 'activo' : 'inactivo',
    dependencies: [],
    description: 'Registro de trazabilidad y eventos sensibles del sistema.',
    category: 'core'
  },
  timeclock_online: {
    key: 'timeclock_online',
    name: 'Checador Online (/checador)',
    version: '1.1.0-beta',
    status: 'activo',
    dependencies: ['employees'],
    description: 'Superficie independiente por PIN/QR para registro de personal.',
    category: 'operativo'
  },
  biometric_hardware: {
    key: 'biometric_hardware',
    name: 'Checador Biométrico Físico',
    version: '2.0.0-hw',
    status: 'planeado',
    dependencies: ['employees'],
    description: 'Integración vía SDK/API con hardware biométrico (huella/rostro).',
    category: 'planeado'
  }
};

export const getActiveDependents = (
  modules: Record<string, ModuleTechnicalInfo>,
  moduleKey: string
): string[] => {
  return Object.values(modules)
    .filter((m) => m.dependencies.includes(moduleKey) && (m.status === 'activo' || m.status === 'simulado'))
    .map((m) => m.key);
};

export const canToggleModule = (
  modules: Record<string, ModuleTechnicalInfo>,
  moduleKey: string
): { canToggle: boolean; newStatus?: ModuleStatus; message?: string } => {
  const target = modules[moduleKey];
  if (!target) {
    return { canToggle: false, message: `El módulo '${moduleKey}' no existe.` };
  }

  if (target.status === 'planeado') {
    return {
      canToggle: false,
      message: `El módulo '${target.name}' está marcado como 'planeado' y no puede activarse en esta beta.`
    };
  }

  const isCurrentlyActive = target.status === 'activo' || target.status === 'simulado';

  if (isCurrentlyActive) {
    const activeDeps = getActiveDependents(modules, moduleKey);
    if (activeDeps.length > 0) {
      const depNames = activeDeps.map((k) => `"${modules[k]?.name || k}"`).join(', ');
      return {
        canToggle: false,
        message: `Bloqueado: No se puede desactivar "${target.name}" porque los siguientes módulos activos dependen de él: ${depNames}. Desactívalos primero.`
      };
    }
    return { canToggle: true, newStatus: 'inactivo' };
  } else {
    const missingParents = target.dependencies.filter((p) => {
      const parent = modules[p];
      return !parent || (parent.status !== 'activo' && parent.status !== 'simulado');
    });

    if (missingParents.length > 0) {
      const parentNames = missingParents.map((k) => `"${modules[k]?.name || k}"`).join(', ');
      return {
        canToggle: false,
        message: `Bloqueado: No se puede activar "${target.name}" porque requiere que los siguientes módulos estén activos primero: ${parentNames}.`
      };
    }
    const newStatus: ModuleStatus = target.category === 'simulado' ? 'simulado' : 'activo';
    return { canToggle: true, newStatus };
  }
};

export const MODULE_STORAGE_KEY = 'codia-demo-modules-demo-cafeteria-v1';

export interface StoredModuleState {
  version: '1.0';
  cafeteriaId: string;
  timestamp: number;
  statuses: Record<string, ModuleStatus>;
}

export const serializeModuleStatuses = (
  modules: Record<string, ModuleTechnicalInfo>,
  cafeteriaId: string = 'demo-cafeteria'
): string => {
  const statuses: Record<string, ModuleStatus> = {};
  for (const [key, mod] of Object.entries(modules)) {
    statuses[key] = mod.status;
  }
  const payload: StoredModuleState = {
    version: '1.0',
    cafeteriaId,
    timestamp: Date.now(),
    statuses
  };
  return JSON.stringify(payload);
};

export const parseStoredModuleStatuses = (
  rawJson: string | null,
  defaultModules: Record<string, ModuleTechnicalInfo> = INITIAL_MODULES
): Record<string, ModuleTechnicalInfo> => {
  if (!rawJson) return defaultModules;
  try {
    const parsed: StoredModuleState = JSON.parse(rawJson);
    if (!parsed || parsed.version !== '1.0' || !parsed.statuses || typeof parsed.statuses !== 'object') {
      return defaultModules;
    }
    const result: Record<string, ModuleTechnicalInfo> = { ...defaultModules };
    for (const [key, status] of Object.entries(parsed.statuses)) {
      if (result[key] && ['activo', 'inactivo', 'simulado', 'planeado'].includes(status)) {
        result[key] = {
          ...result[key],
          status
        };
      }
    }
    return result;
  } catch {
    return defaultModules;
  }
};
