'use client';

import React, { useState } from 'react';
import { useCodia } from '../../context/CodiaContext';
import { Modal } from '../ui/Modal';
import { Expense } from '../../types';
import {
  CircleDollarSign,
  Scan,
  Plus,
  Upload,
  Sparkles,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

export const FinancesView = () => {
  const {
    sales,
    expenses,
    addExpense,
    simulateOcrScan,
    invoices,
    requestInvoice,
    subTab,
    setSubTab
  } = useCodia();

  const activeSubTab: 'resumen' | 'gastos' | 'ocr' | 'facturacion' =
    subTab === 'gastos' || subTab === 'ocr' || subTab === 'facturacion' ? subTab : 'resumen';
  const setActiveSubTab = (tab: 'resumen' | 'gastos' | 'ocr' | 'facturacion') => setSubTab(tab);

  // Manual Expense Modal
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [expSupplier, setExpSupplier] = useState('');
  const [expCategory, setExpCategory] = useState<'insumos' | 'mantenimiento' | 'servicios' | 'nomina' | 'otros'>('insumos');
  const [expDesc, setExpDesc] = useState('');
  const [expSubtotal, setExpSubtotal] = useState(1000);
  const [expTax] = useState(160);

  // OCR Simulator State
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<{
    date: string;
    supplier: string;
    category: 'insumos' | 'mantenimiento' | 'servicios' | 'nomina' | 'otros';
    description: string;
    subtotal: number;
    tax: number;
    total: number;
  } | null>(null);

  // Invoice Simulator State
  const [invoiceSaleFolio, setInvoiceSaleFolio] = useState('');
  const [invoiceRfc, setInvoiceRfc] = useState('XAXX010101000');
  const [invoiceBusinessName, setInvoiceBusinessName] = useState('Publico en General');
  const [invoiceTaxEmail, setInvoiceTaxEmail] = useState('factura@cliente.com');

  const handleManualExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = expSubtotal + expTax;
    addExpense({
      date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }),
      supplier: expSupplier,
      category: expCategory,
      description: expDesc,
      subtotal: expSubtotal,
      tax: expTax,
      total,
      ocrScanned: false
    });
    setIsAddExpenseModalOpen(false);
    setExpSupplier('');
    setExpDesc('');
  };

  const handleRunOcrScan = async (mockTicket: string) => {
    setIsScanning(true);
    const data = await simulateOcrScan(mockTicket);
    setScannedData({
      date: data.date,
      supplier: data.supplier,
      category: data.category,
      description: data.description,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total
    });
    setIsScanning(false);
  };

  const handleSaveOcrExpense = () => {
    if (scannedData) {
      addExpense({
        ...scannedData,
        ocrScanned: true
      });
      setScannedData(null);
    }
  };

  const handleRequestInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceSaleFolio) {
      requestInvoice(invoiceSaleFolio, invoiceRfc, invoiceBusinessName, invoiceTaxEmail);
      setInvoiceSaleFolio('');
    }
  };

  const totalSales = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.total, 0);
  const netBalance = totalSales - totalExpenses;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Header & Subtabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <CircleDollarSign className="w-6 h-6 text-blue-600" />
            <span>Finanzas, OCR & Facturación</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Balance operativo, digitalización de tickets con OCR y emisión de CFDI simulada.
          </p>
        </div>

        {/* Subtabs Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('resumen')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'resumen'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Resumen Financiero
          </button>
          <button
            onClick={() => setActiveSubTab('gastos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'gastos'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Gastos ({expenses.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ocr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'ocr'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            OCR / Escáner
          </button>
          <button
            onClick={() => setActiveSubTab('facturacion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              activeSubTab === 'facturacion'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Facturación CFDI
          </button>
        </div>
      </div>

      {/* TAB 1: FINANCIAL SUMMARY */}
      {activeSubTab === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">Total Ingresos Ventas</div>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                ${totalSales.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs font-bold text-slate-400 uppercase">Total Egresos / Gastos</div>
              <div className="text-2xl font-black text-rose-600 mt-2">
                ${totalExpenses.toLocaleString('es-MX')} <span className="text-xs font-normal text-slate-400">MXN</span>
              </div>
            </div>

            <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
              <div className="text-xs font-bold text-blue-700 uppercase">Balance Operativo Neto</div>
              <div className="text-2xl font-black text-blue-900 mt-2">
                ${netBalance.toLocaleString('es-MX')} <span className="text-xs font-normal text-blue-700">MXN</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Desglose de Gastos por Categoría
            </h3>
            <div className="space-y-3">
              {['insumos', 'servicios', 'mantenimiento', 'otros'].map((cat) => {
                const catTotal = expenses
                  .filter((e) => e.category === cat)
                  .reduce((acc, e) => acc + e.total, 0);
                const percent = totalExpenses > 0 ? Math.round((catTotal / totalExpenses) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                      <span>{cat}</span>
                      <span>
                        ${catTotal.toLocaleString('es-MX')} MXN ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GASTOS / EGRESOS LIST */}
      {activeSubTab === 'gastos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Listado de Comprobantes & Egresos ({expenses.length})
            </h3>
            <button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Egreso</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-4">Folio / Fecha</th>
                    <th className="p-4">Proveedor</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Descripción</th>
                    <th className="p-4">Origen OCR</th>
                    <th className="p-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-4">
                        <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">{exp.folio}</div>
                        <div className="text-[11px] text-slate-400">{exp.date}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{exp.supplier}</td>
                      <td className="p-4">
                        <span className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{exp.description}</td>
                      <td className="p-4">
                        {exp.ocrScanned ? (
                          <span className="bg-purple-500/10 text-purple-600 font-bold px-2 py-0.5 rounded text-[10px] border border-purple-500/20 inline-flex items-center space-x-1">
                            <Scan className="w-3 h-3" />
                            <span>OCR Escaneado</span>
                          </span>
                        ) : (
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded text-[10px]">
                            Manual
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-sm text-slate-900 dark:text-white">
                        ${exp.total.toLocaleString('es-MX')} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OCR DIGITALIZACIÓN DE COMPROBANTES */}
      {activeSubTab === 'ocr' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl text-slate-900 border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl border border-purple-200">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Escáner OCR para Tickets & Comprobantes</h3>
                <p className="text-xs text-slate-500">
                  Sube una foto o selecciona un ticket mock de muestra para extraer automáticamente proveedor, fecha y montos.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => handleRunOcrScan('ticket_cafe')}
                disabled={isScanning}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Simular Escaneo Ticket Café</span>
              </button>
              <button
                onClick={() => handleRunOcrScan('ticket_leche')}
                disabled={isScanning}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-purple-200 transition"
              >
                Simular Ticket Lácteos
              </button>
              <button
                onClick={() => handleRunOcrScan('ticket_mantenimiento')}
                disabled={isScanning}
                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-purple-200 transition"
              >
                Simular Ticket Mantenimiento
              </button>
            </div>
          </div>

          {/* OCR Processing & Review Form */}
          {isScanning && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Analizando comprobante mediante OCR...
              </div>
              <div className="text-xs text-slate-400">Extrayendo texto, datos fiscales e IVA</div>
            </div>
          )}

          {scannedData && !isScanning && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-purple-500/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-purple-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Datos Extraídos por OCR (Revisión & Edición)</span>
                </div>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                  Confianza OCR 98.4%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={scannedData.supplier}
                    onChange={(e) => setScannedData({ ...scannedData, supplier: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={scannedData.date}
                    onChange={(e) => setScannedData({ ...scannedData, date: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <select
                    value={scannedData.category}
                    onChange={(e) => setScannedData({ ...scannedData, category: e.target.value as Expense['category'] })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="insumos">Insumos</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="servicios">Servicios</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                  <input
                    type="text"
                    value={scannedData.description}
                    onChange={(e) => setScannedData({ ...scannedData, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtotal ($)</label>
                  <input
                    type="number"
                    value={scannedData.subtotal}
                    onChange={(e) => {
                      const sub = Number(e.target.value);
                      setScannedData({ ...scannedData, subtotal: sub, total: sub + scannedData.tax });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">IVA ($)</label>
                  <input
                    type="number"
                    value={scannedData.tax}
                    onChange={(e) => {
                      const tax = Number(e.target.value);
                      setScannedData({ ...scannedData, tax, total: scannedData.subtotal + tax });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total ($)</label>
                  <input
                    type="number"
                    value={scannedData.total}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveOcrExpense}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-purple-600/30 transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar y Guardar Egreso en Finanzas</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FACTURACIÓN CFDI SIMULADA */}
      {activeSubTab === 'facturacion' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>Solicitud & Emisión de Facturas (Simulador PAC CFDI 4.0)</span>
            </h3>

            <form onSubmit={handleRequestInvoiceSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Folio de Venta (POS)
                </label>
                <select
                  required
                  value={invoiceSaleFolio}
                  onChange={(e) => setInvoiceSaleFolio(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                >
                  <option value="">-- Seleccionar Folio Venta --</option>
                  {sales.filter((s) => !s.isShiftSummary).map((s) => (
                    <option key={s.id} value={s.folio}>
                      {s.folio} - Total ${s.total} MXN ({s.timestamp})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">RFC Cliente</label>
                <input
                  type="text"
                  required
                  value={invoiceRfc}
                  onChange={(e) => setInvoiceRfc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Razón Social / Nombre Fiscal
                </label>
                <input
                  type="text"
                  required
                  value={invoiceBusinessName}
                  onChange={(e) => setInvoiceBusinessName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Receptor
                </label>
                <input
                  type="email"
                  required
                  value={invoiceTaxEmail}
                  onChange={(e) => setInvoiceTaxEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs shadow transition"
                >
                  Generar CFDI 4.0 Simulado
                </button>
              </div>
            </form>
          </div>

          {/* Issued Invoices List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white">
              Historial de Facturas Emitidas ({invoices.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-3">Folio Venta</th>
                    <th className="p-3">RFC / Razón Social</th>
                    <th className="p-3">UUID CFDI Simulado</th>
                    <th className="p-3">Estado PAC</th>
                    <th className="p-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{inv.saleFolio}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{inv.businessName}</div>
                        <div className="text-[11px] font-mono text-slate-400">{inv.rfc}</div>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{inv.uuidSimulated}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">
                          Timbrada ✓
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        ${inv.total} MXN
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL EXPENSE */}
      <Modal isOpen={isAddExpenseModalOpen} onClose={() => setIsAddExpenseModalOpen(false)} title="Registrar Egreso Manual">
        <form onSubmit={handleManualExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Proveedor</label>
            <input
              type="text"
              required
              value={expSupplier}
              onChange={(e) => setExpSupplier(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="ej. Distribuidora Panini MX"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
              <select
                value={expCategory}
                onChange={(e) => setExpCategory(e.target.value as Expense['category'])}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              >
                <option value="insumos">Insumos</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="servicios">Servicios</option>
                <option value="nomina">Pre-nómina / Pago</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subtotal (MXN)</label>
              <input
                type="number"
                required
                value={expSubtotal}
                onChange={(e) => setExpSubtotal(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
            <textarea
              rows={2}
              required
              value={expDesc}
              onChange={(e) => setExpDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
              placeholder="Detalles del pago o compra..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow transition"
          >
            Guardar Egreso
          </button>
        </form>
      </Modal>
    </div>
  );
};
