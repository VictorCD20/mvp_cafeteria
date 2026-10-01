'use client';

import React, { useMemo, useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Client, Promotion } from '../../types';
import { PageHeader } from '../ui/PageHeader';
import { Bell, Coffee, Gift, QrCode, ScanLine, Smartphone, Store, UserPlus } from 'lucide-react';

type PhoneScreen = 'poster' | 'registro' | 'tarjeta';

/** QR ilustrativo (no escaneable): patrón estable generado a partir del código del cliente. */
const DemoQr = ({ value }: { value: string }) => {
  const size = 21;
  const cells = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < size * size; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      out.push(((seed >> 16) & 1) === 1);
    }
    return out;
  }, [value]);
  const isFinder = (x: number, y: number) => {
    const inBox = (bx: number, by: number) => x >= bx && x < bx + 7 && y >= by && y < by + 7;
    return inBox(0, 0) || inBox(size - 7, 0) || inBox(0, size - 7);
  };
  const finderOn = (x: number, y: number) => {
    const lx = x >= size - 7 ? x - (size - 7) : x;
    const ly = y >= size - 7 ? y - (size - 7) : y;
    return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
  };
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-28 h-28" role="img" aria-label={`Código QR ${value}`}>
      <rect width={size} height={size} fill="#fff" />
      {cells.map((on, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const fill = isFinder(x, y) ? finderOn(x, y) : on;
        return fill ? <rect key={i} x={x} y={y} width={1} height={1} fill="#0f172a" /> : null;
      })}
    </svg>
  );
};

const promoForClient = (promo: Promotion, client: Client) => {
  if (!promo.active) return false;
  if (promo.audience === 'todos') return true;
  if (promo.audience === 'frecuentes') return client.tier !== 'Nuevo';
  if (promo.audience === 'nuevos') return client.tier === 'Nuevo';
  if (promo.audience === 'proximos_recompensa') return client.stampsGoal - client.stamps <= 2 || client.rewardsAvailable > 0;
  return false;
};

