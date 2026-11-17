# ARKAN - Software de Gestión Comercial (ERP / POS / Facturación Electrónica)

Sistema integral de Gestión Comercial, Punto de Venta (POS), Facturación Electrónica SUNAT, Control de Inventario, Compras, Entregas, Caja & Bancos y Reportes Contables.

## Requisitos
- **Node.js** (v16 o superior)

## Inicio Rápido
1. Ejecuta directamente **`INICIAR_SISLII.bat`** (en Windows) o inicia desde terminal:
   ```bash
   node server.js
   ```
2. Abre en tu navegador:
   - **Dashboard**: `http://localhost:3000/dashboard`
   - **Login**: `http://localhost:3000/login`

## Módulos Incluidos
- **Dashboard**: Indicadores en tiempo real, situación financiera y gráficos de tendencia, flujo de caja, ventas por día y hora punta.
- **Administración**: Marcas, Categorías, Lista de precios, Reglas de precios, Unidades de medida, Tallas/Colores, Promociones y Envíos.
- **Inventario**: Catálogo de Productos (modal de 6 pestañas), Almacenes, Kardex, Traslados, Inventario Valorizado, Alerta de Stock, Ajustes, Cuadre de stock y Generador de Etiquetas.
- **Compras**: Nueva compra con ingreso automático de stock, Listado de compras, Proveedores (consulta RUC), Órdenes de compra y Cuentas por pagar.
- **Ventas & POS**: Punto de Venta (POS) con emisión de Tickets 80mm (`F8`/`F9`), Nuevo Comprobante (Factura, Boleta, Nota de Venta), Cotizaciones, Clientes (consulta DNI/RUC) y Guías de Remisión Electrónicas (GRE).
- **Entregas**: Panel operativo, entregas pendientes, agenda, preparación, custodia y facturación masiva.
- **Caja & Bancos**: Apertura/Cierre de caja diaria, movimientos de ingresos/egresos, bancos, cuentas bancarias, tipo de cambio y 29 conceptos operativos.
- **Reportes & Contabilidad**: Análisis de KPIs, Flujo de Efectivo (`Cuadre de Caja`), Registro de Ventas 14.1 y SIRE SUNAT.
- **Configuración**: Permisos, Roles, Usuarios, Establecimientos, 19 interruptores de configuración operativa, Impresoras e Impuestos IGV.
