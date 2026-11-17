// Estructura completa de navegación lateral de Sislii (NYCE STORE)
window.SISLII_MENU = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'line-chart',
    path: '/dashboard'
  },
  {
    id: 'administracion',
    label: 'Administración',
    icon: 'settings',
    children: [
      { label: 'Marcas', path: '/brands/items' },
      { label: 'Categorías', path: '/categories' },
      { label: 'Lista de precios', path: '/price-list' },
      { label: 'Reglas de precios', path: '/price-rules' },
      { label: 'Unidades de medida', path: '/unit_types' },
      {
        id: 'tallas_colores',
        label: 'Tallas / Colores',
        children: [
          { label: 'Tallas', path: '/sizes' },
          { label: 'Colores', path: '/colors' }
        ]
      },
      {
        id: 'promociones',
        label: 'Promociones',
        children: [
          { label: 'Grupo clientes', path: '/group-customers' },
          { label: 'Bonificaciones', path: '/bonus' },
          { label: 'Descuentos', path: '/discounts' },
          { label: 'Cupones de descuento', path: '/discount-coupons' },
          { label: 'Ofertas', path: '/offers' }
        ]
      },
      {
        id: 'envios',
        label: 'Envíos',
        children: [
          { label: 'Rutas', path: '/routes' },
          { label: 'Vehículos', path: '/vehicles' },
          { label: 'Conductores', path: '/drivers' },
          { label: 'Ag. Transporte', path: '/dispatchers' }
        ]
      }
    ]
  },
  {
    id: 'inventario',
    label: 'Inventario',
    icon: 'warehouse',
    children: [
      { label: 'Productos', path: '/items' },
      { label: 'Almacenes', path: '/warehouses' },
      { label: 'Kardex', path: '/reports-kardex' },
      { label: 'Kardex general', path: '/general-kardex' },
      { label: 'Traslados', path: '/transfers' },
      { label: 'Inventario', path: '/reports-inventory' },
      { label: 'Inventario C/T', path: '/reports-color-size-inventory' },
      { label: 'Actualizar stock/precios', path: '/stock' },
      { label: 'Inv. Valorizado', path: '/valued-inventory' },
      { label: 'Costo acumulado', path: '/cost-accumulated' },
      { label: 'Alerta de stock', path: '/reports-stock-alert' },
      { label: 'Ajuste de inventario', path: '/inventory-adjustments' },
      { label: 'Cuadre de stock', path: '/stock-counts' },
      { label: 'Etiquetas', path: '/labels', badge: 'Nuevo' }
    ]
  },
  {
    id: 'compras',
    label: 'Compras',
    icon: 'shopping-cart',
    children: [
      { label: 'Nueva compra', path: '/purchases/create' },
      { label: 'Listado', path: '/purchases' },
      { label: 'Proveedores', path: '/persons/suppliers' },
      { label: 'Orden de compra', path: '/purchase-orders' },
      { label: 'Cuentas por pagar', path: '/debts/payable' },
      { label: 'Calendario de pagos', path: '/debts/payable/calendar' }
    ]
  },
  {
    id: 'ventas',
    label: 'Ventas',
    icon: 'receipt',
    children: [
      { label: 'Nuevo comprobante', path: '/documents/create' },
      { label: 'Punto de venta (POS)', path: '/pos' },
      { label: 'Comprobantes', path: '/documents' },
      { label: 'Resúmenes', path: '/summaries' },
      { label: 'Anulaciones', path: '/voided' },
      { label: 'Cotizaciones', path: '/quotations' },
      { label: 'Notas de venta', path: '/sale-notes' },
      { label: 'Gestión de clientes', path: '/persons/customers' },
      { label: 'Cuentas por cobrar', path: '/debts/receivable' },
      { label: 'Calendario de pagos', path: '/debts/receivable/calendar' },
      {
        id: 'guias_remision',
        label: 'Guías de remisión',
        children: [
          { label: 'Crear', path: '/dispatches/create' },
          { label: 'Listado', path: '/dispatches' }
        ]
      }
    ]
  },
  {
    id: 'entregas',
    label: 'Entregas',
    icon: 'truck',
    children: [
      { label: 'Panel de entregas', path: '/deliveries' },
      { label: 'Entregas pendientes', path: '/deliveries/workspace/pending' },
      { label: 'Agenda de entregas', path: '/deliveries/workspace/schedules' },
      { label: 'Preparación', path: '/deliveries/workspace/preparation' },
      { label: 'Historial', path: '/deliveries/workspace/history' },
      { label: 'Ventas por cliente', path: '/deliveries/workspace/customers' },
      { label: 'Mercadería en custodia', path: '/deliveries/workspace/custody' },
      { label: 'Facturación masiva', path: '/deliveries/bulk-invoicing' }
    ]
  },
  {
    id: 'caja_bancos',
    label: 'Caja & Bancos',
    icon: 'banknote',
    children: [
      { label: 'Ventas por cobrar', path: '/sales-receivable' },
      { label: 'Caja diaria & Mov.', path: '/openings' },
      { label: 'Gestión de caja', path: '/cash' },
      { label: 'Historial de caja', path: '/openings-history' },
      { label: 'Listado de bancos', path: '/banks' },
      { label: 'Cuentas bancarias', path: '/bank-accounts' },
      { label: 'Tipo de cambio', path: '/exchange-rates' },
      { label: 'Conceptos', path: '/concepts' }
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: 'bar-chart-3',
    children: [
      {
        id: 'rep_compras',
        label: 'Compras',
        children: [
          { label: 'Reporte de Compras', path: '/reports/purchases' },
          { label: 'Historial de Precios', path: '/reports/purchase-price-histories' },
          { label: 'Estado Cta. Proveedor', path: '/reports/supplier-statement' },
          { label: 'Balance compras/ventas', path: '/reports/balance-purchase-sale' }
        ]
      },
      {
        id: 'rep_ventas',
        label: 'Ventas',
        children: [
          { label: 'Análisis de KPIs', path: '/reports/sales-kpis' },
          { label: 'Top clientes', path: '/reports/top-customers' },
          { label: 'Ventas en general', path: '/reports/sales-by-seller' },
          { label: 'Ventas x vendedor', path: '/seller-dashboard' },
          { label: 'Ventas detalladas', path: '/reports/sales-details' },
          { label: 'Cupones de dscto.', path: '/reports/discount-coupons' },
          { label: 'Comisión de vendedor', path: '/reports/commissions' },
          { label: 'Cuentas por cobrar', path: '/reports/debts-receivable' },
          { label: 'Consulta de pedidos', path: '/reports/orders' },
          { label: 'Estado de Cta. Cliente', path: '/reports/client-statement' },
          { label: 'Const. Comprobantes', path: '/reports/consistency-documents' },
          { label: 'Ventas por Producto', path: '/reports/sales-by-item' },
          { label: 'Rotación de Productos', path: '/reports/product-turnover' },
          { label: 'Margen de Utilidad', path: '/reports/utility-margins' },
          { label: 'Costos por Venta', path: '/reports/sales-costs' },
          { label: 'Ingresos / Egresos', path: '/reports/cash' },
          { label: 'Comprobantes', path: '/reports/documents' },
          { label: 'Cotizaciones', path: '/reports/quotations-report' },
          { label: 'Pagos', path: '/reports/payments' }
        ]
      },
      {
        id: 'rep_inventario',
        label: 'Inventario',
        children: [
          { label: 'Ajuste de inventario', path: '/reports/inventory-adjustment' },
          { label: 'Traslados', path: '/reports/transfers' }
        ]
      },
      {
        id: 'rep_contabilidad',
        label: 'Contabilidad',
        children: [
          { label: 'Costos y gastos · Punto de equilibrio', path: '/reports/break-even' },
          { label: 'Registro de Ventas (14.1)', path: '/reports/sales-record' },
          { label: 'SIRE', path: '/sire/sale' }
        ]
      }
    ]
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: 'cog',
    children: [
      {
        id: 'conf_usuarios',
        label: 'Gestión de Usuarios',
        children: [
          { label: 'Permisos', path: '/abilities' },
          { label: 'Roles', path: '/roles' },
          { label: 'Usuarios', path: '/users' }
        ]
      },
      { label: 'Establecimientos', path: '/establishments' },
      { label: 'Configuraciones', path: '/configurations' },
      { label: 'Seguridad estricta', path: '/security-settings' },
      { label: 'Empresas', path: '/companies' },
      { label: 'Correlativos', path: '/correlatives' }
    ]
  }
];

