// Controlador principal de Sislii (NYCE STORE)
window.APP_DB = {};
window.UI_STATE = {
  sidebarOpen: false,
  sidebarPinned: false,
  expandedMenus: { reportes: true },
  expandedSubMenus: {},
  userMenuOpen: false,
  fontPercent: 90,
  theme: 'dark'
};

window.refreshState = async function() {
  const res = await fetch('/api/state');
  window.APP_DB = await res.json();
  window.renderCurrentRoute();
};

window.navigateTo = function(path) {
  window.GENERIC_SEARCH = '';
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  window.UI_STATE.sidebarOpen = false;
  window.UI_STATE.userMenuOpen = false;
  window.renderCurrentRoute();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('popstate', () => {
  window.renderCurrentRoute();
});

window.toggleSidebarDrawer = function() {
  window.UI_STATE.sidebarOpen = !window.UI_STATE.sidebarOpen;
  window.renderCurrentRoute();
};

window.toggleMenuGroup = function(id) {
  window.UI_STATE.expandedMenus[id] = !window.UI_STATE.expandedMenus[id];
  window.renderCurrentRoute();
};

window.toggleSubMenuGroup = function(id) {
  window.UI_STATE.expandedSubMenus[id] = !window.UI_STATE.expandedSubMenus[id];
  window.renderCurrentRoute();
};

window.toggleTheme = function() {
  const html = document.documentElement;
  if (html.classList.contains('light')) {
    html.classList.remove('light');
    html.classList.add('dark');
    window.UI_STATE.theme = 'dark';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    window.UI_STATE.theme = 'light';
  }
  window.renderCurrentRoute();
};

window.changeFontScale = function(delta) {
  window.UI_STATE.fontPercent = Math.min(115, Math.max(80, window.UI_STATE.fontPercent + delta));
  document.documentElement.style.setProperty('--font-scale', (window.UI_STATE.fontPercent / 95).toFixed(2));
  window.renderCurrentRoute();
};

window.openWalletDrawer = function() {
  const payments = window.APP_DB.wallet_payments || [];
  window.openModal(
    'Pagos con billeteras (Yape / Plin)',
    `
      <div style="color:var(--text-secondary);font-size:12.5px;margin-bottom:14px;">
        Historial del establecimiento actual. Solo los pagos vinculados inequívocamente a una venta generan alertas.
      </div>
      <div class="table-wrap">
        <table class="sis-table">
          <thead>
            <tr><th>Fecha / Hora</th><th>Billetera</th><th>Remitente</th><th>Cód. Operación</th><th>Comprobante</th><th>Monto</th><th>Estado</th></tr>
          </thead>
          <tbody>
            ${payments.map(w => `
              <tr>
                <td>${w.date}</td>
                <td><span class="badge badge-info">${w.wallet}</span></td>
                <td style="font-weight:600;">${w.sender}</td>
                <td>${w.operation_code}</td>
                <td>${w.linked_doc}</td>
                <td style="font-weight:700;color:#4ade80;">S/ ${Number(w.amount).toFixed(2)}</td>
                <td><span class="badge badge-success">${w.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `,
    `<button class="btn btn-secondary" onclick="window.closeModal()">Cerrar</button>`,
    '740px'
  );
};

function renderSidebarHtml(currentPath) {
  return window.SISLII_MENU.map(group => {
    if (!group.children) {
      const isActive = currentPath === group.path;
      return `
        <div class="nav-item-top ${isActive ? 'active' : ''}" onclick="window.navigateTo('${group.path}')">
          <div class="nav-item-left">
            <i data-lucide="${group.icon}"></i>
            <span>${group.label}</span>
          </div>
        </div>
      `;
    }

    const isExpanded = !!window.UI_STATE.expandedMenus[group.id];
    return `
      <div>
        <div class="nav-item-top ${isExpanded ? 'expanded' : ''}" onclick="window.toggleMenuGroup('${group.id}')">
          <div class="nav-item-left">
            <i data-lucide="${group.icon}"></i>
            <span>${group.label}</span>
          </div>
          <i data-lucide="chevron-down" class="nav-chevron"></i>
        </div>
        ${isExpanded ? `
          <div class="nav-submenu">
            ${group.children.map(child => {
              if (!child.children) {
                const subActive = currentPath === child.path;
                return `
                  <div class="nav-sublink ${subActive ? 'active' : ''}" onclick="window.navigateTo('${child.path}')">
                    <span>${child.label}</span>
                    ${child.badge ? `<span class="badge-new-menu">${child.badge}</span>` : ''}
                  </div>
                `;
              }
              const subOpen = !!window.UI_STATE.expandedSubMenus[child.id];
              return `
                <div>
                  <div class="nav-subgroup-title" onclick="window.toggleSubMenuGroup('${child.id}')">
                    <span>${child.label}</span>
                    <i data-lucide="${subOpen ? 'chevron-up' : 'chevron-down'}" style="width:14px;height:14px;color:#9ca3af;"></i>
                  </div>
                  ${subOpen ? `
                    <div class="nav-subgroup-items">
                      ${child.children.map(leaf => `
                        <div class="nav-sublink ${currentPath === leaf.path ? 'active' : ''}" onclick="window.navigateTo('${leaf.path}')">
                          <span>${leaf.label}</span>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderMainContent(path, db) {
  if (path === '/dashboard' || path === '/') return window.renderDashboardView(db);
  if (path === '/pos') return window.renderPosView(db);
  if (path === '/documents/create') return window.renderDocumentCreateView(db);
  if (path === '/items') return window.renderItemsView(db);
  if (path === '/purchases/create') return window.renderPurchaseCreateView(db);
  if (path === '/dispatches/create') return window.renderDispatchCreateView(db);
  if (path === '/deliveries') return window.renderDeliveriesPanelView(db);
  if (path === '/deliveries/bulk-invoicing') return window.renderBulkInvoicingView(db);
  if (path === '/openings') return window.renderOpeningsView(db);
  if (path === '/configurations') return window.renderConfigurationsView(db);
  if (path === '/labels') return window.renderLabelsView(db);
  if (path === '/reports/cash') return window.renderCashReportView(db);
  return window.renderGenericSpecView(path, db);
}

window.renderCurrentRoute = function() {
  const app = document.getElementById('app');
  if (!app) return;

  const path = window.location.pathname || '/dashboard';
  if (path === '/login') {
    app.innerHTML = window.renderLoginView();
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const db = window.APP_DB;
  const isDashboard = path === '/dashboard' || path === '/';

  app.innerHTML = `
    <div class="app-layout ${window.UI_STATE.sidebarPinned ? 'sidebar-pinned' : ''}">
      <!-- Global Top Header -->
      <header class="app-header">
        <div class="header-left">
          ${window.renderNyceLogo()}
          <button class="hamburger-btn" onclick="window.toggleSidebarDrawer()" title="Fijar menú abierto">
            <i data-lucide="menu"></i>
          </button>

          ${isDashboard ? `
            <div class="header-quick-pills">
              <div class="quick-pill" onclick="window.navigateTo('/documents/create')">
                <i data-lucide="file-plus-2"></i> Nuevo comprobante
              </div>
              <div class="quick-pill" onclick="window.navigateTo('/pos')">
                <i data-lucide="receipt"></i> POS
              </div>
              <div class="quick-pill" onclick="window.navigateTo('/items')">
                <i data-lucide="package"></i> Productos
              </div>
              <div class="quick-pill" onclick="window.navigateTo('/openings')">
                <i data-lucide="wallet"></i> Caja
              </div>
            </div>
          ` : ''}
        </div>

        <div class="header-right">
          <button class="wallet-btn" onclick="window.openWalletDrawer()" title="Abrir historial de pagos con billeteras">
            S/
          </button>

          <button class="icon-util-btn" onclick="window.navigateTo('/downloads-service')" title="Ir a descargas">
            <i data-lucide="download"></i>
          </button>

          <button class="icon-util-btn" onclick="window.toggleTheme()" title="Activar tema claro / oscuro">
            <i data-lucide="sun"></i>
          </button>

          ${isDashboard ? `
            <button class="icon-util-btn" onclick="window.navigateTo('/reports-stock-alert')" title="Alerta de stock">
              <i data-lucide="alert-triangle"></i>
              <span class="alert-badge-count">50</span>
            </button>
          ` : ''}

          <div class="header-divider"></div>

          <div class="user-Trigger" onclick="window.UI_STATE.userMenuOpen=!window.UI_STATE.userMenuOpen;window.renderCurrentRoute();">
            <div class="user-avatar-circle">
              <i data-lucide="user"></i>
            </div>
            <div class="user-meta">
              <span class="user-meta-name">Principal</span>
              <span class="user-meta-role">Administrador</span>
            </div>
            <i data-lucide="chevron-down" style="width:14px;height:14px;color:var(--text-secondary);"></i>

            ${window.UI_STATE.userMenuOpen ? `
              <div class="user-dropdown-menu" onclick="event.stopPropagation()">
                <div class="user-dropdown-item" onclick="window.showToast('Establecimiento activo: Principal')">
                  <span>Cambiar Est./Emp.</span>
                  <span class="badge badge-info" style="font-size:10px;">Principal</span>
                </div>
                <div class="user-dropdown-item">
                  <span>Tamaño de texto (${window.UI_STATE.fontPercent}%)</span>
                  <div class="zoom-controls">
                    <button class="zoom-btn" onclick="window.changeFontScale(-5)">-</button>
                    <button class="zoom-btn" onclick="window.changeFontScale(5)">+</button>
                  </div>
                </div>
                <div class="user-dropdown-item" onclick="window.showToast('Soporte remoto AnyDesk / RustDesk listo')">
                  <span>App soporte remoto</span>
                  <i data-lucide="headphones" style="width:14px;height:14px;"></i>
                </div>
                <div style="border-top:1px solid var(--border-color);margin:4px 0;"></div>
                <div class="user-dropdown-item" style="color:#f43f5e;" onclick="window.navigateTo('/login')">
                  <span>Salir</span>
                  <i data-lucide="log-out" style="width:14px;height:14px;"></i>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </header>

      <!-- Sidebar Backdrop & Drawer -->
      <div class="sidebar-backdrop ${window.UI_STATE.sidebarOpen ? 'open' : ''}" onclick="window.toggleSidebarDrawer()"></div>
      <aside class="app-sidebar ${window.UI_STATE.sidebarOpen ? 'open' : ''}" aria-label="Menú principal">
        ${renderSidebarHtml(path)}
      </aside>

      <!-- Main Content -->
      <main class="app-main">
        ${renderMainContent(path, db)}
      </main>
    </div>
  `;

  if (window.lucide) {
    window.lucide.createIcons();
  }
};

// Keyboard shortcuts for POS (F8 Guardar, F9 Guardar e imprimir)
window.addEventListener('keydown', (e) => {
  if (window.location.pathname === '/pos') {
    if (e.key === 'F8') {
      e.preventDefault();
      window.posCompleteSale(false);
    } else if (e.key === 'F9') {
      e.preventDefault();
      window.posCompleteSale(true);
    }
  }
});

// Initialize Application
window.refreshState();
