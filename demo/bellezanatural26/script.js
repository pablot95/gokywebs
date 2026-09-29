const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const WSP = '5493755509022';
const IG = 'https://www.instagram.com/_bellezanatural26/';
const MARCA = 'Belleza Natural';

const CURSOS = [
  {
    id: 'desde-cero', n: 1, titulo: 'Cosmética natural desde cero', corto: 'Curso completo',
    categorias: ['Rostro', 'Cuerpo', 'Cabello'], nivel: 'Inicial', precio: 62000, descuento: 0, badge: 'Curso completo',
    img: 'images/mesa-botanica-9x16.webp', w: 941, h: 1672, ratio: 'v',
    alt: 'Mesa de trabajo con goteros ámbar, un bálsamo, una crema y cuencos de caléndula, manzanilla, pétalos de rosa y arcilla',
    corta: 'De tu primera balanza a doce productos terminados: aceites, bálsamos, cremas y champú sólido.',
    completa: 'El curso para arrancar de cero y no quedarte en la teoría. Primero armás tu laboratorio en la cocina (balanza, termómetro, frascos y limpieza) y después hacés doce recetas, de la más simple a la más técnica: aceites y bálsamos, cremas que no se cortan y champú sólido. Todas vienen en gramos y en porcentajes, así las hacés en la cantidad que quieras.',
    recetas: ['Oleato de caléndula', 'Sérum de rosa mosqueta', 'Bálsamo labial', 'Ungüento de caléndula', 'Crema de manos', 'Crema facial liviana', 'Crema corporal de karité', 'Champú sólido de ortiga y romero', 'Acondicionador en barra', 'Desodorante en crema', 'Exfoliante de azúcar', 'Mascarilla de arcilla'],
    ingredientes: ['caléndula', 'rosa mosqueta', 'cera de abejas', 'karité', 'manteca de cacao', 'aceite de almendras', 'girasol', 'arcilla', 'ortiga', 'romero', 'lavanda', 'azúcar'],
    aprendes: ['Armar tu laboratorio casero con lo justo', 'Pasar una fórmula de porcentajes a gramos', 'Hacer una crema estable que no se corta', 'Elegir el conservante y calcular el vencimiento'],
    requisitos: ['No hace falta experiencia', 'Balanza de cocina que pese de a 1 g', 'Termómetro de cocina y frascos limpios'],
    incluye: ['Clases en video para ver cuando quieras', 'Recetario en PDF con las 12 fórmulas en gramos', 'Lista de materias primas y dónde conseguirlas', 'Consultas por WhatsApp durante el curso'],
    modulos: [
      { t: 'Tu laboratorio en la cocina', clases: [['Qué necesitás y qué no', 12, 'video', true], ['Higiene: limpiar y desinfectar tus utensilios', 9, 'video'], ['Pesar de a 1 g y medir temperaturas', 11, 'video'], ['Lista de compras y proveedores', 0, 'pdf']] },
      { t: 'Aceites y macerados', clases: [['Aceites vegetales: cuál para cada piel', 14, 'video'], ['Oleato de caléndula en frío', 16, 'video'], ['Sérum de rosa mosqueta', 13, 'video']] },
      { t: 'Bálsamos y ungüentos', clases: [['Ceras y mantecas: cómo elegirlas', 10, 'video'], ['Bálsamo labial', 13, 'video'], ['Ungüento de caléndula para manos secas', 15, 'video']] },
      { t: 'Cremas y emulsiones', clases: [['Fase acuosa, fase oleosa y emulsionante', 18, 'video'], ['Crema de manos paso a paso', 24, 'video'], ['Crema facial liviana', 22, 'video'], ['Por qué se corta una crema y cómo salvarla', 12, 'video']] },
      { t: 'Cabello y cosmética sólida', clases: [['Tensioactivos suaves: cuáles y por qué', 14, 'video'], ['Champú sólido de ortiga y romero', 21, 'video'], ['Acondicionador en barra', 17, 'video']] },
      { t: 'Conservación y etiquetado', clases: [['Conservantes aptos para cosmética natural', 13, 'video'], ['Cuánto dura cada producto', 10, 'video'], ['Recetario: cuatro recetas más para seguir practicando', 0, 'pdf'], ['Etiquetas para tus frascos', 0, 'pdf']] }
    ]
  },
  {
    id: 'aceites', n: 2, titulo: 'Aceites botánicos y sérums faciales', corto: 'Aceites y sérums',
    categorias: ['Rostro'], nivel: 'Inicial', precio: 21000, descuento: 0, badge: '',
    img: 'images/goteros-sueros.webp', w: 1254, h: 1254, ratio: 'c',
    alt: 'Frascos gotero de vidrio ámbar y transparente con aceites y sérums, un pote de crema y ramas de eucalipto sobre mármol',
    corta: 'Macerados en frío y sérums de gotero, con aceites vegetales que se consiguen fácil.',
    completa: 'Aprendés a elegir el aceite según la piel, a macerar flores en frío sin que el aceite se ponga rancio y a combinar aceites para un sérum de uso diario. Es el curso más corto para empezar: casi todo se hace con un frasco, un colador fino y paciencia.',
    recetas: ['Oleato de caléndula', 'Oleato de lavanda', 'Sérum de rosa mosqueta', 'Aceite desmaquillante', 'Aceite de masajes'],
    ingredientes: ['caléndula', 'lavanda', 'rosa mosqueta', 'girasol', 'aceite de almendras', 'jojoba'],
    aprendes: ['Elegir el aceite según tu tipo de piel', 'Macerar flores en frío paso a paso', 'Guardar los aceites para que no se enrancien'],
    requisitos: ['No hace falta experiencia', 'Frascos de vidrio con tapa y un colador fino'],
    incluye: ['Clases en video para ver cuando quieras', 'Recetario en PDF con las 5 fórmulas', 'Tabla de aceites vegetales y su vida útil'],
    modulos: [
      { t: 'Aceites vegetales', clases: [['Cuál aceite para cada piel', 14, 'video', true], ['Cómo leer la etiqueta de un aceite', 8, 'video']] },
      { t: 'El macerado en frío', clases: [['Oleato de caléndula', 16, 'video'], ['Oleato de lavanda', 10, 'video'], ['Filtrar y envasar sin contaminar', 9, 'video']] },
      { t: 'Sérums y aceites de uso diario', clases: [['Sérum de rosa mosqueta', 15, 'video'], ['Aceite desmaquillante', 12, 'video'], ['Aceite de masajes', 9, 'video'], ['Tabla de aceites y vida útil', 0, 'pdf']] }
    ]
  },
  {
    id: 'cremas', n: 3, titulo: 'Cremas y emulsiones que no se cortan', corto: 'Cremas',
    categorias: ['Rostro', 'Cuerpo'], nivel: 'Intermedio', precio: 26000, descuento: 15, badge: '',
    img: 'images/crema-en-frascos.webp', w: 1254, h: 1254, ratio: 'c',
    alt: 'Manos envasando una crema recién hecha en frascos de vidrio, con caléndula, manzanilla, lavanda y equinácea sobre la mesa',
    corta: 'Entendés cómo funciona una emulsión y tu crema sale igual cada vez.',
    completa: 'Una crema es agua y aceite que se llevan bien gracias a un emulsionante. En este curso entendés esa fórmula (fases, temperaturas y proporciones) y la aplicás en cuatro cremas distintas. También aprendés a darte cuenta de por qué se cortó una crema y qué hacer para salvarla.',
    recetas: ['Crema de manos', 'Crema facial liviana', 'Crema corporal de karité', 'Crema de noche con rosa mosqueta'],
    ingredientes: ['karité', 'rosa mosqueta', 'aceite de almendras', 'hidrolato', 'glicerina', 'aloe vera'],
    aprendes: ['Leer y ajustar una fórmula de crema', 'Trabajar las fases a la temperatura justa', 'Elegir el conservante y medir el pH'],
    requisitos: ['Haber hecho alguna receta simple, como un aceite o un bálsamo', 'Balanza de precisión de a 0,1 g y termómetro'],
    incluye: ['Clases en video para ver cuando quieras', 'Recetario en PDF con las 4 fórmulas', 'Planilla para pasar porcentajes a gramos'],
    modulos: [
      { t: 'Cómo funciona una emulsión', clases: [['Qué es emulsionar', 12, 'video', true], ['Por qué se trabaja a 70 °C', 9, 'video'], ['Emulsionantes aptos para cosmética natural', 11, 'video']] },
      { t: 'Tus cremas', clases: [['Crema de manos', 24, 'video'], ['Crema facial liviana', 22, 'video'], ['Crema corporal de karité', 19, 'video'], ['Crema de noche con rosa mosqueta', 20, 'video']] },
      { t: 'Si algo sale mal', clases: [['Por qué se corta una crema', 12, 'video'], ['Textura, pH y conservante', 14, 'video'], ['Planilla de porcentajes a gramos', 0, 'pdf']] }
    ]
  },
  {
    id: 'barras', n: 4, titulo: 'Champú sólido y jabón artesanal', corto: 'Champú y jabón',
    categorias: ['Cabello', 'Cuerpo'], nivel: 'Intermedio', precio: 24000, descuento: 0, badge: '',
    img: 'images/barras-champu-jabon.webp', w: 1254, h: 1254, ratio: 'c',
    alt: 'Barras de champú sólido y jabón artesanal con flores secas, un frasco con dosificador y cuencos de caléndula y lavanda',
    corta: 'Barras para el pelo y para el cuerpo, con los tiempos de secado y de curado bien explicados.',
    completa: 'Hacés champú y acondicionador en barra con tensioactivos suaves, y jabón con el método en frío. El jabón lleva soda cáustica: antes de tocarla aprendés a trabajar seguro, con guantes, antiparras y ventilación. Y entendés por qué el jabón necesita un mes de curado antes de usarse.',
    recetas: ['Champú sólido de ortiga y romero', 'Acondicionador en barra', 'Jabón de avena', 'Jabón de caléndula'],
    ingredientes: ['ortiga', 'romero', 'avena', 'caléndula', 'aceite de coco', 'aceite de oliva', 'arcilla', 'soda cáustica'],
    aprendes: ['Formular un champú sólido para tu tipo de pelo', 'Trabajar la soda cáustica de forma segura', 'Cortar, curar y guardar tus barras'],
    requisitos: ['Guantes, antiparras y un lugar ventilado', 'Moldes de silicona y balanza de a 1 g'],
    incluye: ['Clases en video para ver cuando quieras', 'Recetario en PDF con las 4 fórmulas', 'Guía de seguridad para trabajar con soda'],
    modulos: [
      { t: 'Cosmética sólida', clases: [['Por qué en barra', 9, 'video', true], ['Tensioactivos suaves', 14, 'video']] },
      { t: 'Para el pelo', clases: [['Champú sólido de ortiga y romero', 21, 'video'], ['Acondicionador en barra', 17, 'video']] },
      { t: 'Jabón en frío', clases: [['Seguridad con la soda cáustica', 11, 'video'], ['Jabón de avena', 26, 'video'], ['Jabón de caléndula', 18, 'video'], ['Cortar y curar las barras', 8, 'video'], ['Guía de seguridad', 0, 'pdf']] }
    ]
  },
  {
    id: 'balsamos', n: 5, titulo: 'Bálsamos y ungüentos de hierbas', corto: 'Bálsamos',
    categorias: ['Rostro', 'Cuerpo'], nivel: 'Inicial', precio: 16000, descuento: 0, badge: 'Para empezar',
    img: 'images/mortero-hierbas.webp', w: 1254, h: 1254, ratio: 'c',
    alt: 'Mortero de mármol con flores secas, frascos de aceite con corcho, un bol de crema, resina y ramas de romero y manzanilla',
    corta: 'La puerta de entrada: sin agua ni emulsiones, en una tarde tenés tus primeros frascos.',
    completa: 'Los bálsamos son la forma más simple de empezar: aceite, cera y manteca, sin agua y sin conservantes. Hacés un bálsamo labial, un ungüento de caléndula para manos secas, un bálsamo de pies y una barra de masajes, y aprendés a cambiar la textura subiendo o bajando la cera.',
    recetas: ['Bálsamo labial', 'Ungüento de caléndula', 'Bálsamo de pies con menta', 'Barra de masajes'],
    ingredientes: ['cera de abejas', 'candelilla', 'karité', 'manteca de cacao', 'caléndula', 'menta'],
    aprendes: ['Elegir entre cera de abejas, candelilla o soja', 'Ajustar la textura con la proporción de cera', 'Envasar en pote y en barra'],
    requisitos: ['No hace falta experiencia', 'Una olla para baño María y frascos chicos'],
    incluye: ['Clases en video para ver cuando quieras', 'Recetario en PDF con las 4 fórmulas', 'Etiquetas para imprimir'],
    modulos: [
      { t: 'Ceras y mantecas', clases: [['Qué cera usar', 10, 'video', true], ['Karité, cacao y mango: diferencias', 9, 'video']] },
      { t: 'Tus bálsamos', clases: [['Bálsamo labial', 13, 'video'], ['Ungüento de caléndula', 15, 'video'], ['Bálsamo de pies con menta', 11, 'video'], ['Barra de masajes', 12, 'video'], ['Etiquetas para imprimir', 0, 'pdf']] }
    ]
  }
];

