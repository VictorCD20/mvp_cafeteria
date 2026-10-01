# MEMORY · MVP Cafetería

## Estado actual (2026-10-01)
- Demo funcional en memoria (sin base de datos). Rama local `ajustes-demo`, sin subir.

## Decisiones (y por qué)
- Promociones reales en el POS (`quoteSale`): para que el 2x1/doble sello no sea solo visual.
- Interruptor "Simular viernes" en POS: la demo puede ser cualquier día.
- Se quitó "pagar con Wallet": prometía pagos que no existen.
- Vista del cliente nueva: muestra registro por QR, tarjeta, canje y notificación (lo que más vende).
- Cortes de caja semilla (27-29 sep): balance positivo y realista sin inflar "ventas del día".
- El cliente nuevo recibe 1 sello de bienvenida (comportamiento original de Víctor).

## Errores a evitar
- No calcular "hoy" en UTC. No dejar clientes semilla en 8/8. No usar setState para devolver resultados (bug del canje).

## Próximos pasos
- Kevin prueba en local y decide si se sube (rama/PR al repo de Víctor).
- Piloto real: Supabase, login con roles, rutas por módulo, validación de sellos en servidor.
