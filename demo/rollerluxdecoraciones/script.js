'use strict';

const WA = '5491166732867';
const TOPE_CONSULTA = 100;
const POR_PAGINA = 16;

const CATEGORIAS = [{"id": "roller", "nombre": "Cortinas roller", "subs": [{"id": "blackout", "nombre": "Blackout"}, {"id": "sunscreen", "nombre": "Sunscreen"}, {"id": "rustica", "nombre": "Tela rústica"}]}, {"id": "bandas", "nombre": "Roller bandas"}, {"id": "verticales", "nombre": "Cortinas verticales"}, {"id": "toldos", "nombre": "Toldos", "subs": [{"id": "brazos", "nombre": "De brazos extensibles"}, {"id": "exterior", "nombre": "Roller exterior"}]}];
const PRODUCTOS = [
  {
    "id": "roller-blackout",
    "nombre": "Roller blackout",
    "cat": "roller",
    "sub": "blackout",
    "uso": "interior",
    "luz": 0,
    "luzTxt": "Oscurece por completo",
    "tipo": "m2",
    "precioM2": 54900,
    "lim": {
      "anchoMin": 40,
      "anchoMax": 300,
      "altoMin": 40,
      "altoMax": 300,
      "anchoDef": 120,
      "altoDef": 160
    },
    "imgs": [
      [
        "images/p-blackout.webp",
        "Cortina roller blackout gris bajada en un dormitorio con ventana a la ciudad"
      ]
    ],
    "desc": "Tela opaca que no deja pasar la luz: ideal para dormitorios y para dormir con el sol ya arriba. Se enrolla en un caño de aluminio con cadena de comando a la derecha o a la izquierda.",
    "colores": [
      {
        "id": "blanco",
        "nombre": "Blanco",
        "hex": "#F2F0EB"
      },
      {
        "id": "perla",
        "nombre": "Gris perla",
        "hex": "#B8B9B6"
      },
      {
        "id": "beige",
        "nombre": "Beige",
        "hex": "#D8CAB2"
      },
      {
        "id": "grafito",
        "nombre": "Grafito",
        "hex": "#42474A"
      }
    ],
    "destacado": 1,
    "descuento": 0,
    "claves": [
      "oscuro",
      "dormitorio",
      "opaca",
      "black out"
    ]
  },
  {
    "id": "roller-sunscreen",
    "nombre": "Roller sunscreen 5%",
    "cat": "roller",
    "sub": "sunscreen",
    "uso": "interior",
    "luz": 4,
    "luzTxt": "Filtra el sol, deja la vista",
    "tipo": "m2",
    "precioM2": 63900,
    "lim": {
      "anchoMin": 40,
      "anchoMax": 300,
      "altoMin": 40,
      "altoMax": 300,
      "anchoDef": 120,
      "altoDef": 160
    },
    "imgs": [
      [
        "images/p-sunscreen.webp",
        "Cortina roller sunscreen blanca bajada sobre una ventana corrediza"
      ],
      [
        "images/p-sunscreen-detalle.webp",
        "Detalle de la tela sunscreen y el soporte con cadena"
      ],
      [
        "images/ig-roller-sunscreen.webp",
        "Roller sunscreen frente a un ventanal, publicado en el Instagram de Rollerlux"
      ]
    ],
    "desc": "Tela técnica con 5 % de apertura: filtra el sol y el calor sin perder la vista hacia afuera. De día da privacidad; de noche, con la luz encendida, se ve hacia adentro.",
    "colores": [
      {
        "id": "blanco",
        "nombre": "Blanco",
        "hex": "#F4F3EF"
      },
      {
        "id": "lino",
        "nombre": "Lino",
        "hex": "#CFC2AA"
      },
      {
        "id": "gris",
        "nombre": "Gris",
        "hex": "#8F9496"
      },
      {
        "id": "negro",
        "nombre": "Negro",
        "hex": "#2C2F31"
      }
    ],
    "destacado": 2,
    "descuento": 0,
    "claves": [
      "screen",
      "sun screen",
      "solar",
      "ventanal"
    ]
  },
  {
    "id": "roller-bandas",
    "nombre": "Roller bandas día y noche",
    "cat": "bandas",
    "sub": null,
    "uso": "interior",
    "luz": 3,
    "luzTxt": "Luz regulable",
    "tipo": "m2",
    "precioM2": 69900,
    "lim": {
      "anchoMin": 40,
      "anchoMax": 250,
      "altoMin": 40,
      "altoMax": 260,
      "anchoDef": 120,
      "altoDef": 160
    },
    "imgs": [
      [
        "images/p-bandas.webp",
        "Cortina roller de bandas día y noche sobre la ventana de un escritorio"
      ]
    ],
    "desc": "Dos telas con bandas opacas y traslúcidas que se cruzan: con la cadena regulás cuánta luz entra sin subir la cortina.",
    "colores": [
      {
        "id": "crudo",
        "nombre": "Crudo",
        "hex": "#E7DECD"
      },
      {
        "id": "gris",
        "nombre": "Gris",
        "hex": "#A6A8A6"
      },
      {
        "id": "chocolate",
        "nombre": "Chocolate",
        "hex": "#6A5444"
      }
    ],
    "destacado": 3,
    "descuento": 0,
    "claves": [
      "zebra",
      "dia y noche",
      "doble tela",
      "bandas"
    ]
  },
  {
    "id": "roller-rustica",
    "nombre": "Roller tela rústica",
    "cat": "roller",
    "sub": "rustica",
    "uso": "interior",
    "luz": 2,
    "luzTxt": "Tamiza la luz",
    "tipo": "m2",
    "precioM2": 49900,
    "lim": {
      "anchoMin": 40,
      "anchoMax": 300,
      "altoMin": 40,
      "altoMax": 300,
      "anchoDef": 120,
      "altoDef": 160
    },
    "imgs": [
      [
        "images/ig-roller-rustica.webp",
        "Rollers de tela rústica combinados con sunscreen en un ventanal, foto del Instagram de Rollerlux"
      ]
    ],
    "desc": "Tela con textura de lino que tamiza la luz y le da calidez al ambiente. Se combina con un sunscreen en sistema doble, como en esta instalación publicada en nuestro Instagram.",
    "colores": [
      {
        "id": "crudo",
        "nombre": "Crudo",
        "hex": "#E7DECD"
      },
      {
        "id": "arena",
        "nombre": "Arena",
        "hex": "#CCB894"
      },
      {
        "id": "blanco",
        "nombre": "Blanco",
        "hex": "#F3F0E8"
      }
    ],
    "destacado": 4,
    "descuento": 0,
    "claves": [
      "lino",
      "textura",
      "rustico",
      "doble"
    ]
  },
  {
    "id": "cortina-vertical",
    "nombre": "Cortina vertical de tela",
    "cat": "verticales",
    "sub": null,
    "uso": "interior",
    "luz": 3,
    "luzTxt": "Lamas orientables",
    "tipo": "m2",
    "precioM2": 38900,
    "lim": {
      "anchoMin": 60,
      "anchoMax": 500,
      "altoMin": 60,
      "altoMax": 320,
      "anchoDef": 200,
      "altoDef": 200
    },
    "imgs": [
      [
        "images/p-verticales.webp",
        "Cortina vertical blanca de lamas en una oficina con ventanal"
      ]
    ],
    "desc": "Lamas de 89 mm que giran y se corren hacia un costado: ideales para ventanales, puertas balcón y oficinas. Las orientás para dejar pasar más o menos luz.",
    "colores": [
      {
        "id": "blanco",
        "nombre": "Blanco",
        "hex": "#F5F4F0"
      },
      {
        "id": "marfil",
        "nombre": "Marfil",
        "hex": "#EEE6D4"
      },
      {
        "id": "gris",
        "nombre": "Gris",
        "hex": "#B2B4B2"
      }
    ],
    "destacado": 5,
    "descuento": 0,
    "claves": [
      "lamas",
      "oficina",
      "ventanal",
      "puerta balcon"
    ]
  },
  {
    "id": "toldo-brazos",
    "nombre": "Toldo de brazos extensibles",
    "cat": "toldos",
    "sub": "brazos",
    "uso": "exterior",
    "luz": null,
    "luzTxt": "Sombra para patio y balcón",
    "tipo": "medidas",
    "medidas": [
      {
        "id": "250",
        "nombre": "2,50 m de frente × 2,00 m de salida",
        "precio": 689000
      },
      {
        "id": "300",
        "nombre": "3,00 m de frente × 2,50 m de salida",
        "precio": 789000
      },
      {
        "id": "400",
        "nombre": "4,00 m de frente × 3,00 m de salida",
        "precio": 989000
      }
    ],
    "imgs": [
      [
        "images/p-toldo-brazos.webp",
        "Toldo de brazos extensibles color crudo sobre una galería con mesa de jardín"
      ]
    ],
    "desc": "Lona acrílica sobre brazos articulados de aluminio, con manivela. Da sombra en patios, balcones y terrazas y se recoge contra la pared cuando no lo usás.",
    "colores": [
      {
        "id": "crudo",
        "nombre": "Crudo",
        "hex": "#E4DACA"
      },
      {
        "id": "arena",
        "nombre": "Arena",
        "hex": "#C8B48E"
      },
      {
        "id": "gris",
        "nombre": "Gris",
        "hex": "#9C9C97"
      }
    ],
    "destacado": 6,
    "descuento": 0,
    "claves": [
      "toldo",
      "lona",
      "brazos",
      "patio",
      "balcon",
      "terraza"
    ]
  },
  {
    "id": "roller-exterior",
    "nombre": "Roller exterior screen",
    "cat": "toldos",
    "sub": "exterior",
    "uso": "exterior",
    "luz": 3,
    "luzTxt": "Corta el sol de costado",
    "tipo": "m2",
    "precioM2": 79900,
    "lim": {
      "anchoMin": 100,
      "anchoMax": 400,
      "altoMin": 100,
      "altoMax": 300,
      "anchoDef": 250,
      "altoDef": 220
    },
    "imgs": [
      [
        "images/p-roller-exterior.webp",
        "Toldo vertical de tela screen oscura en una galería con vista al jardín"
      ]
    ],
    "desc": "Toldo vertical de tela screen para galerías y quinchos: corta el sol y el viento sin tapar la vista al jardín. Va con guías laterales de cable de acero.",
    "colores": [
      {
        "id": "negro",
        "nombre": "Negro",
        "hex": "#2B2D2E"
      },
      {
        "id": "gris",
        "nombre": "Gris",
        "hex": "#7C8083"
      }
    ],
    "destacado": 7,
    "descuento": 0,
    "claves": [
      "toldo vertical",
      "screen exterior",
      "galeria",
      "quincho"
    ]
  }
];