const RECETAS = [
  {
    id: 'oleato', nombre: 'Oleato de caléndula', curso: 'aceites', completo: true, espera: 'Macera 4 semanas',
    pasos: [
      { d: 0, tipo: 'trabajo', t: 'Llenás un frasco con caléndula seca y la cubrís con aceite de girasol.', min: 30 },
      { d: 1, hasta: 27, tipo: 'espera', t: 'Macera en un lugar oscuro; lo agitás un poco cada día.' },
      { d: 28, tipo: 'listo', t: 'Filtrás, envasás en gotero ámbar y etiquetás.', min: 30 }
    ]
  },
  {
    id: 'crema', nombre: 'Crema de manos', curso: 'cremas', completo: true, espera: 'Reposa 1 día',
    pasos: [
      { d: 0, tipo: 'trabajo', t: 'Calentás las dos fases a 70 °C, emulsionás y envasás.', min: 90 },
      { d: 1, tipo: 'listo', t: 'Revisás textura y pH: queda lista para usar.', min: 10 }
    ]
  },
  {
    id: 'champu', nombre: 'Champú sólido', curso: 'barras', completo: true, espera: 'Se seca 3 días',
    pasos: [
      { d: 0, tipo: 'trabajo', t: 'Mezclás tensioactivos, aceites y arcilla, y moldeás.', min: 60 },
      { d: 1, tipo: 'trabajo', t: 'Desmoldás las barras y las dejás al aire.', min: 10 },
      { d: 2, tipo: 'espera', t: 'Se terminan de secar.' },
      { d: 3, tipo: 'listo', t: 'Listas para usar.' }
    ]
  },
  {
    id: 'jabon', nombre: 'Jabón de avena', curso: 'barras', completo: false, espera: 'Cura 4 semanas',
    pasos: [
      { d: 0, tipo: 'trabajo', t: 'Con guantes y antiparras preparás la soda, la unís a los aceites y moldeás.', min: 90 },
      { d: 1, tipo: 'espera', t: 'Saponifica en el molde.' },
      { d: 2, tipo: 'trabajo', t: 'Desmoldás y cortás las barras.', min: 20 },
      { d: 3, hasta: 29, tipo: 'espera', t: 'Curado: las barras se secan y se vuelven más suaves.' },
      { d: 30, tipo: 'listo', t: 'Listo para usar.' }
    ]
  },
  {
    id: 'balsamo', nombre: 'Bálsamo labial', curso: 'balsamos', completo: true, espera: 'Listo en el día',
    pasos: [
      { d: 0, tipo: 'listo', t: 'Fundís cera y manteca a baño María, sumás el aceite y envasás: en dos horas se endurece.', min: 40 }
    ]
  }
];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const precioFinal = c => (c.descuento > 0 ? Math.round(c.precio * (1 - c.descuento / 100)) : c.precio);
const getCurso = id => CURSOS.find(c => c.id === id);
const normal = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const dos = n => String(n).padStart(2, '0');
const clasesDe = c => c.modulos.reduce((n, m) => n + m.clases.filter(k => k[2] === 'video').length, 0);
const minutosDe = c => c.modulos.reduce((n, m) => n + m.clases.reduce((s, k) => s + k[1], 0), 0);
const wspHref = lineas => `https://wa.me/${WSP}?text=${encodeURIComponent(lineas.join('\n'))}`;

