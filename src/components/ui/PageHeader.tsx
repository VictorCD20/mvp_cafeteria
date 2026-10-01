'use client';

import React, { ReactNode } from 'react';

interface PageHeaderProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Encabezado uniforme de cada módulo: título, descripción breve y acciones a la derecha. */
export const PageHeader = ({ icon, title, description, actions }: PageHeaderProps) => (
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </h1>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
  </div>
);

interface SectionCardProps {
  title: string;
  icon?: ReactNode;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Tarjeta de sección con título claro y espacio interior generoso. */
export const SectionCard = ({ title, icon, subtitle, action, children, className = '' }: SectionCardProps) => (
  <section className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 ${className}`}>
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);
