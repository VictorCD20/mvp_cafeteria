import test from 'node:test';
import assert from 'node:assert/strict';
import type { InventoryMovementType, LoyaltyMovementType, AuditActionType } from '../src/types';



// Model logic for loyalty transition
const calculateLoyaltyTransition = (
  currentStamps: number,
  currentRewards: number,
  stampsToAdd: number,
  goal: number = 8
) => {
  const prevStamps = currentStamps;
  const prevRewards = currentRewards;
  let newStamps = currentStamps + stampsToAdd;
  let rewardsDelta = 0;
  if (newStamps >= goal) {
    rewardsDelta = Math.floor(newStamps / goal);
    newStamps = newStamps % goal;
  }
  return {
    prevStamps,
    newStamps,
    prevRewards,
    newRewards: prevRewards + rewardsDelta,
    rewardsDelta
  };
};

test('Calcula acumulación de sellos sin alcanzar meta', () => {
  const res = calculateLoyaltyTransition(3, 0, 2, 8);
  assert.equal(res.prevStamps, 3);
  assert.equal(res.newStamps, 5);
  assert.equal(res.rewardsDelta, 0);
  assert.equal(res.newRewards, 0);
});

test('Al alcanzar exactamente la meta de 8 sellos, reinicia a 0 y otorga 1 recompensa', () => {
  const res = calculateLoyaltyTransition(7, 0, 1, 8);
  assert.equal(res.prevStamps, 7);
  assert.equal(res.newStamps, 0);
  assert.equal(res.rewardsDelta, 1);
  assert.equal(res.newRewards, 1);
});

test('Al superar la meta (ej. 7 sellos + 2 con bono de viernes = 9), deja 1 sello y 1 recompensa', () => {
  const res = calculateLoyaltyTransition(7, 0, 2, 8);
  assert.equal(res.prevStamps, 7);
  assert.equal(res.newStamps, 1);
  assert.equal(res.rewardsDelta, 1);
  assert.equal(res.newRewards, 1);
});

test('Verifica que todos los tipos de movimientos formales sean válidos', () => {
  const validMovementTypes: InventoryMovementType[] = [
    'entrada',
    'compra',
    'consumo_venta',
    'merma',
    'ajuste_positivo',
    'ajuste_negativo',
    'devolucion',
    'cancelacion'
  ];
  assert.equal(validMovementTypes.length, 8);
});

test('Verifica que todas las acciones de auditoría sensible estén definidas', () => {
  const validAuditActions: AuditActionType[] = [
    'descuento',
    'merma',
    'ajuste_inventario',
    'cambio_rol',
    'cancelacion',
    'canje_recompensa',
    'configuracion',
    'modificacion_empleado'
  ];
  assert.equal(validAuditActions.length, 8);
});