function duracion(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function statsAcademia() {
  const recetas = new Set(CURSOS.flatMap(c => c.recetas.map(normal)));
  return { cursos: CURSOS.length, clases: CURSOS.reduce((n, c) => n + clasesDe(c), 0), recetas: recetas.size };
}

function filtrarCursos(f) {
  const palabras = normal(f.q).trim().split(/\s+/).filter(Boolean);
  return CURSOS.filter(c => {
    if (f.cat !== 'todos' && !c.categorias.includes(f.cat)) return false;
    if (!palabras.length) return true;
    const texto = normal([c.titulo, c.corto, c.categorias.join(' '), c.nivel, c.recetas.join(' '), c.ingredientes.join(' '), c.corta].join(' '));
    return palabras.every(p => texto.includes(p));
  });
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const soloFecha = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sumarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const difDias = (a, b) => Math.round((soloFecha(b) - soloFecha(a)) / 86400000);
const mismoDia = (a, b) => difDias(a, b) === 0;
const fechaLarga = d => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
const fechaCorta = d => `${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
const claveFecha = d => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);
const duracionReceta = r => Math.max(...r.pasos.map(p => p.hasta ?? p.d));

function desdeClave(k) {
  const [a, m, d] = k.split('-').map(Number);
  return new Date(a, m - 1, d);
}

function proximoSabado(hoy) {
  const d = soloFecha(hoy);
  return sumarDias(d, (6 - d.getDay() + 7) % 7);
}

function planDe(receta, inicio) {
  const ini = soloFecha(inicio);
  const total = duracionReceta(receta);
  const estados = Array.from({ length: total + 1 }, () => 'espera');
  receta.pasos.forEach(p => {
    if (p.tipo !== 'espera') estados[p.d] = p.tipo;
  });
  return {
    inicio: ini,
    fin: sumarDias(ini, total),
    total,
    estados,
    minutos: receta.pasos.reduce((s, p) => s + (p.min || 0), 0),
    pasos: receta.pasos.map(p => ({ tipo: p.tipo, t: p.t, min: p.min || 0, desde: sumarDias(ini, p.d), hasta: sumarDias(ini, p.hasta ?? p.d) }))
  };
}

function estadoDe(plan, fecha) {
  const off = difDias(plan.inicio, fecha);
  return off < 0 || off > plan.total ? null : plan.estados[off];
}

function celdasMes(anio, mes) {
  const offset = (new Date(anio, mes, 1).getDay() + 6) % 7;
  const dias = new Date(anio, mes + 1, 0).getDate();
  const celdas = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= dias; d++) celdas.push(new Date(anio, mes, d));
  while (celdas.length % 7) celdas.push(null);
  return celdas;
}

const Cart = {
  KEY: 'bellezanatural26_cart',
  memoria: [],
  get() {
    try {
      const items = JSON.parse(localStorage.getItem(this.KEY));
      return Array.isArray(items) ? items : [];
    } catch {
      return this.memoria;
    }
  },
  save(items) {
    this.memoria = items;
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
    } catch {
      this.memoria = items.slice();
    }
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },
  add(curso) {
    const items = this.get();
    if (items.some(i => i.id === curso.id)) return false;
    items.push({ id: curso.id, qty: 1 });
    this.save(items);
    return true;
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); },
  clear() { this.save([]); },
  count() { return this.get().length; },
  total() { return this.get().reduce((s, i) => { const c = getCurso(i.id); return c ? s + precioFinal(c) : s; }, 0); },
  limpiar() {
    const items = this.get();
    const validos = items.filter(i => getCurso(i.id));
    if (validos.length !== items.length) this.save(validos);
  }
};

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const ICONO = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>'
};

const checkLi = t => `<li>${ICONO.check}<span>${esc(t)}</span></li>`;

function showToast(msg) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; wrap.setAttribute('aria-live', 'polite'); document.body.appendChild(wrap); }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => { toast.classList.add('hiding'); setTimeout(() => toast.remove(), 220); }, 3200);
}

function precioHTML(c) {
  const fin = formatearPrecio(precioFinal(c));
  return c.descuento > 0
    ? `<p class="precio"><span>${fin}</span><s>${formatearPrecio(c.precio)}</s></p>`
    : `<p class="precio"><span>${fin}</span></p>`;
}

function modulosHTML(c, abrirPrimero) {
  return c.modulos.map((m, i) => {
    const min = m.clases.reduce((s, k) => s + k[1], 0);
    const vids = m.clases.filter(k => k[2] === 'video').length;
    const clases = m.clases.map(k => `<li class="clase">${ICONO[k[2]] || ICONO.video}<span>${esc(k[0])}${k[3] ? ' <span class="tag-muestra">Clase de muestra</span>' : ''}</span><span class="clase__d">${k[2] === 'pdf' ? 'PDF' : k[1] + ' min'}</span></li>`).join('');
    return `<details class="mod"${abrirPrimero && i === 0 ? ' open' : ''}><summary><span class="mod__n">${dos(i + 1)}</span><span class="mod__t">${esc(m.t)}</span><span class="mod__d">${vids} ${vids === 1 ? 'clase' : 'clases'}${min ? ' · ' + duracion(min) : ''}</span>${ICONO.chev}</summary><ul>${clases}</ul></details>`;
  }).join('');
}

function hace(c, n) {
  const extra = c.recetas.length - n;
  return c.recetas.slice(0, n).join(', ') + (extra > 0 ? ` y ${extra} más` : '');
}

function cardHTML(c) {
  const completo = c.id === 'desde-cero';
  const badge = c.badge
    ? `<span class="curso__badge">${esc(c.badge)}</span>`
    : c.descuento > 0 ? `<span class="curso__badge curso__badge--off">-${c.descuento}%</span>` : '';
  return `<article class="curso${completo ? ' curso--completo' : ''}" data-animate style="opacity:0;transform:translateY(20px)">
    <button type="button" class="curso__media" data-open="${c.id}" aria-label="Ver el curso ${esc(c.titulo)}">
      <img src="${c.img}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}">
      <span class="curso__n">N.º ${dos(c.n)}</span>${badge}
    </button>
    <div class="curso__body">
      <p class="curso__meta">${clasesDe(c)} clases · ${duracion(minutosDe(c))} · ${esc(c.nivel)}</p>
      <h3 class="curso__t">${esc(c.titulo)}</h3>
      ${completo ? `<p class="curso__desc">${esc(c.corta)}</p>` : ''}
      <p class="curso__hace"><b>Hacés:</b> ${esc(hace(c, completo ? 4 : 1))}</p>
      <div class="curso__pie">${precioHTML(c)}<div class="curso__acts"><button type="button" class="btn btn--soft btn--sm curso__ver" data-open="${c.id}">Ver curso</button><button type="button" class="btn btn--solid btn--sm curso__add" data-add="${c.id}" aria-label="Inscribirme a ${esc(c.titulo)}"><svg class="curso__add-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg><span>Inscribirme</span></button></div></div>
    </div>
    ${completo ? `<div class="curso__recetario"><p>Las ${c.recetas.length} recetas del curso</p><ol>${c.recetas.map(r => `<li>${esc(r)}</li>`).join('')}</ol></div>` : ''}
  </article>`;
}

const FILTRO = { cat: 'todos', q: '' };
let cursosVisibles = CURSOS;

function rellenar() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  grid.querySelector('.curso-filler')?.remove();
  if (!cursosVisibles.length) return;
  const cols = window.getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length;
  if (cols < 2) return;
  const usados = cursosVisibles.reduce((n, c) => n + (c.id === 'desde-cero' ? cols : 1), 0);
  const resto = usados % cols;
  if (!resto) return;
  grid.insertAdjacentHTML('beforeend', `<a class="curso-filler" href="#calendario" style="grid-column: span ${cols - resto}"><b>¿Primera vez? Un bálsamo se hace en una tarde; un oleato espera cuatro semanas.</b><span>Mirá cuánto tarda cada receta →</span></a>`);
}

function pintarCursos() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  const res = filtrarCursos(FILTRO);
  const q = FILTRO.q.trim();
  cursosVisibles = res;
  grid.innerHTML = res.map(cardHTML).join('');
  grid.hidden = !res.length;
  const vacio = document.getElementById('cursos-vacio');
  if (vacio) vacio.hidden = res.length > 0;
  const vacioT = document.getElementById('cursos-vacio-t');
  if (vacioT && !res.length) vacioT.textContent = q ? `No encontramos cursos con «${q}». Probá con «caléndula», «karité» o «champú».` : 'No hay cursos para esta zona.';
  const cnt = document.getElementById('cursos-count');
  if (cnt) {
    const partes = [`<b>${res.length}</b> ${res.length === 1 ? 'curso' : 'cursos'}`];
    if (FILTRO.cat !== 'todos') partes.push(`para ${esc(FILTRO.cat.toLowerCase())}`);
    if (q) partes.push(`con «${esc(q)}»`);
    cnt.innerHTML = partes.join(' ');
  }
  rellenar();
  revelarNuevos(grid);
}

function initCursos() {
  const grid = document.getElementById('cursos-grid');
  if (!grid) return;
  const chips = [...document.querySelectorAll('.filtros .chip')];
  const q = document.getElementById('q');
  const marcar = cat => chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === cat)));
  pintarCursos();
  chips.forEach(chip => chip.addEventListener('click', () => {
    FILTRO.cat = chip.dataset.cat;
    marcar(FILTRO.cat);
    pintarCursos();
  }));
  let espera = 0;
  q?.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(() => { FILTRO.q = q.value; pintarCursos(); }, 160);
  });
  document.getElementById('buscar')?.addEventListener('submit', e => {
    e.preventDefault();
    FILTRO.q = q ? q.value : '';
    pintarCursos();
  });
  document.getElementById('cursos-reset')?.addEventListener('click', () => {
    FILTRO.cat = 'todos';
    FILTRO.q = '';
    if (q) q.value = '';
    marcar('todos');
    pintarCursos();
  });
  let ancho = 0;
  window.addEventListener('resize', () => { clearTimeout(ancho); ancho = setTimeout(rellenar, 150); }, { passive: true });
}

function panelHTML(c, i) {
  return `<div class="ppanel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" tabindex="0"${i ? ' hidden' : ''}>
    <div class="ppanel__media${c.ratio === 'v' ? ' ppanel__media--v' : ''}"><img src="${c.img}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}"${i ? ' loading="lazy"' : ''}></div>
    <div class="ppanel__txt">
      <p class="etq__n">N.º ${dos(c.n)} · ${esc(c.categorias.join(' · '))}</p>
      <h3 class="h2 ppanel__t">${esc(c.titulo)}</h3>
      <p class="lead">${esc(c.corta)}</p>
      <ul class="datos"><li>${clasesDe(c)} clases</li><li>${duracion(minutosDe(c))} de video</li><li>${esc(c.nivel)}</li><li>${c.recetas.length} recetas</li></ul>
      <p class="ppanel__hace"><b>Hacés:</b> ${esc(c.recetas.join(', '))}.</p>
      <div class="ppanel__pie">${precioHTML(c)}<div class="ppanel__acts"><button type="button" class="btn btn--solid" data-add="${c.id}">Inscribirme</button><button type="button" class="btn btn--soft" data-open="${c.id}">Ver el programa</button></div></div>
    </div>
  </div>`;
}

function initPestanas() {
  const lista = document.getElementById('ptabs');
  const paneles = document.getElementById('ppanels');
  if (!lista || !paneles) return;
  lista.innerHTML = CURSOS.map((c, i) => `<button type="button" role="tab" class="ptab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(c.corto)}</button>`).join('');
  paneles.innerHTML = CURSOS.map(panelHTML).join('');
  const tabs = [...lista.querySelectorAll('.ptab')];
  const activar = (tab, foco) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (foco) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activar(tab, false));
    tab.addEventListener('keydown', e => {
      const destino = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
      if (destino === undefined) return;
      e.preventDefault();
      activar(tabs[destino], true);
    });
  });
}

