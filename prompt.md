Actúa como un equipo senior de producto, UX, arquitectura y desarrollo full-stack siguiendo un enfoque BMAD (primero definir, estructurar y validar experiencia; después construir). Quiero que desarrolles un prototipo funcional navegable en Next.js para validar el flujo completo de un sistema integral de gestión para una cafetería, basado en el PRD funcional de CODIA.

## 1. CONTEXTO GENERAL DEL PROYECTO

Marca: CODIA  
Producto: Sistema integral de gestión para cafetería  
Objetivo: construir un prototipo funcional, usable y coherente que permita probar el flujo completo del sistema antes del desarrollo final.

Este sistema está pensado para una cafetería de una sola sucursal. La meta NO es crear todavía un ERP completo ni conectar todas las APIs reales en esta etapa. La meta es construir una demo funcional de alta fidelidad que permita validar la idea, la navegación, los módulos, los datos y el flujo operativo principal.

## 2. STACK Y ENFOQUE TÉCNICO

Desarrolla el sistema usando:

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- componentes reutilizables (puedes usar una estructura tipo shadcn/ui si lo consideras conveniente)
- estado y persistencia simple orientada a demo funcional
- idealmente usa almacenamiento mock/local o una base simple de demo (por ejemplo JSON, SQLite o datos seed), priorizando rapidez, claridad y funcionalidad del flujo completo
- NO enfoques este entregable en autenticación compleja ni infraestructura enterprise
- el sistema debe ser fácil de correr localmente

Si tienes que elegir entre complejidad técnica y validación del flujo, prioriza validación del flujo.

## 3. ALCANCE DEL PROTOTIPO

Quiero un sistema demo navegable y funcional con solo un perfil:

### Perfil activo:

- Administrador

No desarrollar roles múltiples reales en esta fase.  
Sí deja la arquitectura preparada para futuros roles, pero funcionalmente solo debe existir el administrador.

El administrador podrá navegar y probar todos los módulos relevantes del sistema.

## 4. OBJETIVO DEL PROTOTIPO

Construir un flujo completo para validar la experiencia del sistema con estas áreas:

1. Home / Dashboard
2. Empleados
3. Asistencia / Checador
4. Pre-nómina
5. Ventas / POS básico
6. Inventario
7. Recetas
8. Finanzas
9. OCR / Registro de egresos
10. Cliente Consentido / Wallet simulado
11. Promociones
12. Bot / Asistente administrativo (simulado)
13. Reportes
14. Configuración básica

## 5. ENFOQUE UX/UI

Toma como referencia el PRD de CODIA ya definido para esta cafetería.

Quiero una interfaz:

- moderna
- limpia
- versátil
- usable
- pensada para dashboard SaaS
- responsive
- clara para una dueña o administradora de cafetería

Estética:

- identidad visual alineada con CODIA
- tonos principales azul oscuro / azul eléctrico
- fondos claros y limpios
- tarjetas, tablas, métricas y módulos organizados
- el sistema debe verse profesional, no como plantilla genérica vacía

Jerarquía visual:

- dashboard primero
- luego operación
- luego administración
- luego cliente consentido

## 6. ESTRUCTURA GENERAL DE NAVEGACIÓN

Crea una app con sidebar administrativo y vistas claras.

Navegación principal:

- Inicio
- Ventas
- Inventario
- Empleados
- Finanzas
- Cliente Consentido
- Asistente
- Reportes
- Configuración

Submódulos o tabs internos:

### Empleados

- Personal
- Asistencia
- Horarios
- Pre-nómina

### Inventario

- Insumos
- Productos
- Recetas
- Movimientos

### Finanzas

- Resumen
- Gastos
- OCR / Comprobantes
- Facturación (simulada)

### Cliente Consentido

- Clientes
- Wallet
- Promociones
- Recompensas

## 7. PANTALLAS CLAVE A CONSTRUIR

Necesito al menos estas pantallas funcionales:

### 1. Login

- solo acceso administrador
- simple
- puede ser demo hardcodeado
- ejemplo: admin@codia.com / password demo
- no necesito auth compleja; lo importante es entrar al sistema

### 2. Home Dashboard

Debe mostrar:

- ventas del día
- gastos del día
- personal presente
- retardos
- faltas
- productos con stock bajo
- recompensas por canjear
- comprobantes pendientes
- actividad reciente

Debe incluir:

- KPIs visuales
- tarjetas de resumen
- gráficas simples si es viable
- lista de alertas o “requiere atención”

