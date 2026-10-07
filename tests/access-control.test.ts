import test from 'node:test';
import assert from 'node:assert/strict';
import codiaBetaConfig from '../src/config/codia-beta.json' with { type: 'json' };
import type { UserRole, Permission } from '../src/types';



const checkPermission = (role: UserRole, permission: Permission): boolean => {
  const roleData = codiaBetaConfig.roles[role as keyof typeof codiaBetaConfig.roles];
  if (!roleData) return false;
  const perms = (roleData.permissions as string[]) || [];
  return perms.includes('*') || perms.includes(permission);
};

test('Superadministrador tiene permiso universal (*)', () => {
  assert.equal(checkPermission('superadmin', 'sales.create'), true);
  assert.equal(checkPermission('superadmin', 'settings.manage'), true);
  assert.equal(checkPermission('superadmin', 'audit.view'), true);
  assert.equal(checkPermission('superadmin', 'users.manage'), true);
});

test('Administrador tiene permisos de gestión operativa y financiera', () => {
  assert.equal(checkPermission('administrador', 'sales.create'), true);
  assert.equal(checkPermission('administrador', 'inventory.adjust'), true);
  assert.equal(checkPermission('administrador', 'inventory.waste'), true);
  assert.equal(checkPermission('administrador', 'employees.manage'), true);
  assert.equal(checkPermission('administrador', 'reports.financial'), true);
  assert.equal(checkPermission('administrador', 'audit.view'), true);
  assert.equal(checkPermission('administrador', 'settings.manage'), true);
});

test('Encargado puede operar sucursal pero no cambiar configuración global ni ver finanzas restringidas', () => {
  assert.equal(checkPermission('encargado', 'sales.create'), true);
  assert.equal(checkPermission('encargado', 'inventory.waste'), true);
  assert.equal(checkPermission('encargado', 'inventory.receive'), true);
  assert.equal(checkPermission('encargado', 'reports.operational'), true);
  
  // Restricciones de encargado
  assert.equal(checkPermission('encargado', 'settings.manage'), false);
  assert.equal(checkPermission('encargado', 'reports.financial'), false);
  assert.equal(checkPermission('encargado', 'audit.view'), false);
});

test('Empleado operativo solo tiene permisos básicos de POS y atención', () => {
  assert.equal(checkPermission('empleado', 'sales.create'), true);
  assert.equal(checkPermission('empleado', 'sales.view_own'), true);
  assert.equal(checkPermission('empleado', 'inventory.view'), true);
  assert.equal(checkPermission('empleado', 'customers.create'), true);
  assert.equal(checkPermission('empleado', 'loyalty.redeem'), true);

  // Restricciones críticas para el empleado
  assert.equal(checkPermission('empleado', 'inventory.adjust'), false);
  assert.equal(checkPermission('empleado', 'inventory.waste'), false);
  assert.equal(checkPermission('empleado', 'employees.manage'), false);
  assert.equal(checkPermission('empleado', 'reports.financial'), false);
  assert.equal(checkPermission('empleado', 'settings.manage'), false);
  assert.equal(checkPermission('empleado', 'audit.view'), false);
});

test('Cliente únicamente puede consultar sus propios datos y sellos', () => {
  assert.equal(checkPermission('cliente', 'customers.view_own'), true);
  assert.equal(checkPermission('cliente', 'loyalty.view_own'), true);

  // Restricciones absolutas para el cliente
  assert.equal(checkPermission('cliente', 'sales.create'), false);
  assert.equal(checkPermission('cliente', 'inventory.view'), false);
  assert.equal(checkPermission('cliente', 'employees.view'), false);
  assert.equal(checkPermission('cliente', 'settings.manage'), false);
  assert.equal(checkPermission('cliente', 'audit.view'), false);
});
