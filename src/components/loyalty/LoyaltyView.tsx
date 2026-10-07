'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Client } from '../../types';
import { Modal } from '../ui/Modal';
import {
  Heart,
  Wallet,
  Gift,
  Sparkles,
  Plus,
  QrCode,
  CheckCircle2,
  Tag,
  Star,
  Users,
  Search,
  Award
} from 'lucide-react';

export const LoyaltyView = () => {
  const {
    clients,
    addClient,
    addStampsToClient,
    redeemReward,
    loyaltyMovements,
    promotions,
    addPromotion,
    togglePromotion,
    config,
    subTab,
    setSubTab
  } = useCodia();

  const activeSubTab: 'clientes' | 'wallet' | 'promociones' | 'recompensas' | 'historial' =
    subTab === 'wallet' || subTab === 'promociones' || subTab === 'recompensas' || subTab === 'historial' ? subTab : 'clientes';
  const setActiveSubTab = (tab: 'clientes' | 'wallet' | 'promociones' | 'recompensas' | 'historial') => setSubTab(tab);
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
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
  const [promoValidUntil, setPromoValidUntil] = useState('2026-12-31');

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
      code: promoCode || 'PROMO10'
    });
    setIsAddPromoModalOpen(false);
    setPromoTitle('');
    setPromoDesc('');
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

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
            <span>Cliente Consentido & Wallet Simulada</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Programa de fidelización por sellos digitales, wallet PWA simulada, recompensas y libro mayor de movimientos.
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
            onClick={() => setActiveSubTab('wallet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'wallet'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Wallet Simulada
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
            Recompensas ({clients.filter((c) => c.rewardsAvailable > 0).length})
          </button>
          <button
            onClick={() => setActiveSubTab('historial')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'historial'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Historial de Movimientos ({loyaltyMovements.length})
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
                    <th className="p-4 text-right">Ver Wallet</th>
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
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setActiveSubTab('wallet');
                          }}
                          className="bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-600 dark:text-purple-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 transition"
                        >
                          Abrir Wallet
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

      {/* TAB 2: WALLET SIMULADA (DIGITAL CARD PREVIEW) */}
      {activeSubTab === 'wallet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Selector List */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Seleccionar Tarjeta de Cliente
            </h3>
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClientId(c.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                    selectedClient?.id === c.id
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold">{c.name}</div>
                      <div className="text-[10px] opacity-80">{c.stamps}/{c.stampsGoal} sellos</div>
                    </div>
                  </div>
                  {c.rewardsAvailable > 0 && (
                    <span className="bg-emerald-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full">
                      🎁 {c.rewardsAvailable}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SIMULATED PWA WALLET CARD (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            {selectedClient && (
              <div className="space-y-6">
                {/* Visual Wallet Card mockup */}
                <div className="bg-gradient-to-tr from-slate-950 via-purple-950 to-slate-900 text-white p-6 rounded-3xl border border-purple-800/60 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/20 blur-[100px] pointer-events-none" />

                  {/* Header info */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="inline-flex items-center space-x-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        <span>Tarjeta Digital Consentido</span>
                      </div>
                      <h2 className="text-xl font-extrabold text-white mt-1">{selectedClient.name}</h2>
                      <div className="text-xs text-purple-300 font-mono">{selectedClient.code}</div>
                    </div>

                    <div className="text-right">
                      <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-xl">
                        {selectedClient.tier}
                      </span>
                    </div>
                  </div>

                  {/* Stamp Grid (8 slots) */}
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-purple-900/60 mb-6">
                    <div className="text-xs font-bold text-purple-200 mb-3 flex items-center justify-between">
                      <span>Progreso de Sellos de Café</span>
                      <span>
                        {selectedClient.stamps} / {selectedClient.stampsGoal} sellos
                      </span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {Array.from({ length: 8 }).map((_, index) => {
                        const isStamped = index < selectedClient.stamps;
                        return (
                          <div
                            key={index}
                            className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${
                              isStamped
                                ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 border-purple-400 text-white shadow-lg shadow-purple-500/30 scale-105'
                                : 'bg-slate-950/60 border-slate-800 text-slate-700'
                            }`}
                          >
                            {isStamped ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <span className="text-xs font-bold text-slate-600">{index + 1}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* QR Code & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl shadow">
                        <QrCode className="w-12 h-12 text-slate-950" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Código QR Cliente</div>
                        <div className="text-[11px] text-slate-400 font-mono">{selectedClient.qrCode}</div>
                      </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => addStampsToClient(selectedClient.id, 1)}
                        className="flex-1 sm:flex-initial bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition"
                      >
                        +1 Sello Demo
                      </button>
                      <button
                        onClick={() => redeemReward(selectedClient.id)}
                        disabled={selectedClient.rewardsAvailable === 0}
                        className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow transition"
                      >
                        Canjear Recompensa ({selectedClient.rewardsAvailable})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
            <button
              onClick={() => setIsAddPromoModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Promoción</span>
            </button>
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
                    <button
                      onClick={() => togglePromotion(promo.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        promo.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {promo.active ? 'Publicada ✓' : 'Pausada'}
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{promo.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{promo.description}</p>
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

      {/* TAB 5: HISTORIAL DE MOVIMIENTOS (LEDGER) */}
      {activeSubTab === 'historial' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Libro Mayor de Movimientos de Fidelidad
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Trazabilidad detallada de sellos ganados, bonificaciones, canjes de recompensa y ajustes manuales con responsable.
              </p>
            </div>
            <span className="text-xs font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg">
              {loyaltyMovements.length} registro(s)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Fecha / Hora</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Tipo de Evento</th>
                  <th className="p-3">Sellos (+/-)</th>
                  <th className="p-3">Saldo Resultante</th>
                  <th className="p-3">Motivo / Folio</th>
                  <th className="p-3">Responsable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loyaltyMovements.map((mov) => {
                  const getTypeBadge = () => {
                    switch (mov.type) {
                      case 'sello_ganado':
                        return (
                          <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            Sello Ganado
                          </span>
                        );
                      case 'bonificacion':
                        return (
                          <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            Bonificación Doble
                          </span>
                        );
                      case 'canje':
                        return (
                          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            Canje de Bebida
                          </span>
                        );
                      case 'ajuste':
                        return (
                          <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            Ajuste Manual
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
                      <td className="p-3 font-bold text-slate-900 dark:text-white">{mov.clientName}</td>
                      <td className="p-3">{getTypeBadge()}</td>
                      <td className="p-3 font-bold">
                        {mov.stampsDelta > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">+{mov.stampsDelta} sello(s)</span>
                        ) : mov.rewardsDelta < 0 ? (
                          <span className="text-rose-600 dark:text-rose-400">-1 recompensa</span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                        {mov.rewardsDelta > 0 ? (
                          <span className="block text-[10px] text-emerald-600 font-extrabold">
                            +{mov.rewardsDelta} recompensa lista
                          </span>
                        ) : null}
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {mov.newStamps}/{config.stampsPerReward} sellos
                        {mov.newRewards > 0 ? (
                          <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            {mov.newRewards} cortesía
                          </span>
                        ) : null}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                        {mov.reason}
                        {mov.saleFolio ? (
                          <span className="ml-1 text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold">
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
                onChange={(e) => setPromoAudience(e.target.value as any)}
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
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
          >
            Publicar Promoción en Wallet
          </button>
        </form>
      </Modal>
    </div>
  );
};
