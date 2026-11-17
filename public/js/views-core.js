// Vistas principales de alta precisión: Login, Dashboard, POS, Nuevo Comprobante, Productos (6 pestañas), Nueva Compra, Nueva GRE

window.POS_STATE = {
  search: '',
  docType: 'N. VENTA',
  series: 'NV01',
  customer: '10 - CLIENTES VARIOS',
  condition: 'Contado',
  observations: '',
  paymentMethod: 'Efectivo',
  paymentRef: '',
  cart: []
};

window.DOC_CREATE_STATE = {
  operationType: 'Venta interna',
  docType: 'NOTA DE VENTA',
  series: 'NV01',
  currency: 'Soles',
  exchangeRate: '3.419',
  customer: '10 - CLIENTES VARIOS',
  issueDate: '17/11/2026',
  dueDate: '17/11/2026',
  paymentCondition: 'Contado',
  showOptional: true,
  observations: '',
  warehouse: 'Almacén - Principal',
  plateNumber: '',
  purchaseOrder: '',
  guides: [],
  searchByName: false,
  inlineQty: 1,
  inlineProductSearch: '',
  inlinePresentation: 'Unidades',
  inlinePrice: 0,
  inlineDiscount: 0,
  items: []
};

window.PURCHASE_CREATE_STATE = {
  docType: 'FACTURA ELECTRÓNICA',
  series: 'F001',
  number: '',
  issueDate: '17/11/2026',
  dueDate: '17/11/2026',
  supplier: 'UNILEVER ANDINA PERU S.A.',
  paymentCondition: 'Contado',
  currency: 'Soles',
  exchangeRate: '3.419',
  notes: '',
  inlineQty: 1,
  inlineProduct: "POND'S CLARANT B3 PIEL BALANCEADA A GRASA - 50G",
  inlinePrice: 7.50,
  includesIgv: true,
  items: []
};

window.GRE_CREATE_STATE = {
  docType: 'GUIA DE REMISIÓN ELECTRÓNICA REMITENTE',
  series: 'T001',
  issueDate: '17/11/2026',
  transferDate: '17/11/2026',
  reason: 'Venta',
  transportMode: 'Transporte privado',
  unit: 'kilogramos',
  totalWeight: 5.0,
  packages: 1,
  customer: 'COMERCIALIZADORA COSMÉTICA DEL NORTE E.I.R.L.',
  observations: '',
  originAddress: 'Av. Principal 450 - Lima',
  destAddress: 'Av. Antúnez de Mayolo 1120 - Los Olivos',
  m1Vehicle: false,
  emptyReturn: false,
  driver: 'Carlos Alberto Mendoza Ríos',
  vehicle: 'B4K-892',
  items: []
};

// 1. LOGIN VIEW
window.renderLoginView = function() {
  return `
    <div class="login-screen">
      <div class="login-topbar">
        ${window.renderNyceLogo("window.doLogin(event)")}
        <span class="login-topbar-brand">NYCE STORE</span>
      </div>
      <div class="login-center">
        <form class="login-box" onsubmit="window.doLogin(event)">
          <h1 class="login-title">Bienvenido</h1>
          <p class="login-subtitle">Ingresa a tu cuenta para continuar</p>

          <div class="login-field">
            <div class="login-label-row">
              <span>Correo electrónico</span>
            </div>
            <div class="login-input-wrap">
              <i data-lucide="mail"></i>
              <input id="login-email" type="email" class="login-input" placeholder="tu@correo.com" value="admin@nycestore.com" required />
            </div>
          </div>

          <div class="login-field">
            <div class="login-label-row">
              <span>Contraseña</span>
              <span class="login-forgot" onclick="window.showToast('Se envió enlace de recuperación al correo del administrador')">¿Olvidaste tu contraseña?</span>
            </div>
            <div class="login-input-wrap">
              <i data-lucide="lock"></i>
              <input id="login-password" type="password" class="login-input" value="12345678" required />
              <button type="button" class="eye-btn" onclick="const inp=document.getElementById('login-password');inp.type=inp.type==='password'?'text':'password';">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="login-submit-btn">
            <span>INICIAR SESIÓN</span>
            <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
          </button>

          <div class="login-footer">
            © 2026 Sislii | Construyendo en el futuro digital juntos. Todos los derechos<br/>reservados.
          </div>
        </form>
      </div>
    </div>
  `;
};

window.doLogin = async function(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('login-email')?.value || 'admin@nycestore.com';
  await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  localStorage.setItem('sislii_logged_in', '1');
  window.navigateTo('/dashboard');
};

