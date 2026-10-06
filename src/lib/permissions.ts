import { AccessRole, ModuleId, Permission } from '../types';

/** Orden de los módulos: el primero permitido es la pantalla de inicio del rol. */
export const MODULE_ORDER: ModuleId[] = [
  'inicio',
  'ventas',
  'inventario',
  'empleados',
  'finanzas',
  'reportes',
  'cliente_consentido',
  'vista_cliente',
  'asistente',
  'configuracion'
];

export const PERMISSION_LABELS: { id: Permission; label: string }[] = [
  { id: 'inicio', label: 'Inicio (resumen del día)' },
  { id: 'ventas', label: 'Ventas (POS)' },
  { id: 'inventario', label: 'Inventario y recetas (ver y editar)' },
  { id: 'empleados', label: 'Empleados: asistencia y pre-nómina' },
  { id: 'usuarios', label: 'Administrar personal y roles' },
  { id: 'finanzas', label: 'Finanzas y OCR' },
  { id: 'reportes', label: 'Reportes' },
  { id: 'cliente_consentido', label: 'Cliente Consentido (clientes, sellos, canjes)' },
  { id: 'promociones', label: 'Crear y pausar promociones' },
  { id: 'vista_cliente', label: 'Vista del cliente' },
  { id: 'asistente', label: 'Asistente CODIA' },
  { id: 'configuracion', label: 'Configuración y reinicio de demo' }
];

export const isModuleId = (tab: string): tab is ModuleId => (MODULE_ORDER as string[]).includes(tab);

export const roleHasPermission = (role: AccessRole | undefined, permission: Permission) =>
  Boolean(role?.permissions.includes(permission));

export const homeTabFor = (role: AccessRole | undefined): ModuleId =>
  MODULE_ORDER.find((m) => roleHasPermission(role, m)) ?? 'inicio';