### 3. Empleados

- tabla/lista de empleados
- crear empleado
- editar empleado
- ver detalle del empleado
- campos como:
  - nombre
  - puesto
  - pago diario
  - horario
  - días laborales
  - estado
  - id interno

### 4. Asistencia / Checador

- vista de asistencia del día
- mostrar estado por empleado:
  - puntual
  - retardo
  - ausente
- historial simple
- resumen de horas trabajadas
- componente visual del checador Hikvision, pero simulado
- NO hace falta integración real todavía
- simular que el dispositivo está conectado
- simular registros de entrada / salida

### 5. Pre-nómina

- cálculo visible y entendible
- por empleado
- por periodo
- fórmula transparente basada en:
  - días trabajados
  - pago diario
  - horas extra
  - bonos
  - descuentos
  - faltas
- mostrar desglose claro
- permitir justificar una falta
- permitir marcar si una falta fue justificada o no

### 6. Ventas / POS básico

- catálogo simple de productos de cafetería
- carrito
- agregar productos
- cambiar cantidades
- calcular total
- elegir forma de pago
- registrar venta
- guardar historial demo
- idealmente al registrar una venta se descuente inventario usando recetas

### 7. Inventario

- listado de insumos
- stock actual
- stock mínimo
- alertas de bajo stock
- movimientos de inventario
- entradas/salidas

### 8. Recetas

- poder crear recetas
- asociar receta a producto del menú
- ejemplo:
  - Latte: café 18 g, leche 300 ml, vaso 1, tapa 1
- mostrar costo aproximado si es viable
- estas recetas deben servir para vincularse con el POS y el inventario

### 9. Finanzas

- resumen de ingresos
- resumen de egresos
- gastos
- compras
- balance estimado
- pre-nómina estimada
- vista clara tipo dashboard administrativo

### 10. OCR / Registro de egresos

- flujo funcional simulando OCR
- permitir subir imagen o seleccionar un comprobante mock
- mostrar extracción de datos como:
  - proveedor
  - fecha
  - folio/ticket
  - total
  - IVA
  - categoría
- permitir editar/corregir datos antes de guardar
- guardar el egreso en el módulo de finanzas
- idealmente usar datos mock de tickets reales simulados

### 11. Facturación

- módulo visible y funcional a nivel demo
- NO hace falta timbrado real
- sí mostrar flujo de:
  - solicitud de factura
  - datos fiscales
  - estado
  - emisión simulada de CFDI
- mostrar que esta parte sería por integración posterior con PAC

### 12. Cliente Consentido / Wallet simulado

- crear clientes
- ver lista de clientes
- mostrar tarjeta tipo wallet simulada
- mostrar:
  - nombre
  - progreso de sellos o visitas
  - QR
  - promociones
  - recompensa
- NO conectar Google Wallet real
- simular una wallet web/PWA dentro del sistema
- debe verse atractiva visualmente

### 13. Promociones

- crear promoción
- definir:
  - nombre
  - descripción
  - vigencia
  - audiencia (ejemplo: todos, frecuentes, próximos a recompensa)
- mostrar promociones visibles en la parte de Cliente Consentido
- mostrar flujo de publicación

### 14. Bot / Asistente

- crear una interfaz de asistente tipo chat o panel
- puede ser simulada
- debe responder con datos del sistema
- ejemplo de prompts rápidos:
  - ventas de hoy
  - quién faltó
  - stock bajo
  - total de gastos
  - clientes con recompensa disponible

### 15. Reportes

- vista simple de reportes
- diarios / semanales / mensuales
- mostrar tarjetas, tablas o widgets para:
  - ventas
  - gastos
  - empleados
  - inventario
  - cliente consentido

### 16. Configuración

- datos básicos del negocio
- nombre de la cafetería
- logo o branding demo
- horario
- tolerancia para retardos
- objetivo de fidelización
- parámetros básicos

## 8. DATOS DEMO / SEED DATA

Genera datos de ejemplo realistas para una cafetería.

### Empleados demo

Crear al menos 6 empleados, por ejemplo:

- Laura Méndez – Administradora
- Ana Torres – Barista
- Luis García – Cajero
- Sofía Martínez – Barista
- Carlos Ramírez – Encargado
- María López – Cocina

### Productos de menú demo

Crear al menos 10 productos:

- Americano
- Espresso
- Latte
- Capuchino
- Mocha
- Frappé moka
- Frappé vainilla
- Té chai
- Croissant
- Panini

### Insumos demo