// 2. DASHBOARD VIEW
window.renderDashboardView = function(db) {
  const todayStr = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const docs = db.documents || [];
  const saleNotes = db.sale_notes || [];

  // Calculate live metrics if new sales were created today (17/11/2026)
  const todaySales = [...docs, ...saleNotes]
    .filter(d => d.issue_date === '17/11/2026' || d.issue_date === todayStr)
    .reduce((sum, d) => sum + Number(d.total || 0), 0);

  const receivableTotal = (db.debts_receivable || []).reduce((s, d) => s + Number(d.pending_amount || 0), 0);
  const payableTotal = (db.debts_payable || []).reduce((s, d) => s + Number(d.pending_amount || 0), 0);

  return `
    <div>
      <!-- Top Title Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
        <div>
          <div class="dash-section-tag">PANEL DE CONTROL</div>
          <div style="color:var(--text-secondary);font-size:13.5px;">Visualiza las ventas, flujo de caja y actividad de tu establecimiento.</div>
        </div>
        <button class="btn btn-outline-red" onclick="window.refreshState().then(()=>window.showToast('Indicadores actualizados'))">
          <i data-lucide="refresh-cw"></i> Actualizar
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="sis-card" style="padding:16px 18px;">
        <div class="form-grid grid-4">
          <div class="field-group">
            <label class="field-label">Establecimiento</label>
            <select class="sis-select">
              ${(db.establishments || []).map(e => `<option>${e.name}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Periodo</label>
            <select class="sis-select">
              <option>Entre meses</option>
              <option>Este mes</option>
              <option>Por fechas</option>
              <option>Este año</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Mes inicial</label>
            <input type="text" class="sis-input" value="01/2026" />
          </div>
          <div class="field-group">
            <label class="field-label">Mes final</label>
            <input type="text" class="sis-input" value="12/2026" />
          </div>
        </div>
      </div>

      <!-- Row 1: Indicadores actuales -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin:18px 0 10px;">
        <div class="dash-section-tag" style="margin:0;">INDICADORES ACTUALES</div>
        <div style="font-size:11.5px;color:var(--text-secondary);">Actualizado al 17/11/2026</div>
      </div>

      <div class="form-grid grid-4" style="margin-bottom:20px;">
        <div class="dash-kpi-card">
          <div class="dash-kpi-icon blue"></div>
          <div>
            <div class="dash-kpi-title">Ventas de hoy</div>
            <div class="dash-kpi-value">S/ ${todaySales.toFixed(2)}</div>
            <div class="dash-kpi-trend up">↑ 100% · frente a ayer</div>
          </div>
        </div>

        <div class="dash-kpi-card">
          <div class="dash-kpi-icon green"></div>
          <div>
            <div class="dash-kpi-title">Ventas del mes</div>
            <div class="dash-kpi-value">S/ ${todaySales.toFixed(2)}</div>
            <div class="dash-kpi-trend down">↓ 100% · mismo día del mes anterior</div>
          </div>
        </div>

        <div class="dash-kpi-card">
          <div class="dash-kpi-icon purple">
            <i data-lucide="receipt" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div class="dash-kpi-title">Ticket promedio</div>
            <div class="dash-kpi-value">S/ ${todaySales.toFixed(2)}</div>
            <div class="dash-kpi-trend down">↓ 100% · mismo día del mes anterior</div>
          </div>
        </div>

        <div class="dash-kpi-card">
          <div class="dash-kpi-icon amber">
            <i data-lucide="clipboard-list" style="width:20px;height:20px;"></i>
          </div>
          <div>
            <div class="dash-kpi-title">Pedidos del mes</div>
            <div class="dash-kpi-value">${todaySales > 0 ? 1 : 0}</div>
            <div class="dash-kpi-trend up">↑ 100% · 0 el mes pasado</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Situación financiera -->
      <div class="dash-section-tag" style="margin:18px 0 10px;">SITUACIÓN FINANCIERA</div>
      <div class="form-grid grid-4" style="margin-bottom:20px;">
        <div class="dash-fin-card border-left-red" onclick="window.navigateTo('/debts/receivable')" style="cursor:pointer;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="dash-kpi-title">Cuentas por cobrar</div>
            <i data-lucide="hand-coins" style="width:17px;height:17px;color:#ef4444;"></i>
          </div>
          <div class="dash-kpi-value" style="margin-top:4px;">S/ ${receivableTotal.toFixed(2)}</div>
          <div style="font-size:11px;color:var(--text-secondary);">Pendiente de tus clientes</div>
        </div>

        <div class="dash-fin-card border-left-amber" onclick="window.navigateTo('/debts/payable')" style="cursor:pointer;">
          <div class="dash-kpi-title">Cuentas por pagar</div>
          <div class="dash-kpi-value" style="margin-top:4px;">S/ ${payableTotal.toFixed(2)}</div>
          <div style="font-size:11px;color:var(--text-secondary);">Pendiente con proveedores</div>
        </div>

        <div class="dash-fin-card">
          <div class="dash-kpi-title">Ventas de ayer</div>
          <div class="dash-kpi-value" style="margin-top:4px;">S/ 0.00</div>
          <div style="font-size:11px;color:var(--text-secondary);">Cierre del día anterior</div>
        </div>

        <div class="dash-fin-card">
          <div class="dash-kpi-title">Ventas del mes pasado</div>
          <div class="dash-kpi-value" style="margin-top:4px;">S/ 878.80</div>
          <div style="font-size:11px;color:var(--text-secondary);">Comparativo mensual</div>
        </div>
      </div>

      <!-- Row 3: Charts Grid -->
      <div style="display:grid;grid-template-columns: 1.9fr 1fr;gap:16px;margin-bottom:16px;">
        <!-- Tendencia / Ventas por mes -->
        <div class="sis-card" style="margin-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
            <div>
              <div class="dash-section-tag">TENDENCIA</div>
              <div style="font-size:18px;font-weight:700;">Ventas por mes</div>
            </div>
            <span style="font-size:11.5px;color:var(--text-secondary);">Periodo seleccionado</span>
          </div>
          <svg viewBox="0 0 700 250" style="width:100%;height:240px;">
            ${[0, 300, 600, 900, 1200, 1500, 1800, 2100].map((val, idx) => {
              const y = 215 - idx * 26;
              return `
                <text x="42" y="${y + 4}" fill="#6b7280" font-size="11" text-anchor="end">${val.toLocaleString()}</text>
                <line x1="54" y1="${y}" x2="680" y2="${y}" stroke="#2e3340" stroke-width="1" />
              `;
            }).join('')}
            <!-- Bar for Oct -->
            <rect x="515" y="45" width="26" height="170" rx="5" fill="#1d63dc" />
            ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'].map((m, i) => `
              <text x="${82 + i * 48.5}" y="236" fill="#6b7280" font-size="11" text-anchor="middle">${m}</text>
            `).join('')}
          </svg>
        </div>

        <!-- Caja / Ingresos y egresos Donut -->
        <div class="sis-card" style="margin-bottom:0;">
          <div class="dash-section-tag">CAJA</div>
          <div style="font-size:18px;font-weight:700;margin-bottom:12px;">Ingresos y egresos</div>
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:230px;">
            <svg viewBox="0 0 340 200" style="width:100%;max-width:330px;height:195px;">
              <!-- Donut Green 54.73% + Orange 45.27% -->
              <circle cx="170" cy="105" r="62" fill="none" stroke="#10b981" stroke-width="23" stroke-dasharray="213 390" stroke-dashoffset="97" />
              <circle cx="170" cy="105" r="62" fill="none" stroke="#ea580c" stroke-width="23" stroke-dasharray="177 390" stroke-dashoffset="-116" />
              <line x1="98" y1="100" x2="75" y2="96" stroke="#ea580c" stroke-width="1.5"/>
              <text x="70" y="92" fill="#ffffff" font-size="11" font-weight="700" text-anchor="end">Egresos</text>
              <text x="70" y="105" fill="#ffffff" font-size="11" font-weight="700" text-anchor="end">45.27%</text>

              <line x1="240" y1="120" x2="262" y2="124" stroke="#10b981" stroke-width="1.5"/>
              <text x="266" y="120" fill="#ffffff" font-size="11" font-weight="700">Ingresos</text>
              <text x="266" y="133" fill="#ffffff" font-size="11" font-weight="700">54.73%</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Row 4: Actividad / Ventas por día & Hora punta -->
      <div style="display:grid;grid-template-columns: 1fr 1fr;gap:16px;">
        <div class="sis-card" style="margin-bottom:0;">
          <div class="dash-section-tag">ACTIVIDAD</div>
          <div style="font-size:18px;font-weight:700;margin-bottom:14px;">Ventas por día</div>
          <svg viewBox="0 0 500 200" style="width:100%;height:190px;">
            ${[0, 200, 400, 600, 800].map((v, idx) => {
              const y = 170 - idx * 36;
              return `
                <text x="34" y="${y+4}" fill="#6b7280" font-size="10.5" text-anchor="end">${v}</text>
                <line x1="44" y1="${y}" x2="480" y2="${y}" stroke="#2e3340" stroke-width="1"/>
              `;
            }).join('')}
            ${[
              { d: 'Dom', h: 62 },
              { d: 'Lun', h: 15 },
              { d: 'Mar', h: 25 },
              { d: 'Mié', h: 95 },
              { d: 'Jue', h: 35 },
              { d: 'Vie', h: 48 },
              { d: 'Sáb', h: 74 }
            ].map((item, idx) => {
              const x = 68 + idx * 58;
              return `
                <rect x="${x}" y="${170 - item.h}" width="22" height="${item.h}" rx="4" fill="#8b5cf6" />
                <text x="${x + 11}" y="190" fill="#6b7280" font-size="11" text-anchor="middle">${item.d}</text>
              `;
            }).join('')}
          </svg>
        </div>

        <div class="sis-card" style="margin-bottom:0;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
            <div>
              <div class="dash-section-tag">FLUJO HORARIO</div>
              <div style="font-size:18px;font-weight:700;">Hora punta</div>
            </div>
            <span class="badge badge-info" style="background:rgba(20,184,166,0.16);color:#2dd4bf;border-color:rgba(20,184,166,0.35);">Hora punta: 10:00</span>
          </div>
          <svg viewBox="0 0 500 200" style="width:100%;height:190px;">
            ${[0, 1, 2, 3, 4].map((v, idx) => {
              const y = 170 - idx * 36;
              return `<line x1="34" y1="${y}" x2="480" y2="${y}" stroke="#2e3340" stroke-width="1"/>`;
            }).join('')}
            <path d="M 50 165 Q 110 45, 165 110 T 280 95 T 390 80 T 470 155" fill="none" stroke="#14b8a6" stroke-width="3" />
            <circle cx="112" cy="76" r="5" fill="#14b8a6" />
            ${['08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'].map((h, i) => `
              <text x="${52 + i * 58}" y="190" fill="#6b7280" font-size="10.5" text-anchor="middle">${h}</text>
            `).join('')}
          </svg>
        </div>
      </div>
    </div>
  `;
};

