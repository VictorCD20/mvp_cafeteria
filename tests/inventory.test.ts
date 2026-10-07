import test from 'node:test';
import assert from 'node:assert/strict';
import { requiredIngredients, findShortages } from '../src/lib/inventory.ts';
import type { Ingredient, Recipe, Product } from '../src/types';



const mockIngredients: Ingredient[] = [
  {
    id: 'ing-coffee',
    name: 'Café Grano',
    category: 'granos',
    unit: 'g',
    currentStock: 100,
    minStock: 20,
    costPerUnit: 0.5
  },
  {
    id: 'ing-milk',
    name: 'Leche Entera',
    category: 'lacteos',
    unit: 'ml',
    currentStock: 500,
    minStock: 100,
    costPerUnit: 0.02
  }
];

const mockProductLatte: Product = {
  id: 'prod-latte',
  code: 'PROD-001',
  name: 'Latte Caliente',
  category: 'cafe_caliente',
  price: 65,
  image: '',
  available: true,
  recipeId: 'rec-latte'
};

const mockRecipes: Recipe[] = [
  {
    id: 'rec-latte',
    productId: 'prod-latte',
    productName: 'Latte Caliente',
    items: [
      { ingredientId: 'ing-coffee', ingredientName: 'Café Grano', quantity: 18, unit: 'g' },
      { ingredientId: 'ing-milk', ingredientName: 'Leche Entera', quantity: 200, unit: 'ml' }
    ],
    estimatedCost: 13
  }
];

test('Calcula insumos requeridos multiplicando por la cantidad vendida', () => {
  const lines = [{ product: mockProductLatte, quantity: 2 }];
  const required = requiredIngredients(lines, mockRecipes);

  assert.equal(required.get('ing-coffee'), 36);
  assert.equal(required.get('ing-milk'), 400);
});

test('No detecta faltantes cuando el stock actual es suficiente', () => {
  const lines = [{ product: mockProductLatte, quantity: 2 }]; // Requiere 36g y 400ml (stock: 100g y 500ml)
  const shortages = findShortages(lines, mockRecipes, mockIngredients);

  assert.equal(shortages.length, 0);
});

test('Detecta faltantes cuando el consumo requerido supera el stock', () => {
  const lines = [{ product: mockProductLatte, quantity: 3 }]; // Requiere 54g y 600ml (stock leche: 500ml -> falta 100ml)
  const shortages = findShortages(lines, mockRecipes, mockIngredients);

  assert.equal(shortages.length, 1);
  assert.equal(shortages[0].ingredientName, 'Leche Entera');
  assert.equal(shortages[0].needed, 600);
  assert.equal(shortages[0].available, 500);
});