function initTemario() {
  const mods = document.getElementById('temario-mods');
  if (!mods) return;
  const c = getCurso('desde-cero');
  mods.innerHTML = modulosHTML(c, true);
  const tot = document.getElementById('temario-tot');
  if (tot) tot.textContent = `${c.modulos.length} módulos · ${clasesDe(c)} clases en video · ${duracion(minutosDe(c))} · ${c.recetas.length} recetas`;
  const precio = document.getElementById('ficha-precio');
  if (precio) precio.innerHTML = precioHTML(c);
  const incluye = document.getElementById('ficha-incluye');
  if (incluye) incluye.innerHTML = c.incluye.map(checkLi).join('');
}

function initStats() {
  const s = statsAcademia();
  document.querySelectorAll('[data-stat]').forEach(el => {
    const v = s[el.dataset.stat];
    if (v !== undefined) el.textContent = v;
  });
}

const CAL = { receta: 'oleato', inicio: null, anio: 0, mes: 0 };

function recetaActual() {
  return RECETAS.find(r => r.id === CAL.receta) || RECETAS[0];
}

function pintarResultado(receta, plan) {
  const curso = getCurso(receta.curso);
  const poner = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  poner('cal-inicio', esc(fechaLarga(plan.inicio)));
  poner('cal-listo', `Listo el <span>${esc(fechaLarga(plan.fin))}</span>`);
  const dias = plan.total === 0 ? 'Todo en el mismo día' : `${plan.total} ${plan.total === 1 ? 'día' : 'días'} de principio a fin`;
  poner('cal-sub', `${dias} · ${duracion(plan.minutos)} de trabajo`);
  poner('cal-pasos', plan.pasos.map(p => {
    const cuando = mismoDia(p.desde, p.hasta) ? fechaCorta(p.desde) : `${fechaCorta(p.desde)} → ${fechaCorta(p.hasta)}`;
    return `<li class="p-${p.tipo}"><time datetime="${claveFecha(p.desde)}">${cuando}</time><span>${esc(p.t)}${p.min ? ` <small>· ${duracion(p.min)}</small>` : ''}</span></li>`;
  }).join(''));
  const ver = document.getElementById('cal-ver');
  if (ver) ver.hidden = plan.fin.getMonth() === CAL.mes && plan.fin.getFullYear() === CAL.anio;
  const add = document.getElementById('cal-add');
  if (add && curso) {
    add.dataset.add = curso.id;
    add.textContent = `Inscribirme a ${curso.corto} · ${formatearPrecio(precioFinal(curso))}`;
  }
  const wsp = document.getElementById('cal-wsp');
  if (wsp && curso) {
    wsp.href = wspHref([`Hola ${MARCA}! Armé mi calendario en la web.`, `Receta: ${receta.nombre}`, `Empiezo: ${fechaLarga(plan.inicio)}`, `Listo: ${fechaLarga(plan.fin)}`, `Quiero info del curso «${curso.titulo}».`]);
  }
  const tambien = document.getElementById('cal-tambien');
  if (tambien) {
    tambien.hidden = !receta.completo;
    tambien.innerHTML = receta.completo ? 'También la hacés en el curso completo: <button type="button" data-open="desde-cero">Cosmética natural desde cero</button>.' : '';
  }
}

