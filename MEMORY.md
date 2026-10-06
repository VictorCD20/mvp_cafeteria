# MEMORY · MVP Cafetería

## Estado actual (2026-10-06)
- Demo funcional en memoria (sin base de datos), rama `roles-wallet-correcciones`.
- Tres frentes completados: (1) acceso por PIN con roles Administrador/Caja y administración de personal y roles; (2) Wallet fusionada con Vista del cliente; (3) corrección de errores de fechas, promociones y lint.
- Verificado: `tsc --noEmit` 0 errores, `eslint src` 0 errores (solo avisos de `<img>`), `npm run build` OK.

## Implementado en esta entrega

### 1. Acceso por PIN y roles de acceso
- **Pantalla de PIN** (`LoginView` nueva): elegir a la persona (tarjetas con foto, nombre y rol) y escribir su PIN de 4 dígitos con teclado numérico o teclado normal; error visible en PIN incorrecto. Ya no hay entrada directa a la demo.
- **PINs demo**: Laura 1234 (Administrador); Ana 2222, Luis 3333, Sofía 4444, Carlos 5555, María 6666 (Caja). Se muestran en la propia pantalla para la demo.
- **Modelo** (`src/types/index.ts`): `Employee` ahora tiene `accessRoleId` y `pin`. `AccessRole { id, name, description, permissions, isSystem? }`; `Permission` = `ModuleId` + `promociones` + `usuarios`.
- **Permisos por rol** (`src/lib/permissions.ts`): `can(permiso)` decide qué ve cada usuario; `MODULE_ORDER` define la pantalla de inicio del rol (`homeTabFor`). `role-admin` es `isSystem` (no se edita ni se borra); `role-caja` solo tiene Ventas, Inventario, Cliente Consentido y Vista del cliente.
- **Menú lateral filtrado**: solo aparecen los módulos permitidos; los grupos vacíos se ocultan. `activeTab` cae al primer módulo permitido si la URL apunta a uno sin permiso.
- **Encabezado filtrado**: "Nueva venta", "Preguntar al bot" y "Reiniciar demo" solo se muestran con su permiso (`ventas`, `asistente`, `configuracion`).
- **Asistente flotante** oculto para roles sin permiso `asistente`.
- **Cerrar sesión** en el menú lateral (icono junto al usuario) → vuelve a la pantalla de PIN.
- **Checador propio**: cada persona registra su Entrada/Salida desde el menú lateral (muestra hora de entrada/salida del día).
- **CRUD de empleados**: crear y editar (formulario con puesto, rol de acceso, PIN con mostrar/ocultar, pago, horario, días, contacto) y eliminar con confirmación. Código `EMP-###` calculado por el máximo + 1 (ya no se duplica al borrar).
- **Pestaña "Roles"** en Empleados (solo con permiso `usuarios`): tarjetas por rol con permisos etiquetados y conteo de personas; crear, editar y eliminar roles (checkboxes de permisos con nombres legibles).
- **Reglas duras** (en `CodiaContext`): PIN único de 4 dígitos; siempre debe quedar al menos una persona activa con permiso `usuarios` (`keepsAnAdmin`); nadie se elimina a sí mismo; un rol con personas asignadas no se borra; el rol del sistema no se modifica.

### 2. Wallet fusionada con Vista del cliente
- Se eliminó la pestaña "Wallet Simulada" de Cliente Consentido (lista de tarjetas, grid de sellos y QR duplicados).
- En la tabla de clientes, **"Ver tarjeta"** abre Vista del cliente con esa tarjeta ya abierta: `setActiveTab('vista_cliente', client.id)` → URL `?tab=vista_cliente&sub=cli-…`.
- `CustomerView`: el cliente abierto vive en `subTab` (URL) en administración y en estado local en `/cliente` (público); si la URL ya trae un cliente se abre directamente en su tarjeta.
- Enlaces actualizados: Dashboard "Ver recompensas" → `cliente_consentido/recompensas`; "Abrir tarjetas" → `vista_cliente`; link del bot de sellos → recompensas. `promoForClient` local eliminada en favor de `promotionsForClient` compartida.

