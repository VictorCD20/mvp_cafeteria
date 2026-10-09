import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_MODULES,
  getActiveDependents,
  canToggleModule,
  MODULE_STORAGE_KEY,
  serializeModuleStatuses,
  parseStoredModuleStatuses
} from '../src/lib/moduleState.ts';

test('Punto de Venta (pos) depende de Catálogo (catalog)', () => {
  assert.deepEqual(INITIAL_MODULES.pos.dependencies, ['catalog']);
});

test('Inventario (inventory) depende de Catálogo (catalog)', () => {
  assert.deepEqual(INITIAL_MODULES.inventory.dependencies, ['catalog']);
});

test('Finanzas (finances) depende de Punto de Venta (pos)', () => {
  assert.deepEqual(INITIAL_MODULES.finances.dependencies, ['pos']);
});

test('Checador Online (timeclock_online) depende de Empleados (employees)', () => {
  assert.deepEqual(INITIAL_MODULES.timeclock_online.dependencies, ['employees']);
});

test('Bloquea la desactivación de Catálogo si POS o Inventario están activos', () => {
  const check = canToggleModule(INITIAL_MODULES, 'catalog');
  assert.equal(check.canToggle, false);
  assert.match(check.message || '', /Punto de Venta \(POS\)/);
});

test('Permite desactivar Finanzas cuando sus módulos dependientes no están activos', () => {
  const customModules = {
    ...INITIAL_MODULES,
    ocr_invoice: { ...INITIAL_MODULES.ocr_invoice, status: 'inactivo' as const },
    reports: { ...INITIAL_MODULES.reports, status: 'inactivo' as const }
  };
  
  const check = canToggleModule(customModules, 'finances');
  assert.equal(check.canToggle, true);
  assert.equal(check.newStatus, 'inactivo');
});

test('Módulos planeados como Checador Biométrico Físico no pueden ser activados arbitrariamente', () => {
  const check = canToggleModule(INITIAL_MODULES, 'biometric_hardware');
  assert.equal(check.canToggle, false);
  assert.match(check.message || '', /planeado/);
});

test('La clave de almacenamiento local contiene el identificador de cafetería y versión', () => {
  assert.equal(MODULE_STORAGE_KEY, 'codia-demo-modules-demo-cafeteria-v1');
});

test('Serializa y deserializa el estado de módulos conservando cambios sin tocar datos operativos', () => {
  const modifiedModules = {
    ...INITIAL_MODULES,
    finances: { ...INITIAL_MODULES.finances, status: 'inactivo' as const }
  };

  const serialized = serializeModuleStatuses(modifiedModules, 'demo-cafeteria');
  assert.match(serialized, /"finances":"inactivo"/);
  assert.match(serialized, /"version":"1.0"/);

  const parsed = parseStoredModuleStatuses(serialized, INITIAL_MODULES);
  assert.equal(parsed.finances.status, 'inactivo');
  assert.equal(parsed.pos.status, 'activo');
});

test('parseStoredModuleStatuses recupera valores predeterminados ante JSON corrupto o nulo', () => {
  assert.deepEqual(parseStoredModuleStatuses(null, INITIAL_MODULES), INITIAL_MODULES);
  assert.deepEqual(parseStoredModuleStatuses('{"invalid": true}', INITIAL_MODULES), INITIAL_MODULES);
  assert.deepEqual(parseStoredModuleStatuses('not-a-json', INITIAL_MODULES), INITIAL_MODULES);
});