export const CustomerView = () => {
  const { clients, promotions, addClient, addStampsToClient, redeemReward, config } = useCodia();

  const [screen, setScreen] = useState<PhoneScreen>('poster');
  const [clientId, setClientId] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; privacy?: string }>({});
  const [notification, setNotification] = useState<string | null>(null);
  const [promoToSend, setPromoToSend] = useState<string>('');

  const client = clients.find((c) => c.id === clientId);
  const clientPromos = client ? promotions.filter((p) => promoForClient(p, client)) : [];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    const cleanPhone = phone.replace(/\D/g, '');
    if (name.trim().length < 3) nextErrors.name = 'Escribe tu nombre (mínimo 3 letras).';
    if (cleanPhone.length !== 10) nextErrors.phone = 'El teléfono debe tener 10 dígitos.';
    else if (clients.some((c) => c.phone.replace(/\D/g, '') === cleanPhone)) nextErrors.phone = 'Ese teléfono ya tiene una tarjeta.';
    if (!privacy) nextErrors.privacy = 'Debes aceptar el aviso de privacidad.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const created = addClient({ name: name.trim(), email: '', phone: cleanPhone });
    setClientId(created.id);
    setName('');
    setPhone('');
    setPrivacy(false);
    setScreen('tarjeta');
  };

  const openExisting = (id: string) => {
    setClientId(id);
    setScreen(id ? 'tarjeta' : 'poster');
    setNotification(null);
  };

  const sendPromotion = () => {
    const promo = promotions.find((p) => p.id === promoToSend);
    if (!promo || !client) return;
    setNotification(`${config.cafeteriaName}: ${promo.title}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        icon={<Smartphone className="w-6 h-6 text-purple-500" />}
        title="Vista del cliente"
        description="Así lo vive el cliente en su celular: escanea el QR del mostrador, se registra y guarda su tarjeta. A la derecha, lo que hace el cajero."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* CELULAR DEL CLIENTE */}
        <div className="flex justify-center">
          <div className="w-[320px] rounded-[2.5rem] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
            <div className="h-[600px] overflow-y-auto bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950 text-white relative">
              <div className="flex justify-between items-center px-5 pt-3 pb-2 text-[11px] text-slate-300">
                <span>9:41</span>
                <span>{config.cafeteriaName}</span>
              </div>

              {notification && (
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  className="mx-3 mb-2 w-[calc(100%-1.5rem)] text-left bg-white/95 text-slate-900 rounded-2xl p-3 shadow-xl flex items-start space-x-2 animate-in slide-in-from-top duration-300"
                >
                  <Bell className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">
                    <span className="font-bold block">Notificación</span>
                    {notification}
                  </span>
                </button>
              )}

              {screen === 'poster' && (
                <div className="px-6 pt-16 text-center space-y-5">
                  <Coffee className="w-12 h-12 mx-auto text-purple-300" />
                  <h3 className="text-xl font-extrabold">Junta sellos y gana café gratis</h3>
                  <p className="text-xs text-slate-300">
                    Escanea el código QR del mostrador para obtener tu tarjeta digital. Sin descargar ninguna app.
                  </p>
                  <button
                    type="button"
                    onClick={() => setScreen('registro')}
                    className="w-full bg-purple-600 hover:bg-purple-500 font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Simular escaneo del QR del mostrador</span>
                  </button>
                </div>
              )}

              {screen === 'registro' && (
                <form onSubmit={handleRegister} noValidate className="px-6 pt-8 space-y-4">
                  <h3 className="text-lg font-extrabold">Crea tu tarjeta</h3>
                  <p className="text-xs text-slate-300">
                    Recibe tu primer sello de bienvenida. Al juntar {config.stampsPerReward} sellos, tu bebida es gratis.
                  </p>
                  <div>
                    <label htmlFor="cv-name" className="text-[11px] font-bold text-slate-300">Nombre</label>
                    <input
                      id="cv-name"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
                      className="mt-1 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                      placeholder="Ej. Ana López"
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="cv-phone" className="text-[11px] font-bold text-slate-300">Teléfono (10 dígitos)</label>
                    <input
                      id="cv-phone"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                      className="mt-1 w-full rounded-xl bg-white/10 border border-white/20 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
                      placeholder="Ej. 5512345678"
                    />
                    {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                  <label className="flex items-start space-x-2 text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={privacy}
                      onChange={(e) => { setPrivacy(e.target.checked); setErrors((p) => ({ ...p, privacy: undefined })); }}
                      className="mt-0.5 accent-purple-500"
                    />
                    <span>Acepto el aviso de privacidad. Mis datos solo se usan para mi tarjeta y promociones de la cafetería.</span>
                  </label>
                  {errors.privacy && <p className="text-[11px] text-red-400">{errors.privacy}</p>}
                  <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 font-bold py-3 rounded-xl text-sm">
                    Obtener mi tarjeta
                  </button>
                  <button type="button" onClick={() => setScreen('poster')} className="w-full text-[11px] text-slate-400 py-1">
                    Cancelar
                  </button>
                </form>
              )}

              {screen === 'tarjeta' && client && (
                <div className="px-4 pt-4 pb-6 space-y-4">
                  <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-4 shadow-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-purple-200">Cliente Consentido</div>
                        <div className="text-lg font-extrabold">{client.name}</div>
                        <div className="text-[11px] text-purple-200 font-mono">{client.code}</div>
                      </div>
                      <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 font-bold">{client.tier}</span>
                    </div>
                    <div className="mt-4 text-[11px] text-purple-100 flex justify-between">
                      <span>Sellos</span>
                      <span className="font-bold">{client.stamps} / {client.stampsGoal}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-8 gap-1.5">
                      {Array.from({ length: client.stampsGoal }).map((_, i) => (
                        <div
                          key={i}
                          data-testid="stamp"
                          className={`aspect-square rounded-full flex items-center justify-center ${
                            i < client.stamps ? 'bg-amber-300 text-amber-900' : 'bg-white/15'
                          }`}
                        >
                          {i < client.stamps && <Coffee className="w-3 h-3" />}
                        </div>
                      ))}
                    </div>
                    {client.rewardsAvailable > 0 && (
                      <div className="mt-3 bg-emerald-400 text-emerald-950 rounded-xl px-3 py-2 text-xs font-bold flex items-center space-x-2">
                        <Gift className="w-4 h-4" />
                        <span>
                          {client.rewardsAvailable} bebida{client.rewardsAvailable > 1 ? 's' : ''} gratis lista{client.rewardsAvailable > 1 ? 's' : ''} para canjear
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-4 flex flex-col items-center">
                    <DemoQr value={client.qrCode} />
                    <div className="text-[11px] text-slate-500 mt-2 text-center">Muestra este código al pagar</div>
                  </div>

                  <div>
                    <div className="text-xs font-bold mb-2">Promociones para ti</div>
                    {clientPromos.length === 0 ? (
                      <div className="text-[11px] text-slate-400">Por ahora no hay promociones para tu tarjeta.</div>
                    ) : (
                      <div className="space-y-2">
                        {clientPromos.map((p) => (
                          <div key={p.id} className="bg-white/10 border border-white/10 rounded-xl p-3">
                            <div className="text-xs font-bold">{p.title}</div>
                            <div className="text-[11px] text-slate-300 mt-0.5">{p.description}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 text-center">
                    Demo: en la versión final esta tarjeta se guarda en Google Wallet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL DE CAJA */}
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-purple-500" />
              <span>Ver la tarjeta de un cliente</span>
            </h3>
            <select
              value={clientId}
              onChange={(e) => openExisting(e.target.value)}
              aria-label="Seleccionar cliente"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="">-- Nuevo cliente (pantalla del QR) --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.stamps}/{c.stampsGoal} sellos)
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Store className="w-4 h-4 text-blue-500" />
              <span>Caja (cajero)</span>
            </h3>
            {!client ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registra un cliente en el celular o elige uno arriba para escanear su tarjeta.
              </p>
            ) : (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cliente: <span className="font-bold text-slate-800 dark:text-slate-200">{client.name}</span> · {client.totalVisits} visitas
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => addStampsToClient(client.id, 1)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <ScanLine className="w-4 h-4" />
                    <span>Escanear y sumar sello</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => redeemReward(client.id)}
                    disabled={client.rewardsAvailable === 0}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Canjear recompensa</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  En una venta real, el sello también se suma desde el Punto de Venta al elegir al cliente.
                </p>
              </>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Enviar promoción al celular</span>
            </h3>
            <select
              value={promoToSend}
              onChange={(e) => setPromoToSend(e.target.value)}
              aria-label="Seleccionar promoción"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-900 dark:text-white"
            >
              <option value="">-- Elige una promoción activa --</option>
              {promotions.filter((p) => p.active).map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={sendPromotion}
              disabled={!client || !promoToSend}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-amber-950 font-bold py-2.5 rounded-xl text-xs"
            >
              Enviar notificación
            </button>
            {!client && <p className="text-[11px] text-slate-400">Primero abre la tarjeta de un cliente.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
