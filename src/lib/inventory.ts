import { Ingredient, Recipe } from '../types';
import { CartLine } from './promotions';

export interface Shortage {
  ingredientName: string;
  needed: number;
  available: number;
  unit: string;
}

/** Suma lo que la venta consumirá de cada insumo según las recetas. */
export const requiredIngredients = (lines: CartLine[], recipes: Recipe[]) => {
  const required = new Map<string, number>();
  lines.forEach(({ product, quantity }) => {
    const recipe = recipes.find((r) => r.id === product.recipeId || r.productId === product.id);
    recipe?.items.forEach((item) => {
      required.set(item.ingredientId, (required.get(item.ingredientId) ?? 0) + item.quantity * quantity);
    });
  });
  return required;
};

/** Devuelve los insumos que no alcanzan para la venta (lista vacía = se puede vender). */
export const findShortages = (lines: CartLine[], recipes: Recipe[], ingredients: Ingredient[]): Shortage[] => {
  const shortages: Shortage[] = [];
  requiredIngredients(lines, recipes).forEach((needed, ingredientId) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (ing && ing.currentStock < needed) {
      shortages.push({ ingredientName: ing.name, needed, available: ing.currentStock, unit: ing.unit });
    }
  });
  return shortages;
};
