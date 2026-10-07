'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Modal } from '../ui/Modal';
import { RecipeItem } from '../../types';
import {
  Package,
  Coffee,
  BookOpen,
  History,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  ChevronRight,
  Scale
} from 'lucide-react';

export const InventoryView = () => {
  const {
    ingredients,
    addIngredient,
    updateIngredientStock,
    products,
    addProduct,
    recipes,
    addRecipe,
    movements,
    subTab,
    setSubTab
  } = useCodia();

  const activeSubTab: 'insumos' | 'productos' | 'recetas' | 'movimientos' =
    subTab === 'productos' || subTab === 'recetas' || subTab === 'movimientos' ? subTab : 'insumos';
  const setActiveSubTab = (tab: 'insumos' | 'productos' | 'recetas' | 'movimientos') => setSubTab(tab);
  const [search, setSearch] = useState('');

  // Stock update modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedIngId, setSelectedIngId] = useState<string | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [stockReason, setStockReason] = useState('Ajuste de inventario físico');

  // Add Ingredient Modal
  const [isAddIngModalOpen, setIsAddIngModalOpen] = useState(false);
  const [ingName, setIngName] = useState('');
  const [ingCategory, setIngCategory] = useState<'granos' | 'lacteos' | 'desechables' | 'jarabes' | 'panaderia' | 'perecederos'>('granos');
  const [ingUnit, setIngUnit] = useState<'g' | 'ml' | 'pza' | 'kg' | 'lt'>('g');
  const [ingStock, setIngStock] = useState(1000);
  const [ingMinStock, setIngMinStock] = useState(300);
  const [ingCost, setIngCost] = useState(0.5);

  // Add Recipe Modal
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [recipeProductId, setRecipeProductId] = useState(products[0]?.id || '');
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
    { ingredientId: ingredients[0]?.id || '', ingredientName: ingredients[0]?.name || '', quantity: 18, unit: ingredients[0]?.unit || 'g' }
  ]);

  const handleStockUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIngId) {
      updateIngredientStock(selectedIngId, Number(newStockValue), stockReason);
      setIsStockModalOpen(false);
    }
  };

  const handleAddIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIngredient({
      name: ingName,
      category: ingCategory,
      unit: ingUnit,
      currentStock: Number(ingStock),
      minStock: Number(ingMinStock),
      costPerUnit: Number(ingCost)
    });
    setIsAddIngModalOpen(false);
    setIngName('');
  };

  const handleAddRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === recipeProductId);
    if (!prod) return;

    let estimatedCost = 0;
    recipeItems.forEach((ri) => {
      const ing = ingredients.find((i) => i.id === ri.ingredientId);
      if (ing) {
        estimatedCost += ing.costPerUnit * ri.quantity;
      }
    });

    addRecipe({
      productId: recipeProductId,
      productName: prod.name,
      items: recipeItems,
      estimatedCost: Number(estimatedCost.toFixed(2))
    });

    setIsAddRecipeModalOpen(false);
  };

  const addRecipeItemRow = () => {
    if (ingredients.length > 0) {
      setRecipeItems((prev) => [
        ...prev,
        { ingredientId: ingredients[0].id, ingredientName: ingredients[0].name, quantity: 1, unit: ingredients[0].unit }
      ]);
    }
  };

  const updateRecipeItemRow = (index: number, field: keyof RecipeItem, value: any) => {
    setRecipeItems((prev) => {
      const copy = [...prev];
      if (field === 'ingredientId') {
        const ing = ingredients.find((i) => i.id === value);
        if (ing) {
          copy[index] = { ...copy[index], ingredientId: ing.id, ingredientName: ing.name, unit: ing.unit };
        }
      } else {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase()) ||
    ing.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Header & Subtabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <span>Inventario, Productos & Recetas</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Control de insumos, costeo de recetas y movimientos con deducción por POS.
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('insumos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'insumos'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Insumos ({ingredients.length})
          </button>
          <button
            onClick={() => setActiveSubTab('productos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'productos'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Menú ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recetas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'recetas'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Recetas ({recipes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('movimientos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'movimientos'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Movimientos ({movements.length})
          </button>
        </div>
      </div>

      {/* TAB 1: INSUMOS (INGREDIENTS) */}
      {activeSubTab === 'insumos' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar insumo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsAddIngModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Insumo</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Insumo</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Stock Actual</th>
                    <th className="p-4">Stock Mínimo</th>
                    <th className="p-4">Costo x Unidad</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Ajustar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredIngredients.map((ing) => {
                    const isLow = ing.currentStock <= ing.minStock;
                    return (
                      <tr key={ing.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {ing.name}
                        </td>
                        <td className="p-4">
                          <span className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-lg font-semibold text-[11px]">
                            {ing.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-sm text-slate-900 dark:text-white">
                          {ing.currentStock} <span className="text-xs font-normal text-slate-400">{ing.unit}</span>
                        </td>
                        <td className="p-4 text-slate-500 font-medium">
                          {ing.minStock} {ing.unit}
                        </td>
                        <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">
                          ${ing.costPerUnit} MXN / {ing.unit}
                        </td>
                        <td className="p-4">
                          {isLow ? (
                            <span className="bg-amber-500/10 text-amber-600 font-bold px-2.5 py-1 rounded-full text-[10px] border border-amber-500/20 inline-flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Stock Bajo</span>
                            </span>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-500/20">
                              Óptimo
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedIngId(ing.id);
                              setNewStockValue(ing.currentStock);
                              setIsStockModalOpen(true);
                            }}
                            className="bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 transition"
                          >
                            Modificar Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTOS DEL MENÚ */}
      {activeSubTab === 'productos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const hasRecipe = recipes.some((r) => r.id === prod.recipeId || r.productId === prod.id);
            return (
              <div
                key={prod.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-36 bg-slate-100 dark:bg-slate-800">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    ${prod.price} MXN
                  </span>
                  <span className="absolute bottom-2 left-2 bg-blue-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    {prod.code}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{prod.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="capitalize text-slate-500">{prod.category.replace('_', ' ')}</span>
                    {hasRecipe ? (
                      <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">
                        Receta Vinculada ✓
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded text-[10px]">
                        Sin Receta
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: RECETAS */}
      {activeSubTab === 'recetas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recetas & Descuento de Insumos ({recipes.length})
            </h3>
            <button
              onClick={() => setIsAddRecipeModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Receta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {recipe.productName}
                    </h4>
                    <span className="text-xs text-slate-400">Descuento automático en POS</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Costo Est. Insumos</div>
                    <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                      ${recipe.estimatedCost} MXN
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Insumos de la Receta:</div>
                  {recipe.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {item.ingredientName}
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MOVIMIENTOS HISTORIAL */}
      {activeSubTab === 'movimientos' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Historial de Movimientos de Inventario
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Registro formal de consumos por venta, entradas, mermas, compras y ajustes con usuario responsable.
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
              {movements.length} registro(s)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Insumo</th>
                  <th className="p-3">Tipo de Movimiento</th>
                  <th className="p-3">Cantidad</th>
                  <th className="p-3">Motivo / Folio</th>
                  <th className="p-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {movements.map((mov) => {
                  const getBadge = () => {
                    switch (mov.type) {
                      case 'consumo_venta':
                        return (
                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>Consumo POS</span>
                          </span>
                        );
                      case 'merma':
                        return (
                          <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Merma</span>
                          </span>
                        );
                      case 'entrada':
                      case 'compra':
                        return (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>{mov.type === 'compra' ? 'Compra' : 'Entrada'}</span>
                          </span>
                        );
                      case 'ajuste_positivo':
                        return (
                          <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>Ajuste (+)</span>
                          </span>
                        );
                      case 'ajuste_negativo':
                        return (
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>Ajuste (-)</span>
                          </span>
                        );
                      case 'cancelacion':
                      case 'devolucion':
                        return (
                          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                            <span>{mov.type === 'cancelacion' ? 'Cancelación' : 'Devolución'}</span>
                          </span>
                        );
                      default:
                        return (
                          <span className="bg-slate-500/10 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">
                            {mov.type}
                          </span>
                        );
                    }
                  };

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{mov.timestamp}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{mov.ingredientName}</td>
                      <td className="p-3">{getBadge()}</td>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                        {mov.quantity} {mov.unit}
                        {mov.costImpact ? (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            (${mov.costImpact} MXN)
                          </span>
                        ) : null}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                        {mov.reason}
                        {mov.saleFolio ? (
                          <span className="ml-1 text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                            [{mov.saleFolio}]
                          </span>
                        ) : null}
                      </td>
                      <td className="p-3 text-slate-500 font-medium text-[11px]">
                        {mov.responsibleUserName || 'Sistema'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* MODAL: UPDATE STOCK */}
      <Modal isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)} title="Modificar Stock de Insumo">
        <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nuevo Stock</label>
            <input
              type="number"
              required
              value={newStockValue}
              onChange={(e) => setNewStockValue(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Motivo</label>
            <input
              type="text"
              required
              value={stockReason}
              onChange={(e) => setStockReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
          >
            Guardar Cambio de Stock
          </button>
        </form>
      </Modal>

      {/* MODAL: ADD INGREDIENT */}
      <Modal isOpen={isAddIngModalOpen} onClose={() => setIsAddIngModalOpen(false)} title="Agregar Insumo">
        <form onSubmit={handleAddIngredientSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Insumo</label>
            <input
              type="text"
              required
              value={ingName}
              onChange={(e) => setIngName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Jarabe de Menta"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <select
                value={ingCategory}
                onChange={(e) => setIngCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="granos">Granos / Polvos</option>
                <option value="lacteos">Lácteos</option>
                <option value="desechables">Desechables</option>
                <option value="jarabes">Jarabes</option>
                <option value="panaderia">Panadería</option>
                <option value="perecederos">Perecederos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Unidad Medida</label>
              <select
                value={ingUnit}
                onChange={(e) => setIngUnit(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="g">Gramos (g)</option>
                <option value="ml">Mililitros (ml)</option>
                <option value="pza">Piezas (pza)</option>
                <option value="kg">Kilos (kg)</option>
                <option value="lt">Litros (lt)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Inicial</label>
              <input
                type="number"
                value={ingStock}
                onChange={(e) => setIngStock(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Stock Mínimo</label>
              <input
                type="number"
                value={ingMinStock}
                onChange={(e) => setIngMinStock(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Costo Unit (MXN)</label>
              <input
                type="number"
                step="0.01"
                value={ingCost}
                onChange={(e) => setIngCost(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Guardar Insumo
          </button>
        </form>
      </Modal>

      {/* MODAL: CREATE RECIPE */}
      <Modal isOpen={isAddRecipeModalOpen} onClose={() => setIsAddRecipeModalOpen(false)} title="Crear Receta para Producto">
        <form onSubmit={handleAddRecipeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Seleccionar Producto</label>
            <select
              value={recipeProductId}
              onChange={(e) => setRecipeProductId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price} MXN)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Insumos que Consume</label>
              <button
                type="button"
                onClick={addRecipeItemRow}
                className="text-[11px] text-blue-600 font-bold hover:underline"
              >
                + Agregar Insumo
              </button>
            </div>

            {recipeItems.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <select
                  value={item.ingredientId}
                  onChange={(e) => updateRecipeItemRow(idx, 'ingredientId', e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Cant."
                  value={item.quantity}
                  onChange={(e) => updateRecipeItemRow(idx, 'quantity', Number(e.target.value))}
                  className="w-20 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs"
                />
                <span className="text-xs font-semibold text-slate-400 w-8">{item.unit}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Asociar y Guardar Receta
          </button>
        </form>
      </Modal>
    </div>
  );
};
