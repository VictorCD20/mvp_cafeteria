'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { } from '../../types';
import { Modal } from '../ui/Modal';
import { Heart, Gift, Plus, Search, ExternalLink } from 'lucide-react';
import { Product } from '../../types';

export const LoyaltyView = () => {
  const {
    clients,
    addClient,
    redeemReward,
    promotions,
    addPromotion,
    togglePromotion,
    can,
    setActiveTab,
    subTab,
    setSubTab,
  } = useCodia();

  const canManagePromos = can('promociones');
  const activeSubTab: 'clientes' | 'promociones' | 'recompensas' =
    subTab === 'promociones' || subTab === 'recompensas' ? subTab : 'clientes';
  const setActiveSubTab = (tab: 'clientes' | 'promociones' | 'recompensas') => setSubTab(tab);
  const [search, setSearch] = useState('');

  // Modal states
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Promo form
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoAudience, setPromoAudience] = useState<'todos' | 'frecuentes' | 'nuevos' | 'proximos_recompensa' | 'inactivos'>('todos');
  const [promoCode, setPromoCode] = useState('');
  const [promoValidUntil, setPromoValidUntil] = useState('2027-12-31');
  const [promoBenefit, setPromoBenefit] = useState<'descuento' | 'sellos' | 'regalo'>('descuento');
  const [promoDiscount, setPromoDiscount] = useState(10);
  const [promoAppliesTo, setPromoAppliesTo] = useState<Product['category'][]>([]);
  const [promoBonusStamps, setPromoBonusStamps] = useState(1);
  const [promoFridayOnly, setPromoFridayOnly] = useState(false);
  const [promoMinPurchase, setPromoMinPurchase] = useState(0);
  const [promoFreeItem, setPromoFreeItem] = useState('');

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`
    });
    setIsAddClientModalOpen(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
  };

  const handleAddPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion({
      title: promoTitle,
      description: promoDesc,
      audience: promoAudience,
      validUntil: promoValidUntil,
      active: true,
      code: promoCode.trim().toUpperCase() || 'PROMO10',
      discountPercentage: promoBenefit === 'descuento' ? Number(promoDiscount) : undefined,
      appliesTo: promoBenefit === 'descuento' ? promoAppliesTo : undefined,
      bonusStamps: promoBenefit === 'sellos' ? Number(promoBonusStamps) : undefined,
      fridayOnly: promoBenefit === 'sellos' ? promoFridayOnly : undefined,
      minPurchase: promoBenefit === 'sellos' && promoMinPurchase > 0 ? Number(promoMinPurchase) : undefined,
      freeItem: promoBenefit === 'regalo' ? promoFreeItem : undefined
    });
    setIsAddPromoModalOpen(false);
    setPromoTitle('');
    setPromoDesc('');
    setPromoCode('');
    setPromoFreeItem('');
  };

  const benefitLabel = (promo: (typeof promotions)[number]) => {
    if (promo.discountPercentage) return `${promo.discountPercentage}% de descuento`;
    if (promo.bonusStamps) return `+${promo.bonusStamps} sello${promo.bonusStamps > 1 ? 's' : ''} extra`;
    if (promo.freeItem) return `Regalo: ${promo.freeItem}`;
    return 'Sin beneficio automático (solo visibilidad)';
  };

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Header & Subtabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Heart className="w-6 h-6 text-purple-600" />
            <span>Cliente Consentido</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Programa de fidelización por sellos digitales y promociones dirigidas. Las tarjetas viven en Vista del cliente.
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('clientes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'clientes'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Clientes ({clients.length})
          </button>
          <button
            onClick={() => setActiveSubTab('promociones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'promociones'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Promociones ({promotions.length})
          </button>
          <button
            onClick={() => setActiveSubTab('recompensas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'recompensas'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Recompensas (Canjes)
          </button>
        </div>
      </div>

      {/* TAB 1: CLIENTES LIST */}
      {activeSubTab === 'clientes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente por nombre o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Cliente Consentido</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Nivel / Tier</th>
                    <th className="p-4">Sellos Actuales</th>
                    <th className="p-4">Recompensas Listas</th>
                    <th className="p-4">Total Visitas</th>
                    <th className="p-4 text-right">Tarjeta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/30"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">
                              {client.name}
                            </div>
                            <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                              {client.code}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                            client.tier === 'VIP Consentido'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : client.tier === 'Frecuente'
                              ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {client.tier}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {client.stamps} / {client.stampsGoal} sellos
                      </td>
                      <td className="p-4">
                        {client.rewardsAvailable > 0 ? (
                          <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[10px] border border-emerald-500/20">
                            {client.rewardsAvailable} Recompensa(s) Lista(s) 🎉
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">0 en espera</span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                        {client.totalVisits} visitas
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setActiveTab('vista_cliente', client.id)}
                          className="bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 transition inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver tarjeta
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROMOCIONES */}
      {activeSubTab === 'promociones' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Campañas & Promociones Activas ({promotions.length})
            </h3>
            {canManagePromos && (
              <button
                onClick={() => setIsAddPromoModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Promoción</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-purple-500/10 text-purple-600 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      Audiencia: {promo.audience.replace('_', ' ')}
                    </span>
                    {canManagePromos ? (
                      <button
                        onClick={() => togglePromotion(promo.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          promo.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {promo.active ? 'Publicada ✓' : 'Pausada'}
                      </button>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          promo.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {promo.active ? 'Publicada' : 'Pausada'}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{promo.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{promo.description}</p>
                  <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 mt-1.5">{benefitLabel(promo)}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded">
                    {promo.code}
                  </span>
                  <span className="text-slate-400 text-[11px]">Vence: {promo.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECOMPENSAS */}
      {activeSubTab === 'recompensas' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
            <Gift className="w-5 h-5 text-emerald-500" />
            <span>Recompensas Listas para Canjear en Barra</span>
          </h3>

          <div className="space-y-3">
            {clients.filter((c) => c.rewardsAvailable > 0).length > 0 ? (
              clients
                .filter((c) => c.rewardsAvailable > 0)
                .map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-extrabold text-emerald-600 text-xs">
                        {client.rewardsAvailable} Café Gratis Disponible
                      </span>
                      <button
                        onClick={() => redeemReward(client.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                      >
                        Aplicar Canje
                      </button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No hay recompensas pendientes de canjear en este momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD CLIENT */}
      <Modal isOpen={isAddClientModalOpen} onClose={() => setIsAddClientModalOpen(false)} title="Registrar Cliente Consentido">
        <form onSubmit={handleAddClientSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Carlos Mendoza"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                placeholder="cliente@gmail.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                placeholder="55 1234 5678"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Guardar y Generar QR Digital
          </button>
        </form>
      </Modal>

      {/* MODAL: ADD PROMOTION */}
      <Modal isOpen={isAddPromoModalOpen} onClose={() => setIsAddPromoModalOpen(false)} title="Crear Campaña de Promoción">
        <form onSubmit={handleAddPromoSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título de la Promoción</label>
            <input
              type="text"
              required
              value={promoTitle}
              onChange={(e) => setPromoTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
              placeholder="ej. 2x1 en Frappés los Jueves"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <textarea
              required
              rows={2}
              value={promoDesc}
              onChange={(e) => setPromoDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Audiencia Objetivos</label>
              <select
                value={promoAudience}
                onChange={(e) => setPromoAudience(e.target.value as typeof promoAudience)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
              >
                <option value="todos">Todos los clientes</option>
                <option value="frecuentes">Clientes frecuentes</option>
                <option value="nuevos">Clientes nuevos</option>
                <option value="proximos_recompensa">Próximos a recompensa</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Código Promocional</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono uppercase"
                placeholder="PROMO20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Beneficio</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'descuento', label: 'Descuento %' },
                  { id: 'sellos', label: 'Sellos extra' },
                  { id: 'regalo', label: 'Producto de regalo' }
                ] as const
              ).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setPromoBenefit(b.id)}
                  className={`text-xs font-bold py-2 rounded-xl border transition ${
                    promoBenefit === b.id
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {promoBenefit === 'descuento' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Porcentaje de descuento</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={promoDiscount}
                  onChange={(e) => setPromoDiscount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Aplica a <span className="font-normal text-slate-400">(sin elegir = todo el ticket)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'cafe_caliente', label: 'Café caliente' },
                      { id: 'cafe_frio', label: 'Café frío / frappés' },
                      { id: 'te_infusiones', label: 'Té e infusiones' },
                      { id: 'reposteria', label: 'Repostería' },
                      { id: 'alimentos', label: 'Alimentos' }
                    ] as { id: Product['category']; label: string }[]
                  ).map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                        promoAppliesTo.includes(cat.id)
                          ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/40'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-purple-600"
                        checked={promoAppliesTo.includes(cat.id)}
                        onChange={() =>
                          setPromoAppliesTo((prev) =>
                            prev.includes(cat.id) ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                          )
                        }
                      />
                      {cat.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {promoBenefit === 'sellos' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Sellos extra por compra</label>
                <input
                  type="number"
                  min={1}
                  max={7}
                  required
                  value={promoBonusStamps}
                  onChange={(e) => setPromoBonusStamps(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Compra mínima (MXN)</label>
                <input
                  type="number"
                  min={0}
                  value={promoMinPurchase}
                  onChange={(e) => setPromoMinPurchase(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>
              <label className="col-span-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={promoFridayOnly}
                  onChange={(e) => setPromoFridayOnly(e.target.checked)}
                  className="accent-purple-600"
                />
                Solo los viernes (como el Doble Sello)
              </label>
            </div>
          )}

          {promoBenefit === 'regalo' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Producto de regalo <span className="font-normal text-slate-400">(se entrega al canjear la recompensa)</span>
              </label>
              <input
                type="text"
                required
                value={promoFreeItem}
                onChange={(e) => setPromoFreeItem(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                placeholder="ej. Croissant Mantequilla"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Vigente hasta</label>
            <input
              type="date"
              required
              value={promoValidUntil}
              onChange={(e) => setPromoValidUntil(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Publicar Promoción
          </button>
        </form>
      </Modal>
    </div>
  );
};
