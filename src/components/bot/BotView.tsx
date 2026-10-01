'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { PageHeader } from '../ui/PageHeader';
import { Bot, Send, User, ExternalLink, RefreshCcw } from 'lucide-react';

export const BotView = () => {
  const { botMessages, sendBotMessage, setActiveTab, setSubTab } = useCodia();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Desplaza solo la caja del chat (no toda la página) hasta el último mensaje.
    const list = messagesEndRef.current?.parentElement;
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [botMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendBotMessage(input.trim());
      setInput('');
    }
  };

  const quickPrompts = [
    'Ventas del día',
    '¿Quién faltó hoy?',
    'Stock bajo de insumos',
    'Total de gastos acumulados',
    'Clientes con recompensa lista'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Encabezado */}
      <PageHeader
        icon={<Bot className="w-6 h-6 text-indigo-500" />}
        title="Asistente CODIA"
        description="Bot administrativo en tiempo real: pregunta por ventas, retardos y faltas, inventario, gastos, clientes y promociones."
        actions={
          <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Conectado a datos vivos
          </span>
        }
      />

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Consultas rápidas:</span>
        {quickPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => sendBotMessage(promptText)}
            className="bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full font-medium transition-colors"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {botMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/50'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.actionableLink && (
                    <button
                      onClick={() => {
                        setActiveTab(msg.actionableLink!.tab);
                        setSubTab(msg.actionableLink!.subTab || '');
                      }}
                      className="inline-flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-[11px] font-bold px-3 py-1.5 rounded-xl transition"
                    >
                      <span>{msg.actionableLink.label}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className={`text-[10px] text-slate-400 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una pregunta sobre la cafetería (ej. ventas, faltas, insumos)..."
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-blue-600/30 transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
