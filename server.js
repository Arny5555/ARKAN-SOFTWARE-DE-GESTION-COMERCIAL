const http = require('http');
const fs = require('fs');
const path = require('path');
const getSeedData = require('./data/seed');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'database.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

function loadDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading DB, re-seeding:', err.message);
  }
  const seed = getSeedData();
  saveDatabase(seed);
  return seed;
}

function saveDatabase(db) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB:', err.message);
  }
}

let db = loadDatabase();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function formatNowDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function formatNowDateTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${formatNowDate()} ${hh}:${min}`;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // API Routes
  if (pathname === '/api/state' && req.method === 'GET') {
    return sendJson(res, 200, db);
  }

  if (pathname === '/api/login' && req.method === 'POST') {
    const body = await parseBody(req);
    return sendJson(res, 200, {
      ok: true,
      user: {
        name: 'Principal',
        role: 'Administrador',
        email: body.email || 'admin@nycestore.com',
        establishment: 'Principal'
      }
    });
  }

  if (pathname === '/api/config' && req.method === 'PUT') {
    const body = await parseBody(req);
    if (body.configurations) {
      db.configurations = { ...db.configurations, ...body.configurations };
    }
    if (body.security_settings) {
      db.security_settings = { ...db.security_settings, ...body.security_settings };
    }
    if (body.company) {
      db.company = { ...db.company, ...body.company };
    }
    if (body.taxes) {
      db.taxes = body.taxes;
    }
    saveDatabase(db);
    return sendJson(res, 200, { ok: true, db });
  }

  // Simulated SUNAT / RENIEC Lookup
  if (pathname.startsWith('/api/lookup/') && req.method === 'GET') {
    const num = pathname.replace('/api/lookup/', '').trim();
    const existingCustomer = (db.customers || []).find(c => c.number === num);
    if (existingCustomer) {
      return sendJson(res, 200, { ok: true, data: existingCustomer });
    }
    const existingSupplier = (db.suppliers || []).find(s => s.number === num);
    if (existingSupplier) {
      return sendJson(res, 200, { ok: true, data: existingSupplier });
    }
    if (num.length === 11) {
      return sendJson(res, 200, {
        ok: true,
        data: {
          doc_type: 'RUC',
          number: num,
          name: `INVERSIONES & COMERCIALIZADORA PERÚ ${num.slice(-4)} S.A.C.`,
          trade_name: `GRUPO COMERCIAL ${num.slice(-4)}`,
          department: 'LIMA',
          province: 'LIMA',
          district: 'MIRAFLORES',
          address: `Av. Arequipa ${num.slice(-3)} - Lima`
        }
      });
    }
    return sendJson(res, 200, {
      ok: true,
      data: {
        doc_type: 'DNI',
        number: num,
        name: `CLIENTE RENIEC VERIFICADO (${num})`,
        trade_name: '',
        department: 'LIMA',
        province: 'LIMA',
        district: 'LIMA',
        address: 'Lima - Perú'
      }
    });
  }

  // Process POS / Comprobante / Cotización / Nota de Venta
  if (pathname === '/api/sale' && req.method === 'POST') {
    const body = await parseBody(req);
    const docCategory = body.doc_category || 'NOTA DE VENTA'; // FACTURA, BOLETA, NOTA DE VENTA, COTIZACIÓN
    const series = body.series || (docCategory === 'FACTURA' ? 'F001' : docCategory === 'BOLETA' ? 'B001' : docCategory === 'COTIZACIÓN' ? 'CT01' : 'NV01');
    const corr = (db.correlatives || []).find(c => c.series === series);
    const nextNum = corr ? corr.start_number++ : Math.floor(Math.random() * 900 + 100);
    const seriesNumber = `${series}-${String(nextNum).padStart(docCategory === 'COTIZACIÓN' ? 2 : 6, '0')}`;
    const total = Number(body.total || 0);
    const issueDate = body.issue_date || formatNowDate();
    const customerName = body.customer_name || '10 - CLIENTES VARIOS';
    const customerDoc = body.customer_doc || '10';
    const items = Array.isArray(body.items) ? body.items : [];

    // Deduct stock if not a quotation
    if (docCategory !== 'COTIZACIÓN') {
      items.forEach(cartItem => {
        const prod = (db.items || []).find(p => p.id === cartItem.item_id || p.description === cartItem.description);
        if (prod) {
          prod.stock = Math.max(0, Number(prod.stock || 0) - Number(cartItem.qty || 1));
        }
      });
    }

    let createdRecord = null;
    if (docCategory === 'COTIZACIÓN') {
      createdRecord = {
        id: Date.now(),
        issue_date: issueDate,
        customer_name: customerName,
        phone: body.phone || '-',
        user: 'Principal',
        status: 'Registrado',
        series_number: seriesNumber,
        payment_condition: body.payment_condition || 'Contado',
        paid: body.payment_condition === 'Contado' ? 'Sí' : 'No',
        cpe: '-',
        nv: '-',
        total,
        items
      };
      db.quotations.unshift(createdRecord);
    } else if (docCategory === 'NOTA DE VENTA' || docCategory === 'N. VENTA') {
      createdRecord = {
        id: Date.now(),
        issue_date: issueDate,
        customer_name: customerName,
        phone: body.phone || '-',
        user: 'Principal',
        series_number: seriesNumber,
        status: 'Activo',
        total,
        cpe: '-',
        payment_condition: body.payment_condition || 'Contado',
        items
      };
      db.sale_notes.unshift(createdRecord);
    } else {
      createdRecord = {
        id: Date.now(),
        issue_date: issueDate,
        doc_type: docCategory.includes('FACTURA') ? 'FACTURA ELECTRÓNICA' : 'BOLETA DE VENTA ELECTRÓNICA',
        series_number: seriesNumber,
        payment_condition: body.payment_condition || 'Contado',
        customer_doc: customerDoc,
        customer_name: customerName,
        user: 'Principal',
        notes_cd: '-',
        status: 'Aceptado',
        currency: body.currency === 'Dólares' ? '$' : 'S/',
        total,
        items
      };
      db.documents.unshift(createdRecord);
    }

    // Add to cash or accounts receivable
    if (docCategory !== 'COTIZACIÓN') {
      if ((body.payment_condition || 'Contado') === 'Contado') {
        db.cash_movements.unshift({
          id: Date.now() + 1,
          date: formatNowDateTime(),
          cash: 'Caja Principal',
          type: 'Ingreso',
          concept: 'Venta de mercadería',
          doc: seriesNumber,
          method: body.payment_method || 'Efectivo',
          amount: total,
          user: 'Principal'
        });
        if (db.openings && db.openings[0]) {
          db.openings[0].total_income = Number((db.openings[0].total_income + total).toFixed(2));
          db.openings[0].final_balance = Number((db.openings[0].initial_balance + db.openings[0].total_income - db.openings[0].total_expense).toFixed(2));
        }
      } else {
        db.debts_receivable.unshift({
          id: Date.now() + 2,
          sale_date: issueDate,
          document: seriesNumber,
          customer: customerName,
          currency: 'Soles (S/)',
          total_amount: total,
          paid_amount: 0,
          pending_amount: total,
          installments: 1,
          paid: false
        });
      }

      if (body.create_delivery) {
        db.deliveries.unshift({
          id: Date.now() + 3,
          operation: seriesNumber,
          customer: customerName,
          tracking: 'En preparación',
          status: 'Pendiente',
          progress: '0%',
          warehouse: body.warehouse || 'Almacén - Principal',
          priority: 'Alta',
          date: issueDate,
          total
        });
      }
    }

    saveDatabase(db);
    return sendJson(res, 200, { ok: true, record: createdRecord, db });
  }

  // Process Nueva Compra
  if (pathname === '/api/purchase' && req.method === 'POST') {
    const body = await parseBody(req);
    const total = Number(body.total || 0);
    const issueDate = body.issue_date || formatNowDate();
    const seriesNumber = `${body.series || 'F001'}-${body.number || String(Math.floor(Math.random() * 90000 + 10000))}`;
    const supplier = body.supplier || 'UNILEVER ANDINA PERU S.A.';
    const items = Array.isArray(body.items) ? body.items : [];

    items.forEach(item => {
      const prod = (db.items || []).find(p => p.id === item.item_id || p.description === item.description);
      if (prod) {
        prod.stock = Number(prod.stock || 0) + Number(item.qty || 1);
        if (db.configurations?.update_purchase_price_on_buy && item.price) {
          prod.purchase_price = Number(item.price);
        }
      }
    });

    const newPurchase = {
      id: Date.now(),
      issue_date: issueDate,
      supplier,
      purchase_order: body.purchase_order || '-',
      status: 'Registrado',
      doc_type: body.doc_type || 'FACTURA ELECTRÓNICA',
      series_number: seriesNumber,
      payment_condition: body.payment_condition || 'Contado',
      currency: body.currency === 'Dólares' ? '$' : 'S/',
      total,
      items
    };
    db.purchases.unshift(newPurchase);

    const isCredit = (body.payment_condition || 'Contado') !== 'Contado';
    db.debts_payable.unshift({
      id: Date.now() + 1,
      purchase_date: issueDate,
      document: seriesNumber,
      supplier,
      currency: body.currency === 'Dólares' ? 'Dólares ($)' : 'Soles (S/)',
      total_amount: total,
      paid_amount: isCredit ? 0 : total,
      pending_amount: isCredit ? total : 0,
      installments: 1,
      paid: !isCredit
    });

    if (!isCredit) {
      db.cash_movements.unshift({
        id: Date.now() + 2,
        date: formatNowDateTime(),
        cash: 'Caja Principal',
        type: 'Egreso',
        concept: 'Pago a proveedores',
        doc: seriesNumber,
        method: 'Efectivo',
        amount: total,
        user: 'Principal'
      });
      if (db.openings && db.openings[0]) {
        db.openings[0].total_expense = Number((db.openings[0].total_expense + total).toFixed(2));
        db.openings[0].final_balance = Number((db.openings[0].initial_balance + db.openings[0].total_income - db.openings[0].total_expense).toFixed(2));
      }
    }

    saveDatabase(db);
    return sendJson(res, 200, { ok: true, record: newPurchase, db });
  }

  // Generic CRUD for any collection in db
  if (pathname.startsWith('/api/collection/')) {
    const parts = pathname.replace('/api/collection/', '').split('/');
    const col = parts[0];
    const itemId = parts[1] ? Number(parts[1]) : null;

    if (!Array.isArray(db[col])) {
      db[col] = [];
    }

    if (req.method === 'GET') {
      return sendJson(res, 200, db[col]);
    }

    if (req.method === 'POST') {
      const body = await parseBody(req);
      const nextId = db[col].reduce((max, r) => Math.max(max, Number(r.id || 0)), 0) + 1;
      const newRecord = { id: nextId, ...body };
      db[col].unshift(newRecord);

      // Side effects for cash movements, transfers, inventory adjustments
      if (col === 'cash_movements' && db.openings && db.openings[0]) {
        const amt = Number(newRecord.amount || 0);
        if (newRecord.type === 'Ingreso') {
          db.openings[0].total_income = Number((db.openings[0].total_income + amt).toFixed(2));
        } else {
          db.openings[0].total_expense = Number((db.openings[0].total_expense + amt).toFixed(2));
        }
        db.openings[0].final_balance = Number((db.openings[0].initial_balance + db.openings[0].total_income - db.openings[0].total_expense).toFixed(2));
      }
      if (col === 'inventory_adjustments') {
        const prod = (db.items || []).find(p => p.description === newRecord.product || p.id === Number(newRecord.item_id));
        if (prod) {
          const qty = Number(newRecord.quantity || 0);
          prod.stock = newRecord.type === 'Salida' ? Math.max(0, prod.stock - qty) : prod.stock + qty;
        }
      }

      saveDatabase(db);
      return sendJson(res, 200, { ok: true, record: newRecord, db });
    }

    if (req.method === 'PUT' && itemId !== null) {
      const body = await parseBody(req);
      const idx = db[col].findIndex(r => Number(r.id) === itemId);
      if (idx !== -1) {
        db[col][idx] = { ...db[col][idx], ...body, id: itemId };
        saveDatabase(db);
        return sendJson(res, 200, { ok: true, record: db[col][idx], db });
      }
      return sendJson(res, 404, { ok: false, error: 'No encontrado' });
    }

    if (req.method === 'DELETE' && itemId !== null) {
      db[col] = db[col].filter(r => Number(r.id) !== itemId);
      saveDatabase(db);
      return sendJson(res, 200, { ok: true, db });
    }
  }

  // Static files or SPA fallback
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();

  if (ext && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // SPA Fallback: serve index.html for all routes (/login, /dashboard, /pos, /items, etc.)
  const indexHtml = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(indexHtml).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Sislii (NYCE STORE) ejecutándose en http://localhost:${PORT}/dashboard`);
});