### 3. Corrección de errores
- **Fechas en UTC** → `src/lib/dates.ts` con `todayInMexico` (YYYY-MM-DD) y `timeInMexico` (HH:MM) en `America/Mexico_City`. Aplicado en checador (entrada/salida/justificación) y OCR.
- **Retardo** → `checkInStatus` compara hora de entrada del horario del empleado + `config.lateToleranceMinutes` (antes 07:15 fijo e ignoraba la configuración).
- **Asistencia semilla** usa la fecha de hoy (`seedToday`) para que el checador actualice el mismo registro.
- **Registro por empleado** → `latestAttendanceByEmployee` en Dashboard, Empleados y bot (antes `find()` tomaba el primero y no el de hoy).
- **Audiencias muertas** → `proximos_recompensa` (a ≤2 sellos de la meta o con recompensa) e `inactivos` (≥30 días sin visita, `INACTIVE_AFTER_DAYS`) ya funcionan.
- **Descuento solo en fríos** → nuevo campo `appliesTo` (categorías; vacío = todo el ticket).
- **`freeItem`** → las promociones con regalo se entregan al canjear la recompensa (toast con el regalo).
- **Reglas de sellos** → `fridayOnly` y `minPurchase` por promoción (antes todo `bonusStamps` era viernes + $100 fijo).
- **Vigencias semilla** extendidas (2027) para que la demo no quede sin promociones.
- **Formulario de promoción** completo: tipo de beneficio (descuento %, sellos extra, regalo), categorías, compra mínima, "solo viernes", código, audiencia y vigencia. Crear/pausar requiere permiso `promociones`.
- **Bug de URL** → `setActiveTab(tab, sub)` actualiza pestaña y subpestaña en un solo paso (antes la subpestaña quedaba escrita con la pestaña anterior).
- **Bot** ya no saluda como "Laura" y sus conteos de retardos/faltas usan el registro de hoy por empleado.
- **Lint** → 7 errores eliminados (`any` en selects, `setState` en efecto de `AdminLayout`) y ~55 avisos de imports sin usar; quedan solo 4 avisos de `<img>`.

## Decisiones previas (vigentes)
- Navegación URL bidireccional (`?tab=...&sub=...`); URLs inválidas redirigen a la pantalla de inicio del rol.
- Menú móvil (Drawer) en <768px, cerrable con Escape o al elegir módulo.
- Vista del cliente pública en `/cliente`, sin controles de caja.
- Promociones reales en el POS (`quoteSale`); POS y `registerSale` usan la misma función.
- Interruptor "Simular viernes" en POS; sin "pagar con Wallet".
- Sello de bienvenida al registrarse (comportamiento original de Víctor).
- Cortes de caja semilla (`isShiftSummary`) cuentan en finanzas/reportes, no en "ventas del día".
- Rediseño (Kevin: "organizar, no eliminar"): menú agrupado por área, integraciones simuladas en "Modo demo", `PageHeader` por módulo.
- Asistente flotante comparte conversación con la sección; en POS se mueve a la izquierda.
- Paleta "Latte suave": modo claro forzado; slate→crema, blue/indigo→caramelo, purple→cacao.

## Ideas pendientes (NO implementar hasta que Kevin decida)
- Flujo mesero→cajero y corte de caja por turno.
- Modo "sin POS": dar sellos desde una venta registrada en otro sistema, para cafeterías que ya tienen punto de venta.
- Catering/eventos: cotización → anticipo → saldo → utilidad por evento.
- Selector de plan en la demo (Básico / Crecimiento / Completo) para ocultar módulos según el paquete.
- Marcar empleados como inactivos sin borrarlos (hoy el formulario no edita `status`).

## Errores a evitar
- No calcular "hoy" ni la hora en UTC (usa `src/lib/dates.ts`). No dejar clientes semilla en 8/8. No usar setState para devolver resultados (bug del canje).
- No borrar ni rebajar permisos sin verificar `keepsAnAdmin`: siempre debe quedar quien administre usuarios.
- No usar `attendance.find()` pensando en "hoy": usar `latestAttendanceByEmployee`.
- No crear promociones solo "visuales": cada beneficio debe mover `quoteSale` o el canje.

## Próximos pasos
- Kevin prueba en local y decide si se sube (rama/PR al repo de Víctor).
- Piloto real: Supabase, login con roles reales, rutas por módulo, validación de sellos y PIN en servidor.