const SUBCATEGORIAS = CATEGORIAS.flatMap(c => (c.subs || []).map(s => ({ ...s, cat: c.id })));
const LUCES = {
  oscurece: { nombre: 'Oscurece', min: 0, max: 1 },
  tamiza: { nombre: 'Tamiza la luz', min: 2, max: 3 },
  filtra: { nombre: 'Filtra el sol', min: 4, max: 5 },
};
const USOS = { interior: 'Interior', exterior: 'Exterior' };
const ORDENES = { destacados: 'Más elegidos', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const redondear = n => Math.round(n / 100) * 100;
const conDescuento = (p, v) => (p.descuento > 0 ? redondear(v * (1 - p.descuento / 100)) : v);
const m2De = (ancho, alto) => Math.max(1, (ancho * alto) / 10000);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const subDe = id => SUBCATEGORIAS.find(s => s.id === id);
const colorDe = (p, id) => p.colores.find(c => c.id === id) || p.colores[0];
const waLink = texto => `https://wa.me/${WA}?text=${encodeURIComponent(texto)}`;

function precioDesde(p) {
  if (p.tipo === 'medidas') return Math.min(...p.medidas.map(m => conDescuento(p, m.precio)));
  return conDescuento(p, p.precioM2);
}

function seleccionDe(p, v) {
  const [medida = '', color = ''] = String(v || '').split('|');
  const sel = { color: colorDe(p, color).id };
  if (p.tipo === 'medidas') {
    const m = p.medidas.find(x => x.id === medida.replace(/^f:/, '')) || p.medidas[0];
    sel.med = m.id;
  } else {
    const [a, h] = medida.replace(/^m:/, '').split('x').map(n => parseInt(n, 10));
    sel.ancho = Number.isFinite(a) ? a : p.lim.anchoDef;
    sel.alto = Number.isFinite(h) ? h : p.lim.altoDef;
  }
  return sel;
}

function claveDe(p, sel) {
  const medida = p.tipo === 'medidas' ? `f:${sel.med}` : `m:${sel.ancho}x${sel.alto}`;
  return `${medida}|${colorDe(p, sel.color).id}`;
}

function precioUnidad(p, sel) {
  if (p.tipo === 'medidas') {
    const m = p.medidas.find(x => x.id === sel.med) || p.medidas[0];
    return conDescuento(p, m.precio);
  }
  return conDescuento(p, redondear(m2De(sel.ancho, sel.alto) * p.precioM2));
}

function medidaValida(p, sel) {
  if (p.tipo === 'medidas') return p.medidas.some(m => m.id === sel.med);
  const l = p.lim;
  return Number.isInteger(sel.ancho) && Number.isInteger(sel.alto) && sel.ancho >= l.anchoMin && sel.ancho <= l.anchoMax && sel.alto >= l.altoMin && sel.alto <= l.altoMax;
}

function textoSeleccion(p, sel) {
  const color = colorDe(p, sel.color).nombre;
  if (p.tipo === 'medidas') return `${(p.medidas.find(m => m.id === sel.med) || p.medidas[0]).nombre} · ${color}`;
  const m2 = m2De(sel.ancho, sel.alto).toLocaleString('es-AR', { maximumFractionDigits: 2 });
  return `${sel.ancho} × ${sel.alto} cm (${m2} m²) · ${color}`;
}

function crearTienda(coleccion, { tope = TOPE_CONSULTA } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), sub = lista(f.sub), luz = lista(f.luz), uso = lista(f.uso), excluir = lista(f.excluir);
    if (sub.length) {
      if (p.sub) { if (!sub.includes(p.sub)) return false; }
      else if (!cat.includes(p.cat)) return false;
    } else if (cat.length && !cat.includes(p.cat)) return false;
    if (luz.length && !luz.some(l => LUCES[l] && p.luz != null && p.luz >= LUCES[l].min && p.luz <= LUCES[l].max)) return false;
    if (uso.length && !uso.includes(p.uso)) return false;
    if (f.destacado && !p.destacado) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.destacado || 999) - (b.destacado || 999) || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
    const lim = limitar(limite);
    const ordenados = visibles.filter(p => coincide(p, filtros)).sort(comparador(orden));
    let inicio = 0;
    if (cursor != null) {
      const i = ordenados.findIndex(p => p.id === cursor);
      inicio = i < 0 ? ordenados.length : i + 1;
    }
    const items = ordenados.slice(inicio, inicio + lim);
    const hayMas = inicio + items.length < ordenados.length;
    return { items: items.map(copia), cursor: hayMas && items.length ? items[items.length - 1].id : null };
  }
  function contar(filtros = {}) {
    return visibles.reduce((n, p) => n + (coincide(p, filtros) ? 1 : 0), 0);
  }
  function obtener(id) {
    const p = visibles.find(x => x.id === id);
    return p ? copia(p) : null;
  }
  return { TOPE: tope, consultar, contar, obtener };
}