window.renderNyceLogo = function(onclickAttr = "window.navigateTo('/dashboard')") {
  return `
    <div class="nyce-logo-badge" onclick="${onclickAttr}" title="Ir al Dashboard">
      <div class="nyce-word">N<span style="position:relative;display:inline-block;">Y<svg viewBox="0 0 24 10" style="position:absolute;top:-4px;left:-2px;width:18px;height:8px;stroke:#46635f;fill:none;stroke-width:2;"><path d="M3 8 Q12 1 21 8 M6 5 L4 1 M10 3 L9 0 M14 3 L15 0 M18 5 L20 1"/></svg></span>CE</div>
      <div class="nyce-store-sub">STORE</div>
    </div>
  `;
};

window.renderBreadcrumb = function(parentLabel, currentLabel, actionsHtml = '', parentPath = '/dashboard') {
  return `
    <div class="page-breadcrumb-row">
      <div class="breadcrumb-left">
        <span class="breadcrumb-gauge" onclick="window.navigateTo('/dashboard')" title="Dashboard">
          <i data-lucide="gauge"></i>
        </span>
        ${currentLabel ? `
          <span class="breadcrumb-parent" onclick="window.navigateTo('${parentPath}')">${parentLabel}</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">${currentLabel}</span>
        ` : `
          <span class="breadcrumb-current" style="color:var(--text-main);font-weight:500;">${parentLabel}</span>
        `}
      </div>
      <div class="page-actions">${actionsHtml}</div>
    </div>
  `;
};

