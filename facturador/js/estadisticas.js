// Estadísticas — lee facturador/data/{uid}/emitidas.json vía api/estadisticas.php
// (Firestore no tiene el historial de facturas, solo el listado de clientes) y
// agrupa todo del lado del cliente: por mes, por cliente, por tipo de comprobante.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { $, escapeHtml, formatPesos, formatPesosCorto } from './utils.js';
import { estado } from './state.js';

const LETRA = { 1: 'A', 6: 'B', 11: 'C' };
let facturas = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    estado.user = user;
    await cargar();
});

async function cargar() {
    try {
        const token = await estado.user.getIdToken();
        const res = await fetch('api/estadisticas.php', { headers: { Authorization: 'Bearer ' + token } });
        const datos = await res.json();
        facturas = datos.ok ? (datos.facturas || []) : [];
    } catch (err) {
        facturas = [];
    }

    $('loadingState').hidden = true;
    if (!facturas.length) {
        $('emptyState').hidden = false;
        return;
    }

    $('statsContent').hidden = false;
    poblarFiltroMes();
    render();
}

function mesDe(fecha) {
    return (fecha || '').slice(0, 6); // YYYYMM
}

function etiquetaMes(yyyymm) {
    const y = Number(yyyymm.slice(0, 4));
    const m = Number(yyyymm.slice(4, 6));
    const texto = new Date(y, m - 1, 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatFecha(yyyymmdd) {
    if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || '—';
    return `${yyyymmdd.slice(6, 8)}/${yyyymmdd.slice(4, 6)}/${yyyymmdd.slice(0, 4)}`;
}

function poblarFiltroMes() {
    const meses = [...new Set(facturas.map(f => mesDe(f.fecha)))].filter(Boolean).sort().reverse();
    const sel = $('filtroMes');
    sel.innerHTML = '<option value="">Todo</option>' + meses.map(m => `<option value="${m}">${etiquetaMes(m)}</option>`).join('');
    sel.addEventListener('change', render);
}

function facturasFiltradas() {
    const mes = $('filtroMes').value;
    return mes ? facturas.filter(f => mesDe(f.fecha) === mes) : facturas;
}

function render() {
    const lista = facturasFiltradas();
    renderResumen(lista);
    renderBarChart(); // siempre el histórico completo, no respeta el filtro
    renderTipos(lista);
    renderClientes(lista);
    renderUltimas(lista);
}

function renderResumen(lista) {
    const total = lista.reduce((s, f) => s + f.total, 0);
    const cantidad = lista.length;
    const promedio = cantidad ? total / cantidad : 0;

    $('statTotal').textContent = formatPesos(total);
    $('statCantidad').textContent = String(cantidad);
    $('statPromedio').textContent = formatPesos(promedio);

    const conIva = lista.filter(f => f.iva != null);
    if (conIva.length) {
        $('statIva').textContent = formatPesos(conIva.reduce((s, f) => s + f.iva, 0));
        $('statIvaCard').hidden = false;
    } else {
        $('statIvaCard').hidden = true;
    }
}

function renderBarChart() {
    const porMes = new Map();
    facturas.forEach((f) => {
        const m = mesDe(f.fecha);
        if (!m) return;
        porMes.set(m, (porMes.get(m) || 0) + f.total);
    });

    const cont = $('barChart');
    const meses = [...porMes.keys()].sort();
    if (!meses.length) {
        cont.innerHTML = '<p class="bar-chart-empty">Sin datos todavía.</p>';
        return;
    }

    const max = Math.max(...porMes.values());
    cont.innerHTML = meses.map((m) => {
        const valor = porMes.get(m);
        const alturaPx = max > 0 ? Math.max(3, Math.round((valor / max) * 150)) : 3;
        const corta = etiquetaMes(m).split(' de ')[0].slice(0, 3);
        return `<div class="bar-chart-col" title="${etiquetaMes(m)}: ${formatPesos(valor)}">
            <span class="bar-chart-value">${formatPesosCorto(valor)}</span>
            <div class="bar-chart-bar" style="height:${alturaPx}px"></div>
            <span class="bar-chart-label">${corta}</span>
        </div>`;
    }).join('');
}

function renderTipos(lista) {
    const tipos = new Set(lista.map(f => f.tipoComprobante));
    if (tipos.size <= 1) {
        $('tipoSection').hidden = true;
        return;
    }
    $('tipoSection').hidden = false;

    const porTipo = new Map();
    lista.forEach((f) => {
        const d = porTipo.get(f.tipoComprobante) || { cantidad: 0, total: 0 };
        d.cantidad++;
        d.total += f.total;
        porTipo.set(f.tipoComprobante, d);
    });

    const filas = [...porTipo.entries()].sort((a, b) => b[1].total - a[1].total);
    $('tipoBody').innerHTML = filas.map(([tipo, d]) => `
        <tr><td>Factura ${LETRA[tipo] || tipo}</td><td class="num">${d.cantidad}</td><td class="num">${formatPesos(d.total)}</td></tr>
    `).join('');
}

function renderClientes(lista) {
    const porCliente = new Map();
    lista.forEach((f) => {
        const key = f.clienteId || f.cliente || '—';
        const c = porCliente.get(key) || { nombre: f.cliente || 'Consumidor final', cantidad: 0, total: 0 };
        c.cantidad++;
        c.total += f.total;
        porCliente.set(key, c);
    });

    const filas = [...porCliente.values()].sort((a, b) => b.total - a.total);
    $('clientesBody').innerHTML = filas.length
        ? filas.map(c => `<tr><td>${escapeHtml(c.nombre)}</td><td class="num">${c.cantidad}</td><td class="num">${formatPesos(c.total)}</td></tr>`).join('')
        : '<tr><td colspan="3" style="color:var(--text-muted)">Sin facturas en este período.</td></tr>';
}

function renderUltimas(lista) {
    const top = lista.slice(0, 30); // ya viene ordenado por fecha descendente desde el backend
    $('ultimasBody').innerHTML = top.length
        ? top.map(f => `
            <tr>
                <td>${formatFecha(f.fecha)}</td>
                <td>${LETRA[f.tipoComprobante] || f.tipoComprobante} ${String(f.puntoVenta).padStart(5, '0')}-${String(f.numero).padStart(8, '0')}</td>
                <td>${escapeHtml(f.cliente || 'Consumidor final')}</td>
                <td class="num">${formatPesos(f.total)}</td>
            </tr>`).join('')
        : '<tr><td colspan="4" style="color:var(--text-muted)">Sin facturas en este período.</td></tr>';
}