- Café molido
- Leche entera
- Leche deslactosada
- Azúcar
- Vasos medianos
- Vasos grandes
- Tapas
- Chocolate
- Jarabe vainilla
- Té chai mix
- Pan
- Queso
- Jamón

### Recetas demo

Asocia varias recetas a productos.  
Ejemplo:

- Latte = café + leche + vaso + tapa
- Capuchino = café + leche + vaso + tapa
- Panini = pan + queso + jamón

### Clientes demo

Crear al menos 8 clientes de Cliente Consentido con diferentes estados:

- nuevos
- frecuentes
- próximos a recompensa
- con recompensa disponible

### Promociones demo

Crear al menos 3 promociones:

- Doble sello viernes
- 15% en bebidas frías
- Recompensa de café gratis al completar 8 sellos

### Egresos demo

Crear varios registros:

- compra de insumos
- mantenimiento
- servicios
- otros

## 9. FUNCIONALIDAD CLAVE QUE QUIERO VALIDAR

### Flujo 1 – Empleado y asistencia

- ver empleados
- registrar entrada/salida simulada
- ver horas trabajadas
- calcular pre-nómina
- justificar faltas

### Flujo 2 – Venta y receta

- crear venta
- sumar al carrito
- confirmar venta
- descontar inventario según receta
- registrar movimiento

### Flujo 3 – OCR / egreso

- subir ticket mock
- ver datos extraídos
- corregir datos
- guardar egreso
- reflejarlo en finanzas

### Flujo 4 – Cliente Consentido

- crear cliente
- generar tarjeta wallet simulada
- ver QR
- sumar sellos o visitas
- desbloquear recompensa
- mostrar promociones

### Flujo 5 – Dashboard y reportes

- ver cómo todas las acciones impactan el dashboard
- ver actividad reciente
- ver métricas actualizadas

## 10. REGLAS DEL PROTOTIPO

- Prioriza funcionalidad y flujo realista
- No sobrecomplicar integraciones reales
- Si una integración es compleja, simúlala de forma coherente
- Todo debe estar alineado al PRD funcional ya definido para CODIA
- El sistema debe sentirse consistente y usable
- Usa una estructura limpia, escalable y modular
- Mantén el código organizado para futura evolución

## 11. VALIDACIÓN Y VERIFICACIÓN FUNCIONAL

Además de construir la app, quiero que hagas una verificación completa del sistema.

Necesito que verifiques funcionalmente:

### Navegación

- que todas las rutas principales funcionen
- que el sidebar navegue correctamente
- que el flujo sea consistente

### CRUDs

- que se puedan crear empleados
- que se puedan crear clientes
- que se puedan crear recetas
- que se puedan registrar ventas
- que se puedan registrar egresos
- que se puedan crear promociones

### Lógica del sistema

- que la pre-nómina se calcule
- que la asistencia impacte la pre-nómina
- que las ventas descuenten inventario
- que el OCR genere un egreso
- que los sellos o visitas del cliente se actualicen
- que el dashboard refleje cambios

### Estados y UX

- que existan estados vacíos
- mensajes de éxito/error
- feedback visual
- datos demo suficientes
- consistencia visual

### Responsive

- que al menos las pantallas principales puedan visualizarse bien en:
  - desktop
  - tablet
  - móvil

## 12. ENTREGABLES ESPERADOS

Quiero que entregues:

1. La aplicación funcional en Next.js
2. Estructura de carpetas clara
3. Datos demo listos para probar
4. Flujo navegable completo
5. Verificación funcional del sistema
6. Un resumen final explicando:
   - qué se implementó
   - qué se simuló
   - qué queda listo para siguiente fase
   - qué módulos ya se pueden probar de punta a punta

## 13. NOTAS IMPORTANTES

- Esto es una demo/prototipo funcional
- No quiero que el foco se vaya a autenticación avanzada ni infraestructura compleja
- Quiero que sí se vea como producto real
- Mantén fidelidad al PRD funcional de CODIA para cafetería
- Piensa como producto, no solo como código
- La prioridad es que podamos probar el flujo completo

## 14. RESULTADO FINAL DESEADO

Necesito una demo funcional donde podamos entrar como administrador y probar:

- dashboard
- empleados
- asistencia
- pre-nómina
- ventas
- inventario
- recetas
- finanzas
- OCR/egresos
- cliente consentido
- promociones
- reportes
- bot

Todo dentro de una misma experiencia coherente, visualmente sólida y lista para validación interna y demostración con cliente.