window.showToast = function(msg, type = 'success') {
  let root = document.getElementById('toast-root');
  if (!root) return;
  root.className = 'toast-container';
  const el = document.createElement('div');
  el.className = 'sis-toast';
  if (type === 'error') el.style.borderLeftColor = '#ef4444';
  if (type === 'warning') el.style.borderLeftColor = '#f59e0b';
  el.innerHTML = msg;
  root.appendChild(el);
  setTimeout(() => { el.remove(); }, 3400);
};

window.openModal = function(title, bodyHtml, footerHtml = '', maxWidth = '820px') {
  const root = document.getElementById('modal-root');
  root.innerHTML = `
    <div class="modal-backdrop" onclick="if(event.target===this) window.closeModal()">
      <div class="modal-dialog" style="max-width:${maxWidth}">
        <div class="modal-header">
          <span>${title}</span>
          <button class="icon-util-btn" onclick="window.closeModal()"><i data-lucide="x"></i></button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
};

window.closeModal = function() {
  const root = document.getElementById('modal-root');
  if (root) root.innerHTML = '';
};

window.exportCSV = function(filename, headers, rows) {
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  window.showToast(`Archivo exportado: ${a.download}`);
};

window.showTicketModal = function(doc) {
  const items = doc.items || [];
  const subtotal = (Number(doc.total || 0) / 1.18).toFixed(2);
  const igv = (Number(doc.total || 0) - Number(subtotal)).toFixed(2);
  window.openModal(
    `Impresión de Comprobante · ${doc.series_number}`,
    `
      <div id="printable-ticket" style="background:#ffffff;color:#111827;padding:22px;border-radius:8px;max-width:360px;margin:0 auto;font-family:monospace;font-size:12px;line-height:1.45;">
        <div style="text-align:center;border-bottom:1px dashed #9ca3af;padding-bottom:10px;margin-bottom:10px;">
          <div style="font-size:16px;font-weight:700;">NYCE STORE S.A.C.</div>
          <div>RUC: 20608945123</div>
          <div>Av. Principal 450, Lima - Perú</div>
          <div>Telf: 987654321</div>
          <div style="margin-top:6px;font-weight:700;font-size:13px;">${doc.doc_type || 'NOTA DE VENTA ELECTRÓNICA'}</div>
          <div style="font-weight:700;font-size:14px;">${doc.series_number}</div>
        </div>
        <div style="border-bottom:1px dashed #9ca3af;padding-bottom:8px;margin-bottom:8px;">
          <div><b>Fecha:</b> ${doc.issue_date}</div>
          <div><b>Cliente:</b> ${doc.customer_name || '10 - CLIENTES VARIOS'}</div>
          <div><b>Condición:</b> ${doc.payment_condition || 'Contado'}</div>
          <div><b>Vendedor:</b> ${doc.user || 'Principal'}</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px;font-size:11.5px;">
          <thead>
            <tr style="border-bottom:1px solid #111827;">
              <th style="text-align:left;padding:3px 0;">CANT</th>
              <th style="text-align:left;padding:3px 4px;">DESCRIPCIÓN</th>
              <th style="text-align:right;padding:3px 0;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${items.length ? items.map(it => `
              <tr>
                <td style="padding:3px 0;">${it.qty}</td>
                <td style="padding:3px 4px;">${it.description}</td>
                <td style="text-align:right;padding:3px 0;">S/ ${Number(it.total || (it.qty * it.price)).toFixed(2)}</td>
              </tr>
            `).join('') : `
              <tr>
                <td>1</td>
                <td>CONSUMO / VENTA DE MERCADERÍA</td>
                <td style="text-align:right;">S/ ${Number(doc.total || 0).toFixed(2)}</td>
              </tr>
            `}
          </tbody>
        </table>
        <div style="border-top:1px dashed #9ca3af;padding-top:8px;text-align:right;">
          <div>OP. GRAVADA: S/ ${subtotal}</div>
          <div>I.G.V. (18%): S/ ${igv}</div>
          <div style="font-size:14px;font-weight:700;margin-top:4px;">IMPORTE TOTAL: S/ ${Number(doc.total || 0).toFixed(2)}</div>
        </div>
        <div style="text-align:center;margin-top:14px;font-size:11px;color:#4b5563;">
          Representación impresa del comprobante electrónico.<br/>
          ¡Gracias por su preferencia en NYCE STORE!
        </div>
      </div>
    `,
    `
      <button class="btn btn-secondary" onclick="window.closeModal()">Cerrar</button>
      <button class="btn btn-primary" onclick="window.print()"><i data-lucide="printer"></i> Imprimir Ticket 80mm / PDF</button>
    `,
    '480px'
  );
};