const textoBusqueda = new Map();
function textoDe(p) {
  if (!textoBusqueda.has(p.id)) {
    textoBusqueda.set(p.id, norm([
      p.nombre, catDe(p.cat)?.nombre, subDe(p.sub)?.nombre, p.desc, p.luzTxt, USOS[p.uso],
      ...p.colores.map(c => c.nombre), ...(p.medidas || []).map(m => m.nombre), ...(p.claves || []),
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => textoDe(p).includes(w));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = POR_PAGINA } = {}) {
  const palabras = norm(q).split(' ').filter(Boolean);
  if (!palabras.length) return { ...tienda.consultar({ filtros, orden, cursor, limite }), paginas: 1 };
  const items = [];
  let c = cursor;
  let ultimo = cursor;
  let paginas = 0;
  let agotado = false;
  while (items.length < limite) {
    const pag = tienda.consultar({ filtros, orden, cursor: c, limite: tienda.TOPE });
    paginas++;
    for (const p of pag.items) {
      ultimo = p.id;
      if (coincideBusqueda(p, palabras)) {
        items.push(p);
        if (items.length === limite) break;
      }
    }
    if (items.length === limite) break;
    if (!pag.cursor) { agotado = true; break; }
    c = pag.cursor;
  }
  return { items, cursor: agotado ? null : ultimo, paginas };
}

const Tienda = crearTienda(PRODUCTOS, { tope: TOPE_CONSULTA });
const getProducto = id => PRODUCTOS.find(p => p.id === id);

const Cart = {
  KEY: 'rollerlux_cart',
  get() { try { return (JSON.parse(localStorage.getItem(this.KEY)) || []).filter(i => getProducto(i.id)); } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); if (typeof document !== 'undefined') document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, v, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === producto.id && i.var === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, 99);
    else items.push({ id: producto.id, var: v, qty: Math.min(qty, 99) });
    this.save(items);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.var === v); if (!it) return;
    it.qty = Math.max(1, Math.min(qty, 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && i.var === v))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioUnidad(p, seleccionDe(p, i.var)) * i.qty : s; }, 0); },
};

if (typeof document === 'undefined') {
  globalThis.RollerluxTienda = { PRODUCTOS, CATEGORIAS, crearTienda, buscarPaginado, precioUnidad, precioDesde, seleccionDe, claveDe, medidaValida, textoSeleccion, m2De, Cart, TOPE_CONSULTA, POR_PAGINA };
}