function pintarCalendario() {
  const grilla = document.getElementById('cal-grilla');
  if (!grilla) return;
  const receta = recetaActual();
  const plan = planDe(receta, CAL.inicio);
  const hoy = soloFecha(new Date());
  const celdas = celdasMes(CAL.anio, CAL.mes);
  grilla.innerHTML = celdas.map((d, i) => {
    if (!d) return '<span class="dia" aria-hidden="true"></span>';
    const est = estadoDe(plan, d);
    const col = i % 7;
    const cls = ['dia'];
    if (est) {
      cls.push('en-rango', `is-${est}`);
      if (col === 0 || !celdas[i - 1] || !estadoDe(plan, celdas[i - 1])) cls.push('banda-ini');
      if (col === 6 || !celdas[i + 1] || !estadoDe(plan, celdas[i + 1])) cls.push('banda-fin');
    }
    if (mismoDia(d, hoy)) cls.push('is-hoy');
    const esInicio = mismoDia(d, plan.inicio);
    const nota = { trabajo: ', día de trabajo', espera: ', espera', listo: ', listo' }[est] || '';
    const label = mayus(fechaLarga(d)) + nota + (esInicio ? ', empezás este día' : '');
    return `<button type="button" class="${cls.join(' ')}" data-fecha="${claveFecha(d)}" aria-label="${esc(label)}" aria-pressed="${esInicio}"${d < hoy ? ' disabled' : ''}><span>${d.getDate()}</span></button>`;
  }).join('');
  const titulo = document.getElementById('cal-mes');
  if (titulo) titulo.textContent = `${mayus(MESES[CAL.mes])} ${CAL.anio}`;
  const base = hoy.getFullYear() * 12 + hoy.getMonth();
  const actual = CAL.anio * 12 + CAL.mes;
  const prev = document.getElementById('cal-prev');
  if (prev) prev.disabled = actual <= base;
  const next = document.getElementById('cal-next');
  if (next) next.disabled = actual >= base + 4;
  pintarResultado(receta, plan);
}