// 3. PUNTO DE VENTA (POS) VIEW (/pos)
window.renderPosView = function(db) {
  const s = window.POS_STATE;
  const allItems = db.items || [];
  const filtered = allItems.filter(p => {
    if (!s.search) return true;
    const q = s.search.toLowerCase();
    return (p.description || '').toLowerCase().includes(q) ||
           (p.internal_code || '').toLowerCase().includes(q) ||
           (p.barcode || '').toLowerCase().includes(q);
  });

  const cartTotal = s.cart.reduce((sum, c) => sum + Number(c.qty) * Number(c.price), 0);
  const totalCount = s.cart.reduce((sum, c) => sum + Number(c.qty), 0);

  return `
    <div>
      <!-- Top Panel: Agregar productos -->
      <div class="sis-card" style="padding:16px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="font-size:15.5px;font-weight:700;">Agregar productos</div>
          <span style="background:rgba(225,29,72,0.2);color:#f43f5e;font-weight:700;font-size:12px;padding:3px 9px;border-radius:999px;">
            ${filtered.length}
          </span>
        </div>

        <div style="margin-bottom:12px;">
          <input
            type="text"
            class="sis-input"
            style="height:42px;border-color:#e11d48;box-shadow:0 0 0 2px rgba(225,29,72,0.22);"
            placeholder="Buscar..."
            value="${s.search}"
            oninput="window.POS_STATE.search=this.value;window.renderCurrentRoute();"
          />
        </div>

        <div style="max-height:210px;overflow-y:auto;padding-right:4px;">
          ${filtered.map(prod => `
            <div class="pos-product-card" onclick="window.posAddToCart(${prod.id})">
              <div style="display:flex;align-items:center;gap:14px;">
                <div class="pos-prod-thumb">
                  <i data-lucide="package" style="width:28px;height:28px;color:#9ca3af;"></i>
                  <span style="position:absolute;bottom:3px;right:3px;background:#6b7280;color:#fff;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;font-size:9px;">+</span>
                </div>
                <div>
                  <div style="font-weight:700;font-size:13px;color:#ffffff;margin-bottom:5px;">${prod.description}</div>
                  <span style="background:#323846;color:#e5e7eb;font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;">
                    Stock: ${prod.stock}
                  </span>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="text-align:right;">
                  <span style="font-size:11px;color:#9ca3af;font-weight:600;">S/</span>
                  <span style="font-size:15px;font-weight:700;color:#f43f5e;">${Number(prod.sale_price).toFixed(2).replace(/\.00$/, '')}</span>
                </div>
                <button
                  type="button"
                  class="btn btn-sm"
                  style="background:rgba(34,197,94,0.12);border:1px solid #22c55e;color:#22c55e;width:32px;height:30px;padding:0;"
                  onclick="event.stopPropagation();window.posInspectProduct(${prod.id})"
                  title="Ver detalle del producto"
                >
                  <i data-lucide="eye" style="width:15px;height:15px;"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Bottom Panel: Cart & Checkout -->
      <div class="sis-card" style="padding:16px 18px;">
        <div class="sis-card" style="background:var(--bg-card-alt);padding:14px;margin-bottom:14px;">
          <div style="display:grid;grid-template-columns: 2fr 1fr;gap:12px;margin-bottom:12px;">
            <div class="pos-doc-tabs">
              ${['FACTURA', 'BOLETA', 'N. VENTA', 'COTIZACIÓN'].map(t => `
                <button
                  type="button"
                  class="pos-doc-tab ${s.docType === t ? 'active' : ''}"
                  onclick="window.posSetDocType('${t}')"
                >${t}</button>
              `).join('')}
            </div>
            <select class="sis-select" onchange="window.POS_STATE.series=this.value">
              <option value="${s.series}">${s.series}</option>
              <option value="F001">F001</option>
              <option value="B001">B001</option>
              <option value="NV01">NV01</option>
              <option value="CT01">CT01</option>
            </select>
          </div>

          <div style="display:grid;grid-template-columns: 2fr 1fr;gap:12px;margin-bottom:12px;">
            <select class="sis-select" onchange="window.POS_STATE.customer=this.value">
              ${(db.customers || []).map(c => {
                const label = `${c.number} - ${c.name}`;
                return `<option value="${label}" ${s.customer === label ? 'selected' : ''}>${label}</option>`;
              }).join('')}
            </select>
            <button type="button" class="btn btn-primary" style="height:38px;" onclick="window.openCustomerModal()">
              Nuevo cliente
            </button>
          </div>

          <div style="display:grid;grid-template-columns: 1fr 1fr;gap:12px;">
            <select class="sis-select" onchange="window.POS_STATE.condition=this.value">
              <option value="Contado" ${s.condition === 'Contado' ? 'selected' : ''}>Contado</option>
              <option value="Crédito 15 días" ${s.condition === 'Crédito 15 días' ? 'selected' : ''}>Crédito 15 días</option>
              <option value="Crédito 30 días" ${s.condition === 'Crédito 30 días' ? 'selected' : ''}>Crédito 30 días</option>
            </select>
            <input
              type="text"
              class="sis-input"
              placeholder="Observaciones"
              value="${s.observations}"
              oninput="window.POS_STATE.observations=this.value"
            />
          </div>
        </div>

        <!-- Cart Table -->
        <div class="table-wrap" style="min-height:220px;margin-bottom:14px;">
          <table class="sis-table">
            <thead>
              <tr>
                <th>CANTIDAD (${totalCount})</th>
                <th>DESCRIPCIÓN</th>
                <th>PRESENTACIÓN</th>
                <th>PRECIO UNITARIO</th>
                <th>TOTAL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${s.cart.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align:center;padding:56px 12px;color:var(--text-secondary);">
                    Haz clic en un producto de la lista superior para agregarlo a la venta.
                  </td>
                </tr>
              ` : s.cart.map((c, idx) => `
                <tr>
                  <td style="width:130px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.posChangeQty(${idx}, -1)">-</button>
                      <input type="number" class="sis-input" style="width:58px;height:30px;text-align:center;padding:0 4px;" value="${c.qty}" onchange="window.posSetQty(${idx}, this.value)" />
                      <button class="btn btn-secondary btn-sm" onclick="window.posChangeQty(${idx}, 1)">+</button>
                    </div>
                  </td>
                  <td style="font-weight:600;">${c.description}</td>
                  <td>${c.unit || 'Unidades'}</td>
                  <td>
                    <input type="number" step="0.10" class="sis-input" style="width:95px;height:30px;" value="${Number(c.price).toFixed(2)}" onchange="window.posSetPrice(${idx}, this.value)" />
                  </td>
                  <td style="font-weight:700;color:#4ade80;">S/ ${(c.qty * c.price).toFixed(2)}</td>
                  <td>
                    <button class="btn btn-outline-red btn-sm" onclick="window.posRemoveCart(${idx})">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Payment Footer -->
        <div style="display:grid;grid-template-columns: 1fr 1fr 1fr 1.2fr;gap:12px;align-items:end;margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Método de pago</label>
            <select class="sis-select" onchange="window.POS_STATE.paymentMethod=this.value">
              <option>Efectivo</option>
              <option>Yape / Plin</option>
              <option>Tarjeta Visa / Mastercard</option>
              <option>Transferencia BCP / Interbank</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Referencia / N° Operación</label>
            <input type="text" class="sis-input" placeholder="Opcional" oninput="window.POS_STATE.paymentRef=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">Monto recibido</label>
            <input type="number" step="0.10" class="sis-input" value="${cartTotal.toFixed(2)}" />
          </div>
          <div style="background:var(--bg-card-alt);border:1px solid var(--border-color);border-radius:8px;padding:9px 14px;text-align:right;">
            <div style="font-size:12px;color:var(--text-secondary);">${totalCount} artículos · Pagado: <b style="color:#4ade80;">S/ ${cartTotal.toFixed(2)}</b></div>
            <div style="font-size:17px;font-weight:700;color:#ffffff;">TOTAL: S/ ${cartTotal.toFixed(2)}</div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-secondary" onclick="window.POS_STATE.cart=[];window.renderCurrentRoute();">Limpiar</button>
          <button class="btn btn-secondary" onclick="window.posCompleteSale(false)">
            <i data-lucide="save"></i> Guardar F8
          </button>
          <button class="btn btn-primary" onclick="window.posCompleteSale(true)">
            <i data-lucide="printer"></i> Guardar e imprimir F9
          </button>
        </div>
      </div>
    </div>
  `;
};

window.posSetDocType = function(type) {
  window.POS_STATE.docType = type;
  window.POS_STATE.series = type === 'FACTURA' ? 'F001' : type === 'BOLETA' ? 'B001' : type === 'COTIZACIÓN' ? 'CT01' : 'NV01';
  window.renderCurrentRoute();
};

window.posAddToCart = function(prodId) {
  const prod = (window.APP_DB.items || []).find(p => p.id === prodId);
  if (!prod) return;
  const existing = window.POS_STATE.cart.find(c => c.item_id === prod.id);
  if (existing) {
    existing.qty += 1;
  } else {
    window.POS_STATE.cart.push({
      item_id: prod.id,
      description: prod.description,
      unit: prod.unit || 'Unidades',
      qty: 1,
      price: Number(prod.sale_price || 0)
    });
  }
  window.renderCurrentRoute();
};

window.posChangeQty = function(idx, delta) {
  const item = window.POS_STATE.cart[idx];
  if (!item) return;
  item.qty = Math.max(1, Number(item.qty) + delta);
  window.renderCurrentRoute();
};

window.posSetQty = function(idx, val) {
  const item = window.POS_STATE.cart[idx];
  if (!item) return;
  item.qty = Math.max(1, Number(val || 1));
  window.renderCurrentRoute();
};

window.posSetPrice = function(idx, val) {
  const item = window.POS_STATE.cart[idx];
  if (!item) return;
  item.price = Math.max(0, Number(val || 0));
  window.renderCurrentRoute();
};

window.posRemoveCart = function(idx) {
  window.POS_STATE.cart.splice(idx, 1);
  window.renderCurrentRoute();
};

window.posInspectProduct = function(prodId) {
  const p = (window.APP_DB.items || []).find(i => i.id === prodId);
  if (!p) return;
  window.openModal(
    `Ficha del Producto · ${p.internal_code}`,
    `
      <div class="form-grid grid-2">
        <div><b>Descripción:</b> ${p.description}</div>
        <div><b>Marca / Categoría:</b> ${p.brand} / ${p.category}</div>
        <div><b>Código de Barras:</b> ${p.barcode}</div>
        <div><b>Ubicación:</b> ${p.location || 'Estante A-1'}</div>
        <div><b>Stock Disponible:</b> <span class="badge badge-success">${p.stock} ${p.unit}</span></div>
        <div><b>Precio Venta:</b> <b style="color:#f43f5e;">S/ ${Number(p.sale_price).toFixed(2)}</b></div>
        <div><b>Precio Mínimo:</b> S/ ${Number(p.min_sale_price || p.sale_price).toFixed(2)}</div>
        <div><b>Almacén:</b> ${p.warehouse || 'Almacén - Principal'}</div>
      </div>
    `,
    `<button class="btn btn-primary" onclick="window.posAddToCart(${p.id});window.closeModal()">Agregar al carrito</button>`,
    '540px'
  );
};

window.posCompleteSale = async function(printTicket) {
  const s = window.POS_STATE;
  if (s.cart.length === 0) {
    window.showToast('Agrega al menos un producto para registrar la venta', 'warning');
    return;
  }
  const total = s.cart.reduce((sum, c) => sum + c.qty * c.price, 0);
  const res = await fetch('/api/sale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_category: s.docType,
      series: s.series,
      customer_name: s.customer,
      payment_condition: s.condition,
      payment_method: s.paymentMethod,
      observations: s.observations,
      total,
      items: s.cart.map(c => ({ ...c, total: c.qty * c.price }))
    })
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.POS_STATE.cart = [];
    window.renderCurrentRoute();
    window.showToast(`Comprobante ${data.record.series_number} emitido con éxito`);
    if (printTicket) {
      window.showTicketModal(data.record);
    }
  }
};

// 4. NUEVO COMPROBANTE (/documents/create) - Exact match to final_step_70.png
window.renderDocumentCreateView = function(db) {
  const s = window.DOC_CREATE_STATE;
  const total = s.items.reduce((sum, i) => sum + (i.qty * i.price - (i.discount || 0)), 0);

  return `
    <div>
      ${window.renderBreadcrumb('Comprobantes', 'Nuevo comprobante', '', '/documents')}

      <!-- Top Form Card -->
      <div class="sis-card">
        <div class="form-grid grid-2" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Tipo Operación</label>
            <select class="sis-select" onchange="window.DOC_CREATE_STATE.operationType=this.value">
              <option>Venta interna</option>
              <option>Exportación de bienes</option>
              <option>Operación sujeta a detracción</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Tipo de comprobante</label>
            <select class="sis-select" onchange="window.docCreateChangeType(this.value)">
              <option value="NOTA DE VENTA" ${s.docType === 'NOTA DE VENTA' ? 'selected' : ''}>NOTA DE VENTA</option>
              <option value="FACTURA ELECTRÓNICA" ${s.docType === 'FACTURA ELECTRÓNICA' ? 'selected' : ''}>FACTURA ELECTRÓNICA</option>
              <option value="BOLETA DE VENTA ELECTRÓNICA" ${s.docType === 'BOLETA DE VENTA ELECTRÓNICA' ? 'selected' : ''}>BOLETA DE VENTA ELECTRÓNICA</option>
            </select>
          </div>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Serie</label>
            <select class="sis-select" onchange="window.DOC_CREATE_STATE.series=this.value">
              <option value="${s.series}">${s.series}</option>
              <option value="NV01">NV01</option>
              <option value="B001">B001</option>
              <option value="F001">F001</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Moneda</label>
            <select class="sis-select" onchange="window.DOC_CREATE_STATE.currency=this.value">
              <option>Soles</option>
              <option>Dólares</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Tipo de cambio</label>
            <input type="text" class="sis-input" value="${s.exchangeRate}" onchange="window.DOC_CREATE_STATE.exchangeRate=this.value" />
          </div>
        </div>

        <div class="field-group" style="margin-bottom:14px;">
          <label class="field-label">
            Cliente <span class="link-new" onclick="window.openCustomerModal()">[+ Nuevo]</span>
          </label>
          <select class="sis-select" onchange="window.DOC_CREATE_STATE.customer=this.value">
            ${(db.customers || []).map(c => {
              const label = `${c.number} - ${c.name}`;
              return `<option value="${label}" ${s.customer === label ? 'selected' : ''}>${label}</option>`;
            }).join('')}
          </select>
        </div>

        <div class="form-grid grid-3" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Fecha de emisión</label>
            <input type="text" class="sis-input" value="${s.issueDate}" onchange="window.DOC_CREATE_STATE.issueDate=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">Fecha Vcto.</label>
            <input type="text" class="sis-input" value="${s.dueDate}" onchange="window.DOC_CREATE_STATE.dueDate=this.value" />
          </div>
          <div class="field-group">
            <label class="field-label">Condición de pago</label>
            <select class="sis-select" onchange="window.DOC_CREATE_STATE.paymentCondition=this.value">
              <option value="Contado">Contado</option>
              <option value="Crédito 15 días">Crédito 15 días</option>
              <option value="Crédito 30 días">Crédito 30 días</option>
            </select>
          </div>
        </div>

        <div style="border-top:1px solid var(--border-subtle);padding-top:10px;">
          <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:10px;cursor:pointer;" onclick="window.DOC_CREATE_STATE.showOptional=!window.DOC_CREATE_STATE.showOptional;window.renderCurrentRoute();">
            <span style="font-size:12px;color:var(--text-secondary);">Observaciones, guía y otros datos</span>
            <span class="badge badge-neutral" style="font-size:10.5px;">Opcional</span>
            <i data-lucide="${s.showOptional ? 'chevron-up' : 'chevron-down'}" style="width:14px;height:14px;color:var(--text-secondary);"></i>
          </div>

          ${s.showOptional ? `
            <div class="sis-card" style="background:var(--bg-card-alt);margin-bottom:0;">
              <div class="field-group" style="margin-bottom:12px;">
                <label class="field-label">Observaciones</label>
                <input type="text" class="sis-input" value="${s.observations}" oninput="window.DOC_CREATE_STATE.observations=this.value" />
              </div>
              <div class="form-grid grid-3" style="margin-bottom:14px;">
                <div class="field-group">
                  <label class="field-label">Almacenes</label>
                  <select class="sis-select">
                    ${(db.warehouses || []).map(w => `<option>${w.name}</option>`).join('')}
                  </select>
                </div>
                <div class="field-group">
                  <label class="field-label">Número de placa</label>
                  <input type="text" class="sis-input" value="${s.plateNumber}" oninput="window.DOC_CREATE_STATE.plateNumber=this.value" />
                </div>
                <div class="field-group">
                  <label class="field-label">Orden de compra</label>
                  <input type="text" class="sis-input" value="${s.purchaseOrder}" oninput="window.DOC_CREATE_STATE.purchaseOrder=this.value" />
                </div>
              </div>
              <button type="button" class="btn btn-amber" onclick="window.showToast('Guía de remisión vinculada al comprobante')">
                Agregar guía
              </button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Bottom Card: Productos -->
      <div class="sis-card">
        <div style="margin-bottom:14px;">
          <div style="display:flex;align-items:baseline;gap:8px;">
            <span style="font-size:15.5px;font-weight:700;">Productos</span>
            <span style="font-size:12px;color:var(--text-secondary);">${s.items.length} ítems</span>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);">Busca por nombre o escanea el código del producto.</div>
        </div>

        <div class="sis-card" style="background:var(--bg-card-alt);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:14px;">
            <div>
              <div style="font-weight:600;font-size:12.5px;">Búsqueda por nombre</div>
              <div style="font-size:11.5px;color:var(--text-secondary);">Selección manual</div>
            </div>
            <button type="button" class="sis-switch ${s.searchByName ? 'on' : ''}" onclick="window.DOC_CREATE_STATE.searchByName=!window.DOC_CREATE_STATE.searchByName;window.renderCurrentRoute();"></button>
          </div>
          <button type="button" class="btn btn-secondary" onclick="window.showToast('Plantilla de importación lista')">
            <i data-lucide="upload"></i> Importar
          </button>
        </div>

        <!-- Inline Add Row -->
        <div class="sis-card" style="background:var(--bg-card-alt);padding:14px 16px;margin-bottom:14px;">
          <div class="form-grid grid-2" style="margin-bottom:12px;">
            <div class="field-group">
              <label class="field-label">Cantidad</label>
              <input id="doc-inline-qty" type="number" class="sis-input" value="1" min="1" />
            </div>
            <div class="field-group">
              <label class="field-label">Producto</label>
              <select id="doc-inline-prod" class="sis-select" onchange="const p=(window.APP_DB.items||[]).find(x=>x.id===Number(this.value));if(p)document.getElementById('doc-inline-price').value=p.sale_price;">
                <option value="">Buscar...</option>
                ${(db.items || []).map(p => `<option value="${p.id}">${p.internal_code} - ${p.description} (Stock: ${p.stock})</option>`).join('')}
              </select>
            </div>
          </div>
          <div style="display:grid;grid-template-columns: 1fr 1fr auto;gap:12px;align-items:end;">
            <div class="field-group">
              <label class="field-label">Presentación</label>
              <select id="doc-inline-unit" class="sis-select">
                <option>Seleccionar</option>
                <option selected>Unidades</option>
                <option>Caja</option>
                <option>Paquete</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Precio Unit.</label>
              <input id="doc-inline-price" type="number" step="0.10" class="sis-input" value="12.00" />
            </div>
            <button type="button" class="btn btn-primary" style="height:38px;" onclick="window.docCreateAddItem()">
              <i data-lucide="plus"></i> Agregar
            </button>
          </div>
        </div>

        <!-- 8-col Items Table -->
        <div class="table-wrap" style="margin-bottom:16px;">
          <table class="sis-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>CANT.</th>
                <th>DESCRIPCIÓN</th>
                <th>PRESENTACIÓN</th>
                <th>PRECIO UNIT.</th>
                <th>DSCTO.</th>
                <th>TOTAL</th>
                <th>OPCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${s.items.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align:center;padding:28px;color:var(--text-secondary);">Sin productos agregados</td>
                </tr>
              ` : s.items.map((it, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td>${it.qty}</td>
                  <td style="font-weight:600;">${it.description}</td>
                  <td>${it.unit}</td>
                  <td>S/ ${Number(it.price).toFixed(2)}</td>
                  <td>S/ 0.00</td>
                  <td style="font-weight:700;color:#4ade80;">S/ ${(it.qty * it.price).toFixed(2)}</td>
                  <td>
                    <button class="btn btn-outline-red btn-sm" onclick="window.DOC_CREATE_STATE.items.splice(${idx},1);window.renderCurrentRoute();">
                      <i data-lucide="trash-2"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:10px;border-top:1px solid var(--border-color);">
          <div style="font-size:16px;font-weight:700;">Total a Pagar: <span style="color:#f43f5e;">S/ ${total.toFixed(2)}</span></div>
          <div style="display:flex;gap:10px;">
            <button type="button" class="btn btn-secondary" onclick="window.navigateTo('/documents')">Cancelar</button>
            <button type="button" class="btn btn-primary" onclick="window.docCreateSubmit()">
              <i data-lucide="check"></i> Generar comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.docCreateChangeType = function(val) {
  window.DOC_CREATE_STATE.docType = val;
  window.DOC_CREATE_STATE.series = val.includes('FACTURA') ? 'F001' : val.includes('BOLETA') ? 'B001' : 'NV01';
  window.renderCurrentRoute();
};

window.docCreateAddItem = function() {
  const prodSelect = document.getElementById('doc-inline-prod');
  const qty = Number(document.getElementById('doc-inline-qty')?.value || 1);
  const price = Number(document.getElementById('doc-inline-price')?.value || 12);
  const unit = document.getElementById('doc-inline-unit')?.value || 'Unidades';
  const prodId = Number(prodSelect?.value || 1);
  const prod = (window.APP_DB.items || []).find(p => p.id === prodId) || (window.APP_DB.items || [])[0];
  if (!prod) return;

  window.DOC_CREATE_STATE.items.push({
    item_id: prod.id,
    description: prod.description,
    qty,
    unit,
    price,
    total: qty * price
  });
  window.renderCurrentRoute();
};

window.docCreateSubmit = async function() {
  const s = window.DOC_CREATE_STATE;
  if (s.items.length === 0) {
    window.showToast('Agrega al menos un producto al comprobante', 'warning');
    return;
  }
  const total = s.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const res = await fetch('/api/sale', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doc_category: s.docType,
      series: s.series,
      customer_name: s.customer,
      issue_date: s.issueDate,
      payment_condition: s.paymentCondition,
      currency: s.currency,
      total,
      items: s.items
    })
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.DOC_CREATE_STATE.items = [];
    window.showToast(`Comprobante ${data.record.series_number} generado correctamente`);
    window.showTicketModal(data.record);
    window.navigateTo(s.docType === 'NOTA DE VENTA' ? '/sale-notes' : '/documents');
  }
};

// 5. PRODUCTOS VIEW (/items) + 6-TAB MODAL NUEVO PRODUCTO
window.ITEMS_FILTER = {
  category: '',
  brand: '',
  discontinued: 'Todos',
  sortBy: 'Nombre',
  order: 'Ascendente',
  search: ''
};

window.renderItemsView = function(db) {
  const f = window.ITEMS_FILTER;
  let list = [...(db.items || [])];
  if (f.category) list = list.filter(i => i.category === f.category);
  if (f.brand) list = list.filter(i => i.brand === f.brand);
  if (f.search) {
    const q = f.search.toLowerCase();
    list = list.filter(i =>
      (i.description || '').toLowerCase().includes(q) ||
      (i.internal_code || '').toLowerCase().includes(q) ||
      (i.barcode || '').toLowerCase().includes(q)
    );
  }

  return `
    <div>
      ${window.renderBreadcrumb(
        'Productos',
        '',
        `
          <button class="btn btn-primary" onclick="window.exportCSV('productos_nycestore', ['COD_INTERNO','COD_BARRAS','CATEGORIA','MARCA','DESCRIPCION','STOCK','PRECIO_COMPRA','PRECIO_VENTA'], (window.APP_DB.items||[]).map(i=>[i.internal_code,i.barcode,i.category,i.brand,i.description,i.stock,i.purchase_price,i.sale_price]))">
            <i data-lucide="upload"></i> Importar
          </button>
          <button class="btn btn-primary" onclick="window.openProductModal()">
            <i data-lucide="plus-circle"></i> Nuevo
          </button>
        `
      )}

      <div class="sis-card">
        <div class="form-grid grid-5" style="margin-bottom:14px;">
          <div class="field-group">
            <label class="field-label">Categoría</label>
            <select class="sis-select" onchange="window.ITEMS_FILTER.category=this.value;window.renderCurrentRoute();">
              <option value="">Seleccionar</option>
              ${(db.categories || []).map(c => `<option value="${c.name}" ${f.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Marca</label>
            <select class="sis-select" onchange="window.ITEMS_FILTER.brand=this.value;window.renderCurrentRoute();">
              <option value="">Marca</option>
              ${(db.brands || []).map(b => `<option value="${b.name}" ${f.brand === b.name ? 'selected' : ''}>${b.name}</option>`).join('')}
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Descontinuado</label>
            <select class="sis-select">
              <option>Todos</option>
              <option>Activos</option>
              <option>Descontinuados</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Ordenar por:</label>
            <select class="sis-select">
              <option>Nombre</option>
              <option>Stock</option>
              <option>Precio Venta</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Orden</label>
            <select class="sis-select">
              <option>Ascendente</option>
              <option>Descendente</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:14px;">
          <input
            type="text"
            class="sis-input"
            placeholder="Buscar..."
            value="${f.search}"
            oninput="window.ITEMS_FILTER.search=this.value;window.renderCurrentRoute();"
          />
        </div>

        <div class="table-wrap">
          <table class="sis-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>CÓD. INTERNO</th>
                <th>CÓD. BARRAS</th>
                <th>CATEGORÍA</th>
                <th>MARCA</th>
                <th>DESCRIPCIÓN</th>
                <th>NOMBRE COMERCIAL</th>
                <th>MODELO</th>
                <th>UBICACION</th>
                <th>STOCK</th>
                <th>P. UNIT. COMPRA</th>
                <th>P. UNIT. VENTA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((item, idx) => `
                <tr>
                  <td>${idx + 1}</td>
                  <td><span class="badge badge-neutral">${item.internal_code || '-'}</span></td>
                  <td>${item.barcode || '-'}</td>
                  <td>${item.category || '-'}</td>
                  <td>${item.brand || '-'}</td>
                  <td style="font-weight:600;">${item.description}</td>
                  <td>${item.trade_name || '-'}</td>
                  <td>${item.model || '-'}</td>
                  <td>${item.location || '-'}</td>
                  <td>
                    <span class="badge ${Number(item.stock) <= Number(item.min_stock || 8) ? 'badge-danger' : 'badge-success'}">
                      ${item.stock}
                    </span>
                  </td>
                  <td>S/ ${Number(item.purchase_price || 0).toFixed(2)}</td>
                  <td style="font-weight:700;color:#f43f5e;">S/ ${Number(item.sale_price || 0).toFixed(2)}</td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.openProductModal(${item.id})">Editar</button>
                      <button class="btn btn-outline-red btn-sm" onclick="window.deleteRecord('items', ${item.id})">Eliminar</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="table-pagination">
          <span>Total ${list.length}</span>
          <span>&lt;</span>
          <span class="page-num-active">1</span>
          <span>&gt;</span>
        </div>
      </div>
    </div>
  `;
};

window.PRODUCT_MODAL_TAB = 1;
window.openProductModal = function(editId = null) {
  window.PRODUCT_MODAL_TAB = 1;
  const db = window.APP_DB;
  const existing = editId ? (db.items || []).find(i => i.id === editId) : null;
  window.CURRENT_EDIT_PRODUCT = existing ? { ...existing } : {
    internal_code: `P00${(db.items?.length || 20) + 1}`,
    barcode: '7501056399901',
    sunat_code: '53131608',
    category: 'Cuidado Facial',
    brand: "POND'S",
    description: '',
    trade_name: '',
    model: '',
    unit: 'Unidades',
    min_stock: 10,
    stock: 20,
    warehouse: 'Almacén - Principal',
    location: 'Estante A-1',
    purchase_price: 10.00,
    utility_pct: 50.0,
    sale_price: 15.00,
    min_sale_price: 13.50,
    supplier: 'UNILEVER ANDINA PERU S.A.'
  };
  window.renderProductModalContent(editId);
};

window.renderProductModalContent = function(editId = null) {
  const db = window.APP_DB;
  const p = window.CURRENT_EDIT_PRODUCT;
  const tab = window.PRODUCT_MODAL_TAB;

  const tabsHtml = `
    <div class="sis-tabs">
      ${[
        [1, 'Datos'],
        [2, 'Códigos e Inventario'],
        [3, 'Precios'],
        [4, 'Proveedor'],
        [5, 'Combo/Pack'],
        [6, 'Variantes']
      ].map(([num, label]) => `
        <button type="button" class="sis-tab-btn ${tab === num ? 'active' : ''}" onclick="window.PRODUCT_MODAL_TAB=${num};window.renderProductModalContent(${editId || 'null'})">
          ${label}
        </button>
      `).join('')}
    </div>
  `;

  let tabBody = '';
  if (tab === 1) {
    tabBody = `
      <div class="form-grid grid-2">
        <div class="field-group">
          <label class="field-label">Tipo</label>
          <select class="sis-select"><option>Producto</option><option>Servicio</option></select>
        </div>
        <div class="field-group">
          <label class="field-label">Categoría <span class="link-new" onclick="window.navigateTo('/categories');window.closeModal()">[+ Nuevo]</span></label>
          <select class="sis-select" onchange="window.CURRENT_EDIT_PRODUCT.category=this.value">
            ${(db.categories || []).map(c => `<option value="${c.name}" ${p.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Marca <span class="link-new" onclick="window.navigateTo('/brands/items');window.closeModal()">[+ Nuevo]</span></label>
          <select class="sis-select" onchange="window.CURRENT_EDIT_PRODUCT.brand=this.value">
            ${(db.brands || []).map(b => `<option value="${b.name}" ${p.brand === b.name ? 'selected' : ''}>${b.name}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Nombre / Descripción *</label>
          <input type="text" class="sis-input" value="${p.description}" oninput="window.CURRENT_EDIT_PRODUCT.description=this.value" placeholder="Ej. POND'S CLARANT B3 50G" />
        </div>
        <div class="field-group">
          <label class="field-label">Nombre comercial</label>
          <input type="text" class="sis-input" value="${p.trade_name || ''}" oninput="window.CURRENT_EDIT_PRODUCT.trade_name=this.value" />
        </div>
        <div class="field-group">
          <label class="field-label">Modelo</label>
          <input type="text" class="sis-input" value="${p.model || ''}" oninput="window.CURRENT_EDIT_PRODUCT.model=this.value" />
        </div>
      </div>
    `;
  } else if (tab === 2) {
    tabBody = `
      <div class="form-grid grid-3">
        <div class="field-group">
          <label class="field-label">Cód. Interno</label>
          <input type="text" class="sis-input" value="${p.internal_code || ''}" oninput="window.CURRENT_EDIT_PRODUCT.internal_code=this.value" />
        </div>
        <div class="field-group">
          <label class="field-label">Código de barras</label>
          <input type="text" class="sis-input" value="${p.barcode || ''}" oninput="window.CURRENT_EDIT_PRODUCT.barcode=this.value" />
        </div>
        <div class="field-group">
          <label class="field-label">Código Sunat</label>
          <input type="text" class="sis-input" value="${p.sunat_code || '53131608'}" oninput="window.CURRENT_EDIT_PRODUCT.sunat_code=this.value" />
        </div>
        <div class="field-group">
          <label class="field-label">Unidad de medida</label>
          <select class="sis-select" onchange="window.CURRENT_EDIT_PRODUCT.unit=this.value">
            ${(db.unit_types || []).map(u => `<option value="${u.description}" ${p.unit === u.description ? 'selected' : ''}>${u.description}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Stock Mínimo</label>
          <input type="number" class="sis-input" value="${p.min_stock || 10}" oninput="window.CURRENT_EDIT_PRODUCT.min_stock=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">Stock Inicial / Actual</label>
          <input type="number" class="sis-input" value="${p.stock || 0}" oninput="window.CURRENT_EDIT_PRODUCT.stock=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">Almacén</label>
          <select class="sis-select" onchange="window.CURRENT_EDIT_PRODUCT.warehouse=this.value">
            ${(db.warehouses || []).map(w => `<option value="${w.name}">${w.name}</option>`).join('')}
          </select>
        </div>
        <div class="field-group">
          <label class="field-label">Ubicación en almacén</label>
          <input type="text" class="sis-input" value="${p.location || ''}" oninput="window.CURRENT_EDIT_PRODUCT.location=this.value" />
        </div>
        <div class="field-group">
          <label class="field-label">Afectación IGV (Venta)</label>
          <select class="sis-select"><option>Gravado - Operación Onerosa (18%)</option><option>Exonerado - Operación Onerosa</option></select>
        </div>
      </div>
    `;
  } else if (tab === 3) {
    tabBody = `
      <div class="form-grid grid-3" style="margin-bottom:14px;">
        <div class="field-group">
          <label class="field-label">Moneda</label>
          <select class="sis-select"><option>Soles</option><option>Dólares</option></select>
        </div>
        <div class="field-group">
          <label class="field-label">Precio Compra (S/)</label>
          <input type="number" step="0.10" class="sis-input" value="${p.purchase_price}" oninput="window.CURRENT_EDIT_PRODUCT.purchase_price=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">Utilidad (%)</label>
          <input type="number" step="0.5" class="sis-input" value="${p.utility_pct || 50}" oninput="window.CURRENT_EDIT_PRODUCT.utility_pct=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">Precio Venta (S/) *</label>
          <input type="number" step="0.10" class="sis-input" value="${p.sale_price}" oninput="window.CURRENT_EDIT_PRODUCT.sale_price=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">Precio mínimo venta</label>
          <input type="number" step="0.10" class="sis-input" value="${p.min_sale_price || p.sale_price}" oninput="window.CURRENT_EDIT_PRODUCT.min_sale_price=Number(this.value)" />
        </div>
        <div class="field-group">
          <label class="field-label">¿Incluye IGV?</label>
          <select class="sis-select"><option>Sí</option><option>No</option></select>
        </div>
      </div>
      <div style="font-weight:600;margin-bottom:8px;">Lista de precios por presentación</div>
      <div class="table-wrap">
        <table class="sis-table">
          <thead>
            <tr><th>Lista P.</th><th>Unidad</th><th>Factor</th><th>Precio compra</th><th>Utilidad (%)</th><th>Precio venta</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Mayorista</td><td>Docena (12)</td><td>12</td>
              <td>S/ ${(Number(p.purchase_price)*12).toFixed(2)}</td><td>40%</td>
              <td>S/ ${(Number(p.sale_price)*12*0.9).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 4) {
    tabBody = `
      <div class="field-group">
        <label class="field-label">Proveedor habitual <span class="link-new" onclick="window.navigateTo('/persons/suppliers');window.closeModal()">[+ Nuevo]</span></label>
        <select class="sis-select" onchange="window.CURRENT_EDIT_PRODUCT.supplier=this.value">
          ${(db.suppliers || []).map(s => `<option value="${s.name}" ${p.supplier === s.name ? 'selected' : ''}>${s.number} - ${s.name}</option>`).join('')}
        </select>
      </div>
    `;
  } else {
    tabBody = `
      <div style="padding:18px;text-align:center;color:var(--text-secondary);">
        Configuración de ${tab === 5 ? 'productos que conforman el Combo/Pack promocional' : 'variantes de Tallas y Colores con código de barras independiente'}.
      </div>
    `;
  }

  window.openModal(
    editId ? `Editar producto · ${p.internal_code}` : 'Nuevo producto',
    `${tabsHtml}${tabBody}`,
    `
      <button class="btn btn-secondary" onclick="window.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.saveProductModal(${editId || 'null'})">Guardar</button>
    `,
    '840px'
  );
};

window.saveProductModal = async function(editId = null) {
  const p = window.CURRENT_EDIT_PRODUCT;
  if (!p.description) {
    window.showToast('Ingresa el nombre/descripción del producto', 'warning');
    return;
  }
  const url = editId ? `/api/collection/items/${editId}` : '/api/collection/items';
  const method = editId ? 'PUT' : 'POST';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p)
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.closeModal();
    window.renderCurrentRoute();
    window.showToast(editId ? 'Producto actualizado' : 'Producto registrado exitosamente');
  }
};

// 6. MODAL NUEVO CLIENTE / PROVEEDOR CON CONSULTA SUNAT/RENIEC
window.openCustomerModal = function(isSupplier = false) {
  window.openModal(
    isSupplier ? 'Nuevo proveedor' : 'Nuevo cliente',
    `
      <div class="form-grid grid-3" style="margin-bottom:12px;">
        <div class="field-group">
          <label class="field-label">Tipo Doc. Identidad</label>
          <select id="cust-doc-type" class="sis-select">
            <option value="RUC">RUC (11 dígitos)</option>
            <option value="DNI" ${!isSupplier ? 'selected' : ''}>DNI (8 dígitos)</option>
            <option value="CE">Carnet de Extranjería</option>
          </select>
        </div>
        <div class="field-group" style="grid-column: span 2;">
          <label class="field-label">Número (Consulta directa SUNAT / RENIEC)</label>
          <div style="display:flex;gap:8px;">
            <input id="cust-number" type="text" class="sis-input" placeholder="Ingresa DNI o RUC..." />
            <button type="button" class="btn btn-primary" onclick="window.lookupSunatReniec()">
              <i data-lucide="search"></i> SUNAT/RENIEC
            </button>
          </div>
        </div>
      </div>
      <div class="form-grid grid-2" style="margin-bottom:12px;">
        <div class="field-group">
          <label class="field-label">Nombre / Razón Social *</label>
          <input id="cust-name" type="text" class="sis-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Nombre comercial</label>
          <input id="cust-trade" type="text" class="sis-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Departamento / Provincia / Distrito</label>
          <input id="cust-ubigeo" type="text" class="sis-input" value="LIMA / LIMA / LIMA" />
        </div>
        <div class="field-group">
          <label class="field-label">Dirección fiscal</label>
          <input id="cust-address" type="text" class="sis-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Teléfono / Celular</label>
          <input id="cust-phone" type="text" class="sis-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Correo electrónico</label>
          <input id="cust-email" type="email" class="sis-input" />
        </div>
        <div class="field-group">
          <label class="field-label">Vendedor asignado</label>
          <select id="cust-seller" class="sis-select"><option>Principal</option><option>Caja Ventas 01</option></select>
        </div>
        <div class="field-group">
          <label class="field-label">Límite de crédito (S/)</label>
          <input id="cust-credit" type="number" class="sis-input" value="1000" />
        </div>
      </div>
    `,
    `
      <button class="btn btn-secondary" onclick="window.closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.saveCustomerModal(${isSupplier})">Guardar</button>
    `,
    '720px'
  );
};

window.lookupSunatReniec = async function() {
  const num = document.getElementById('cust-number')?.value?.trim();
  if (!num) {
    window.showToast('Ingresa un número de DNI o RUC', 'warning');
    return;
  }
  const res = await fetch(`/api/lookup/${encodeURIComponent(num)}`);
  const json = await res.json();
  if (json.ok && json.data) {
    document.getElementById('cust-doc-type').value = json.data.doc_type || 'RUC';
    document.getElementById('cust-name').value = json.data.name || '';
    document.getElementById('cust-trade').value = json.data.trade_name || '';
    document.getElementById('cust-address').value = json.data.address || '';
    window.showToast('Datos obtenidos desde padrón SUNAT / RENIEC');
  }
};

window.saveCustomerModal = async function(isSupplier = false) {
  const payload = {
    doc_type: document.getElementById('cust-doc-type')?.value || 'DNI',
    number: document.getElementById('cust-number')?.value || '00000000',
    name: document.getElementById('cust-name')?.value || 'CLIENTE NUEVO',
    trade_name: document.getElementById('cust-trade')?.value || '',
    address: document.getElementById('cust-address')?.value || '-',
    phone: document.getElementById('cust-phone')?.value || '-',
    email: document.getElementById('cust-email')?.value || '-',
    seller: document.getElementById('cust-seller')?.value || 'Principal',
    credit_limit: Number(document.getElementById('cust-credit')?.value || 0)
  };
  const col = isSupplier ? 'suppliers' : 'customers';
  const res = await fetch(`/api/collection/${col}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (data.ok) {
    window.APP_DB = data.db;
    window.closeModal();
    window.renderCurrentRoute();
    window.showToast(isSupplier ? 'Proveedor registrado' : 'Cliente registrado');
  }
};
