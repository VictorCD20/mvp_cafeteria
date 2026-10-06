'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Bot, Send, X, Maximize2, ExternalLink } from 'lucide-react';

const quickPrompts = ['Ventas del día', '¿Quién faltó hoy?', 'Stock bajo'];

/**
 * Asistente flotante: botón abajo a la derecha que abre un mini chat.
 * Comparte la conversación con la sección "Asistente CODIA" (mismo estado del contexto).
 */
export const FloatingAssistant = () => {
  const { activeTab, setActiveTab, botMessages, sendBotMessage, can } = useCodia();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Desplaza solo la lista del mini chat hasta el último mensaje.
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [botMessages, open]);

  // Al abrir, el cursor queda listo para escribir; Escape cierra.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // En la sección del asistente ya está el chat completo.
  if (activeTab === 'asistente' || !can('asistente')) return null;

  // En el punto de venta el botón "Confirmar venta" está abajo a la derecha: ahí el asistente se mueve a la izquierda.
  const side = activeTab === 'ventas' ? 'left-[18.5rem]' : 'right-6';

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    sendBotMessage(clean);
    setInput('');
  };

  const openFull = () => {
    setOpen(false);
    setActiveTab('asistente');
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Asistente CODIA"
          className={`fixed bottom-24 ${side} z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vh-11rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200`}
        >
          {/* Encabezado */}
          <div className="flex items-center justify-between gap-2 px-4 h-14 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </span>
              <div className="leading-tight min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Asistente CODIA</div>
                <div className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Datos de la demo en vivo
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={openFull}
                title="Abrir el asistente completo"
                aria-label="Abrir el asistente completo"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Cerrar"
                aria-label="Cerrar el asistente"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {botMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.actionableLink && (
                    <button
                      onClick={() => {
                        setActiveTab(msg.actionableLink!.tab, msg.actionableLink!.subTab);
                      }}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <span>{msg.actionableLink.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1">{msg.timestamp}</span>
                </div>
              );
            })}
          </div>

          {/* Consultas rápidas + entrada */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-3 space-y-2 shrink-0">
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta algo sobre la cafetería..."
                aria-label="Escribe tu pregunta"
                className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Enviar"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar el asistente' : 'Abrir el asistente CODIA'}
        title="Asistente CODIA"
        className={`fixed bottom-6 ${side} z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:scale-105 transition-transform`}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>
    </>
  );
};