function moverMes(delta) {
  const hoy = soloFecha(new Date());
  const base = hoy.getFullYear() * 12 + hoy.getMonth();
  const destino = CAL.anio * 12 + CAL.mes + delta;
  if (destino < base || destino > base + 4) return;
  CAL.anio = Math.floor(destino / 12);
  CAL.mes = destino % 12;
  pintarCalendario();
}

function initCalendario() {
  const grilla = document.getElementById('cal-grilla');
  const opciones = document.getElementById('cal-recetas');
  if (!grilla || !opciones) return;
  CAL.inicio = proximoSabado(new Date());
  CAL.anio = CAL.inicio.getFullYear();
  CAL.mes = CAL.inicio.getMonth();
  opciones.innerHTML = RECETAS.map(r => {
    const p = Math.max(3, Math.round((duracionReceta(r) / 30) * 100));
    const on = r.id === CAL.receta;
    return `<label class="receta${on ? ' is-on' : ''}"><input type="radio" name="receta" value="${r.id}"${on ? ' checked' : ''}><span class="receta__n">${esc(r.nombre)}</span><span class="receta__t">${esc(r.espera)}</span><span class="receta__barra" style="--p:${p}%" aria-hidden="true"></span></label>`;
  }).join('');
  opciones.addEventListener('change', e => {
    const input = e.target.closest('input[name="receta"]');
    if (!input) return;
    CAL.receta = input.value;
    opciones.querySelectorAll('.receta').forEach(l => l.classList.toggle('is-on', l.contains(input)));
    CAL.anio = CAL.inicio.getFullYear();
    CAL.mes = CAL.inicio.getMonth();
    pintarCalendario();
  });
  opciones.addEventListener('focusin', e => {
    const label = e.target.closest('.receta');
    if (label && e.target.matches(':focus-visible')) label.classList.add('is-foco');
  });
  opciones.addEventListener('focusout', e => e.target.closest('.receta')?.classList.remove('is-foco'));
  grilla.addEventListener('click', e => {
    const dia = e.target.closest('button.dia');
    if (!dia || dia.disabled) return;
    const clave = dia.dataset.fecha;
    CAL.inicio = desdeClave(clave);
    pintarCalendario();
    grilla.querySelector(`[data-fecha="${clave}"]`)?.focus();
  });
  document.getElementById('cal-prev')?.addEventListener('click', () => moverMes(-1));
  document.getElementById('cal-next')?.addEventListener('click', () => moverMes(1));
  document.getElementById('cal-ver')?.addEventListener('click', () => {
    const plan = planDe(recetaActual(), CAL.inicio);
    CAL.anio = plan.fin.getFullYear();
    CAL.mes = plan.fin.getMonth();
    pintarCalendario();
  });
  pintarCalendario();
}

