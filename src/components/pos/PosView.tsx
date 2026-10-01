'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Product, CartItem } from '../../types';
import { Modal } from '../ui/Modal';
import { quoteSale, isFridayInMexico } from '../../lib/promotions';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  User,
  CheckCircle,
  Receipt,
  Search,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';

export const PosView = () => {
  const { products, clients, registerSale, sales, promotions } = useCodia();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('tarjeta');
  const [simulateFriday, setSimulateFriday] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Receipt modal after sale
  const [lastSaleFolio, setLastSaleFolio] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCheckoutError(null);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const quote = quoteSale(cart, promotions, selectedClient, { forceFriday: simulateFriday });
  const isFridayToday = isFridayInMexico();

  const handleCheckout = () => {
    const result = registerSale(cart, paymentMethod, selectedClientId || undefined, { forceFriday: simulateFriday });
    if (result.success) {
      setCheckoutError(null);
      setLastSaleFolio(result.folio);
      setCart([]);
      setSelectedClientId('');
    } else {
      setCheckoutError(result.message);
    }
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'todos' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const lastSaleObj = sales.find((s) => s.folio === lastSaleFolio);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {/* Left Column (2 Cols): Catalog & Category Filter */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header Search & Category Pills */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <span>Catálogo Punto de Venta</span>
            </h1>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar bebida o alimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'cafe_caliente', label: 'Café Caliente' },
              { id: 'cafe_frio', label: 'Café Frío / Frappés' },
              { id: 'te_infusiones', label: 'Té & Chai' },
              { id: 'reposteria', label: 'Repostería' },
              { id: 'alimentos', label: 'Alimentos' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredProducts.map((prod) => (
            <button
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between hover:border-blue-500/80 hover:shadow-lg transition-all group text-left relative overflow-hidden"
            >
              <div className="w-full h-24 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2 relative">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1 right-1 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                  ${prod.price}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 transition">
                  {prod.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                  {prod.category.replace('_', ' ')}
                </div>
              </div>

              <div className="mt-2 text-center bg-blue-50 dark:bg-blue-950/50 group-hover:bg-blue-600 text-blue-600 dark:text-blue-400 group-hover:text-white font-bold text-[11px] py-1.5 rounded-lg transition">
                + Agregar
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column (1 Col): Order Ticket & Checkout */}
      <div className="lg:sticky lg:top-0 lg:self-start">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
          {/* Solo la lista del ticket hace scroll; el cobro queda siempre visible abajo */}
          <div className="min-h-[7rem] flex-1 lg:overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span>Ticket de Compra</span>
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-500 font-semibold hover:underline"
                >
                  Vaciar
                </button>
              )}
            </div>

            {/* Cart Items List */}
            {cart.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex-1 overflow-hidden pr-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        ${item.product.price} MXN c/u
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-500 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                El carrito está vacío. Haz clic en una bebida del menú para iniciar la orden.
              </div>
            )}
          </div>

          {/* Checkout Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 shrink-0">
            {/* Associate Client for Loyalty */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-blue-500" />
                <span>Cliente Consentido (Suma Sellos)</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
              >
                <option value="">-- Cliente Mostrador (General) --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stamps}/{c.stampsGoal} sellos)
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Forma de Pago
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('tarjeta')}
                  className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition ${
                    paymentMethod === 'tarjeta'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <span>Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`p-2 rounded-xl text-xs font-bold border flex flex-col items-center justify-center transition ${
                    paymentMethod === 'efectivo'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 mb-1" />
                  <span>Efectivo</span>
                </button>
              </div>
            </div>

            {/* Promociones de la venta */}
            <label className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={simulateFriday || isFridayToday}
                disabled={isFridayToday}
                onChange={(e) => setSimulateFriday(e.target.checked)}
                className="accent-purple-600"
              />
              <span>{isFridayToday ? 'Hoy es viernes: doble sello activo' : 'Simular viernes (demo de doble sello)'}</span>
            </label>

            {quote.applied.length > 0 && (
              <div className="space-y-1 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl p-2.5">
                {quote.applied.map((a) => (
                  <div key={a.code + a.detail} className="flex justify-between text-[11px] text-purple-700 dark:text-purple-300">
                    <span className="font-bold">{a.code}</span>
                    <span>{a.detail}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total & Confirm Button */}
            <div className="pt-2 space-y-1">
              {quote.discount > 0 && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal ${quote.subtotal} · Descuento</span>
                  <span className="font-bold text-emerald-600">-${quote.discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Total a Cobrar</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${quote.total} <span className="text-xs text-slate-400">MXN</span>
                </span>
              </div>
              {selectedClient && (
                <div className="text-[11px] text-purple-600 dark:text-purple-300 text-right">
                  {selectedClient.name} sumará {quote.stamps} sello{quote.stamps > 1 ? 's' : ''}
                </div>
              )}
            </div>

            {checkoutError && (
              <div role="alert" className="text-[11px] text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-2.5">
                {checkoutError}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition text-xs flex items-center justify-center space-x-2"
            >
              <span>Confirmar Venta & Descontar Inventario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL TICKET GENERATED */}
      <Modal isOpen={Boolean(lastSaleFolio)} onClose={() => setLastSaleFolio(null)} title="Ticket de Venta Generado">
        {lastSaleObj && (
          <div className="space-y-4 font-mono text-xs text-slate-800 dark:text-slate-200">
            <div className="text-center border-b border-dashed border-slate-300 dark:border-slate-700 pb-3">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">CODIA CAFETERÍA GOURMET</div>
              <div>Sucursal Principal - Centro</div>
              <div className="text-[11px] text-slate-400 mt-1">Ticket Folio: {lastSaleObj.folio}</div>
              <div className="text-[11px] text-slate-400">{lastSaleObj.timestamp}</div>
            </div>

            <div className="space-y-1">
              {lastSaleObj.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-bold">${item.price * item.quantity} MXN</span>
                </div>
              ))}
            </div>

            {lastSaleObj.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento ({(lastSaleObj.promotionsApplied ?? []).filter((p) => p.includes('-$')).map((p) => p.split(':')[0]).join(', ')})</span>
                <span className="font-bold">-${lastSaleObj.discount} MXN</span>
              </div>
            )}

            <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-2 flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
              <span>TOTAL</span>
              <span>${lastSaleObj.total} MXN</span>
            </div>

            {lastSaleObj.clientName && (
              <div className="bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-[11px] font-sans text-purple-700 dark:text-purple-300">
                <span className="font-bold">Cliente Consentido:</span> {lastSaleObj.clientName}
                <br />
                <span>+{lastSaleObj.stampsEarned ?? 1} sello{(lastSaleObj.stampsEarned ?? 1) > 1 ? 's' : ''} agregado{(lastSaleObj.stampsEarned ?? 1) > 1 ? 's' : ''} a su tarjeta digital</span>
              </div>
            )}

            <div className="text-center text-[10px] text-slate-400 pt-2 font-sans">
              ¡Gracias por tu compra! Inventario descontado según receta.
            </div>

            <button
              onClick={() => setLastSaleFolio(null)}
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-2.5 rounded-xl text-xs transition font-sans"
            >
              Cerrar y Continuar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};
