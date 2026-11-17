// Módulos especializados y generador CRUD/Reportes para las ~90 rutas de Sislii

// NUEVA COMPRA (/purchases/create)
window.renderPurchaseCreateView = function(db) {
  const s = window.PURCHASE_CREATE_STATE;
  const total = s.items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return `
    <div>
      ${window.renderBreadcrumb('Compras', 'Nueva compra', '', '/purchases')}

      <div class="sis-card">
        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Tipo comprobante</label>
            <select class="sis-select" onchange="window.PURCHASE_CREATE_STATE.docType=this.value">
              <option>FACTURA ELECTRÓNICA</option>
              <option>BOLETA DE VENTA</option>
              <option>GUÍA / NOTA DE COMPRA</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Serie *</label>
            <input type="text" class="sis-input" value="${s.series}" oninput="window.PURCHASE_CREATE_STATE.series=this.value" placeholder="F001" />
          </div>
          <div class="field-group">
            <label class="field-label">Número *</label>
            <input type="text" class="sis-input" value="${s.number}" oninput="window.PURCHASE_CREATE_STATE.number=this.value" placeholder="0004512" />
          </div>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">F. Emisión</label>
            <input type="text" class="sis-input" value="${s.issueDate}" oninput="window.PURCHASE_CREATE_STATE.issueDate=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">F. Vencimiento</label>
            <input type="text" class="sis-input" value="${s.dueDate}" oninput="window.PURCHASE_CREATE_STATE.dueDate=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">Proveedor <span class="link-new" onclick="window.openCustomerModal(true)">[+ Nuevo]</span></label>
            <select class="sis-select" onchange="window.PURCHASE_CREATE_STATE.supplier=this.value">
              ${(db.suppliers || []).map(sup => `<option value="${sup.name}" ${s.supplier === sup.name ? 'selected' : ''}>${sup.number} - ${sup.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Condición pago</label>
            <select class="sis-select" onchange="window.PURCHASE_CREATE_STATE.paymentCondition=this.value">
              <option value="Contado">Contado</option>
              <option value="Crédito 15 días">Crédito 15 días</option>
              <option value="Crédito 30 días">Crédito 30 días</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Moneda</label>
            <select class="sis-select" onchange="window.PURCHASE_CREATE_STATE.currency=this.value">
              <option>Soles</option>
              <option>Dólares</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Tipo de cambio</label>
            <input type="text" class="sis-input" value="${s.exchangeRate}" />
          </div>
        </div>

        <div class="field-group" style="margin-bottom:16px;">
          <label class="field-label">Información adicional</label>
          <input type="text" class="sis-input" placeholder="Observaciones de ingreso a almacén..." oninput="window.PURCHASE_CREATE_STATE.notes=this.value" />
        </div>

        <div style="font-weight:700;margin-bottom:10px;">Agregar producto(s)</div>
        <div class="sis-card" style="background:var(--bg-card-alt);display:grid;grid-template-columns:100px 2fr 130px auto auto;gap:12px;align-items:end;margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Cantidad</label>
            <input id="pur-qty" type="number" class="sis-input" value="6" min="1" />
          </div>
          <div class="field-group">
            <label class="field-label">Producto <span class="link-new" onclick="window.openProductModal()">[+ Nuevo]</span></label>
            <select id="pur-prod" class="sis-select" onchange="const p=(window.APP_DB.items||[]).find(x=>x.id===Number(this.value));if(p)document.getElementById('pur-price').value=p.purchase_price;">
              ${(db.items || []).map(p => `<option value="${p.id}">${p.internal_code} - ${p.description}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Precio Unit. (S/)</label>
            <input id="pur-price" type="number" step="0.10" class="sis-input" value="7.50" />
          </div>
          <label style="display:flex;align-items:center;gap:6px;height:38px;font-size:12.5px;">
            <input type="checkbox" checked /> Incluye IGV
          </label>
          <button type="button" class="btn btn-primary" onclick="window.purchaseAddItem()">
            <i data-lucide="plus"></i> Agregar
          </button>
        </div>

        <div class="table-wrap" style="margin-bottom:16px;">
          <table class="sis-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>CANT.</th>
                <th>PRODUCTO</th>
                <th>PRECIO UNIT.</th>
                <th>DSCTO.</th>
                <th>TOTAL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${s.items.length === 0 ? `
                <tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary);">Agrega productos a la compra para ingresar stock al almacén</td></tr>
              ` : s.items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${it.qty}</td>
                  <td style="font-weight:600;">${it.description}</td>
                  <td>S/ ${Number(it.price).toFixed(2)}</td>
                  <td>S/ 0.00</td>
                  <td style="font-weight:700;color:#4ade80;">S/ ${(it.qty * it.price).toFixed(2)}</td>
                  <td>
                    <button class="btn btn-outline-red btn-sm" onclick="window.PURCHASE_CREATE_STATE.items.splice(${idx},1);window.renderCurrentRoute();">Quitar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="font-size:16px;font-weight:700;">Total Compra: <span style="color:#f43f5e;">S/ ${total.toFixed(2)}</span></div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-secondary" onclick="window.navigateTo('/purchases')">Cancelar</button>
            <button class="btn btn-primary" onclick="window.purchaseSubmit()">Guardar compra e ingresar stock</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.purchaseAddItem = function() {
  const prodId = Number(document.getElementById('pur-prod')?.value || 1);
  const qty = Number(document.getElementById('pur-qty')?.value || 1);
  const price = Number(document.getElementById('pur-price')?.value || 7.5);
  const prod = (window.APP_DB.items || []).find(p => p.id === prodId) || (window.APP_DB.items || [])[0];
  if (!prod) return;
  window.PURCHASE_CREATE_STATE.items.push({
    item_id: prod.id,
    description: prod.description,
    qty,
    price
  });
  window.renderCurrentRoute();
};

window.purchaseSubmit = async function() {
  const s = window.PURCHASE_CREATE_STATE;
  if (s.items.length === 0) {
    window.showToast('Agrega al menos un producto a la compra', 'warning');
    return;
  }
  const total = s.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const res = await fetch('/api/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_type: s.docType,
      series: s.series || 'F001',
      number: s.number || String(Math.floor(Math.random() * 89999 + 10000)),
      issue_date: s.issueDate,
      supplier: s.supplier,
      payment_condition: s.paymentCondition,
      currency: s.currency,
      total,
      items: s.items
    })
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.PURCHASE_CREATE_STATE.items = [];
    window.showToast(`Compra ${data.record.series_number} registrada y stock actualizado`);
    window.navigateTo('/purchases');
  }
};

// NUEVA GUÍA DE REMISIÓN ELECTRÓNICA (/dispatches/create)
window.renderDispatchCreateView = function(db) {
  const s = window.GRE_CREATE_STATE;
  return `
    <div>
      ${window.renderBreadcrumb('Guías de remisión', 'Nueva GRE', '', '/dispatches')}

      <div class="sis-card">
        <div class="form-grid grid-4" style="margin-bottom:14px;">
          <div class="field-group" style="grid-column: span 2;">
            <label class="field-label">Tipo de comprobante</label>
            <select class="sis-select"><option>GUIA DE REMISIÓN ELECTRÓNICA REMITENTE</option><option>GUIA DE REMISIÓN TRANSPORTISTA</option></select>
          </div>
          <div class="field-group">
            <label class="field-label">Serie</label>
            <select class="sis-select"><option>T001</option><option>V001</option></select>
          </div>
          <div class="field-group">
            <label class="field-label">Documento de ref.</label>
            <button type="button" class="btn btn-secondary" onclick="window.showToast('Comprobante F001-000089 vinculado')">Buscar comprobante</button>
          </div>
        </div>

        <div class="form-grid grid-4" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Fecha de emisión</label>
            <input type="text" class="sis-input" value="${s.issueDate}" />
          </div>
          <div class="field-group">
            <label class="field-label">Fecha de traslado</label>
            <input type="text" class="sis-input" value="${s.transferDate}" />
          </div>
          <div class="field-group">
            <label class="field-label">Motivo de traslado</label>
            <select class="sis-select" onchange="window.GRE_CREATE_STATE.reason=this.value">
              <option>Venta</option>
              <option>Traslado entre establecimientos de la misma empresa</option>
              <option>Compra</option>
              <option>Importación</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Modalidad de transporte</label>
            <select class="sis-select" onchange="window.GRE_CREATE_STATE.transportMode=this.value">
              <option>Transporte privado</option>
              <option>Transporte público</option>
            </select>
          </div>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Unidad de medida peso</label>
            <select class="sis-select"><option>kilogramos</option><option>toneladas</option></select>
          </div>
          <div class="field-group">
            <label class="field-label">Peso total</label>
            <input type="number" step="0.5" class="sis-input" value="${s.totalWeight}" />
          </div>
          <div class="field-group">
            <label class="field-label">Número de paquetes</label>
            <input type="number" class="sis-input" value="${s.packages}" />
          </div>
        </div>

        <div class="form-grid grid-2" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Cliente destinatario <span class="link-new" onclick="window.openCustomerModal()">[+ Nuevo]</span></label>
            <select class="sis-select" onchange="window.GRE_CREATE_STATE.customer=this.value">
              ${(db.customers || []).map(c => `<option value="${c.name}">${c.number} - ${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Observaciones</label>
            <input type="text" class="sis-input" placeholder="Observaciones del despacho..." />
          </div>
        </div>

        <div class="form-grid grid-2" style="margin-bottom:16px;">
          <div class="field-group">
            <label class="field-label">Dirección / Distrito de partida</label>
            <input type="text" class="sis-input" value="150101 - LIMA / Av. Principal 450 - Lima" />
          </div>
          <div class="field-group">
            <label class="field-label">Dirección / Distrito de llegada</label>
            <input type="text" class="sis-input" value="150117 - LOS OLIVOS / Av. Antúnez de Mayolo 1120" />
          </div>
        </div>

        <!-- Datos del traslado -->
        <div style="border:1px solid rgba(34,197,94,0.35);background:rgba(34,197,94,0.05);border-radius:10px;padding:14px;margin-bottom:16px;">
          <div style="color:#4ade80;font-weight:700;margin-bottom:10px;">Datos del traslado</div>
          <div style="display:flex;flex-wrap:wrap;gap:18px;margin-bottom:12px;font-size:12.5px;">
            <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" /> ¿Transporte con vehículo M1 o L?</label>
            <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" /> ¿Retorna vehículo vacío?</label>
            <label style="display:flex;align-items:center;gap:6px;"><input type="checkbox" /> ¿Retorna vehículo con envase vacío?</label>
          </div>
          <div class="form-grid grid-2">
            <div class="field-group">
              <label class="field-label">Conductor <span class="link-new" onclick="window.navigateTo('/drivers')">[+ Nuevo]</span></label>
              <select class="sis-select" onchange="window.GRE_CREATE_STATE.driver=this.value">
                ${(db.drivers || []).map(d => `<option value="${d.name}">${d.document_number} - ${d.name} (Lic: ${d.license})</option>`).join('')}
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Vehículo <span class="link-new" onclick="window.navigateTo('/vehicles')">[+ Nuevo]</span></label>
              <select class="sis-select" onchange="window.GRE_CREATE_STATE.vehicle=this.value">
                ${(db.vehicles || []).map(v => `<option value="${v.plate}">${v.plate} - ${v.brand} ${v.model}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-secondary" onclick="window.navigateTo('/dispatches')">Cancelar</button>
          <button class="btn btn-primary" onclick="window.greSubmit()">Generar Guía Electrónica</button>
        </div>
      </div>
    </div>
  `;
};

window.greSubmit = async function() {
  const s = window.GRE_CREATE_STATE;
  const res = await fetch('/api/collection/dispatches', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issue_date: s.issueDate,
      transfer_date: s.transferDate,
      recipient: s.customer,
      type: 'GRE Remitente',
      series_number: `T001-0000${(window.APP_DB.dispatches?.length || 45) + 1}`,
      driver: s.driver,
      vehicle: s.vehicle,
      transfer_reason: s.reason,
      route: 'Ruta Lima Metropolitana',
      status: 'Aceptado SUNAT'
    })
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.showToast('Guía de Remisión Electrónica emitida y aceptada por SUNAT');
    window.navigateTo('/dispatches');
  }
};

// PANEL DE ENTREGAS (/deliveries) - Exact match to step_55_shot_1_deliveries.png
window.renderDeliveriesPanelView = function(db) {
  const deliveries = db.deliveries || [];
  return `
    <div>
      <div class="page-breadcrumb-row">
        <div class="breadcrumb-left">
          <span class="breadcrumb-gauge" onclick="window.navigateTo('/dashboard')"><i data-lucide="truck"></i></span>
          <span class="breadcrumb-parent">Entregas</span>
          <span class="breadcrumb-sep">/</span>
          <span class="breadcrumb-current">Panel operativo</span>
        </div>
      </div>

      <div class="form-grid grid-2" style="margin-bottom:16px;">
        <div class="sis-card" style="margin-bottom:0;padding:20px;">
          <div style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">Operaciones abiertas</div>
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;">${deliveries.length}</div>
          <div style="font-size:12px;color:var(--text-secondary);">Requieren seguimiento</div>
        </div>
        <div class="sis-card" style="margin-bottom:0;padding:20px;">
          <div style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">Unidades en custodia</div>
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;">0</div>
          <div style="font-size:12px;color:var(--text-secondary);">Vendidas y no entregadas</div>
        </div>
        <div class="sis-card" style="margin-bottom:0;padding:20px;">
          <div style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">Clientes con saldo</div>
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;">0</div>
          <div style="font-size:12px;color:var(--text-secondary);">Con productos pendientes</div>
        </div>
        <div class="sis-card" style="margin-bottom:0;padding:20px;">
          <div style="color:var(--text-secondary);font-size:14px;margin-bottom:8px;">Programadas</div>
          <div style="font-size:28px;font-weight:700;margin-bottom:8px;">0</div>
          <div style="font-size:12px;color:var(--text-secondary);">Con fecha de atención</div>
        </div>
      </div>

      <div class="sis-card" style="padding:0;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:14.5px;">Atención prioritaria</div>
            <div style="font-size:12px;color:var(--text-secondary);">Más antiguas, vencidas o urgentes.</div>
          </div>
          <span style="color:#f43f5e;font-weight:600;cursor:pointer;" onclick="window.navigateTo('/deliveries/workspace/pending')">Ver todas</span>
        </div>
        <div style="padding:48px 20px;text-align:center;color:var(--text-secondary);">
          ${deliveries.length === 0 ? 'No hay operaciones pendientes.' : `${deliveries.length} operación(es) en curso.`}
        </div>
      </div>

      <div class="sis-card" style="padding:0;overflow:hidden;margin-bottom:0;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-weight:700;font-size:14.5px;">Agenda de hoy</div>
            <div style="font-size:12px;color:var(--text-secondary);">Retiros y despachos comprometidos.</div>
          </div>
          <span style="color:#f43f5e;font-weight:600;cursor:pointer;" onclick="window.navigateTo('/deliveries/workspace/schedules')">Abrir agenda</span>
        </div>
        <div style="padding:48px 20px;text-align:center;color:var(--text-secondary);">
          No hay entregas programadas para hoy.
        </div>
      </div>
    </div>
  `;
};

// FACTURACIÓN MASIVA (/deliveries/bulk-invoicing)
window.renderBulkInvoicingView = function(db) {
  return `
    <div>
      ${window.renderBreadcrumb('Entregas', 'Facturación masiva', '', '/deliveries')}
      <div class="sis-card">
        <div style="font-size:16px;font-weight:700;margin-bottom:6px;">Facturación de notas de venta</div>
        <div style="color:var(--text-secondary);font-size:13px;margin-bottom:18px;">
          Selecciona de 2 a 50 notas del mismo cliente y moneda. El comprobante no volverá a descontar stock.
        </div>
        <div class="form-grid grid-3" style="align-items:end;margin-bottom:18px;">
          <div class="field-group" style="grid-column: span 2;">
            <label class="field-label">Cliente</label>
            <select class="sis-select">
              ${(db.customers || []).map(c => `<option>${c.number} - ${c.name}</option>`).join('')}
            </select>
          </div>
          <button class="btn btn-primary" onclick="window.showToast('Notas de venta del cliente cargadas para consolidación')">Continuar</button>
        </div>
        <div class="table-wrap">
          <table class="sis-table">
            <thead>
              <tr><th><input type="checkbox" checked /></th><th>N° Nota</th><th>Fecha</th><th>Cliente</th><th>Moneda</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${(db.sale_notes || []).map(nv => `
                <tr>
                  <td><input type="checkbox" checked /></td>
                  <td><span class="badge badge-info">${nv.series_number}</span></td>
                  <td>${nv.issue_date}</td>
                  <td>${nv.customer_name}</td>
                  <td>Soles (S/)</td>
                  <td style="font-weight:700;">S/ ${Number(nv.total).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// CAJA DIARIA & MOVIMIENTOS (/openings)
window.renderOpeningsView = function(db) {
  const op = (db.openings && db.openings[0]) || {
    id: 9,
    cash_name: 'Caja Principal',
    open_date: '25/10/2026 08:30',
    initial_balance: 200.00,
    total_income: 878.80,
    total_expense: 726.85,
    final_balance: 351.95,
    status: 'Abierta'
  };
  const movs = db.cash_movements || [];

  return `
    <div>
      ${window.renderBreadcrumb(
        'Caja diaria & Mov.',
        '',
        `
          <button class="btn btn-secondary" onclick="window.navigateTo('/reports/cash')">
            <i data-lucide="file-text"></i> Resumen
          </button>
          <button class="btn btn-primary" onclick="window.openCashMovementModal()">
            <i data-lucide="plus-circle"></i> Nuevo movimiento
          </button>
          <button class="btn btn-outline-red" onclick="window.showToast('Arqueo y cierre de Caja Principal procesado correctamente')">
            <i data-lucide="lock"></i> Cerrar caja
          </button>
        `
      )}

      <div class="sis-card" style="border-left:4px solid #22c55e;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-size:15px;font-weight:700;color:#4ade80;">
              ${op.cash_name} -|- Apertura: ${op.open_date} -|- Usuario: Principal / Administrador
            </div>
            <div style="font-size:12.5px;color:var(--text-secondary);margin-top:4px;">
              Estado: <span class="badge badge-success">${op.status}</span>
            </div>
          </div>
          <div style="display:flex;gap:20px;text-align:right;">
            <div>
              <div style="font-size:11px;color:var(--text-secondary);">SALDO INICIAL</div>
              <div style="font-weight:700;font-size:15px;">S/ ${Number(op.initial_balance).toFixed(2)}</div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--text-secondary);">TOTAL INGRESOS</div>
              <div style="font-weight:700;font-size:15px;color:#4ade80;">+ S/ ${Number(op.total_income).toFixed(2)}</div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--text-secondary);">TOTAL EGRESOS</div>
              <div style="font-weight:700;font-size:15px;color:#f87171;">- S/ ${Number(op.total_expense).toFixed(2)}</div>
            </div>
            <div>
              <div style="font-size:11px;color:var(--text-secondary);">SALDO EN CAJA</div>
              <div style="font-weight:700;font-size:17px;color:#ffffff;">S/ ${Number(op.final_balance).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="sis-card">
        <div style="font-weight:700;margin-bottom:12px;">Movimientos del turno actual</div>
        <div class="table-wrap">
          <table class="sis-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>FECHA / HORA</th>
                <th>CAJA</th>
                <th>TIPO</th>
                <th>CONCEPTO</th>
                <th>DOC. REF</th>
                <th>MÉTODO PAGO</th>
                <th>IMPORTE</th>
                <th>USUARIO</th>
              </tr>
            </thead>
            <tbody>
              ${movs.map((m, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${m.date}</td>
                  <td>${m.cash}</td>
                  <td>
                    <span class="badge ${m.type === 'Ingreso' ? 'badge-success' : 'badge-danger'}">${m.type}</span>
                  </td>
                  <td>${m.concept}</td>
                  <td>${m.doc || '-'}</td>
                  <td>${m.method || 'Efectivo'}</td>
                  <td style="font-weight:700;color:${m.type === 'Ingreso' ? '#4ade80' : '#f87171'};">
                    S/ ${Number(m.amount).toFixed(2)}
                  </td>
                  <td>${m.user || 'Principal'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

window.openCashMovementModal = function() {
  const concepts = window.APP_DB.concepts || [];
  window.openModal(
    'Registrar movimiento de caja',
    `
      <div class="form-grid grid-2">
        <div class="field-group">
          <label class="field-label">Tipo de movimiento</label>
          <select id="mov-type" class="sis-select">
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Concepto</label>
          <select id="mov-concept" class="sis-select">
            ${concepts.map(c => `<option value="${c.name}">[${c.type}] ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Método de pago</label>
          <select id="mov-method" class="sis-select">
            <option>Efectivo</option>
            <option>Yape / Plin</option>
            <option>Transferencia</option>
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Importe (S/) *</label>
          <input id="mov-amount" type="number" step="0.10" class="sis-input" value="50.00" />
        </div>
        <div class="field-group" style="grid-column: span 2;">
          <label class="field-label">Referencia / Observación</label>
          <input id="mov-doc" type="text" class="sis-input" placeholder="Ej. Recibo N° 0045" />
        </div>
      </div>
    `,
    `
      <button class="btn btn-secondary" onclick="window.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.saveCashMovement()">Guardar movimiento</button>
    `,
    '560px'
  );
};

window.saveCashMovement = async function() {
  const payload = {
    date: new Date().toLocaleDateString('es-PE') + ' ' + new Date().toTimeString().slice(0,5),
    cash: 'Caja Principal',
    type: document.getElementById('mov-type')?.value || 'Ingreso',
    concept: document.getElementById('mov-concept')?.value || 'Movimiento',
    method: document.getElementById('mov-method')?.value || 'Efectivo',
    amount: Number(document.getElementById('mov-amount')?.value || 0),
    doc: document.getElementById('mov-doc')?.value || '-',
    user: 'Principal'
  };
  const res = await fetch('/api/collection/cash_movements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.closeModal();
    window.renderCurrentRoute();
    window.showToast('Movimiento registrado en Caja Principal');
  }
};

// CONFIGURACIONES (/configurations) - Exact match to step_57_shot_1_configurations.png
window.renderConfigurationsView = function(db) {
  const cfg = db.configurations || {};
  const toggleItems = [
    ['auto_send_invoices', 'Envío automático de facturas', ''],
    ['cron_job', 'Cron job', ''],
    ['avg_purchase_price', 'Promediar precio de compra de productos', ''],
    ['warehouse_per_establishment', 'Manejo de almacén por establecimiento', ''],
    ['verify_transfers', 'Verificar traslados antes de ingresar stock al destino', 'Al activarlo, el despacho descuenta el origen y el destino recibe stock solo después del visto bueno.'],
    ['charge_sales_in_cash', 'Cobrar Ventas en Caja', ''],
    ['restrict_stock_on_sale', 'Venta con restricción de stock', ''],
    ['sales_with_price_list', 'Ventas con lista de precio', ''],
    ['price_per_branch', 'Manejar precio por sucursal', ''],
    ['search_by_barcode', 'Buscar productos por N°. Cod. Barras', ''],
    ['search_customers_by_address', 'Buscar clientes por dirección', ''],
    ['scale_price_calculation', 'Calcular precio de venta de productos en escala', ''],
    ['calculate_change_in_pos', 'Calcular vuelto en POS', ''],
    ['accumulate_qty_in_pos', 'Acumular cantidad de producto al vender (POS)', ''],
    ['cash_opening_per_user', 'Apertura de caja por usuario', ''],
    ['enforce_min_sale_price', 'Establecer precio mínimo de venta', ''],
    ['allow_edit_product_name_on_sale', 'Al vender permitir la edición del nombre del producto/servicio', ''],
    ['update_purchase_price_on_buy', 'Actualizar precio de compra del producto al registrar una compra', ''],
    ['allow_negative_stock_sale', 'Permitir la venta de productos con stock negativo', '']
  ];

  return `
    <div>
      ${window.renderBreadcrumb('Configuraciones', '')}

      <div class="sis-card">
        <div class="sis-card-header-red">Configuraciones</div>

        <div class="form-grid grid-2" style="row-gap:22px;column-gap:36px;margin-bottom:28px;">
          ${toggleItems.map(([key, title, help]) => {
            const isOn = !!cfg[key];
            return `
              <div style="border-bottom:1px solid var(--border-subtle);padding-bottom:14px;">
                <div style="font-weight:600;font-size:13px;margin-bottom:10px;color:var(--text-main);">${title}</div>
                <div class="sis-switch-row">
                  <span class="sis-switch-label ${!isOn ? 'active-no' : ''}">No</span>
                  <button type="button" class="sis-switch ${isOn ? 'on' : ''}" onclick="window.toggleConfigSwitch('${key}')"></button>
                  <span class="sis-switch-label ${isOn ? 'active-si' : ''}">Sí</span>
                </div>
                ${help ? `<div style="font-size:11.5px;color:var(--text-secondary);margin-top:8px;">${help}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Impresión -->
        <div style="border-top:1px solid var(--border-color);padding-top:20px;margin-bottom:24px;">
          <div style="font-weight:700;font-size:14.5px;margin-bottom:14px;">Configuración de Impresión (POS / Tickets)</div>
          <div class="form-grid grid-4" style="margin-bottom:14px;">
            <div class="field-group">
              <label class="field-label">Modo de impresión</label>
              <select class="sis-select"><option>Directa</option><option>Navegador (PDF)</option></select>
            </div>
            <div class="field-group">
              <label class="field-label">Formato de impresión</label>
              <select class="sis-select"><option>Ticket 80</option><option>Ticket 58</option><option>A4</option></select>
            </div>
            <div class="field-group">
              <label class="field-label">Tipo de conexión de impresora</label>
              <select class="sis-select"><option>Impresora local</option><option>Red / IP</option></select>
            </div>
            <div class="field-group">
              <label class="field-label">Nombre de impresora</label>
              <input type="text" class="sis-input" value="${cfg.printer_name || 'POS-80C'}" />
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.showToast('Parámetros de impresora guardados')">Guardar cambios</button>
        </div>

        <!-- Impuestos SUNAT -->
        <div style="border-top:1px solid var(--border-color);padding-top:20px;">
          <div style="font-weight:700;font-size:14.5px;margin-bottom:12px;">Impuestos (Afectación IGV SUNAT)</div>
          <div class="table-wrap">
            <table class="sis-table">
              <thead>
                <tr><th>Código</th><th>Descripción</th><th>Porcentaje (%)</th><th>Activo</th><th>Por defecto</th></tr>
              </thead>
              <tbody>
                ${(db.taxes || []).map(t => `
                  <tr>
                    <td>${t.code}</td>
                    <td style="font-weight:600;">${t.name}</td>
                    <td>${t.percentage}%</td>
                    <td><span class="badge badge-success">Sí</span></td>
                    <td>${t.is_default ? '<span class="badge badge-info">Por defecto</span>' : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.toggleConfigSwitch = async function(key) {
  const cfg = window.APP_DB.configurations || {};
  cfg[key] = !cfg[key];
  const res = await fetch('/api/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ configurations: cfg })
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.renderCurrentRoute();
    window.showToast('Configuración actualizada');
  }
};

// ETIQUETAS DE PRODUCTOS (/labels)
window.renderLabelsView = function(db) {
  return `
    <div>
      ${window.renderBreadcrumb('Inventario', 'Etiquetas de productos', '', '/items')}
      <div class="sis-card">
        <div class="sis-tabs">
          <button class="sis-tab-btn active">Preparar lote</button>
          <button class="sis-tab-btn" onclick="window.showToast('Impresora Zebra / TSC configurada')">Impresoras</button>
          <button class="sis-tab-btn" onclick="window.showToast('Plantilla 50x25mm seleccionada')">Plantillas</button>
          <button class="sis-tab-btn" onclick="window.showToast('Historial de lotes impresos')">Historial</button>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:18px;">
          <div class="sis-card" style="background:var(--bg-card-alt);margin:0;">
            <div style="color:#f43f5e;font-weight:700;font-size:12px;">PASO 1</div>
            <div style="font-weight:700;margin-bottom:8px;">Configuración del lote</div>
            <select class="sis-select" style="margin-bottom:8px;"><option>Etiqueta Adhesiva 50x25mm (Cód. Barras + Precio)</option><option>Etiqueta Góndola 60x40mm</option></select>
            <select class="sis-select"><option>Almacén - Principal</option></select>
          </div>
          <div class="sis-card" style="background:var(--bg-card-alt);margin:0;">
            <div style="color:#f43f5e;font-weight:700;font-size:12px;">PASO 2</div>
            <div style="font-weight:700;margin-bottom:8px;">Agregar productos y variantes</div>
            <select class="sis-select" style="margin-bottom:8px;">
              ${(db.items || []).map(i => `<option>${i.internal_code} - ${i.description}</option>`).join('')}
            </select>
            <button class="btn btn-primary btn-sm" onclick="window.showToast('Producto añadido al lote de etiquetas')">+ Añadir al lote</button>
          </div>
          <div class="sis-card" style="background:#ffffff;color:#111827;margin:0;text-align:center;padding:12px;">
            <div style="font-size:10px;font-weight:700;">NYCE STORE</div>
            <div style="font-size:10.5px;font-weight:700;margin:2px 0;">POND'S CLARANT B3 50G</div>
            <div style="font-family:monospace;letter-spacing:3px;font-weight:700;font-size:15px;margin:4px 0;">||| |||| || |||| |||</div>
            <div style="font-size:10px;">7501056341209 · <b>S/ 12.00</b></div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;">
          <button class="btn btn-primary" onclick="window.print()"><i data-lucide="printer"></i> Imprimir etiquetas</button>
        </div>
      </div>
    </div>
  `;
};

// REPORTE FLUJO DE EFECTIVO (/reports/cash)
window.renderCashReportView = function(db) {
  const movs = db.cash_movements || [];
  const totalIn = movs.filter(m => m.type === 'Ingreso').reduce((s, m) => s + Number(m.amount), 0);
  const totalOut = movs.filter(m => m.type === 'Egreso').reduce((s, m) => s + Number(m.amount), 0);

  return `
    <div>
      ${window.renderBreadcrumb(
        'Reportes',
        'Ingresos / Egresos (Flujo de efectivo)',
        `<button class="btn btn-primary" onclick="window.exportCSV('flujo_efectivo_caja', ['FECHA','CAJA','TIPO','CONCEPTO','DOC','METODO','MONTO'], (window.APP_DB.cash_movements||[]).map(m=>[m.date,m.cash,m.type,m.concept,m.doc,m.method,m.amount]))"><i data-lucide="download"></i> Exportar Excel</button>`,
        '/openings'
      )}
      <div class="sis-card">
        <div class="form-grid grid-4" style="margin-bottom:16px;">
          <div class="field-group"><label class="field-label">Caja</label><select class="sis-select"><option>Caja Principal</option></select></div>
          <div class="field-group"><label class="field-label">Periodo</label><select class="sis-select"><option>Entre fechas</option></select></div>
          <div class="field-group"><label class="field-label">Fecha del</label><input type="text" class="sis-input" value="01/10/2026" /></div>
          <div class="field-group"><label class="field-label">Fecha al</label><input type="text" class="sis-input" value="17/11/2026" /></div>
        </div>

        <div class="table-wrap" style="margin-bottom:16px;">
          <table class="sis-table">
            <thead>
              <tr><th>N°</th><th>FECHA</th><th>CAJA</th><th>TIPO</th><th>CONCEPTO</th><th>DOCUMENTO</th><th>MÉTODO</th><th>USUARIO</th><th>MONTO</th></tr>
            </thead>
            <tbody>
              ${movs.map((m, i) => `
                <tr>
                  <td>${i + 1}</td><td>${m.date}</td><td>${m.cash}</td>
                  <td><span class="badge ${m.type === 'Ingreso' ? 'badge-success' : 'badge-danger'}">${m.type}</span></td>
                  <td>${m.concept}</td><td>${m.doc}</td><td>${m.method}</td><td>${m.user}</td>
                  <td style="font-weight:700;">S/ ${Number(m.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="sis-card" style="background:var(--bg-card-alt);margin:0;">
          <div style="font-weight:700;margin-bottom:10px;color:#f43f5e;">CUADRE DE CAJA</div>
          <div class="form-grid grid-3">
            <div><span style="color:var(--text-secondary);">TOTAL INGRESOS:</span> <b style="color:#4ade80;font-size:16px;">S/ ${totalIn.toFixed(2)}</b></div>
            <div><span style="color:var(--text-secondary);">TOTAL EGRESOS:</span> <b style="color:#f87171;font-size:16px;">S/ ${totalOut.toFixed(2)}</b></div>
            <div><span style="color:var(--text-secondary);">SALDO FINAL:</span> <b style="color:#ffffff;font-size:16px;">S/ ${(totalIn - totalOut).toFixed(2)}</b></div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// CONFIGURACIÓN DE TODAS LAS DEMÁS RUTAS (~75 vistas CRUD y Reportes)
window.ROUTE_SPECS = {
  // ADMINISTRACIÓN
  '/brands/items': {
    parent: 'Administración', title: 'Marcas', col: 'brands',
    columns: [['id','N°'], ['name','Nombre de Marca'], ['count','Productos asociados']],
    fields: [['name','Nombre de Marca *','text']]
  },
  '/categories': {
    parent: 'Administración', title: 'Categorías', col: 'categories',
    columns: [['id','N°'], ['name','Nombre'], ['commission','Comisión (%)']],
    fields: [['name','Nombre de Categoría *','text'], ['commission','Comisión (%)','number']]
  },
  '/price-list': {
    parent: 'Administración', title: 'Lista de precios', col: 'price_lists',
    columns: [['id','N°'], ['description','Descripción'], ['percentage','Descuento / Escala (%)']],
    fields: [['description','Descripción *','text'], ['percentage','Porcentaje (%)','number']]
  },
  '/price-rules': {
    parent: 'Administración', title: 'Reglas de precios', col: 'price_rules',
    columns: [['id','N°'], ['name','Regla'], ['category','Categoría'], ['min_qty','Cant. Mín.'], ['max_qty','Cant. Máx.'], ['discount_pct','Dscto (%)']],
    fields: [['name','Nombre de regla *','text'], ['category','Categoría','text'], ['min_qty','Cant. Mínima','number'], ['max_qty','Cant. Máxima','number'], ['discount_pct','Descuento (%)','number']]
  },
  '/unit_types': {
    parent: 'Administración', title: 'Unidades de medida', col: 'unit_types',
    columns: [['id','N°'], ['code','Código SUNAT'], ['description','Descripción'], ['symbol','Símbolo']],
    fields: [['code','Código SUNAT (Ej. NIU)','text'], ['description','Descripción *','text'], ['symbol','Símbolo','text']]
  },
  '/sizes': {
    parent: 'Tallas / Colores', title: 'Tallas', col: 'sizes',
    columns: [['id','N°'], ['code','Abreviatura'], ['name','Descripción de Talla']],
    fields: [['code','Código *','text'], ['name','Descripción *','text']]
  },
  '/colors': {
    parent: 'Tallas / Colores', title: 'Colores', col: 'colors',
    columns: [['id','N°'], ['name','Nombre del Color'], ['hex','Código Color']],
    fields: [['name','Nombre del Color *','text'], ['hex','Código HEX (#f43f5e)','text']]
  },
  '/group-customers': {
    parent: 'Promociones', title: 'Grupo clientes', col: 'group_customers',
    columns: [['id','N°'], ['name','Grupo de Clientes'], ['discount','Descuento (%)'], ['members','Integrantes']],
    fields: [['name','Nombre del Grupo *','text'], ['discount','Descuento (%)','number'], ['members','Cant. Clientes','number']]
  },
  '/bonus': {
    parent: 'Promociones', title: 'Bonificaciones', col: 'bonus',
    columns: [['id','N°'], ['name','Campaña Bonificación'], ['product','Producto'], ['buy_qty','Por compra de'], ['bonus_qty','Bonifica']],
    fields: [['name','Descripción *','text'], ['product','Producto','text'], ['buy_qty','Cantidad compra','number'], ['bonus_qty','Unidades gratis','number']]
  },
  '/discounts': {
    parent: 'Promociones', title: 'Descuentos', col: 'discounts',
    columns: [['id','N°'], ['valid_for','Válido para:'], ['description','Descripción'], ['percentage','Porcentaje (%)']],
    fields: [['valid_for','Válido para *','text'], ['description','Descripción *','text'], ['percentage','Descuento (%)','number']]
  },
  '/discount-coupons': {
    parent: 'Promociones', title: 'Cupones de descuento', col: 'discount_coupons',
    columns: [['id','N°'], ['code','Código Cupón'], ['description','Descripción'], ['type','Tipo'], ['value','Valor'], ['expiration','Vencimiento'], ['status','Estado']],
    fields: [['code','Código *','text'], ['description','Descripción','text'], ['type','Tipo (Porcentaje/Monto fijo)','text'], ['value','Valor','number'], ['expiration','Fecha Vcto.','text']]
  },
  '/offers': {
    parent: 'Promociones', title: 'Ofertas', col: 'offers',
    columns: [['id','N°'], ['name','Oferta / Pack'], ['regular_price','P. Regular (S/)'], ['offer_price','P. Oferta (S/)'], ['start_date','Inicio'], ['end_date','Fin'], ['status','Estado']],
    fields: [['name','Nombre de Oferta *','text'], ['regular_price','Precio Regular','number'], ['offer_price','Precio Oferta','number'], ['start_date','Desde','text'], ['end_date','Hasta','text']]
  },
  '/routes': {
    parent: 'Envíos', title: 'Rutas', col: 'routes',
    columns: [['id','N°'], ['code','Código'], ['name','Descripción de Ruta'], ['zone','Zona'], ['distance_km','Distancia (Km)']],
    fields: [['code','Código','text'], ['name','Nombre de Ruta *','text'], ['zone','Zona','text'], ['distance_km','Km','number']]
  },
  '/vehicles': {
    parent: 'Envíos', title: 'Vehículos', col: 'vehicles',
    columns: [['id','N°'], ['plate','N° Placa'], ['brand','Marca'], ['model','Modelo'], ['capacity_kg','Capacidad (Kg)'], ['tuc','T.U.C.']],
    fields: [['plate','Placa *','text'], ['brand','Marca','text'], ['model','Modelo','text'], ['capacity_kg','Capacidad Kg','number'], ['tuc','N° TUC','text']]
  },
  '/drivers': {
    parent: 'Envíos', title: 'Conductores', col: 'drivers',
    columns: [['id','N°'], ['document_type','Tipo Doc'], ['document_number','N° Doc'], ['name','Conductor'], ['license','N° Licencia'], ['phone','Teléfono']],
    fields: [['document_number','DNI *','text'], ['name','Nombres y Apellidos *','text'], ['license','N° Brevete / Licencia *','text'], ['phone','Teléfono','text']]
  },
  '/dispatchers': {
    parent: 'Envíos', title: 'Ag. Transporte', col: 'dispatchers',
    columns: [['id','N°'], ['ruc','RUC'], ['name','Razón Social Transportista'], ['address','Dirección'], ['mtc_reg','Registro MTC']],
    fields: [['ruc','RUC *','text'], ['name','Razón Social *','text'], ['address','Dirección','text'], ['mtc_reg','Registro MTC','text']]
  },

  // INVENTARIO
  '/warehouses': {
    parent: 'Inventario', title: 'Almacenes', col: 'warehouses',
    columns: [['id','N°'], ['name','Nombre'], ['establishment','Establecimiento'], ['location','Ubicación']],
    fields: [['name','Nombre del Almacén *','text'], ['establishment','Establecimiento','text'], ['location','Dirección / Ubicación','text']]
  },
  '/reports-kardex': {
    parent: 'Inventario', title: 'Kardex por Producto', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['description','Nombre'], ['warehouse','Almacén'], ['stock','Stock Actual']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['stock','Stock','number']]
  },
  '/general-kardex': {
    parent: 'Inventario', title: 'Kardex general', col: 'items',
    columns: [['id','N°'], ['internal_code','Cód. Interno'], ['barcode','Cód. Barras'], ['description','Producto'], ['unit','Unidad'], ['stock','Saldo Físico']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['stock','Saldo','number']]
  },
  '/transfers': {
    parent: 'Inventario', title: 'Traslados entre almacenes', col: 'transfers',
    columns: [['id','N°'], ['date','Fecha'], ['origin_warehouse','Almacén origen'], ['destination_warehouse','Almacén destino'], ['responsible','Responsable'], ['description','Descripción'], ['status','Estado']],
    fields: [['date','Fecha','text'], ['origin_warehouse','Almacén origen','text'], ['destination_warehouse','Almacén destino','text'], ['responsible','Responsable','text'], ['description','Motivo / Descripción','text'], ['status','Estado','text']]
  },
  '/reports-inventory': {
    parent: 'Inventario', title: 'Reporte de Inventario Físico', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['category','Categoría'], ['brand','Marca'], ['description','Producto'], ['warehouse','Almacén'], ['stock','Stock']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['stock','Stock','number']]
  },
  '/reports-color-size-inventory': {
    parent: 'Inventario', title: 'Inventario por Color / Talla', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['description','Producto'], ['model','Talla / Presentación'], ['brand','Marca'], ['stock','Stock']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['model','Talla/Color','text'], ['stock','Stock','number']]
  },
  '/stock': {
    parent: 'Inventario', title: 'Actualizar stock / precios rápido', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['description','Producto'], ['stock','Stock Actual'], ['purchase_price','P. Compra (S/)'], ['sale_price','P. Venta (S/)']],
    fields: [['description','Producto','text'], ['stock','Nuevo Stock','number'], ['purchase_price','Precio Compra','number'], ['sale_price','Precio Venta','number']]
  },
  '/valued-inventory': {
    parent: 'Inventario', title: 'Inventario Valorizado', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['description','Producto'], ['stock','Stock'], ['purchase_price','Costo Unit. (S/)'], ['sale_price','Precio Venta (S/)']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['stock','Stock','number']]
  },
  '/cost-accumulated': {
    parent: 'Inventario', title: 'Costo acumulado de inventario', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['category','Categoría'], ['description','Producto'], ['stock','Unidades'], ['purchase_price','Costo Promedio (S/)']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['purchase_price','Costo','number']]
  },
  '/reports-stock-alert': {
    parent: 'Inventario', title: 'Alerta de stock (Stock mínimo)', col: 'items',
    columns: [['id','N°'], ['internal_code','Código'], ['description','Producto'], ['warehouse','Almacén'], ['stock','Stock Actual'], ['min_stock','Stock Mínimo']],
    fields: [['internal_code','Código','text'], ['description','Producto','text'], ['stock','Stock Actual','number'], ['min_stock','Stock Mínimo','number']]
  },
  '/inventory-adjustments': {
    parent: 'Inventario', title: 'Ajuste de inventario', col: 'inventory_adjustments',
    columns: [['id','N°'], ['code','ID'], ['date','Fecha'], ['type','Tipo'], ['warehouse','Almacén'], ['operation','Operación'], ['responsible','Responsable'], ['product','Producto'], ['quantity','Cantidad']],
    fields: [['code','Código (AJ-0015)','text'], ['date','Fecha','text'], ['type','Tipo (Ingreso/Salida)','text'], ['warehouse','Almacén','text'], ['operation','Motivo de operación','text'], ['product','Producto','text'], ['quantity','Cantidad','number']]
  },
  '/stock-counts': {
    parent: 'Inventario', title: 'Cuadre de stock', col: 'stock_counts',
    columns: [['id','N°'], ['number','Número'], ['date','Fecha'], ['warehouse','Almacén'], ['responsible','Responsable'], ['products_count','Productos'], ['status','Estado']],
    fields: [['number','Número (CS-2026-002)','text'], ['date','Fecha','text'], ['warehouse','Almacén','text'], ['responsible','Responsable','text'], ['products_count','N° Productos','number'], ['status','Estado','text']]
  },

  // COMPRAS
  '/purchases': {
    parent: 'Compras', title: 'Listado de Compras', col: 'purchases', createPath: '/purchases/create',
    columns: [['id','N°'], ['issue_date','F. Emisión'], ['supplier','Proveedor'], ['purchase_order','O. Compra'], ['status','Estado'], ['doc_type','Comprobante'], ['series_number','Número'], ['payment_condition','C.Pago'], ['total','Total (S/)']],
    fields: [['issue_date','F. Emisión','text'], ['supplier','Proveedor','text'], ['series_number','Serie-Número','text'], ['total','Total','number']]
  },
  '/persons/suppliers': {
    parent: 'Compras', title: 'Proveedores', col: 'suppliers', customCreate: 'window.openCustomerModal(true)',
    columns: [['id','N°'], ['number','RUC / Doc.'], ['name','Nombre / Razón Social'], ['address','Dirección'], ['phone','Teléfono'], ['email','Email'], ['seller','Contacto']],
    fields: [['number','RUC *','text'], ['name','Razón Social *','text'], ['address','Dirección','text'], ['phone','Teléfono','text'], ['email','Email','text']]
  },
  '/purchase-orders': {
    parent: 'Compras', title: 'Órdenes de compra', col: 'purchase_orders',
    columns: [['id','#'], ['issue_date','F. Emisión'], ['due_date','F. Vencimiento'], ['supplier','Proveedor'], ['number','O. Compra'], ['observations','Observaciones'], ['total','Total (S/)'], ['status','Estado']],
    fields: [['issue_date','F. Emisión','text'], ['due_date','F. Vencimiento','text'], ['supplier','Proveedor *','text'], ['number','N° Orden (OC01-0021)','text'], ['observations','Observaciones','text'], ['total','Total (S/)','number']]
  },
  '/debts/payable': {
    parent: 'Compras', title: 'Cuentas por pagar', col: 'debts_payable',
    columns: [['id','N°'], ['purchase_date','Fecha de Compra'], ['document','Comprobante'], ['supplier','Proveedor'], ['currency','Moneda'], ['total_amount','Importe total'], ['paid_amount','Importe abonado'], ['pending_amount','Pendiente de pago'], ['installments','N° Cuotas']],
    fields: [['purchase_date','Fecha','text'], ['document','Comprobante','text'], ['supplier','Proveedor','text'], ['total_amount','Importe Total','number'], ['paid_amount','Abonado','number'], ['pending_amount','Pendiente','number']]
  },
  '/debts/payable/calendar': {
    parent: 'Compras', title: 'Calendario de pagos a proveedores', col: 'debts_payable',
    columns: [['id','N°'], ['purchase_date','Fecha Vcto.'], ['supplier','Proveedor'], ['document','Documento'], ['total_amount','Total'], ['pending_amount','Saldo Pendiente']],
    fields: [['purchase_date','Fecha Vcto.','text'], ['supplier','Proveedor','text'], ['document','Documento','text'], ['pending_amount','Monto','number']]
  },

  // VENTAS
  '/documents': {
    parent: 'Ventas', title: 'Comprobantes Electrónicos', col: 'documents', createPath: '/documents/create',
    columns: [['id','N°'], ['issue_date','Fecha Emisión'], ['doc_type','Comprobante'], ['payment_condition','C. Pago'], ['customer_doc','RUC/DNI'], ['customer_name','Denominación'], ['user','Usuario'], ['series_number','Serie-Número'], ['status','Estado'], ['total','Total (S/)']],
    fields: [['issue_date','Fecha','text'], ['doc_type','Tipo','text'], ['series_number','Serie-Número','text'], ['customer_name','Cliente','text'], ['total','Total','number']]
  },
  '/summaries': {
    parent: 'Ventas', title: 'Resúmenes Diarios de Boletas', col: 'summaries',
    columns: [['id','N°'], ['issue_date','Fecha Envío'], ['ref_date','Fecha Comprobantes'], ['identifier','Identificador'], ['ticket','Ticket SUNAT'], ['documents_count','Comprobantes'], ['status','Estado']],
    fields: [['issue_date','Fecha Envío','text'], ['ref_date','Fecha Emisión Boletas','text'], ['identifier','Identificador (RC-20261117-1)','text'], ['ticket','Ticket SUNAT','text'], ['status','Estado','text']]
  },
  '/voided': {
    parent: 'Ventas', title: 'Comunicación de Baja / Anulaciones', col: 'voided',
    columns: [['id','N°'], ['issue_date','Fecha Baja'], ['ref_date','Fecha Doc.'], ['identifier','Identificador'], ['document','Comprobante Anulado'], ['reason','Motivo de Baja'], ['ticket','Ticket SUNAT'], ['status','Estado']],
    fields: [['issue_date','Fecha Baja','text'], ['document','Comprobante','text'], ['reason','Motivo de anulación *','text'], ['status','Estado','text']]
  },
  '/quotations': {
    parent: 'Ventas', title: 'Cotizaciones', col: 'quotations', createPath: '/pos',
    columns: [['id','N°'], ['issue_date','Fecha Emisión'], ['customer_name','Cliente'], ['phone','Teléfono'], ['user','Usuario'], ['status','Estado'], ['series_number','Número'], ['payment_condition','C. Pago'], ['paid','¿Pagado?'], ['total','Total (S/)']],
    fields: [['issue_date','Fecha','text'], ['customer_name','Cliente *','text'], ['series_number','Número (CT01-12)','text'], ['payment_condition','Condición','text'], ['total','Total (S/)','number']]
  },
  '/sale-notes': {
    parent: 'Ventas', title: 'Notas de venta', col: 'sale_notes', createPath: '/documents/create',
    columns: [['id','N°'], ['issue_date','Fecha Emisión'], ['customer_name','Cliente'], ['phone','Teléfono'], ['user','Usuario'], ['series_number','Número'], ['status','Estado'], ['total','Total (S/)'], ['cpe','C.P.E.']],
    fields: [['issue_date','Fecha','text'], ['customer_name','Cliente','text'], ['series_number','Número (NV01-00218)','text'], ['total','Total (S/)','number']]
  },
  '/persons/customers': {
    parent: 'Ventas', title: 'Gestión de clientes', col: 'customers', customCreate: 'window.openCustomerModal(false)',
    columns: [['id','N°'], ['number','Número Doc.'], ['name','Nombre / Razón Social'], ['address','Dirección'], ['phone','Teléfono'], ['email','Email'], ['seller','Vendedor']],
    fields: [['number','DNI / RUC *','text'], ['name','Nombre *','text'], ['address','Dirección','text'], ['phone','Teléfono','text'], ['email','Email','text']]
  },
  '/debts/receivable': {
    parent: 'Ventas', title: 'Cuentas por cobrar', col: 'debts_receivable',
    columns: [['id','N°'], ['sale_date','Fecha Venta'], ['document','Comprobante'], ['customer','Cliente'], ['currency','Moneda'], ['total_amount','Importe Total'], ['paid_amount','Abonado'], ['pending_amount','Pendiente de cobro']],
    fields: [['sale_date','Fecha','text'], ['document','Comprobante','text'], ['customer','Cliente','text'], ['total_amount','Total','number'], ['pending_amount','Pendiente','number']]
  },
  '/debts/receivable/calendar': {
    parent: 'Ventas', title: 'Calendario de cobranzas', col: 'debts_receivable',
    columns: [['id','N°'], ['sale_date','Fecha Vencimiento'], ['customer','Cliente'], ['document','Comprobante'], ['total_amount','Importe'], ['pending_amount','Saldo por Cobrar']],
    fields: [['sale_date','Fecha Vcto.','text'], ['customer','Cliente','text'], ['document','Documento','text'], ['pending_amount','Saldo','number']]
  },
  '/dispatches': {
    parent: 'Guías de remisión', title: 'Listado de Guías de Remisión', col: 'dispatches', createPath: '/dispatches/create',
    columns: [['id','N°'], ['issue_date','F. emisión'], ['transfer_date','F. traslado'], ['recipient','Destinatario'], ['type','Tipo de guía'], ['series_number','Número'], ['driver','Conductor / transportista'], ['vehicle','Vehículo'], ['transfer_reason','Motivo'], ['status','Estado']],
    fields: [['issue_date','F. emisión','text'], ['recipient','Destinatario','text'], ['series_number','Serie-Número','text'], ['driver','Conductor','text'], ['vehicle','Vehículo','text']]
  },

  // ENTREGAS WORKSPACE
  '/deliveries/workspace/pending': {
    parent: 'Entregas', title: 'Entregas pendientes', col: 'deliveries',
    columns: [['id','N°'], ['operation','Operación'], ['customer','Cliente'], ['tracking','Seguimiento'], ['status','Estado'], ['progress','Avance de entrega']],
    fields: [['operation','Comprobante / Operación','text'], ['customer','Cliente','text'], ['tracking','Seguimiento','text'], ['status','Estado','text'], ['progress','Avance (%)','text']]
  },
  '/deliveries/workspace/schedules': {
    parent: 'Entregas', title: 'Agenda de entregas programadas', col: 'deliveries',
    columns: [['id','N°'], ['date','Fecha Programada'], ['operation','Operación'], ['customer','Cliente'], ['warehouse','Almacén'], ['status','Estado']],
    fields: [['date','Fecha','text'], ['operation','Operación','text'], ['customer','Cliente','text'], ['status','Estado','text']]
  },
  '/deliveries/workspace/preparation': {
    parent: 'Entregas', title: 'Preparación de pedidos (Picking & Packing)', col: 'deliveries',
    columns: [['id','N°'], ['operation','Operación'], ['customer','Cliente'], ['warehouse','Almacén'], ['priority','Prioridad'], ['progress','Avance']],
    fields: [['operation','Operación','text'], ['customer','Cliente','text'], ['priority','Prioridad','text'], ['progress','Avance','text']]
  },
  '/deliveries/workspace/history': {
    parent: 'Entregas', title: 'Historial de entregas completadas', col: 'dispatches',
    columns: [['id','N°'], ['issue_date','Fecha'], ['series_number','Guía / Doc'], ['recipient','Cliente'], ['driver','Responsable'], ['status','Estado']],
    fields: [['issue_date','Fecha','text'], ['series_number','Documento','text'], ['recipient','Cliente','text']]
  },
  '/deliveries/workspace/customers': {
    parent: 'Entregas', title: 'Ventas y entregas por cliente', col: 'customers',
    columns: [['id','N°'], ['number','RUC / DNI'], ['name','Cliente'], ['address','Dirección de Entrega'], ['phone','Teléfono']],
    fields: [['number','Documento','text'], ['name','Cliente','text'], ['address','Dirección','text']]
  },
  '/deliveries/workspace/custody': {
    parent: 'Entregas', title: 'Mercadería en custodia (Vendida por recoger)', col: 'deliveries',
    columns: [['id','N°'], ['operation','Documento'], ['customer','Cliente'], ['warehouse','Almacén Custodia'], ['status','Estado']],
    fields: [['operation','Documento','text'], ['customer','Cliente','text'], ['warehouse','Almacén','text']]
  },

  // CAJA & BANCOS
  '/sales-receivable': {
    parent: 'Caja & Bancos', title: 'Ventas por cobrar en Caja', col: 'sale_notes',
    columns: [['id','N°'], ['issue_date','Fecha'], ['payment_condition','Cond. Pago'], ['series_number','Número'], ['customer_name','Cliente'], ['user','Vendedor'], ['total','Total (S/)'], ['status','Estado']],
    fields: [['issue_date','Fecha','text'], ['series_number','Número','text'], ['customer_name','Cliente','text'], ['total','Total','number']]
  },
  '/cash': {
    parent: 'Caja & Bancos', title: 'Gestión de caja', col: 'cash_registers',
    columns: [['id','N°'], ['description','Descripción'], ['establishment','Establecimiento'], ['status','Estado']],
    fields: [['description','Nombre de Caja *','text'], ['establishment','Establecimiento','text'], ['status','Estado','text']]
  },
  '/openings-history': {
    parent: 'Caja & Bancos', title: 'Historial de aperturas y cierres de caja', col: 'openings_history',
    columns: [['id','N°'], ['cash_name','Caja'], ['open_date','F. Apertura'], ['close_date','F. Cierre'], ['user','Usuario'], ['initial_balance','S. Inicial'], ['total_income','Ingresos'], ['total_expense','Egresos'], ['final_balance','S. Final'], ['status','Estado']],
    fields: [['cash_name','Caja','text'], ['open_date','Apertura','text'], ['close_date','Cierre','text'], ['final_balance','Saldo Final','number']]
  },
  '/banks': {
    parent: 'Caja & Bancos', title: 'Listado de bancos', col: 'banks',
    columns: [['id','N°'], ['code','Abreviatura'], ['description','Entidad Bancaria / Financiera']],
    fields: [['code','Código (Ej. BCP)','text'], ['description','Nombre del Banco *','text']]
  },
  '/bank-accounts': {
    parent: 'Caja & Bancos', title: 'Cuentas bancarias', col: 'bank_accounts',
    columns: [['id','N°'], ['bank','Banco'], ['description','Descripción'], ['currency','Moneda'], ['holder','Titular'], ['number','Número de Cuenta'], ['cci','C.C.I.']],
    fields: [['bank','Banco *','text'], ['description','Descripción','text'], ['currency','Moneda','text'], ['holder','Titular','text'], ['number','Número de Cuenta *','text'], ['cci','Código CCI','text']]
  },
  '/exchange-rates': {
    parent: 'Caja & Bancos', title: 'Tipo de cambio oficial SUNAT', col: 'exchange_rates',
    columns: [['id','N°'], ['date','Fecha'], ['buy','Compra (S/)'], ['sell','Venta (S/)'], ['source','Fuente']],
    fields: [['date','Fecha (DD/MM/YYYY)','text'], ['buy','Tipo Cambio Compra','number'], ['sell','Tipo Cambio Venta','number'], ['source','Fuente','text']]
  },
  '/concepts': {
    parent: 'Caja & Bancos', title: 'Conceptos de Ingresos y Egresos', col: 'concepts',
    columns: [['id','N°'], ['type','Tipo'], ['name','Nombre del Concepto']],
    fields: [['type','Tipo (Ingreso/Egreso)','text'], ['name','Nombre del Concepto *','text']]
  },

  // CONFIGURACIÓN
  '/abilities': {
    parent: 'Gestión de Usuarios', title: 'Permisos del Sistema', col: 'abilities',
    columns: [['id','N°'], ['module','Módulo'], ['code','Clave Permiso'], ['description','Descripción']],
    fields: [['module','Módulo','text'], ['code','Clave','text'], ['description','Descripción','text']]
  },
  '/roles': {
    parent: 'Gestión de Usuarios', title: 'Roles', col: 'roles',
    columns: [['id','N°'], ['description','Descripción del Rol']],
    fields: [['description','Nombre y alcance del Rol *','text']]
  },
  '/users': {
    parent: 'Gestión de Usuarios', title: 'Usuarios', col: 'users',
    columns: [['id','N°'], ['name','Nombre'], ['email','Email'], ['phone','Teléfono'], ['establishments','Establecimiento(s)'], ['roles','Rol(es)'], ['status','Estado']],
    fields: [['name','Nombre Completo *','text'], ['email','Correo electrónico *','text'], ['phone','Teléfono','text'], ['establishments','Establecimiento','text'], ['roles','Rol','text'], ['status','Estado','text']]
  },
  '/establishments': {
    parent: 'Configuración', title: 'Establecimientos / Sucursales', col: 'establishments',
    columns: [['id','N°'], ['company','Empresa'], ['name','Nombre'], ['code','Código SUNAT'], ['email','Email'], ['phone','Teléfono'], ['address','Dirección']],
    fields: [['company','Empresa','text'], ['name','Nombre Sucursal *','text'], ['code','Código Anexo SUNAT (0000)','text'], ['email','Email','text'], ['phone','Teléfono','text'], ['address','Dirección Fiscal','text']]
  },
  '/security-settings': {
    parent: 'Configuración', title: 'Seguridad estricta y auditoría', col: 'abilities',
    columns: [['id','N°'], ['module','Módulo Protegido'], ['code','Regla de Seguridad'], ['description','Política Aplicada']],
    fields: [['module','Módulo','text'], ['code','Regla','text'], ['description','Descripción','text']]
  },
  '/companies': {
    parent: 'Configuración', title: 'Empresas (Emisor Electrónico SUNAT)', col: 'establishments',
    columns: [['id','N°'], ['company','Razón Social'], ['name','Sede'], ['code','Cód. Establecimiento'], ['email','Correo'], ['address','Domicilio Fiscal']],
    fields: [['company','Razón Social *','text'], ['name','Nombre Comercial','text'], ['code','Código','text'], ['email','Correo','text'], ['address','Dirección','text']]
  },
  '/correlatives': {
    parent: 'Configuración', title: 'Asignación de Correlativos', col: 'correlatives',
    columns: [['id','N°'], ['document_type','Comprobante'], ['series','Serie'], ['start_number','Número actual / a iniciar'], ['establishment','Establecimiento']],
    fields: [['document_type','Tipo de Comprobante *','text'], ['series','Serie (F001/B001/NV01) *','text'], ['start_number','Número a iniciar *','number'], ['establishment','Establecimiento','text']]
  },
  '/downloads-service': {
    parent: 'Sistema', title: 'Bandeja de Descargas Generadas', col: 'downloads',
    columns: [['id','N°'], ['date','Fecha Generación'], ['type','Formato'], ['module','Módulo / Reporte'], ['filename','Archivo'], ['user','Usuario'], ['status','Estado']],
    fields: [['type','Formato','text'], ['module','Módulo','text'], ['filename','Nombre Archivo','text']]
  }
};

// Map all remaining /reports/* and /sire/* routes automatically so every single report has filters, export, and table data
const REPORT_ROUTES = {
  '/reports/purchases': ['Reportes de Compras', 'Reporte General de Compras', 'purchases', [['issue_date','F. Emisión'],['doc_type','Comprobante'],['series_number','Número'],['supplier','Proveedor'],['payment_condition','Condición'],['total','Total (S/)']]],
  '/reports/purchase-price-histories': ['Reportes de Compras', 'Historial de Precios de Compra', 'items', [['internal_code','Código'],['description','Producto'],['supplier','Proveedor'],['purchase_price','Último Costo Compra (S/)'],['sale_price','Precio Venta Actual (S/)']]],
  '/reports/supplier-statement': ['Reportes de Compras', 'Estado de Cuenta de Proveedor', 'debts_payable', [['purchase_date','Fecha'],['document','Documento'],['supplier','Proveedor'],['total_amount','Importe'],['paid_amount','Pagado'],['pending_amount','Saldo']]],
  '/reports/balance-purchase-sale': ['Reportes de Compras', 'Balance Comparativo Compras vs Ventas', 'documents', [['issue_date','Fecha'],['doc_type','Tipo Operación'],['series_number','Documento'],['customer_name','Tercero'],['total','Monto (S/)']]],
  '/reports/sales-kpis': ['Reportes de Ventas', 'Análisis de KPIs de Ventas', 'documents', [['issue_date','Fecha'],['series_number','Comprobante'],['customer_name','Cliente'],['user','Vendedor'],['total','Total Venta (S/)']]],
  '/reports/top-customers': ['Reportes de Ventas', 'Ranking Top Clientes', 'customers', [['number','RUC / DNI'],['name','Cliente'],['phone','Teléfono'],['seller','Vendedor'],['credit_limit','Línea Crédito (S/)']]],
  '/reports/sales-by-seller': ['Reportes de Ventas', 'Ventas en General por Vendedor', 'documents', [['issue_date','Fecha'],['user','Vendedor'],['doc_type','Comprobante'],['series_number','Número'],['customer_name','Cliente'],['total','Total (S/)']]],
  '/seller-dashboard': ['Reportes de Ventas', 'Dashboard de Ventas x Vendedor', 'documents', [['user','Vendedor'],['series_number','Comprobante'],['issue_date','Fecha'],['customer_name','Cliente'],['total','Importe (S/)']]],
  '/reports/sales-details': ['Reportes de Ventas', 'Ventas Detalladas por Ítem', 'items', [['internal_code','Código'],['description','Producto'],['category','Categoría'],['brand','Marca'],['sale_price','P. Unit (S/)'],['stock','Stock Actual']]],
  '/reports/discount-coupons': ['Reportes de Ventas', 'Reporte de Cupones de Descuento', 'discount_coupons', [['code','Cupón'],['description','Campaña'],['type','Tipo'],['value','Valor'],['uses','Usos'],['status','Estado']]],
  '/reports/commissions': ['Reportes de Ventas', 'Comisión de Vendedores', 'users', [['name','Vendedor'],['email','Correo'],['establishments','Establecimiento'],['roles','Cargo'],['status','Estado']]],
  '/reports/debts-receivable': ['Reportes de Ventas', 'Reporte de Cuentas por Cobrar', 'debts_receivable', [['sale_date','Fecha'],['document','Comprobante'],['customer','Cliente'],['total_amount','Total'],['paid_amount','Cobrado'],['pending_amount','Pendiente']]],
  '/reports/orders': ['Reportes de Ventas', 'Consulta de Pedidos y Notas', 'sale_notes', [['issue_date','Fecha'],['series_number','Nota de Venta'],['customer_name','Cliente'],['user','Vendedor'],['status','Estado'],['total','Total (S/)']]],
  '/reports/client-statement': ['Reportes de Ventas', 'Estado de Cuenta Cliente', 'documents', [['issue_date','Fecha'],['series_number','Comprobante'],['customer_name','Cliente'],['payment_condition','Condición'],['status','Estado'],['total','Importe (S/)']]],
  '/reports/consistency-documents': ['Reportes de Ventas', 'Consistencia de Comprobantes Electrónicos', 'correlatives', [['document_type','Tipo Comprobante'],['series','Serie'],['start_number','Último Correlativo'],['establishment','Establecimiento']]],
  '/reports/sales-by-item': ['Reportes de Ventas', 'Ventas Acumuladas por Producto', 'items', [['internal_code','Código'],['description','Producto'],['brand','Marca'],['sale_price','Precio Venta (S/)'],['stock','Stock Restante']]],
  '/reports/product-turnover': ['Reportes de Ventas', 'Índice de Rotación de Productos', 'items', [['internal_code','Código'],['description','Producto'],['category','Categoría'],['stock','Stock Actual'],['min_stock','Stock Mínimo']]],
  '/reports/utility-margins': ['Reportes de Ventas', 'Margen de Utilidad por Producto', 'items', [['internal_code','Código'],['description','Producto'],['purchase_price','Costo (S/)'],['sale_price','P. Venta (S/)'],['utility_pct','Margen Utilidad (%)']]],
  '/reports/sales-costs': ['Reportes de Ventas', 'Costos por Venta', 'items', [['internal_code','Código'],['description','Producto'],['purchase_price','Costo Unit. (S/)'],['sale_price','P. Venta Unit. (S/)']]],
  '/reports/documents': ['Reportes de Ventas', 'Reporte General de Comprobantes', 'documents', [['issue_date','Fecha'],['doc_type','Tipo'],['series_number','Número'],['customer_doc','Doc. Cliente'],['customer_name','Cliente'],['status','Estado SUNAT'],['total','Total (S/)']]],
  '/reports/quotations-report': ['Reportes de Ventas', 'Reporte de Cotizaciones Emitidas', 'quotations', [['issue_date','Fecha'],['series_number','Cotización'],['customer_name','Cliente'],['user','Vendedor'],['status','Estado'],['total','Total (S/)']]],
  '/reports/payments': ['Reportes de Ventas', 'Reporte de Pagos y Cobranzas Recibidas', 'cash_movements', [['date','Fecha'],['doc','Comprobante'],['concept','Concepto'],['method','Medio de Pago'],['user','Cajero'],['amount','Monto (S/)']]],
  '/reports/inventory-adjustment': ['Reportes de Inventario', 'Reporte de Ajustes de Inventario', 'inventory_adjustments', [['date','Fecha'],['code','Código'],['type','Tipo'],['warehouse','Almacén'],['product','Producto'],['quantity','Cantidad']]],
  '/reports/transfers': ['Reportes de Inventario', 'Reporte de Traslados entre Almacenes', 'transfers', [['date','Fecha'],['origin_warehouse','Origen'],['destination_warehouse','Destino'],['responsible','Responsable'],['description','Motivo'],['status','Estado']]],
  '/reports/break-even': ['Contabilidad', 'Costos y gastos · Punto de equilibrio', 'cash_movements', [['date','Fecha'],['type','Clasificación'],['concept','Concepto'],['doc','Referencia'],['amount','Importe (S/)']]],
  '/reports/sales-record': ['Contabilidad', 'Registro de Ventas e Ingresos (Formato 14.1 SUNAT)', 'documents', [['issue_date','F. Emisión'],['doc_type','Tipo Comp.'],['series_number','Serie-Número'],['customer_doc','RUC/DNI'],['customer_name','Razón Social'],['status','Estado'],['total','Importe Total (S/)']]],
  '/sire/sale': ['Contabilidad', 'SIRE SUNAT - RVIE (Registro de Ventas e Ingresos Electrónico)', 'documents', [['issue_date','Periodo / Fecha'],['doc_type','Tipo CPE'],['series_number','Serie - Correlativo'],['customer_doc','Doc. Identidad'],['customer_name','Cliente'],['total','Total CP (S/)']]]
};

Object.entries(REPORT_ROUTES).forEach(([path, [parent, title, col, columns]]) => {
  window.ROUTE_SPECS[path] = {
    parent,
    title,
    col,
    isReport: true,
    columns: [['id', 'N°'], ...columns],
    fields: columns.map(([k, lbl]) => [k, lbl, 'text'])
  };
});

window.GENERIC_SEARCH = '';

window.renderGenericSpecView = function(path, db) {
  const spec = window.ROUTE_SPECS[path];
  if (!spec) {
    return `
      <div>
        ${window.renderBreadcrumb('Módulo', path)}
        <div class="sis-card">Vista activa: <b>${path}</b></div>
      </div>
    `;
  }

  let rows = [...(db[spec.col] || [])];
  if (path === '/reports-stock-alert') {
    rows = rows.filter(r => Number(r.stock || 0) <= Number(r.min_stock || 10));
  }
  if (window.GENERIC_SEARCH) {
    const q = window.GENERIC_SEARCH.toLowerCase();
    rows = rows.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q)));
  }

  const actionsHtml = `
    <button class="btn btn-secondary" onclick="window.exportSpecCSV('${path}')">
      <i data-lucide="download"></i> Exportar
    </button>
    ${spec.createPath ? `
      <button class="btn btn-primary" onclick="window.navigateTo('${spec.createPath}')">
        <i data-lucide="plus-circle"></i> Nuevo
      </button>
    ` : spec.customCreate ? `
      <button class="btn btn-primary" onclick="${spec.customCreate}">
        <i data-lucide="plus-circle"></i> Nuevo
      </button>
    ` : !spec.isReport ? `
      <button class="btn btn-primary" onclick="window.openGenericCreateModal('${path}')">
        <i data-lucide="plus-circle"></i> Nuevo
      </button>
    ` : `
      <button class="btn btn-primary" onclick="window.print()">
        <i data-lucide="printer"></i> Generar PDF / Imprimir
      </button>
    `}
  `;

  return `
    <div>
      ${window.renderBreadcrumb(spec.parent, spec.title, actionsHtml)}

      <div class="sis-card">
        ${spec.isReport ? `
          <div class="form-grid grid-4" style="margin-bottom:14px;">
            <div class="field-group">
              <label class="field-label">Establecimiento</label>
              <select class="sis-select"><option>Principal</option><option>Sucursal Miraflores</option></select>
            </div>
            <div class="field-group">
              <label class="field-label">Desde</label>
              <input type="text" class="sis-input" value="01/10/2026" />
            </div>
            <div class="field-group">
              <label class="field-label">Hasta</label>
              <input type="text" class="sis-input" value="17/11/2026" />
            </div>
            <div class="field-group">
              <label class="field-label">Filtrar rápido</label>
              <input type="text" class="sis-input" placeholder="Buscar..." value="${window.GENERIC_SEARCH}" oninput="window.GENERIC_SEARCH=this.value;window.renderCurrentRoute();" />
            </div>
          </div>
        ` : `
          <div style="display:flex;gap:12px;margin-bottom:14px;">
            <input
              type="text"
              class="sis-input"
              placeholder="Buscar en ${spec.title}..."
              value="${window.GENERIC_SEARCH}"
              oninput="window.GENERIC_SEARCH=this.value;window.renderCurrentRoute();"
            />
          </div>
        `}

        <div class="table-wrap">
          <table class="sis-table">
            <thead>
              <tr>
                ${spec.columns.map(([, label]) => `<th>${label}</th>`).join('')}
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${rows.length === 0 ? `
                <tr>
                  <td colspan="${spec.columns.length + 1}" style="text-align:center;padding:36px;color:var(--text-secondary);">
                    No se encontraron registros.
                  </td>
                </tr>
              ` : rows.map((row, idx) => `
                <tr>
                  ${spec.columns.map(([key], cIdx) => {
                    if (cIdx === 0 && key === 'id') return `<td>${idx + 1}</td>`;
                    const val = row[key];
                    if (key === 'status') {
                      return `<td><span class="badge badge-success">${val || 'Activo'}</span></td>`;
                    }
                    if (key === 'total' || key === 'total_amount' || key === 'sale_price' || key === 'purchase_price' || key === 'amount') {
                      return `<td style="font-weight:700;">S/ ${Number(val || 0).toFixed(2)}</td>`;
                    }
                    return `<td>${val ?? '-'}</td>`;
                  }).join('')}
                  <td>
                    <div style="display:flex;gap:6px;">
                      ${(spec.col === 'documents' || spec.col === 'sale_notes' || spec.col === 'quotations') ? `
                        <button class="btn btn-secondary btn-sm" onclick='window.showTicketModal(${JSON.stringify(row).replace(/'/g, "&#39;")})'>
                          <i data-lucide="printer"></i> PDF/Ticket
                        </button>
                      ` : ''}
                      ${!spec.isReport ? `
                        <button class="btn btn-secondary btn-sm" onclick="window.openGenericCreateModal('${path}', ${row.id})">Editar</button>
                        <button class="btn btn-outline-red btn-sm" onclick="window.deleteRecord('${spec.col}', ${row.id})">Eliminar</button>
                      ` : `
                        <button class="btn btn-secondary btn-sm" onclick="window.showToast('Detalle verificado')">Ver</button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="table-pagination">
          <span>Total ${rows.length}</span>
          <span>&lt;</span>
          <span class="page-num-active">1</span>
          <span>&gt;</span>
        </div>
      </div>
    </div>
  `;
};

window.exportSpecCSV = function(path) {
  const spec = window.ROUTE_SPECS[path];
  if (!spec) return;
  const rows = window.APP_DB[spec.col] || [];
  const headers = spec.columns.map(([, lbl]) => lbl);
  const dataRows = rows.map(r => spec.columns.map(([k]) => r[k] ?? ''));
  window.exportCSV(spec.title.toLowerCase().replace(/\s+/g, '_'), headers, dataRows);
};

window.openGenericCreateModal = function(path, editId = null) {
  const spec = window.ROUTE_SPECS[path];
  if (!spec) return;
  const existing = editId ? (window.APP_DB[spec.col] || []).find(r => Number(r.id) === Number(editId)) : null;

  window.openModal(
    `${editId ? 'Editar' : 'Nuevo'} · ${spec.title}`,
    `
      <div class="form-grid grid-2">
        ${spec.fields.map(([key, label, type]) => `
          <div class="field-group">
            <label class="field-label">${label}</label>
            <input
              id="gen-field-${key}"
              type="${type || 'text'}"
              step="any"
              class="sis-input"
              value="${existing ? (existing[key] ?? '') : ''}"
            />
          </div>
        `).join('')}
      </div>
    `,
    `
      <button class="btn btn-secondary" onclick="window.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.saveGenericModal('${path}', ${editId || 'null'})">Guardar</button>
    `,
    '620px'
  );
};

window.saveGenericModal = async function(path, editId = null) {
  const spec = window.ROUTE_SPECS[path];
  if (!spec) return;
  const payload = {};
  spec.fields.forEach(([key, , type]) => {
    const val = document.getElementById(`gen-field-${key}`)?.value ?? '';
    payload[key] = type === 'number' ? Number(val || 0) : val;
  });

  const url = editId ? `/api/collection/${spec.col}/${editId}` : `/api/collection/${spec.col}`;
  const method = editId ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.closeModal();
    window.renderCurrentRoute();
    window.showToast(editId ? 'Registro actualizado' : 'Registro creado con éxito');
  }
};

window.deleteRecord = async function(col, id) {
  const res = await fetch(`/api/collection/${col}/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.renderCurrentRoute();
    window.showToast('Registro eliminado');
  }
};