function trap(e, cont) {
  const f = [...cont.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let focoModal = null;
let focoDrawer = null;

function modalHTML(c) {
  const wsp = wspHref([`Hola ${MARCA}! Quiero inscribirme en «${c.titulo}» (clases grabadas).`, '¿Me pasás info para empezar?']);
  return `<div class="mc">
    <div class="mc__media${c.ratio === 'v' ? ' mc__media--v' : ''}"><img src="${c.img}" width="${c.w}" height="${c.h}" alt="${esc(c.alt)}"></div>
    <div class="mc__info">
      <p class="etq__n">N.º ${dos(c.n)} · ${esc(c.categorias.join(' · '))}</p>
      <h2 class="mc__t">${esc(c.titulo)}</h2>
      <p class="mc__corta">${esc(c.corta)}</p>
      <ul class="datos"><li>${esc(c.nivel)}</li><li>Clases grabadas</li><li>${clasesDe(c)} clases</li><li>${duracion(minutosDe(c))} de video</li><li>${c.recetas.length} recetas</li></ul>
      <div class="mc__buy">${precioHTML(c)}<button type="button" class="btn btn--solid" data-add="${c.id}">Inscribirme</button><a class="btn btn--soft" href="${wsp}" target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
      <p>${esc(c.completa)}</p>
      <div class="mc__bloque"><h3>Vas a hacer</h3><ul class="mc__recetas">${c.recetas.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>
      <div class="mc__bloque"><h3>Qué aprendés</h3><ul class="checks">${c.aprendes.map(checkLi).join('')}</ul></div>
      <div class="mc__bloque"><h3>Programa</h3><div class="mods">${modulosHTML(c, true)}</div></div>
      <div class="mc__dos"><div><h3>Qué necesitás</h3><ul class="checks">${c.requisitos.map(checkLi).join('')}</ul></div><div><h3>Incluye</h3><ul class="checks">${c.incluye.map(checkLi).join('')}</ul></div></div>
      <div class="mc__docente"><p><b>Quién enseña.</b> Lo dicta quien está detrás de @_bellezanatural26: cada receta se hace entera frente a cámara, con los pesos y los tiempos. <a href="${IG}" target="_blank" rel="noopener noreferrer">Ver su Instagram</a></p></div>
    </div>
  </div>`;
}

function abrirModal(id) {
  const c = getCurso(id);
  const modal = document.getElementById('modal');
  const cont = document.getElementById('modal-content');
  if (!c || !modal || !cont) return;
  if (modal.hidden) focoModal = document.activeElement;
  cont.innerHTML = modalHTML(c);
  cont.scrollTop = 0;
  modal.setAttribute('aria-label', c.titulo);
  const kicker = document.getElementById('modal-kicker');
  if (kicker) kicker.textContent = `Fórmula N.º ${dos(c.n)} · ${c.corto}`;
  modal.hidden = false;
  document.body.classList.add('no-scroll');
  document.getElementById('modal-close')?.focus();
}

function cerrarModal(devolver = true) {
  const modal = document.getElementById('modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  if (!document.getElementById('drawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  if (devolver) focoModal?.focus();
}

function initModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  document.getElementById('modal-close')?.addEventListener('click', () => cerrarModal());
  modal.addEventListener('click', e => { if (e.target.closest('[data-close-modal]')) cerrarModal(); });
  document.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') cerrarModal();
    if (e.key === 'Tab') trap(e, modal);
  });
}

function lineaHTML(c) {
  return `<div class="linea">
    <span class="linea__img"><img src="${c.img}" width="${c.w}" height="${c.h}" alt=""></span>
    <div><p class="linea__t">${esc(c.titulo)}</p><p class="linea__m">Clases grabadas · ${clasesDe(c)} clases · ${c.recetas.length} recetas</p><button type="button" class="linea__x" data-quitar="${c.id}">Quitar</button></div>
    <p class="linea__pr">${formatearPrecio(precioFinal(c))}${c.descuento > 0 ? `<s>${formatearPrecio(c.precio)}</s>` : ''}</p>
  </div>`;
}

function pintarDrawer() {
  const body = document.getElementById('drawer-body');
  const foot = document.getElementById('drawer-foot');
  if (!body) return;
  Cart.limpiar();
  const items = Cart.get().map(i => getCurso(i.id)).filter(Boolean);
  if (!items.length) {
    body.innerHTML = '<div class="drawer-vacio"><b>Todavía no elegiste ningún curso</b><p>Si es tu primera vez, el de bálsamos se hace en una tarde.</p><button type="button" class="btn btn--line" data-cerrar-drawer>Ver los cursos</button></div>';
    if (foot) foot.hidden = true;
    return;
  }
  body.innerHTML = items.map(lineaHTML).join('');
  if (foot) foot.hidden = false;
  const total = document.getElementById('drawer-total');
  if (total) total.textContent = formatearPrecio(Cart.total());
}

