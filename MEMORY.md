# MEMORY · MVP Cafetería

## Estado actual (2026-10-01)
- Demo funcional en memoria (sin base de datos). Corrección de navegación, sincronización de subsecciones en URL, drawer móvil accesible y vista del cliente pública separada en `/cliente`.

## Decisiones (y por qué)
- Navegación URL bidireccional (`?tab=...&sub=...`): al recargar la página (F5) o usar los botones Atrás/Adelante del navegador, la ubicación y subsección exactas se conservan. URLs inválidas redirigen limpiamente a `inicio`.
- Sincronización de subsecciones en vistas: `EmployeesView`, `FinancesView`, `LoyaltyView` e `InventoryView` ahora escuchan y actualizan `subTab` desde `useCodia()`, permitiendo que todos los enlaces rápidos ("Ver checador" → `asistencia`, "Wallet y tarjetas" → `wallet`, "Promociones" → `promociones`, "Registrar egreso" → `gastos`, "Escanear comprobante" → `ocr`, "Ver inventario" → `insumos`) abran exactamente la subpestaña anunciada.
- Menú móvil (Drawer): en pantallas móviles (<768px), la barra lateral se oculta y se habilita un drawer colapsable desde el botón de hamburguesa en la barra superior. Es navegable por teclado, se cierra con `Escape` o al seleccionar un módulo y comunica `aria-current`.
- Vista del cliente independiente (`/cliente`): ruta pública separada de la administración sin controles de caja ni selector de clientes del negocio, usando datos de prueba simulados e indicador de demo.
- Promociones reales en el POS (`quoteSale`): para que el 2x1/doble sello no sea solo visual.
- Interruptor "Simular viernes" en POS: la demo puede ser cualquier día.
- Se quitó "pagar con Wallet": prometía pagos que no existen.
- Vista del cliente nueva: muestra registro por QR, tarjeta, canje y notificación (lo que más vende).
- Cortes de caja semilla (27-29 sep): balance positivo y realista sin inflar "ventas del día".
- El cliente nuevo recibe 1 sello de bienvenida (comportamiento original de Víctor).
- Rediseño (Kevin: "organizar, no eliminar"): menú agrupado por área, barra superior en una línea con integraciones simuladas dentro de "Modo demo", encabezado uniforme por módulo (`ui/PageHeader.tsx`), más espacio entre secciones y ancho máximo de contenido.
- Inicio: "Requiere tu atención" concentra stock bajo, retardos/faltas y recompensas; asistencia muestra primero pendientes y el resto con "Ver también".
- Cada módulo abre arriba; el chat del bot hace scroll solo dentro de su caja.
- Asistente flotante (mini chat) abajo a la derecha, comparte conversación con la sección; en POS se mueve a la izquierda para no tapar "Confirmar venta". Avisos (toasts) movidos arriba a la derecha.
- POS: el cobro (total + confirmar) queda fijo abajo del ticket; solo la lista de productos hace scroll.

- Paleta y Temas Configurables (Etapa 6): configurable por JSON en `src/config/codia-beta.json` con temas predeterminados (`cafe`, `neutro`, `oscuro`, `alto_contraste`), variables CSS globales dinámicas (`--app-*`), modo claro/oscuro/auto, densidad visual (cómoda vs compacta), nombre comercial e ícono de logo personalizables, vista previa en tiempo real en Configuración > Apariencia & Temas, y protección de permisos RBAC (solo administradores y superadmin pueden modificar o restaurar la apariencia).

## Ideas pendientes (NO implementar hasta que Kevin decida)
- Roles: Administrador (dueña, ve todo desde celular/compu: finanzas, OCR, promociones, checador/horarios, reportes) y Caja/empleados (computadora del local: ventas, corte, registrar clientes y sellos; sin bot ni finanzas). Real con Supabase RLS. Por definir: PIN por empleado vs cuenta compartida, flujo mesero→cajero, corte de caja.
- Fusionar la pestaña "Wallet simulada" con "Vista del cliente" (aprobado por Kevin, pendiente de hacer).

## Errores a evitar
- No calcular "hoy" en UTC. No dejar clientes semilla en 8/8. No usar setState para devolver resultados (bug del canje).

## Próximos pasos
- Kevin prueba en local y decide si se sube (rama/PR al repo de Víctor).
- Piloto real: Supabase, login con roles, rutas por módulo, validación de sellos en servidor.