if (typeof document !== 'undefined') {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase();
    if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
      e.preventDefault();
    }
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());
  const refrescar = () => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); };

  const showToast = msg => {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
    wrap.appendChild(toast);
    setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
  };

  let revealsListos = false;
  const revelarNuevos = cont => {
    if (!revealsListos || !cont) return;
    const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')].filter(el => el.getClientRects().length);
    if (!nuevos.length) return;
    if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
    requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
      const d = Math.min(i * 0.06, 0.6);
      el.style.transitionDelay = `${d}s`;
      el.classList.add('in');
      setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
    })));
  };

  const ANIM = 'data-animate="subir" style="opacity:0;transform:translateY(40px)"';

  const luzHTML = p => {
    if (p.luz == null) return `<p class="luz luz--sombra"><span class="luz__txt">${esc(p.luzTxt)}</span></p>`;
    const segs = [1, 2, 3, 4, 5].map(n => `<i${n <= p.luz ? ' class="on"' : ''}></i>`).join('');
    return `<p class="luz"><span class="luz__barra" role="img" aria-label="Luz que deja pasar: ${p.luz} de 5">${segs}</span><span class="luz__txt">${esc(p.luzTxt)}</span></p>`;
  };

  const cardHTML = (p, anim = true) => {
    const [src, alt] = p.imgs[0];
    const desde = precioDesde(p);
    const lista = p.tipo === 'medidas' ? Math.min(...p.medidas.map(m => m.precio)) : p.precioM2;
    const unidad = p.tipo === 'medidas' ? '' : '<small>/ m²</small>';
    const swatches = p.colores.map(c => `<i style="background:${c.hex}" title="${esc(c.nombre)}"></i>`).join('');
    return `<article class="prod"${anim ? ' ' + ANIM : ''} data-id="${p.id}">
      <button type="button" class="prod__media media" data-ver="${p.id}" aria-label="Ver ${esc(p.nombre)}"><img src="${src}" alt="${esc(alt)}" width="600" height="600">${p.nuevo ? '<span class="badge">Nuevo</span>' : ''}${p.descuento > 0 ? `<span class="badge badge--off">-${p.descuento}%</span>` : ''}</button>
      <div class="prod__info">
        <p class="prod__cat">${esc(subDe(p.sub)?.nombre || catDe(p.cat)?.nombre || '')}</p>
        <h3 class="prod__nombre">${esc(p.nombre)}</h3>
        ${luzHTML(p)}
        <p class="prod__colores" aria-label="${p.colores.length} colores">${swatches}</p>
        <p class="prod__precio"><span>Desde</span> <strong>${formatearPrecio(desde)}</strong>${unidad}${p.descuento > 0 ? ` <s>${formatearPrecio(lista)}</s>` : ''}</p>
        <div class="prod-actions"><button type="button" class="btn btn--cta prod-add" data-ver="${p.id}">Elegir medida</button></div>
      </div>
    </article>`;
  };

  function initReveals() {
    revealsListos = true;
    const items = document.querySelectorAll('[data-animate]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(el => el.classList.add('in'));
      return;
    }
    const entrar = (el, n) => {
      const d = Math.min(n * 0.1, 0.6);
      el.style.transitionDelay = `${d}s`;
      el.classList.add('in');
      setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
    };
    const io = new IntersectionObserver(entries => {
      let n = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) { entrar(entry.target, n++); io.unobserve(entry.target); }
      });
    }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
    items.forEach(el => io.observe(el));

    let queued = false;
    const sweep = () => {
      queued = false;
      let pending = 0;
      let n = 0;
      items.forEach(el => {
        if (el.classList.contains('in')) return;
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) { entrar(el, n++); io.unobserve(el); }
        else pending++;
      });
      if (!pending) {
        window.removeEventListener('scroll', queueSweep);
        window.removeEventListener('resize', queueSweep);
      }
    };
    const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
    requestAnimationFrame(() => requestAnimationFrame(queueSweep));
    window.addEventListener('load', queueSweep);
    window.addEventListener('scroll', queueSweep, { passive: true });
    window.addEventListener('resize', queueSweep, { passive: true });
  }

  function initHeroMotion() {
    if (reduceMotion || typeof gsap === 'undefined') return;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    const img = hero.querySelector('[data-hero-img]');
    if (img) tl.from(img, { scale: 1.1, duration: 1.8 }, 0);
    tl.from(hero.querySelectorAll('.hero-eyebrow'), { y: 18, opacity: 0, duration: 0.9 }, 0.1)
      .from(hero.querySelectorAll('h1'), { y: 40, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2)
      .from(hero.querySelectorAll('.hero-lead'), { y: 26, opacity: 0, duration: 1 }, 0.45)
      .from(hero.querySelectorAll('.hero-ctas .btn'), { y: 22, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6)
      .from(hero.querySelectorAll('.hero-badge'), { scale: 0.92, opacity: 0, duration: 1.1, stagger: 0.1, clearProps: 'transform,opacity' }, 0.68);
    const persiana = hero.querySelector('.hero__persiana');
    if (persiana) tl.fromTo(persiana, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.6, ease: 'power3.inOut', clearProps: 'clipPath' }, 0.05);
  }

  function initParallax() {
    if (reduceMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      gsap.fromTo(el, { yPercent: -3 }, { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.closest('.hero') || el, start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  const drawer = document.getElementById('carrito');
  const modal = document.getElementById('vista');
  let focoPrevio = null;
  const atrapar = (cont, e) => {
    if (e.key !== 'Tab') return;
    const f = [...cont.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent || x === document.activeElement);
    if (!f.length) return;
    const primero = f[0], ultimo = f[f.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
  };

  function updateCartBadge() {
    const n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(b => {
      b.textContent = n; b.hidden = n === 0;
      b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
    });
  }

  function pintarCarrito() {
    if (!drawer) return;
    const lista = drawer.querySelector('.carrito__lista');
    const pie = drawer.querySelector('.carrito__pie');
    const vacio = drawer.querySelector('.carrito__vacio');
    const items = Cart.get();
    vacio.hidden = items.length > 0;
    pie.hidden = items.length === 0;
    lista.innerHTML = items.map(i => {
      const p = getProducto(i.id);
      const sel = seleccionDe(p, i.var);
      const unidad = precioUnidad(p, sel);
      return `<li class="linea" data-id="${p.id}" data-var="${esc(i.var)}">
        <img src="${p.imgs[0][0]}" alt="" width="72" height="72">
        <div class="linea__info">
          <p class="linea__nombre">${esc(p.nombre)}</p>
          <p class="linea__var">${esc(textoSeleccion(p, sel))}</p>
          <div class="linea__fila">
            <div class="stepper stepper--sm"><button type="button" data-paso="-1" aria-label="Restar uno">−</button><span aria-live="polite">${i.qty}</span><button type="button" data-paso="1" aria-label="Sumar uno">+</button></div>
            <strong>${formatearPrecio(unidad * i.qty)}</strong>
          </div>
        </div>
        <button type="button" class="linea__quitar" aria-label="Quitar ${esc(p.nombre)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </li>`;
    }).join('');
    drawer.querySelector('[data-total]').textContent = formatearPrecio(Cart.total());
  }

  function abrirCarrito() {
    if (!drawer) return;
    focoPrevio = document.activeElement;
    pintarCarrito();
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('abierto'));
    document.body.classList.add('no-scroll');
    drawer.querySelector('.carrito__cerrar')?.focus();
  }
  function cerrarCarrito() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { drawer.hidden = true; }, reduceMotion ? 0 : 320);
    focoPrevio?.focus?.();
  }

  function initCarrito() {
    if (!drawer) return;
    document.querySelectorAll('[data-open-cart]').forEach(b => b.addEventListener('click', abrirCarrito));
    drawer.querySelectorAll('[data-cerrar-carrito]').forEach(b => b.addEventListener('click', cerrarCarrito));
    drawer.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); atrapar(drawer, e); });
    drawer.querySelector('.carrito__lista').addEventListener('click', e => {
      const li = e.target.closest('.linea');
      if (!li) return;
      const { id, var: v } = li.dataset;
      const it = Cart.get().find(x => x.id === id && x.var === v);
      if (!it) return;
      const paso = e.target.closest('[data-paso]');
      if (paso) Cart.setQty(id, v, it.qty + Number(paso.dataset.paso));
      if (e.target.closest('.linea__quitar')) Cart.remove(id, v);
    });
    drawer.querySelector('[data-finalizar]')?.addEventListener('click', () => showToast('¡Genial! El pago online se activa al pasar la web a producción.'));
    drawer.querySelector('[data-pedido-wa]')?.addEventListener('click', () => {
      const lineas = Cart.get().map(i => { const p = getProducto(i.id); const sel = seleccionDe(p, i.var); return `• ${i.qty} × ${p.nombre} — ${textoSeleccion(p, sel)} — ${formatearPrecio(precioUnidad(p, sel) * i.qty)}`; });
      window.open(waLink(`Hola Rollerlux, quiero hacer este pedido:\n${lineas.join('\n')}\nTotal: ${formatearPrecio(Cart.total())}`), '_blank', 'noopener');
    });
    document.addEventListener('cart:updated', () => { updateCartBadge(); if (!drawer.hidden) pintarCarrito(); });
    updateCartBadge();
  }

  function initFloats() {
    const wsp = document.getElementById('wsp-float');
    const cart = document.getElementById('cart-float');
    const sync = () => {
      const scrolled = window.scrollY > 600;
      wsp?.classList.toggle('visible', scrolled);
      cart?.classList.toggle('visible', scrolled || Cart.count() > 0);
    };
    window.addEventListener('scroll', sync, { passive: true });
    document.addEventListener('cart:updated', sync);
    sync();
  }

  function abrirVista(id, { sinURL = false } = {}) {
    const p = Tienda.obtener(id);
    if (!p || !modal) return;
    if (modal.hidden) focoPrevio = document.activeElement;
    const sel = seleccionDe(p, '');
    const cuerpo = modal.querySelector('.vista__cuerpo');
    const thumbs = p.imgs.length > 1 ? `<div class="vista__thumbs">${p.imgs.map(([s], i) => `<button type="button" data-thumb="${i}" aria-label="Foto ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${s}" alt="" width="80" height="80"></button>`).join('')}</div>` : '';
    const colores = p.colores.map((c, i) => `<label class="swatch"><input type="radio" name="color" value="${c.id}"${i === 0 ? ' checked' : ''}><span style="--sw:${c.hex}" title="${esc(c.nombre)}"></span><span class="sr-only">${esc(c.nombre)}</span></label>`).join('');
    const medida = p.tipo === 'medidas'
      ? `<div class="campo"><label for="vMed">Medida</label><select id="vMed" name="med">${p.medidas.map(m => `<option value="${m.id}">${esc(m.nombre)} · ${formatearPrecio(conDescuento(p, m.precio))}</option>`).join('')}</select></div>`
      : `<div class="medida">
          <div class="campo"><label for="vAncho">Ancho (cm)</label><input id="vAncho" name="ancho" type="number" inputmode="numeric" min="${p.lim.anchoMin}" max="${p.lim.anchoMax}" step="1" value="${sel.ancho}"></div>
          <span class="medida__x" aria-hidden="true">×</span>
          <div class="campo"><label for="vAlto">Alto (cm)</label><input id="vAlto" name="alto" type="number" inputmode="numeric" min="${p.lim.altoMin}" max="${p.lim.altoMax}" step="1" value="${sel.alto}"></div>
        </div>
        <p class="medida__ayuda">Ancho de ${p.lim.anchoMin} a ${p.lim.anchoMax} cm · alto de ${p.lim.altoMin} a ${p.lim.altoMax} cm. Se calcula por m² (mínimo 1 m²).</p>`;
    const rel = Tienda.consultar({ filtros: { cat: p.cat, excluir: [p.id] }, limite: 3 }).items;
    const relacionados = (rel.length >= 2 ? rel : rel.concat(Tienda.consultar({ filtros: { excluir: [p.id, ...rel.map(r => r.id)] }, limite: 3 - rel.length }).items)).slice(0, 3);
    cuerpo.innerHTML = `<div class="vista__galeria"><div class="vista__foto media"><img src="${p.imgs[0][0]}" alt="${esc(p.imgs[0][1])}" width="600" height="600"></div>${thumbs}</div>
      <form class="vista__info" novalidate>
        <p class="prod__cat">${esc(subDe(p.sub)?.nombre || catDe(p.cat)?.nombre || '')}</p>
        <h2 id="vistaTitulo">${esc(p.nombre)}</h2>
        ${luzHTML(p)}
        <p class="vista__desc">${esc(p.desc)}</p>
        <fieldset class="campo"><legend>Color: <strong data-color-nombre>${esc(p.colores[0].nombre)}</strong></legend><div class="swatches">${colores}</div></fieldset>
        ${medida}
        <p class="medida__err" role="alert" hidden></p>
        <div class="vista__total"><span data-detalle></span><strong data-precio></strong></div>
        <div class="vista__acciones">
          <div class="stepper"><button type="button" data-q="-1" aria-label="Restar uno">−</button><input type="number" name="qty" min="1" max="99" value="1" aria-label="Cantidad"><button type="button" data-q="1" aria-label="Sumar uno">+</button></div>
          <button type="submit" class="btn btn--cta prod-add">Agregar al carrito</button>
        </div>
        <div class="vista__acciones vista__acciones--sec">
          <button type="button" class="btn btn--dark" data-comprar>Comprar ahora</button>
          <a class="btn btn--line" data-wa-medida href="#" target="_blank" rel="noopener">Consultar esta medida</a>
        </div>
      </form>
      ${relacionados.length ? `<div class="vista__rel"><p class="vista__rel-tit">También te puede interesar</p><div class="vista__rel-lista">${relacionados.map(r => `<button type="button" class="mini" data-ver="${r.id}"><img src="${r.imgs[0][0]}" alt="" width="96" height="96"><span>${esc(r.nombre)}</span><strong>Desde ${formatearPrecio(precioDesde(r))}</strong></button>`).join('')}</div></div>` : ''}`;
    const form = cuerpo.querySelector('.vista__info');
    const err = form.querySelector('.medida__err');
    const leer = () => {
      const s = { color: form.querySelector('input[name="color"]:checked')?.value || p.colores[0].id };
      if (p.tipo === 'medidas') s.med = form.elements.med.value;
      else { s.ancho = parseInt(form.elements.ancho.value, 10); s.alto = parseInt(form.elements.alto.value, 10); }
      return s;
    };
    const qty = () => Math.max(1, Math.min(99, parseInt(form.elements.qty.value, 10) || 1));
    const pintar = () => {
      const s = leer();
      form.querySelector('[data-color-nombre]').textContent = colorDe(p, s.color).nombre;
      const ok = medidaValida(p, s);
      err.hidden = ok;
      if (!ok) err.textContent = `Revisá la medida: ancho entre ${p.lim.anchoMin} y ${p.lim.anchoMax} cm y alto entre ${p.lim.altoMin} y ${p.lim.altoMax} cm.`;
      ['ancho', 'alto'].forEach(n => { const i = form.elements[n]; if (i) { if (ok) i.removeAttribute('aria-invalid'); else i.setAttribute('aria-invalid', 'true'); } });
      form.querySelector('[data-precio]').textContent = ok ? formatearPrecio(precioUnidad(p, s) * qty()) : '—';
      form.querySelector('[data-detalle]').textContent = ok ? `${qty()} × ${textoSeleccion(p, s)}` : 'Medida fuera de rango';
      form.querySelector('[data-wa-medida]').href = waLink(`Hola Rollerlux, quiero consultar por ${p.nombre}${ok ? ` (${textoSeleccion(p, s)})` : ''}.`);
      return ok ? s : null;
    };
    const agregar = () => {
      const s = pintar();
      if (!s) { (form.elements.ancho || form.elements.med)?.focus(); showToast('Revisá la medida antes de agregar'); return false; }
      Cart.add(p, claveDe(p, s), qty());
      return true;
    };
    form.addEventListener('input', pintar);
    form.addEventListener('change', pintar);
    form.addEventListener('click', e => {
      const b = e.target.closest('[data-q]');
      if (b) { form.elements.qty.value = Math.max(1, Math.min(99, qty() + Number(b.dataset.q))); pintar(); }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (agregar()) showToast(`Agregaste ${p.nombre} al carrito`);
    });
    form.querySelector('[data-comprar]').addEventListener('click', () => { if (agregar()) { cerrarVista(true); abrirCarrito(); } });
    cuerpo.querySelectorAll('[data-thumb]').forEach(b => b.addEventListener('click', () => {
      const [s, a] = p.imgs[Number(b.dataset.thumb)];
      const im = cuerpo.querySelector('.vista__foto img');
      im.src = s; im.alt = a;
      cuerpo.querySelectorAll('[data-thumb]').forEach(x => x.removeAttribute('aria-current'));
      b.setAttribute('aria-current', 'true');
    }));
    pintar();
    if (modal.hidden) {
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('abierto'));
      document.body.classList.add('no-scroll');
    }
    modal.querySelector('.vista__panel').scrollTop = 0;
    modal.querySelector('.vista__cerrar').focus();
    if (!sinURL && document.body.dataset.pagina === 'catalogo') {
      const u = new URL(location.href); u.searchParams.set('producto', p.id); window.history.replaceState(null, '', u);
    }
  }
  function cerrarVista(sinFoco) {
    if (!modal || modal.hidden) return;
    modal.classList.remove('abierto');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { modal.hidden = true; }, reduceMotion ? 0 : 260);
    if (document.body.dataset.pagina === 'catalogo') {
      const u = new URL(location.href); u.searchParams.delete('producto'); window.history.replaceState(null, '', u);
    }
    if (!sinFoco) focoPrevio?.focus?.();
  }

  function initVista() {
    if (!modal) return;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-ver]');
      if (!b) return;
      if (b.closest('.dragging') || b.closest('[data-arrastrado]')) { e.preventDefault(); return; }
      abrirVista(b.dataset.ver);
    });
    modal.querySelectorAll('[data-cerrar-vista]').forEach(b => b.addEventListener('click', () => cerrarVista()));
    modal.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarVista(); atrapar(modal, e); });
  }

  function initMenuCategorias() {
    const caja = document.querySelector('[data-menu-cat]');
    if (!caja) return;
    const btn = caja.querySelector('.nav-cat__btn');
    const panel = caja.querySelector('.nav-cat__panel');
    const desktop = window.matchMedia('(min-width: 961px) and (hover: hover)');
    let t = 0;
    const abrir = () => { clearTimeout(t); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (panel.hidden ? abrir() : cerrar()));
    caja.addEventListener('mouseenter', () => { if (desktop.matches) abrir(); });
    caja.addEventListener('mouseleave', () => { if (desktop.matches) t = setTimeout(cerrar, 140); });
    document.addEventListener('click', e => { if (!caja.contains(e.target) && window.matchMedia('(min-width: 961px)').matches) cerrar(); });
    caja.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { cerrar(); btn.focus(); } });
    const params = new URLSearchParams(location.search);
    if (document.body.dataset.pagina === 'catalogo' && params.get('cat')) {
      caja.querySelector(`a[data-cat="${window.CSS.escape(params.get('cat'))}"]`)?.setAttribute('aria-current', 'page');
    }
  }

  function initNav() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    const closeBtn = document.getElementById('navClose');
    if (!toggle || !nav) return;
    let bd = document.querySelector('.nav-backdrop');
    if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
    const desktopMq = window.matchMedia('(min-width: 961px)');
    const close = () => {
      nav.classList.remove('open'); bd.classList.remove('open');
      if (!desktopMq.matches) nav.setAttribute('inert', '');
      toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
    };
    const open = () => {
      nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
      toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
      nav.querySelector('a, .nav-cat__btn')?.focus();
    };
    toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
    closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
    bd.addEventListener('click', close);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
    const syncInert = () => {
      if (desktopMq.matches) nav.removeAttribute('inert');
      else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
    };
    desktopMq.addEventListener('change', syncInert);
    syncInert();
  }

  function initRail() {
    const rail = document.getElementById('rail');
    if (!rail) return;
    rail.innerHTML = Tienda.consultar({ filtros: { destacado: true }, limite: 8 }).items.map(p => cardHTML(p).replace('data-animate="subir" style="opacity:0;transform:translateY(40px)"', 'data-animate="der" style="opacity:0;transform:translateX(64px)"')).join('');
    const prev = document.querySelector('[data-rail="prev"]');
    const next = document.querySelector('[data-rail="next"]');
    const paso = () => (rail.querySelector('.prod')?.getBoundingClientRect().width || 280) + 16;
    const inicio = () => parseFloat(window.getComputedStyle(rail).paddingInlineStart) || 0;
    const flechas = () => {
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
    };
    prev?.addEventListener('click', () => rail.scrollBy({ left: -paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    next?.addEventListener('click', () => rail.scrollBy({ left: paso(), behavior: reduceMotion ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', flechas, { passive: true });
    let abajo = false, movido = false, x0 = 0, s0 = 0, pid = 0;
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      abajo = true; movido = false; x0 = e.clientX; s0 = rail.scrollLeft; pid = e.pointerId;
    });
    window.addEventListener('pointermove', e => {
      if (!abajo) return;
      const dx = e.clientX - x0;
      if (!movido && Math.abs(dx) > 6) {
        movido = true; rail.classList.add('dragging'); rail.dataset.arrastrado = '1';
        try { rail.setPointerCapture?.(pid); } catch (err) { void err; }
      }
      if (movido) rail.scrollLeft = s0 - dx;
    });
    window.addEventListener('pointerup', e => {
      if (!abajo) return;
      abajo = false;
      try { rail.releasePointerCapture?.(pid); } catch (err) { void err; }
      if (!movido) return;
      const dx = e.clientX - x0;
      const base = rail.getBoundingClientRect().left + inicio();
      const pos = [...rail.querySelectorAll('.prod')].map(c => rail.scrollLeft + c.getBoundingClientRect().left - base);
      let destino = null;
      if (dx < -60) destino = pos.find(p => p > s0 + 4);
      else if (dx > 60) destino = [...pos].reverse().find(p => p < s0 - 4);
      if (destino == null) destino = pos.reduce((a, p) => (Math.abs(p - rail.scrollLeft) < Math.abs(a - rail.scrollLeft) ? p : a), pos[0] || 0);
      rail.scrollTo({ left: Math.max(0, destino), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => { delete rail.dataset.arrastrado; }, 80);
      setTimeout(() => rail.classList.remove('dragging'), 520);
    });
    flechas();
  }

  function initLuzTabs() {
    const lista = document.querySelector('.luz-tabs__lista');
    if (!lista) return;
    const tabs = [...lista.querySelectorAll('[role="tab"]')];
    tabs.forEach(t => {
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      const grid = panel?.querySelector('.luz-grid');
      if (!grid) return;
      const f = t.dataset.luz === 'exterior' ? { uso: 'exterior' } : { luz: t.dataset.luz, uso: 'interior' };
      grid.innerHTML = Tienda.consultar({ filtros: f, limite: 4 }).items.map(p => cardHTML(p)).join('');
    });
    const activar = (tab, foco) => {
      tabs.forEach(t => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (foco) tab.focus();
      revelarNuevos(document.getElementById(tab.getAttribute('aria-controls')));
      refrescar();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => activar(t));
      t.addEventListener('keydown', e => {
        let n = null;
        if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); activar(tabs[n], true); }
      });
    });
    document.querySelectorAll('[data-ir-luz]').forEach(a => a.addEventListener('click', () => {
      const t = tabs.find(x => x.dataset.luz === a.dataset.irLuz);
      if (t) activar(t);
    }));
  }

  function initGuia() {
    const form = document.getElementById('guia');
    if (!form) return;
    const out = document.getElementById('guiaResultado');
    const MATRIZ = {
      dormitorio: { oscurecer: 'roller-blackout', tamizar: 'roller-rustica', filtrar: 'roller-sunscreen', regular: 'roller-bandas' },
      living: { oscurecer: 'roller-blackout', tamizar: 'roller-rustica', filtrar: 'roller-sunscreen', regular: 'roller-bandas' },
      oficina: { oscurecer: 'roller-blackout', tamizar: 'cortina-vertical', filtrar: 'roller-sunscreen', regular: 'cortina-vertical' },
      exterior: { oscurecer: 'toldo-brazos', tamizar: 'roller-exterior', filtrar: 'roller-exterior', regular: 'toldo-brazos' },
    };
    const POR_QUE = {
      oscurecer: 'Para dormir de día o ver una pantalla sin reflejos, necesitás una tela que no deje pasar la luz.',
      tamizar: 'Una tela con textura reparte la luz pareja y le saca el golpe directo del sol.',
      filtrar: 'El sunscreen corta el sol y el calor pero te deja ver hacia afuera.',
      regular: 'Podés pasar de luz plena a penumbra sin subir ni bajar del todo la cortina.',
    };
    const ESP_EXTERIOR = {
      oscurecer: 'Para sombra plena en el patio, la lona del toldo corta el sol de arriba.',
      tamizar: 'La tela screen exterior corta el sol de costado sin tapar el jardín.',
      filtrar: 'La tela screen exterior corta el sol de costado sin tapar el jardín.',
      regular: 'Con la manivela abrís el toldo lo justo según la hora del día.',
    };
    const pintar = () => {
      const amb = form.querySelector('input[name="ambiente"]:checked')?.value || 'dormitorio';
      const obj = form.querySelector('input[name="objetivo"]:checked')?.value || 'oscurecer';
      const p = Tienda.obtener(MATRIZ[amb][obj]);
      if (!p) return;
      const etiqueta = form.querySelector(`input[name="ambiente"][value="${amb}"]`)?.nextElementSibling?.textContent || '';
      out.innerHTML = `<div class="guia__texto">
          <p class="guia__para">Para ${esc(etiqueta.toLowerCase())}</p>
          <p class="guia__nombre">${esc(p.nombre)}</p>
          <p>${esc(amb === 'exterior' ? ESP_EXTERIOR[obj] : POR_QUE[obj])}</p>
          ${luzHTML(p)}
          <p class="prod__precio"><span>Desde</span> <strong>${formatearPrecio(precioDesde(p))}</strong>${p.tipo === 'medidas' ? '' : '<small>/ m²</small>'}</p>
          <div class="guia__acciones"><button type="button" class="btn btn--cta" data-ver="${p.id}">Elegir medida</button><a class="btn btn--line" href="${waLink(`Hola Rollerlux, para ${etiqueta.toLowerCase()} me recomendaron ${p.nombre}. ¿Me asesoran?`)}" target="_blank" rel="noopener">Consultar por WhatsApp</a></div>
        </div>`;
    };
    form.addEventListener('change', pintar);
    pintar();
  }

  function initCatalogo() {
    if (document.body.dataset.pagina !== 'catalogo') return;
    const grid = document.getElementById('grilla');
    const verMas = document.getElementById('verMas');
    const contador = document.getElementById('contador');
    const vacio = document.getElementById('sinResultados');
    const buscador = document.getElementById('buscarInput');
    const orden = document.getElementById('orden');
    const filtros = document.getElementById('filtros');
    const btnFiltros = document.getElementById('btnFiltros');
    const params = new URLSearchParams(location.search);
    const validos = (v, ok) => (v || '').split(',').filter(x => ok.includes(x));
    const estado = {
      cat: validos(params.get('cat'), CATEGORIAS.map(c => c.id)),
      sub: validos(params.get('sub'), SUBCATEGORIAS.map(s => s.id)),
      luz: validos(params.get('luz'), Object.keys(LUCES)),
      uso: validos(params.get('uso'), Object.keys(USOS)),
      q: (params.get('q') || '').slice(0, 60),
      orden: ORDENES[params.get('orden')] ? params.get('orden') : 'destacados',
    };
    estado.sub.forEach(s => { const c = subDe(s)?.cat; if (c && !estado.cat.includes(c)) estado.cat.push(c); });
    let cursor = null;
    let mostrados = 0;
    const filtrosDe = () => ({ cat: estado.cat, sub: estado.sub, luz: estado.luz, uso: estado.uso });
    const sincronizarUI = () => {
      filtros.querySelectorAll('input[data-f]').forEach(i => { i.checked = estado[i.dataset.f].includes(i.value); });
      filtros.querySelectorAll('.filtro-sub').forEach(g => { g.hidden = !estado.cat.includes(g.dataset.cat); });
      buscador.value = estado.q;
      orden.value = estado.orden;
      const n = estado.cat.length + estado.sub.length + estado.luz.length + estado.uso.length;
      btnFiltros.querySelector('span').textContent = n ? `Filtros (${n})` : 'Filtros';
      document.querySelectorAll('[data-limpiar]').forEach(b => { b.hidden = !n && !estado.q; });
      const migaCat = document.getElementById('migaCat');
      const c = estado.cat.length === 1 ? catDe(estado.cat[0]) : null;
      migaCat.hidden = !c;
      if (c) migaCat.querySelector('span').textContent = c.nombre;
    };
    const escribirURL = () => {
      const u = new URL(location.href);
      ['cat', 'sub', 'luz', 'uso'].forEach(k => (estado[k].length ? u.searchParams.set(k, estado[k].join(',')) : u.searchParams.delete(k)));
      estado.q ? u.searchParams.set('q', estado.q) : u.searchParams.delete('q');
      estado.orden !== 'destacados' ? u.searchParams.set('orden', estado.orden) : u.searchParams.delete('orden');
      window.history.replaceState(null, '', u);
    };
    const pintar = agregar => {
      const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
      cursor = res.cursor;
      const html = res.items.map(p => cardHTML(p)).join('');
      if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
      mostrados = agregar ? mostrados + res.items.length : res.items.length;
      verMas.hidden = !cursor;
      vacio.hidden = mostrados > 0;
      const total = estado.q ? null : Tienda.contar(filtrosDe());
      contador.innerHTML = mostrados ? (total != null ? `<strong>${total}</strong> ${total === 1 ? 'producto' : 'productos'}` : `<strong>${mostrados}${cursor ? '+' : ''}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»`) : '';
      revelarNuevos(grid);
      refrescar();
    };
    const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(false); };
    filtros.addEventListener('change', e => {
      const i = e.target.closest('input[data-f]');
      if (!i) return;
      const lista = estado[i.dataset.f];
      if (i.checked && !lista.includes(i.value)) lista.push(i.value);
      if (!i.checked) estado[i.dataset.f] = lista.filter(x => x !== i.value);
      if (i.dataset.f === 'cat' && !i.checked) {
        const subs = (catDe(i.value)?.subs || []).map(s => s.id);
        estado.sub = estado.sub.filter(s => !subs.includes(s));
      }
      aplicar();
    });
    let tq = 0;
    buscador.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(() => { estado.q = buscador.value.trim().slice(0, 60); aplicar(); }, 220); });
    buscador.closest('form')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tq); estado.q = buscador.value.trim().slice(0, 60); aplicar(); });
    orden.addEventListener('change', () => { estado.orden = orden.value; aplicar(); });
    verMas.addEventListener('click', () => pintar(true));
    document.querySelectorAll('[data-limpiar]').forEach(b => b.addEventListener('click', () => {
      estado.cat = []; estado.sub = []; estado.luz = []; estado.uso = []; estado.q = '';
      aplicar();
    }));
    btnFiltros.addEventListener('click', () => {
      const abierto = btnFiltros.getAttribute('aria-expanded') === 'true';
      btnFiltros.setAttribute('aria-expanded', String(!abierto));
      filtros.classList.toggle('abierto', !abierto);
      refrescar();
    });
    sincronizarUI();
    pintar(false);
    if (location.hash === '#buscar') setTimeout(() => buscador.focus(), 300);
    const prod = params.get('producto');
    if (prod && Tienda.obtener(prod)) setTimeout(() => abrirVista(prod, { sinURL: true }), 400);
  }

  function initModelBarScroll() {
    const bar = document.querySelector('.gw-modelos');
    if (!bar) return;
    let showTimer = 0;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.scrollY <= 8) {
        bar.classList.remove('gw-modelos--scrolling');
        return;
      }
      bar.classList.add('gw-modelos--scrolling');
      clearTimeout(showTimer);
      showTimer = setTimeout(() => bar.classList.remove('gw-modelos--scrolling'), 120);
    };
    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
  }

  [initRail, initLuzTabs, initGuia, initCatalogo, initCarrito, initVista, initMenuCategorias, initFloats, initHeroMotion, initParallax, initReveals, initNav, initModelBarScroll]
    .forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
}