function abrirDrawer(retorno) {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd) return;
  if (!dr.classList.contains('open')) focoDrawer = retorno || document.activeElement;
  pintarDrawer();
  bd.hidden = false;
  dr.hidden = false;
  requestAnimationFrame(() => { bd.classList.add('open'); dr.classList.add('open'); });
  document.body.classList.add('no-scroll');
  document.getElementById('drawer-close')?.focus();
}

function cerrarDrawer(devolver = true) {
  const dr = document.getElementById('drawer');
  const bd = document.getElementById('drawer-backdrop');
  if (!dr || !bd || dr.hidden) return;
  dr.classList.remove('open');
  bd.classList.remove('open');
  if (document.getElementById('modal')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { if (!dr.classList.contains('open')) { dr.hidden = true; bd.hidden = true; } }, 380);
  if (devolver) focoDrawer?.focus();
}

function irACursos() {
  document.getElementById('cursos')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function initDrawer() {
  const dr = document.getElementById('drawer');
  if (!dr) return;
  document.getElementById('cart-header')?.addEventListener('click', () => abrirDrawer());
  document.getElementById('drawer-close')?.addEventListener('click', () => cerrarDrawer());
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => cerrarDrawer());
  dr.addEventListener('click', e => {
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const c = getCurso(quitar.dataset.quitar);
      Cart.remove(quitar.dataset.quitar);
      pintarDrawer();
      showToast(c ? `Sacamos «${c.corto}» de tu inscripción.` : 'Lo sacamos de tu inscripción.');
      document.getElementById('drawer-close')?.focus();
      return;
    }
    if (e.target.closest('[data-cerrar-drawer]')) { cerrarDrawer(false); irACursos(); }
  });
  document.getElementById('checkout')?.addEventListener('click', () => {
    showToast('El pago y la creación automática de tu cuenta se activan al llevar la plataforma a producción.');
  });
  document.addEventListener('keydown', e => {
    if (!dr.classList.contains('open')) return;
    if (e.key === 'Escape') cerrarDrawer();
    if (e.key === 'Tab') trap(e, dr);
  });
  document.addEventListener('cart:updated', () => { if (dr.classList.contains('open')) pintarDrawer(); });
}

function inscribir(id) {
  const c = getCurso(id);
  if (!c) return;
  const modal = document.getElementById('modal');
  const desdeModal = modal && !modal.hidden;
  const retorno = desdeModal ? focoModal : document.activeElement;
  const nuevo = Cart.add(c);
  cerrarModal(false);
  abrirDrawer(retorno);
  showToast(nuevo ? `«${c.corto}» quedó en tu inscripción.` : `«${c.corto}» ya estaba en tu inscripción.`);
}

function initAcciones() {
  document.addEventListener('click', e => {
    const abrir = e.target.closest('[data-open]');
    if (abrir) { e.preventDefault(); abrirModal(abrir.dataset.open); return; }
    const add = e.target.closest('[data-add]');
    if (add) { inscribir(add.dataset.add); return; }
    if (e.target.closest('[data-play]')) { showToast('La clase de muestra se reproduce acá al pasar la web a producción.'); return; }
    if (e.target.closest('[data-ingresar]')) showToast('El ingreso al aula se activa al llevar la plataforma a producción.');
  });
}

function updateCartBadge() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(b => {
    b.textContent = n; b.hidden = n === 0;
    b.classList.remove('bump'); void b.offsetWidth; if (n) b.classList.add('bump');
  });
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
  cart?.addEventListener('click', () => abrirDrawer());
  sync();
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

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) {
    bd = document.createElement('div');
    bd.className = 'nav-backdrop';
    const header = document.querySelector('.site-header');
    (header || document.body).appendChild(bd);
  }
  const desktopMq = window.matchMedia('(min-width: 961px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a')?.focus();
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

let revealsListos = false;

function initReveals() {
  revealsListos = true;
  const items = document.querySelectorAll('[data-animate]');
  if (!items.length) return;
  document.querySelectorAll('[data-animate-stagger]').forEach(parent => {
    parent.querySelectorAll('[data-animate]').forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.06, 0.36)}s`;
    });
  });
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: '0px 0px -7% 0px' });
  items.forEach(el => io.observe(el));

  let queued = false;
  const sweep = () => {
    queued = false;
    let pending = 0;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) { el.classList.add('in'); io.unobserve(el); }
      else pending++;
    });
    if (!pending) {
      window.removeEventListener('scroll', queueSweep);
      window.removeEventListener('resize', queueSweep);
    }
  };
  const queueSweep = () => { if (!queued) { queued = true; requestAnimationFrame(sweep); } };
  window.addEventListener('load', queueSweep);
  window.addEventListener('scroll', queueSweep, { passive: true });
  window.addEventListener('resize', queueSweep, { passive: true });
}

function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = cont.querySelectorAll('[data-animate]:not(.in)');
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  nuevos.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 0.05, 0.3)}s`; });
  setTimeout(() => nuevos.forEach(el => el.classList.add('in')), 40);
}

function abrirDesdeUrl() {
  const id = new URLSearchParams(location.search).get('curso');
  if (id && getCurso(id)) abrirModal(id);
}

document.querySelectorAll('[data-anio]').forEach(el => { el.textContent = new Date().getFullYear(); });
Cart.limpiar();
initStats();
initCursos();
initPestanas();
initTemario();
initCalendario();
initReveals();
initModelBarScroll();
initNav();
initModal();
initDrawer();
initAcciones();
initFloats();
document.addEventListener('cart:updated', updateCartBadge);
updateCartBadge();
abrirDesdeUrl();
