<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CODIA · MVP Cafetería (demo)
Prototipo navegable de un sistema de gestión para una cafetería (1 sucursal): POS, inventario con recetas, empleados/pre-nómina, finanzas/OCR, Cliente Consentido (sellos), vista del cliente, bot y reportes. Uso: demo para validar con el cliente. Autor del MVP: Víctor; ajustes de demo: Kevin.

## Stack y estructura
- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. Sin backend: estado en memoria (`src/context/CodiaContext.tsx`) cargado de `src/data/seedData.ts`; se reinicia al recargar.
- `src/app/page.tsx` cambia de módulo con `activeTab` (no hay rutas por módulo).
- `src/components/<modulo>/` vistas · `src/lib/` reglas de negocio puras (promociones, inventario, fechas, asistencia, permisos) · `src/types/` modelos.
- Acceso por PIN por empleado con roles de acceso (`AccessRole` + `Permission` en `src/lib/permissions.ts`); `can(permiso)` decide qué ve cada usuario.

## Comandos
- `npm run dev` (http://localhost:3000) · `npx tsc --noEmit` · `npx eslint src` · `npm run build`

## Reglas de dominio / trampas
- Fechas y horas en hora de México (`src/lib/dates.ts`), nunca UTC (`toISOString`, `getDay`, etc.).
- Sellos: la meta es `stampsGoal`; al llegarla el contador vuelve a 0 y suma `rewardsAvailable`. Ningún cliente semilla debe quedar en meta/meta.
- Promociones se calculan solo en `src/lib/promotions.ts` (`quoteSale`, `promotionsForClient`, `matchesAudience`); el POS, `registerSale` y la vista del cliente usan la misma lógica.
- Asistencia: "hoy" es el registro más reciente por empleado (`latestAttendanceByEmployee`); retardo = horario del empleado + tolerancia (`checkInStatus`).
- Permisos: cada módulo/acción se protege con `can(permiso)`; los roles se administran desde Empleados → Roles. Siempre debe existir una persona activa con permiso `usuarios`.
- No se vende si faltan insumos (`src/lib/inventory.ts`). No mutar objetos del estado.
- Ventas `isShiftSummary` son cortes de días previos: cuentan en finanzas/reportes, no en "ventas del día" ni en ticket promedio.
- Integraciones (Hikvision, PAC, Google Wallet, IA) son simuladas; decirlo en la demo.

## Forma de trabajar
- Plan antes de código; un cambio de lógica por vez y volver a probar lo anterior.
- Trabajar en ramas de funcionalidad (`roles-wallet-correcciones` para los cambios actuales). El push está bloqueado hasta que Kevin apruebe.

## Límites
- ✅ Siempre: leer, editar en la rama de trabajo, correr tsc/lint/build, probar en el navegador, actualizar MEMORY.md.
- ⚠️ Preguntar antes: push, deploy, nuevas dependencias, cambiar la forma de los datos semilla o tipos compartidos.
- 🚫 Nunca: subir claves/tokens o datos personales; tocar el repo o Vercel de Víctor sin permiso.

## Verificación
`npx tsc --noEmit` sin errores, `npm run build` exitoso y recorrido manual: venta con cliente → sello/descuento → inventario; registro en Vista del cliente → sello → canje → notificación.
