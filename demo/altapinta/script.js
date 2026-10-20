const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (typeof gsap === 'undefined') document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
if (typeof ScrollTrigger !== 'undefined') window.addEventListener('load', () => ScrollTrigger.refresh());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = (e.key || '').toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) e.preventDefault();
});

const WSP = '5491154845865';
const wspLink = msg => `https://wa.me/${WSP}?text=${encodeURIComponent(msg)}`;
const MODELO = document.body.dataset.modelo === '2' ? '2' : '1';
const PAGINA = document.body.dataset.pagina || 'home';
const URL_CATALOGO = MODELO === '2' ? 'catalogo-2.html' : 'catalogo.html';
const URL_HOME = MODELO === '2' ? 'modelo-2.html' : './';
const POR_PAGINA = 16;
const PARAMS = new URLSearchParams(location.search);
const KEY_MEDIDA = 'altapinta_medida';
const KEY_PAGO = 'altapinta_pago_recibir';

const CATEGORIAS = [
  { id: 'sabanas', nombre: 'Juegos de sábanas', corto: 'Sábanas', sub: '1 plaza a King', op: 'medida', img: 'images/c-sabanas.webp', amb: ['dormitorio'],
    bajada: 'Juegos completos de algodón, percal y lino, de 1 plaza a King.' },
  { id: 'cubrecamas', nombre: 'Cubrecamas', corto: 'Cubrecamas', sub: '1½ plaza a King', op: 'medida', img: 'images/c-cubrecamas.webp', amb: ['dormitorio'],
    bajada: 'De gasa, matelaseados y lisos, de 1½ plaza a King.' },
  { id: 'toallas', nombre: 'Toallas y toallones', corto: 'Toallas', sub: 'Toallas, toallones y juegos', op: 'medida', img: 'images/c-toallas.webp', amb: ['bano'],
    bajada: 'Toallas, toallones y juegos de algodón para el baño de tu casa o de tu negocio.' },
  { id: 'cortinas', nombre: 'Cortinas', corto: 'Cortinas', sub: 'Lino, tusor y blackout', op: 'medida', img: 'images/c-cortinas.webp', amb: ['living', 'dormitorio'],
    bajada: 'Cortinas de lino, tusor con voile y blackout, listas para colgar.' },
  { id: 'infantiles', nombre: 'Sábanas infantiles', corto: 'Infantiles', sub: 'Cuna, 1 y 1½ plaza', op: 'medida', img: 'images/c-infantiles.webp', amb: ['chicos'],
    bajada: 'Juegos estampados para la cuna y la primera cama.' },
  { id: 'alfombras', nombre: 'Alfombras', corto: 'Alfombras', sub: 'De 60 × 90 a 1,60 × 2,30', op: 'medida', img: 'images/c-alfombras.webp', amb: ['living'],
    bajada: 'Alfombras tejidas para el living, el dormitorio o la entrada.' },
  { id: 'peluches', nombre: 'Peluches', corto: 'Peluches', sub: 'De 30 a 80 cm', op: 'tamaño', img: 'images/c-peluches.webp', amb: ['chicos'],
    bajada: 'Osos y conejos de peluche para regalar o decorar el cuarto.' },
  { id: 'repasadores', nombre: 'Repasadores', corto: 'Repasadores', sub: 'Packs de 3, 6 y 12', op: 'pack', img: 'images/c-repasadores.webp', amb: ['cocina'],
    bajada: 'Repasadores de algodón en packs de 3, 6 y 12.' },
  { id: 'cubresillones', nombre: 'Cubresillones', corto: 'Cubresillones', sub: '1, 2 y 3 cuerpos', op: 'medida', img: 'images/c-cubresillones.webp', amb: ['living'],
    bajada: 'Fundas y mantas para renovar el sillón de 1, 2 o 3 cuerpos.' },
];
const AMBIENTES = {
  dormitorio: { nombre: 'Dormitorio', titulo: 'Para el dormitorio', img: 'images/h-cama-terracota.webp', w: 1672, h: 940, pos: '76% 50%', sub: 'Sábanas, cubrecamas y cortinas',
    alt: 'Cama con cubrecama de gasa terracota y almohadones blancos en un dormitorio cálido' },
  chicos: { nombre: 'Chicos', titulo: 'Para los chicos', img: 'images/h-infantil.webp', w: 1254, h: 1254, sub: 'Sábanas infantiles y peluches',
    alt: 'Cama infantil con juego de sábanas celeste estampado con nubes y estrellas' },
  bano: { nombre: 'Baño', titulo: 'Para el baño', img: 'images/h-toallas.webp', w: 1254, h: 1254, sub: 'Toallas, toallones y juegos',
    alt: 'Toallas y toallones blancos y beige apilados en un baño con plantas' },
  cocina: { nombre: 'Cocina', titulo: 'Para la cocina', img: 'images/h-cocina.webp', w: 1254, h: 1254, sub: 'Repasadores en packs',
    alt: 'Repasadores a cuadros color caramelo doblados sobre una mesada de cocina' },
  living: { nombre: 'Living', titulo: 'Para el living', img: 'images/h-living.webp', w: 1254, h: 1254, sub: 'Cubresillones, alfombras y cortinas',
    alt: 'Sillón gris con funda elastizada en un living luminoso con alfombra de yute' },
};
const COLORES = {
  Blanco: '#F4F1EC', Beige: '#D8C6A8', 'Verde salvia': '#A9B59A', 'Gris perla': '#C9C8C3', Arena: '#CDB896', Celeste: '#A9C6E3',
  Terracota: '#B5633F', Gris: '#8E8C8A', Marfil: '#EFE6D3', 'Crema y terracota': '#D9A07E', Ciruela: '#6E4A57', Miel: '#C9A06B',
  Lino: '#E3D6BF', Caramelo: '#B98552', Azul: '#4A6A9A', 'Blanco y gris': '#B9BCC2', Crema: '#F0E4C8',
};
const RANGOS = {
  hasta15: { nombre: 'Hasta $15.000', max: 15000 },
  '15a30': { nombre: '$15.000 a $30.000', min: 15001, max: 30000 },
  mas30: { nombre: 'Más de $30.000', min: 30001 },
};
const ORDENES = { destacados: 'Más pedidos', nuevos: 'Recién ingresados', 'precio-asc': 'Menor precio', 'precio-desc': 'Mayor precio', nombre: 'Nombre (A-Z)' };
const MEDIDAS_CAMA = [
  ['Cuna', '60 × 120 cm'], ['1 plaza', '80 × 190 cm'], ['1½ plaza', '100 × 190 cm'], ['2 plazas', '140 × 190 cm'], ['Queen', '160 × 200 cm'], ['King', '180 × 200 cm'],
];
const NOMBRES_CAMA = MEDIDAS_CAMA.map(m => m[0]);
const op = (v, precio, stock) => ({ v, precio, stock });

const PRODUCTOS = [
  { id: 'sabanas-algodon', nombre: 'Juego de sábanas de algodón 144 hilos', cat: 'sabanas', colores: ['Blanco', 'Beige'], descuento: 0, rango: 1, alta: 20,
    ops: [op('1 plaza', 18900, 8), op('1½ plaza', 21900, 10), op('2 plazas', 25900, 12), op('Queen', 29900, 7), op('King', 33900, 4)],
    img: 'images/p-sabanas-algodon.webp', alt: 'Juegos de sábanas blancos y beige doblados y apilados sobre una mesa de madera',
    desc: 'Sábana con elástico, sábana plana y fundas: una en 1 y 1½ plaza, dos desde 2 plazas. Algodón 144 hilos, suave desde el primer lavado.', tags: ['sabanas', 'juego', 'algodon', 'blanco', 'beige', 'cama', 'basico'] },
  { id: 'cubrecama-gasa', nombre: 'Cubrecama de gasa de algodón', cat: 'cubrecamas', colores: ['Terracota'], descuento: 0, rango: 2, alta: 22,
    ops: [op('1½ plaza', 34900, 5), op('2 plazas', 39900, 7), op('Queen', 44900, 5), op('King', 49900, 2)],
    img: 'images/p-cubrecama-gasa.webp', alt: 'Cubrecama de gasa de algodón color terracota sobre una cama con almohadones blancos',
    desc: 'Gasa de algodón doble con textura arrugada: abriga en media estación y en invierno se usa como pie de cama.', tags: ['cubrecama', 'gasa', 'muselina', 'terracota', 'algodon', 'manta'] },
  { id: 'toallas-algodon', nombre: 'Toalla y toallón de algodón 500 g', cat: 'toallas', colores: ['Blanco', 'Beige'], descuento: 0, rango: 3, alta: 18,
    ops: [op('Toalla 50 × 90 cm', 11900, 14), op('Toallón 70 × 140 cm', 19900, 12), op('Juego toalla y toallón', 28900, 9)],
    img: 'images/p-toallas-algodon.webp', alt: 'Toallas y toallones blancos y beige apilados con guarda tejida',
    desc: 'Rizo de algodón de 500 g por metro con guarda tejida. Se pide suelto o en juego de toalla y toallón.', tags: ['toalla', 'toallon', 'juego', 'algodon', 'blanco', 'beige', 'baño'] },
  { id: 'sabanas-nubes', nombre: 'Juego de sábanas infantil Nubes', cat: 'infantiles', colores: ['Celeste'], descuento: 0, rango: 4, alta: 19,
    ops: [op('1 plaza', 19900, 9), op('1½ plaza', 22900, 6)],
    img: 'images/p-sabanas-nubes.webp', alt: 'Juego de sábanas infantil celeste estampado con nubes blancas y estrellas sobre una cama',
    desc: 'Algodón estampado con nubes y estrellas: sábana con elástico, sábana plana y funda.', tags: ['sabanas', 'infantil', 'nubes', 'estrellas', 'celeste', 'chicos', 'nene', 'nena'] },
  { id: 'cortina-lino', nombre: 'Cortina de lino con presillas', cat: 'cortinas', colores: ['Marfil'], descuento: 0, rango: 5, alta: 21,
    ops: [op('2 paños de 1,40 × 2,20 m', 32900, 6), op('2 paños de 1,40 × 2,50 m', 36900, 4)],
    img: 'images/p-cortina-lino.webp', alt: 'Cortinas de lino color marfil abiertas frente a un ventanal con luz natural',
    desc: 'Lino liviano que filtra la luz sin oscurecer. Presillas ocultas para barral y dobladillo listo.', tags: ['cortina', 'cortinas', 'lino', 'marfil', 'presillas', 'living'] },
  { id: 'oso-miel', nombre: 'Oso de peluche Miel', cat: 'peluches', colores: ['Miel'], descuento: 0, rango: 6, alta: 17,
    ops: [op('30 cm', 14900, 10), op('50 cm', 24900, 6), op('80 cm', 42900, 3)],
    img: 'images/p-oso-miel.webp', alt: 'Oso de peluche color miel sentado junto a una manta a cuadros beige',
    desc: 'Peluche de pelo largo y suave con ojos bordados. Viene en tres tamaños.', tags: ['peluche', 'oso', 'osito', 'miel', 'regalo', 'chicos'] },
  { id: 'cubresillon-elastizado', nombre: 'Funda cubresillón elastizada', cat: 'cubresillones', colores: ['Gris', 'Beige'], descuento: 0, rango: 7, alta: 16,
    ops: [op('1 cuerpo', 19900, 8), op('2 cuerpos', 26900, 7), op('3 cuerpos', 32900, 6)],
    img: 'images/p-cubresillon-elastizado.webp', alt: 'Sillón de tres cuerpos con funda elastizada gris en un living luminoso',
    desc: 'Tela elastizada que se ajusta al sillón y se saca para lavar. Cubre brazos, respaldo y almohadones.', tags: ['cubresillon', 'funda', 'sillon', 'elastizada', 'gris', 'beige', 'living'] },
  { id: 'alfombra-geometrica', nombre: 'Alfombra tejida geométrica', cat: 'alfombras', colores: ['Crema y terracota'], descuento: 0, rango: 8, alta: 15,
    ops: [op('60 × 90 cm', 19900, 8), op('1,20 × 1,70 m', 46900, 4), op('1,60 × 2,30 m', 79900, 2)],
    img: 'images/p-alfombra-geometrica.webp', alt: 'Alfombras tejidas con dibujo geométrico crema y terracota dobladas una sobre otra',
    desc: 'Tejido plano de algodón con dibujo geométrico, liviana y fácil de sacudir.', tags: ['alfombra', 'tejida', 'geometrica', 'terracota', 'crema', 'living'] },
  { id: 'repasadores-cuadros', nombre: 'Repasadores a cuadros de algodón', cat: 'repasadores', colores: ['Caramelo'], descuento: 0, rango: 9, alta: 13,
    ops: [op('Pack x3', 7900, 20), op('Pack x6', 14900, 15), op('Pack x12', 27900, 8)],
    img: 'images/p-repasadores-cuadros.webp', alt: 'Repasadores a cuadros color caramelo doblados sobre una mesada de cocina',
    desc: 'Algodón a cuadros que seca bien y no deja pelusa. Vienen con presilla para colgar.', tags: ['repasador', 'repasadores', 'cuadros', 'caramelo', 'cocina', 'pack'] },
  { id: 'sabanas-percal', nombre: 'Juego de sábanas de percal 180 hilos', cat: 'sabanas', colores: ['Verde salvia', 'Gris perla'], descuento: 10, alta: 26,
    ops: [op('1½ plaza', 27900, 5), op('2 plazas', 32900, 8), op('Queen', 36900, 6), op('King', 41900, 3)],
    img: 'images/p-sabanas-percal.webp', alt: 'Cama con juego de sábanas de percal verde salvia y almohadas con fundas al tono',
    desc: 'Percal de 180 hilos, fresco y con caída lisa. Sábana con elástico, sábana plana y fundas.', tags: ['sabanas', 'juego', 'percal', '180 hilos', 'verde', 'salvia', 'gris'] },
  { id: 'sabanas-lino', nombre: 'Juego de sábanas de lino lavado', cat: 'sabanas', colores: ['Arena'], descuento: 0, alta: 28,
    ops: [op('2 plazas', 46900, 4), op('Queen', 52900, 3), op('King', 58900, 2)],
    img: 'images/p-sabanas-lino.webp', alt: 'Cama con juego de sábanas de lino lavado color arena y almohadas arrugadas',
    desc: 'Lino lavado con textura natural: fresco en verano y abrigado en invierno. Incluye dos fundas.', tags: ['sabanas', 'juego', 'lino', 'arena', 'beige', 'premium'] },
  { id: 'sabanas-cuna', nombre: 'Juego de sábanas para cuna', cat: 'infantiles', colores: ['Terracota'], descuento: 0, alta: 24,
    ops: [op('Cuna', 14900, 6)],
    img: 'images/p-sabanas-cuna.webp', alt: 'Cuna de madera con sábanas y mantas en tonos terracota y beige',
    desc: 'Sábana ajustable, sábana plana y funda para colchón de cuna de 60 × 120 cm.', tags: ['sabanas', 'cuna', 'bebe', 'terracota', 'chicos'] },
  { id: 'cubrecama-matelaseado', nombre: 'Cubrecama matelaseado reversible', cat: 'cubrecamas', colores: ['Blanco'], descuento: 0, alta: 23,
    ops: [op('2 plazas', 42900, 6), op('Queen', 47900, 4), op('King', 52900, 3)],
    img: 'images/p-cubrecama-matelaseado.webp', alt: 'Cama con cubrecama blanco matelaseado y almohadones en un dormitorio con paredes de madera',
    desc: 'Matelaseado liviano, reversible y con dos fundas de almohadón al tono.', tags: ['cubrecama', 'matelaseado', 'quilt', 'blanco', 'reversible'] },
  { id: 'cubrecama-microfibra', nombre: 'Cubrecama liso de microfibra', cat: 'cubrecamas', colores: ['Gris'], descuento: 0, alta: 12,
    ops: [op('1½ plaza', 24900, 8), op('2 plazas', 27900, 9), op('Queen', 31900, 5), op('King', 35900, 3)],
    img: 'images/p-cubrecama-microfibra.webp', alt: 'Cama con cubrecama liso gris de microfibra y respaldo tapizado',
    desc: 'Microfibra lisa que no se arruga y se seca rápido. Para el uso de todos los días.', tags: ['cubrecama', 'microfibra', 'gris', 'liso'] },
  { id: 'cortina-tusor', nombre: 'Cortina de tusor con voile', cat: 'cortinas', colores: ['Arena'], descuento: 0, alta: 9,
    ops: [op('2 paños y voile de 1,50 × 2,20 m', 38900, 4)],
    img: 'images/p-cortina-tusor.webp', alt: 'Cortinas de tusor color arena con voile blanco al medio, recogidas con lazo',
    desc: 'Dos paños de tusor y un voile blanco para filtrar la luz. Con lazos para recoger.', tags: ['cortina', 'cortinas', 'tusor', 'voile', 'arena', 'living'] },
  { id: 'cortina-blackout', nombre: 'Cortina blackout con ojales', cat: 'cortinas', colores: ['Gris'], descuento: 0, alta: 14,
    ops: [op('1 paño de 1,40 × 2,20 m', 21900, 10), op('1 paño de 1,40 × 2,50 m', 24900, 7)],
    img: 'images/p-cortina-blackout.webp', alt: 'Cortina blackout gris colgada junto a una ventana con marco blanco',
    desc: 'Tela blackout que corta la luz de la calle. Ojales metálicos para colgar de un barral.', tags: ['cortina', 'blackout', 'gris', 'ojales', 'dormitorio', 'oscura'] },
  { id: 'toallon-peinado', nombre: 'Toallón de algodón peinado', cat: 'toallas', colores: ['Gris', 'Ciruela'], descuento: 0, alta: 27,
    ops: [op('Toallón 70 × 140 cm', 21900, 8), op('Toallón 90 × 160 cm', 27900, 5)],
    img: 'images/p-toallon-peinado.webp', alt: 'Toallones de algodón peinado gris y ciruela enrollados',
    desc: 'Algodón peinado de rizo largo, muy absorbente. Dos tamaños.', tags: ['toallon', 'algodon', 'peinado', 'gris', 'ciruela', 'baño'] },
  { id: 'toallon-guarda', nombre: 'Toallón 600 g con guarda', cat: 'toallas', colores: ['Gris perla'], descuento: 0, alta: 11,
    ops: [op('Toallón 70 × 140 cm', 23900, 6)],
    img: 'images/p-toallon-guarda.webp', alt: 'Toallones gris perla con guarda doblados y apilados en un estante de baño',
    desc: 'Rizo de 600 g por metro, pesado y suave, con guarda tejida.', tags: ['toallon', 'guarda', 'gris', 'perla', '600 g', 'baño'] },
  { id: 'toallon-hotel', nombre: 'Toallón blanco tipo hotel', cat: 'toallas', colores: ['Blanco'], descuento: 0, alta: 25,
    ops: [op('Toallón 70 × 140 cm', 18900, 30), op('Pack x6 toallones', 104900, 5)],
    img: 'images/p-toallon-hotel.webp', alt: 'Toallones blancos de rizo doblados y apilados',
    desc: 'Pensado para hoteles, cabañas, spas y peluquerías: rizo de algodón blanco que aguanta lavados frecuentes.', tags: ['toallon', 'blanco', 'hotel', 'cabañas', 'spa', 'peluqueria', 'pack'] },
  { id: 'toallas-mano', nombre: 'Toallas de mano x3', cat: 'toallas', colores: ['Blanco'], descuento: 0, alta: 10,
    ops: [op('Pack x3 de 30 × 50 cm', 9900, 12)],
    img: 'images/p-toallas-mano.webp', alt: 'Tres toallas de mano blancas enrolladas en una silla de macramé',
    desc: 'Tres toallas de mano de rizo blanco, para el baño o la cocina.', tags: ['toalla', 'mano', 'blanco', 'pack', 'baño'] },
  { id: 'conejo-orejon', nombre: 'Conejo de peluche orejón', cat: 'peluches', colores: ['Blanco'], descuento: 0, alta: 29,
    ops: [op('35 cm', 15900, 7)],
    img: 'images/p-conejo-orejon.webp', alt: 'Conejo de peluche blanco con orejas largas asomando de una bota',
    desc: 'Peluche blanco de orejas largas, suave al tacto. Ideal para regalar.', tags: ['peluche', 'conejo', 'blanco', 'regalo', 'chicos', 'bebe'] },
  { id: 'conejita-tela', nombre: 'Conejita de tela con vestido', cat: 'peluches', colores: ['Lino'], descuento: 0, alta: 7,
    ops: [op('40 cm', 18900, 5)],
    img: 'images/p-conejita-tela.webp', alt: 'Conejita de tela color lino con vestido de lunares y moño marrón',
    desc: 'Muñeca de tela con vestido de lunares y moño. Para decorar el cuarto o regalar.', tags: ['peluche', 'conejita', 'muñeca', 'tela', 'regalo', 'nena'] },
  { id: 'repasadores-rayados', nombre: 'Repasadores rayados de algodón', cat: 'repasadores', colores: ['Azul'], descuento: 0, alta: 30,
    ops: [op('Pack x3', 7500, 18), op('Pack x6', 13900, 12), op('Pack x12', 25900, 6)],
    img: 'images/p-repasadores-rayados.webp', alt: 'Repasadores rayados azules y crudos colgados de ganchos en una pared de ladrillo blanco',
    desc: 'Algodón rayado en azul y crudo, con presilla para colgar.', tags: ['repasador', 'repasadores', 'rayado', 'azul', 'cocina', 'pack'] },
  { id: 'repasador-guarda', nombre: 'Repasador de rizo con guarda', cat: 'repasadores', colores: ['Blanco y gris'], descuento: 0, alta: 8,
    ops: [op('Pack x3', 8900, 10), op('Pack x6', 16900, 6)],
    img: 'images/p-repasador-guarda.webp', alt: 'Repasadores blancos de rizo con guarda gris doblados',
    desc: 'Rizo blanco con guarda gris: absorbe más que el repasador de tela.', tags: ['repasador', 'rizo', 'guarda', 'blanco', 'gris', 'cocina', 'pack'] },
  { id: 'cubresillon-flores', nombre: 'Cubresillón estampado Flores', cat: 'cubresillones', colores: ['Terracota'], descuento: 0, alta: 31,
    ops: [op('2 cuerpos', 22900, 6), op('3 cuerpos', 27900, 4)],
    img: 'images/p-cubresillon-flores.webp', alt: 'Sillón cubierto con una manta estampada con flores grandes terracota y crema',
    desc: 'Manta cubresillón estampada con flores grandes. Se apoya sobre el sillón y protege el tapizado.', tags: ['cubresillon', 'manta', 'flores', 'estampado', 'terracota', 'living'] },
  { id: 'cubresillon-corderito', nombre: 'Cubresillón de corderito', cat: 'cubresillones', colores: ['Crema'], descuento: 0, alta: 6,
    ops: [op('2 cuerpos', 29900, 5), op('3 cuerpos', 35900, 3)],
    img: 'images/p-cubresillon-corderito.webp', alt: 'Sillón cubierto con una manta de corderito color crema y almohadones blancos',
    desc: 'Corderito suave y abrigado para el invierno. Protege el sillón de los pelos de las mascotas.', tags: ['cubresillon', 'corderito', 'crema', 'abrigo', 'invierno', 'living'] },
  { id: 'borrador-acolchado', nombre: 'Acolchado de pluma (borrador)', cat: 'cubrecamas', colores: ['Blanco'], descuento: 0, alta: 0, visible: false,
    ops: [op('2 plazas', 1, 0)], img: 'images/p-cubrecama-matelaseado.webp', alt: '', desc: '', tags: [] },
];

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const redondear = n => Math.round(n / 100) * 100;
const conDescuento = (p, n) => (p.descuento > 0 ? redondear(n * (1 - p.descuento / 100)) : n);
const medidaDe = v => String(v).split(' · ').pop();
const opDe = (p, v) => p.ops.find(o => o.v === medidaDe(v));
const precioLista = (p, v) => (v != null && opDe(p, v) ? opDe(p, v).precio : Math.min(...p.ops.map(o => o.precio)));
const precioFinal = (p, v) => conDescuento(p, precioLista(p, v));
const precioDesde = p => precioFinal(p);
const variosPrecios = p => new Set(p.ops.map(o => o.precio)).size > 1;
const stockTotal = p => p.ops.reduce((s, o) => s + (o.stock || 0), 0);
const coloresDe = p => (p.colores && p.colores.length ? p.colores : []);
const catDe = id => CATEGORIAS.find(c => c.id === id);
const ambientesDe = p => (p.amb || catDe(p.cat)?.amb || []);
const esCama = p => p.ops.some(o => NOMBRES_CAMA.includes(o.v));

function crearTienda(coleccion, { tope = 100 } = {}) {
  const visibles = coleccion.filter(p => p.visible !== false);
  const lista = v => (Array.isArray(v) ? v : v ? [v] : []);
  const copia = p => JSON.parse(JSON.stringify(p));
  const limitar = n => Math.min(Math.max(parseInt(n, 10) || 1, 1), tope);
  function coincide(p, f) {
    const cat = lista(f.cat), excluir = lista(f.excluir), medidas = lista(f.medidas), colores = lista(f.colores);
    if (cat.length && !cat.includes(p.cat)) return false;
    if (f.amb && !ambientesDe(p).includes(f.amb)) return false;
    if (f.ofertas && !(p.descuento > 0)) return false;
    if (Array.isArray(f.ids) && !f.ids.includes(p.id)) return false;
    if (excluir.includes(p.id)) return false;
    if (f.destacado && !p.rango) return false;
    if (f.stock && !(stockTotal(p) > 0)) return false;
    if (medidas.length && !p.ops.some(o => medidas.includes(o.v) && (!f.stock || o.stock > 0))) return false;
    if (colores.length && !coloresDe(p).some(c => colores.includes(c))) return false;
    if (f.precioMin != null && precioDesde(p) < f.precioMin) return false;
    if (f.precioMax != null && precioDesde(p) > f.precioMax) return false;
    return true;
  }
  function comparador(orden) {
    const desempate = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    switch (orden) {
      case 'nuevos': return (a, b) => b.alta - a.alta || desempate(a, b);
      case 'precio-asc': return (a, b) => precioDesde(a) - precioDesde(b) || desempate(a, b);
      case 'precio-desc': return (a, b) => precioDesde(b) - precioDesde(a) || desempate(a, b);
      case 'nombre': return (a, b) => a.nombre.localeCompare(b.nombre, 'es') || desempate(a, b);
      default: return (a, b) => (a.rango || 999) - (b.rango || 999) || b.alta - a.alta || desempate(a, b);
    }
  }
  function consultar({ filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
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
      p.nombre, catDe(p.cat)?.nombre, ...ambientesDe(p).map(a => AMBIENTES[a]?.nombre), p.desc, ...coloresDe(p), ...p.ops.map(o => o.v), ...(p.tags || []),
      p.descuento > 0 ? 'oferta ofertas descuento' : '',
    ].join(' ')));
  }
  return textoBusqueda.get(p.id);
}
const tokensBusqueda = new Map();
function tokensDe(p) {
  if (!tokensBusqueda.has(p.id)) tokensBusqueda.set(p.id, new Set(textoDe(p).split(/[^a-z0-9½]+/).filter(Boolean)));
  return tokensBusqueda.get(p.id);
}
const coincideBusqueda = (p, palabras) => palabras.every(w => (w.length <= 2 ? tokensDe(p).has(w) : textoDe(p).includes(w)));

function buscarPaginado(tienda, { q = '', filtros = {}, orden = 'destacados', cursor = null, limite = 16 } = {}) {
  const palabras = norm(q).split(/\s+/).filter(Boolean);
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

const Tienda = crearTienda(PRODUCTOS, { tope: 100 });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const formatearPrecio = n => '$' + Math.round(n).toLocaleString('es-AR');
const cacheProductos = new Map();
const cachear = p => { if (p) cacheProductos.set(p.id, p); return p; };
const getProducto = id => (cacheProductos.has(id) ? cacheProductos.get(id) : cachear(Tienda.obtener(id)));
const stockDe = (p, v) => opDe(p, v)?.stock || 0;
const pideEleccion = p => p.ops.length > 1 || coloresDe(p).length > 1;
const opNombre = p => catDe(p.cat)?.op || 'medida';
const opArticulo = p => (opNombre(p) === 'pack' ? 'el pack' : opNombre(p) === 'tamaño' ? 'el tamaño' : 'la medida');
const varTexto = (p, v) => {
  const partes = String(v).split(' · ');
  const color = partes.length > 1 ? partes[0] : coloresDe(p).length > 1 ? coloresDe(p)[0] : '';
  return [color, p.ops.length > 1 || partes.length > 1 ? medidaDe(v) : p.ops[0].v].filter(Boolean).join(' · ');
};
const leerMedida = () => { try { return localStorage.getItem(KEY_MEDIDA) || ''; } catch { return ''; } };
const guardarMedida = m => { if (!NOMBRES_CAMA.includes(m)) return; try { localStorage.setItem(KEY_MEDIDA, m); } catch (e) { void e; } };
const leerPago = () => { try { return localStorage.getItem(KEY_PAGO) === '1'; } catch { return false; } };
const guardarPago = on => { try { localStorage.setItem(KEY_PAGO, on ? '1' : '0'); } catch (e) { void e; } };
function opsResumen(p) {
  if (p.ops.length === 1) return p.ops[0].v;
  if (esCama(p)) return `${p.ops[0].v} a ${p.ops[p.ops.length - 1].v}`;
  const plural = { medida: 'medidas', 'tamaño': 'tamaños', pack: 'packs' }[opNombre(p)];
  return `${p.ops.length} ${plural}`;
}

const Cart = {
  KEY: 'altapinta_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch { return []; } },
  save(items) { try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch (e) { void e; } document.dispatchEvent(new CustomEvent('cart:updated')); },
  add(producto, qty = 1, v = producto.ops[0].v) {
    const items = this.get();
    const max = stockDe(producto, v) || 0;
    if (!max) return 0;
    const existing = items.find(i => i.id === producto.id && i.v === v);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id: producto.id, v, qty: Math.min(qty, max) });
    this.save(items);
    return Math.min(qty, max);
  },
  setQty(id, v, qty) {
    const items = this.get(); const it = items.find(i => i.id === id && i.v === v); if (!it) return;
    const p = getProducto(id); it.qty = Math.max(1, Math.min(qty, p ? stockDe(p, v) || 1 : 99)); this.save(items);
  },
  remove(id, v) { this.save(this.get().filter(i => !(i.id === id && (v == null || i.v === v)))); },
  clear() { this.save([]); },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => { const p = getProducto(i.id); return p ? s + precioFinal(p, i.v) * i.qty : s; }, 0); },
};

const ICO = {
  flecha: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
  mas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  menos: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg>',
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  carrito: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.2l1.9 10.6a2 2 0 0 0 2 1.65h8.4a2 2 0 0 0 1.96-1.6L21 8H6.3"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>',
  basura: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  check: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  info: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  regla: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
  paquete: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="m7.5 4.27 9 5.15"/></svg>',
  billetera: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
  capas: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
  pin: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  wsp: '<svg class="ico-wsp" viewBox="0 0 32 32" aria-hidden="true"><path d="M16.003 0h-.006C7.166 0 0 7.168 0 16c0 3.504 1.129 6.752 3.047 9.392L1.05 31.35l6.156-1.968A15.9 15.9 0 0 0 16.003 32C24.834 32 32 24.83 32 16S24.834 0 16.003 0zm9.318 22.594c-.387 1.09-1.92 1.996-3.144 2.26-.837.178-1.93.32-5.61-1.204-4.706-1.95-7.737-6.73-7.973-7.04-.226-.31-1.902-2.533-1.902-4.832 0-2.299 1.168-3.428 1.638-3.898.387-.387.998-.563 1.585-.563.19 0 .36.01.514.017.47.02.706.048 1.016.79.387.93 1.328 3.23 1.44 3.463.114.234.228.55.07.86-.148.32-.278.46-.512.73-.234.27-.456.478-.69.767-.214.253-.456.524-.184.994.272.46 1.21 1.996 2.6 3.234 1.794 1.598 3.276 2.093 3.79 2.307.383.16.84.122 1.12-.184.356-.386.796-1.028 1.244-1.66.318-.452.72-.508 1.14-.352.428.148 2.72 1.282 3.19 1.516.47.234.782.348.896.542.114.196.114 1.122-.273 2.212z"/></svg>',
};

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

function precioHTML(p, clase = 'precio', v = null) {
  const desde = v == null && variosPrecios(p);
  return `<p class="${clase}">${desde ? '<small>Desde</small>' : ''}<b>${formatearPrecio(precioFinal(p, v))}</b>${p.descuento > 0 ? `<s>${formatearPrecio(precioLista(p, v))}</s>` : ''}</p>`;
}
function swatchesHTML(p) {
  return `<span class="swatches" aria-label="Color: ${esc(coloresDe(p).join(' o '))}">${coloresDe(p).map(c => `<i style="--sw:${COLORES[c] || '#ccc'}" title="${esc(c)}"></i>`).join('')}</span>`;
}

function cardHTML(p, { anim = true, clase = '' } = {}) {
  const sinStock = !(stockTotal(p) > 0);
  const cat = catDe(p.cat);
  let badge = '';
  if (p.descuento > 0) badge = `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>`;
  else if (!sinStock && stockTotal(p) <= 6) badge = '<span class="pcard__badge">Últimas unidades</span>';
  return `<article class="pcard${clase ? ' ' + clase : ''}${sinStock ? ' pcard--sin' : ''}" data-id="${esc(p.id)}"${anim ? ' data-animate="subir" style="opacity:0;transform:translateY(40px)"' : ''}>
  <div class="pcard__media">
    <a class="pcard__foto" href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}" tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200"></a>
    ${badge}
    <span class="pcard__etq">${esc(opsResumen(p))}</span>
    <button type="button" class="pcard__ya" data-comprar="${esc(p.id)}"${sinStock ? ' disabled' : ''}>${sinStock ? 'Sin stock' : 'Comprar ahora'}</button>
  </div>
  <div class="pcard__info">
    <p class="pcard__meta">${swatchesHTML(p)}<span>${esc(cat?.corto || '')}</span></p>
    <h3 class="pcard__nombre"><a href="?producto=${esc(p.id)}" data-quick="${esc(p.id)}">${esc(p.nombre)}</a></h3>
    ${precioHTML(p, 'pcard__precio')}
    <div class="prod-actions">
      <div class="stepper" data-stepper><button type="button" data-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qty>1</span><button type="button" data-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
      <button type="button" class="prod-add" data-add="${esc(p.id)}" aria-label="${sinStock ? 'Sin stock' : 'Agregar al carrito'}: ${esc(p.nombre)}"${sinStock ? ' disabled' : ''}>${ICO.carrito}<span>${sinStock ? 'Sin stock' : 'Agregar'}</span></button>
    </div>
  </div>
</article>`;
}

let revealsListos = false;
function revelarNuevos(cont) {
  if (!revealsListos || !cont) return;
  const nuevos = [...cont.querySelectorAll('[data-animate]:not(.in)')];
  if (!nuevos.length) return;
  if (reduceMotion) { nuevos.forEach(el => el.classList.add('in')); return; }
  requestAnimationFrame(() => requestAnimationFrame(() => nuevos.forEach((el, i) => {
    const d = Math.min(i * 0.06, 0.6);
    el.style.transitionDelay = `${d}s`;
    el.classList.add('in');
    setTimeout(() => { el.style.transitionDelay = ''; }, (d + 1.2) * 1000);
  })));
}

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
  if (PAGINA === 'catalogo') {
    bar.querySelectorAll('.gw-modelos__btn:not([aria-current])').forEach(a => {
      const base = a.getAttribute('href').split('?')[0];
      a.addEventListener('click', () => {
        const u = new URLSearchParams(location.search);
        u.delete('producto');
        const qs = u.toString();
        a.setAttribute('href', base + (qs ? '?' + qs : ''));
      });
    });
  }
}

function initNav() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const closeBtn = document.getElementById('navClose');
  if (!toggle || !nav) return;
  let bd = document.querySelector('.nav-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'nav-backdrop'; (document.querySelector('.site-header') || document.body).appendChild(bd); }
  const desktopMq = window.matchMedia('(min-width: 1025px)');
  const close = () => {
    nav.classList.remove('open'); bd.classList.remove('open');
    if (!desktopMq.matches) nav.setAttribute('inert', '');
    toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('no-scroll');
  };
  const open = () => {
    nav.classList.add('open'); bd.classList.add('open'); nav.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('no-scroll');
    nav.querySelector('a, .nav-drop__btn')?.focus();
  };
  toggle.addEventListener('click', () => (nav.classList.contains('open') ? close() : open()));
  closeBtn?.addEventListener('click', () => { close(); toggle.focus(); });
  bd.addEventListener('click', close);
  nav.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { close(); toggle.focus(); } });
  const syncInert = () => {
    if (desktopMq.matches) nav.removeAttribute('inert');
    else if (!nav.classList.contains('open')) nav.setAttribute('inert', '');
  };
  desktopMq.addEventListener('change', syncInert);
  syncInert();
}

function initBuscadorHeader() {
  document.querySelectorAll('[data-hsearch]').forEach(form => {
    const input = form.querySelector('input');
    if (!input) return;
    form.addEventListener('submit', e => {
      if (input.value.trim()) return;
      e.preventDefault();
      form.classList.add('abierto');
      input.focus();
    });
    input.addEventListener('blur', () => { if (!input.value.trim()) form.classList.remove('abierto'); });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; input.blur(); } });
  });
}

function initMenuTienda(sel = {}) {
  document.querySelectorAll('[data-nav-drop]').forEach(box => {
    const btn = box.querySelector('.nav-drop__btn');
    const panel = box.querySelector('.nav-drop__panel');
    const lista = box.querySelector('[data-drop-cats]');
    if (!btn || !panel || !lista) return;
    lista.innerHTML = CATEGORIAS.map(c => `<li><a class="nav-drop__cat" href="${URL_CATALOGO}?cat=${c.id}"${sel.cat === c.id ? ' aria-current="page"' : ''}><img src="${esc(c.img)}" alt="" width="64" height="48"><span class="nav-drop__txt"><span>${esc(c.nombre)}</span><small>${esc(c.sub)}</small></span><span class="nav-drop__n">${Tienda.contar({ cat: c.id })}</span></a></li>`).join('');
    const hoverMq = window.matchMedia('(hover: hover) and (min-width: 1025px)');
    let t = 0;
    const abrir = () => { clearTimeout(t); box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); };
    const cerrar = () => { clearTimeout(t); box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => (box.classList.contains('open') ? cerrar() : abrir()));
    box.addEventListener('mouseenter', () => { if (hoverMq.matches) abrir(); });
    box.addEventListener('mouseleave', () => { if (hoverMq.matches) { clearTimeout(t); t = setTimeout(cerrar, 120); } });
    box.addEventListener('focusout', e => { if (hoverMq.matches && !box.contains(e.relatedTarget)) cerrar(); });
    document.addEventListener('click', e => { if (hoverMq.matches && !box.contains(e.target)) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && box.classList.contains('open')) { cerrar(); btn.focus(); } });
    panel.addEventListener('click', e => { if (e.target.closest('a')) cerrar(); });
  });
  const marcar = (a, si) => { if (si) a.setAttribute('aria-current', 'page'); else if (!a.closest('.nav-drop__panel')) a.removeAttribute('aria-current'); };
  document.querySelectorAll('.main-nav .nav-link[href*="catalogo"]').forEach(a => {
    const u = new URL(a.getAttribute('href'), location.href);
    marcar(a, PAGINA === 'catalogo' && ((sel.cat && u.searchParams.get('cat') === sel.cat) || (sel.amb && !sel.cat && u.searchParams.get('amb') === sel.amb)));
  });
}

function initCuentas() {
  document.querySelectorAll('[data-cuenta-total]').forEach(el => { el.textContent = `· ${Tienda.contar({})} productos`; });
}

function pintarRail(track, items) {
  items.forEach(cachear);
  track.innerHTML = items.map(p => `<div class="rail-item"><div class="rail-in" data-animate="der" style="opacity:0;transform:translateX(56px)">${cardHTML(p, { anim: false })}</div></div>`).join('');
}
let idsRail = [];
function initRail() {
  const track = document.querySelector('[data-rail-track]');
  if (!track) return;
  const { items } = Tienda.consultar({ filtros: { destacado: true }, orden: 'destacados', limite: 8 });
  idsRail = items.map(p => p.id);
  pintarRail(track, items);
  const vp = track.closest('[data-rail]');
  initRailDrag(vp);
  const prev = document.querySelector('[data-rail-prev]');
  const next = document.querySelector('[data-rail-next]');
  const paso = () => (track.firstElementChild?.getBoundingClientRect().width || 260) + 20;
  const sync = () => {
    if (!prev || !next) return;
    const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
    prev.disabled = vp.scrollLeft <= Math.min(inicio, 2) + 2;
    next.disabled = vp.scrollLeft >= vp.scrollWidth - vp.clientWidth - 2;
  };
  prev?.addEventListener('click', () => vp.scrollBy({ left: -paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  next?.addEventListener('click', () => vp.scrollBy({ left: paso() * 2, behavior: reduceMotion ? 'auto' : 'smooth' }));
  vp.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}

function initRailDrag(vp) {
  if (!vp) return;
  let dragging = false, moved = false, startX = 0, startScroll = 0, pointerId = null;
  const THRESHOLD = 6;
  vp.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0) return;
    dragging = true; moved = false; pointerId = e.pointerId;
    startX = e.clientX; startScroll = vp.scrollLeft;
  });
  vp.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) < THRESHOLD) return;
    if (!moved) {
      moved = true;
      vp.classList.add('dragging');
      try { vp.setPointerCapture?.(pointerId); } catch (err) { void err; }
    }
    e.preventDefault();
    vp.scrollLeft = startScroll - dx;
  });
  const end = e => {
    if (!dragging || (e && pointerId !== null && e.pointerId !== pointerId)) return;
    dragging = false;
    if (moved) {
      try { vp.releasePointerCapture?.(pointerId); } catch (err) { void err; }
      const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
      vp.addEventListener('click', kill, { capture: true, once: true });
      setTimeout(() => vp.removeEventListener('click', kill, { capture: true }), 0);
      const track = vp.firstElementChild;
      const inicio = parseFloat(window.getComputedStyle(track).paddingInlineStart) || 0;
      const items = [...track.children];
      const destino = items.reduce((best, it) => {
        const left = it.offsetLeft - inicio;
        return Math.abs(left - vp.scrollLeft) < Math.abs(best - vp.scrollLeft) ? left : best;
      }, 0);
      vp.scrollTo({ left: Math.max(0, Math.min(destino, vp.scrollWidth - vp.clientWidth)), behavior: reduceMotion ? 'auto' : 'smooth' });
      setTimeout(() => vp.classList.remove('dragging'), 480);
    }
    pointerId = null; moved = false;
  };
  vp.addEventListener('pointerup', end);
  vp.addEventListener('pointercancel', end);
  vp.addEventListener('dragstart', e => e.preventDefault());
}

function initPreview() {
  const cont = document.querySelector('[data-preview]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { excluir: idsRail }, orden: 'nuevos', limite: 8 });
  items.forEach(cachear);
  cont.innerHTML = items.map(p => cardHTML(p)).join('');
}

let idsVitrina = [];
function initVitrina() {
  const box = document.querySelector('[data-vitrina]');
  if (!box) return;
  const tabs = [...box.querySelectorAll('[data-vitrina-tab]')];
  const grid = box.querySelector('[data-vitrina-grid]');
  const foto = box.querySelector('[data-vitrina-amb]');
  const panel = box.querySelector('[role="tabpanel"]');
  if (!tabs.length || !grid || !foto) return;
  const pintar = (id, primera) => {
    const a = AMBIENTES[id];
    if (!a) return;
    tabs.forEach(t => {
      const activa = t.dataset.vitrinaTab === id;
      t.setAttribute('aria-selected', String(activa));
      t.tabIndex = activa ? 0 : -1;
      if (activa) panel?.setAttribute('aria-labelledby', t.id);
    });
    const n = Tienda.contar({ amb: id });
    foto.href = `${URL_CATALOGO}?amb=${id}`;
    foto.innerHTML = `<img src="${esc(a.img)}" alt="${esc(a.alt)}" width="${a.w}" height="${a.h}"${a.pos ? ` style="object-position:${a.pos}"` : ''}>
      <span class="amb-foto__txt"><span class="amb-foto__nom">${esc(a.nombre)}</span><span class="amb-foto__sub">${esc(a.sub)}</span><span class="amb-foto__cta">Ver ${n} ${n === 1 ? 'producto' : 'productos'} ${ICO.flecha}</span></span>`;
    const { items } = Tienda.consultar({ filtros: { amb: id }, orden: 'destacados', limite: 4 });
    items.forEach(cachear);
    if (primera) idsVitrina = items.map(p => p.id);
    grid.innerHTML = items.map(p => cardHTML(p)).join('');
    if (!primera) {
      foto.classList.remove('cambia'); void foto.offsetWidth; foto.classList.add('cambia');
      revelarNuevos(grid);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => pintar(t.dataset.vitrinaTab, false));
    t.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const j = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[j].focus();
      pintar(tabs[j].dataset.vitrinaTab, false);
    });
  });
  pintar(tabs[0].dataset.vitrinaTab, true);
}

function initMosaico() {
  const cont = document.querySelector('[data-mosaico]');
  if (!cont) return;
  const { items } = Tienda.consultar({ filtros: { excluir: idsVitrina }, orden: 'nuevos', limite: 7 });
  items.forEach(cachear);
  const todo = `<a class="mosaico__todo" href="${URL_CATALOGO}" data-animate="subir" style="opacity:0;transform:translateY(40px)"><span class="mosaico__todo-tit">Ver todo el catálogo</span><span class="mosaico__todo-n">${Tienda.contar({})} productos de blanquería</span>${ICO.flecha}</a>`;
  cont.innerHTML = items.map((p, i) => cardHTML(p, { clase: i === 0 ? 'pcard--grande' : '' })).join('') + todo;
}

const TRAMOS = [[600, 780], [1020, 1200]];
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
function ahoraAR() {
  try {
    const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const val = t => partes.find(x => x.type === t)?.value;
    const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(val('weekday'));
    return { dia, min: parseInt(val('hour'), 10) * 60 + parseInt(val('minute'), 10) };
  } catch {
    const d = new Date();
    return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
  }
}
function estadoHorario() {
  const { dia, min } = ahoraAR();
  const abreDia = d => d >= 1 && d <= 6;
  const hs = m => `${Math.floor(m / 60)} h`;
  if (abreDia(dia)) {
    const t = TRAMOS.find(([a, c]) => min >= a && min < c);
    if (t) return { abierto: true, largo: `Abierto ahora · cierra a las ${hs(t[1])}`, corto: 'Abierto ahora' };
    const prox = TRAMOS.find(([a]) => min < a);
    if (prox) return { abierto: false, largo: `Cerrado · abre hoy a las ${hs(prox[0])}`, corto: `Abre a las ${hs(prox[0])}` };
  }
  let d = (dia + 1) % 7;
  while (!abreDia(d)) d = (d + 1) % 7;
  const cuando = d === (dia + 1) % 7 ? 'mañana' : `el ${DIAS[d]}`;
  return { abierto: false, largo: `Cerrado · abre ${cuando} a las 10 h`, corto: `Abre ${cuando} 10 h` };
}
function initHorario() {
  const els = document.querySelectorAll('[data-estado]');
  if (!els.length) return;
  const pintar = () => {
    const e = estadoHorario();
    els.forEach(el => {
      el.classList.toggle('abierto', e.abierto);
      el.classList.toggle('cerrado', !e.abierto);
      const txt = el.querySelector('[data-estado-txt]');
      if (!txt) return;
      txt.textContent = el.classList.contains('estado--mini') ? e.corto : e.largo;
    });
  };
  pintar();
  setInterval(pintar, 60000);
}

const ORIGEN = [-34.7609, -58.4062];
const RADIO_KM = 50;
const LOCALIDADES = [
  ['Ciudad de Buenos Aires', [
    ['CABA · Microcentro', -34.6037, -58.3816], ['CABA · Flores', -34.6286, -58.4636], ['CABA · Palermo', -34.5889, -58.4306], ['CABA · Belgrano', -34.5627, -58.4565], ['CABA · Mataderos', -34.6574, -58.5023]]],
  ['Zona Sur', [
    ['Lomas de Zamora', -34.7609, -58.4062], ['Banfield', -34.7449, -58.3936], ['Temperley', -34.7766, -58.3967], ['Lanús', -34.7065, -58.3917], ['Avellaneda', -34.6626, -58.3655],
    ['Quilmes', -34.7206, -58.2546], ['Bernal', -34.7086, -58.2803], ['Berazategui', -34.7646, -58.2128], ['Florencio Varela', -34.8066, -58.2758], ['Adrogué', -34.7996, -58.3891],
    ['Burzaco', -34.827, -58.3933], ['Monte Grande', -34.8166, -58.4686], ['Ezeiza', -34.853, -58.5228], ['Canning', -34.857, -58.507], ['Guernica', -34.9165, -58.3871],
    ['Alejandro Korn', -34.9837, -58.3824], ['San Vicente', -35.0247, -58.4232], ['Cañuelas', -35.0517, -58.7608], ['Brandsen', -35.1689, -58.234]]],
  ['La Plata y alrededores', [
    ['La Plata', -34.9214, -57.9545], ['City Bell', -34.8667, -58.05], ['Ensenada', -34.864, -57.911], ['Berisso', -34.8728, -57.8868]]],
  ['Zona Oeste', [
    ['San Justo', -34.6833, -58.55], ['Ramos Mejía', -34.6431, -58.5652], ['González Catán', -34.7714, -58.6461], ['Morón', -34.6534, -58.6198], ['Ituzaingó', -34.6587, -58.667],
    ['Merlo', -34.6653, -58.7276], ['Marcos Paz', -34.779, -58.837], ['Moreno', -34.6509, -58.7896], ['General Rodríguez', -34.6084, -58.9522], ['Luján', -34.5703, -59.105]]],
  ['Zona Norte', [
    ['San Martín', -34.5751, -58.5371], ['Vicente López', -34.5262, -58.4795], ['San Isidro', -34.4708, -58.5286], ['San Fernando', -34.4419, -58.5596], ['Tigre', -34.426, -58.5797],
    ['San Miguel', -34.5432, -58.7124], ['José C. Paz', -34.5153, -58.7676], ['Pilar', -34.4587, -58.9142], ['Escobar', -34.3486, -58.7934], ['Campana', -34.1633, -58.9592], ['Zárate', -34.0981, -59.0286]]],
];
function distanciaKm([lat1, lon1], [lat2, lon2]) {
  const rad = x => (x * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function initRadio() {
  const box = document.querySelector('[data-radio]');
  if (!box) return;
  const sel = box.querySelector('[data-radio-loc]');
  const km = box.querySelector('[data-radio-km]');
  const msg = box.querySelector('[data-radio-msg]');
  const res = box.querySelector('[data-radio-res]');
  const wsp = box.querySelector('[data-radio-wsp]');
  const cta = box.querySelector('[data-radio-cta]');
  const ubic = box.querySelector('[data-radio-ubicacion]');
  if (!sel || !km || !msg || !wsp) return;
  sel.insertAdjacentHTML('beforeend', LOCALIDADES.map(([grupo, locs]) => `<optgroup label="${esc(grupo)}">${locs.map(([n]) => `<option value="${esc(n)}">${esc(n)}</option>`).join('')}</optgroup>`).join(''));
  const todas = new Map(LOCALIDADES.flatMap(([, locs]) => locs.map(([n, la, lo]) => [n, [la, lo]])));
  const mapa = initMapa();
  const mostrar = (nombre, punto) => {
    const d = distanciaKm(ORIGEN, punto);
    const dentro = d <= RADIO_KM;
    const kmTxt = d < 1.5 ? 'En Lomas' : `≈ ${Math.round(d)} km`;
    km.textContent = kmTxt;
    res.classList.toggle('dentro', dentro);
    res.classList.toggle('fuera', !dentro);
    if (dentro) {
      msg.textContent = `${nombre} está dentro del radio: en tu primera compra podés pagar cuando recibís el pedido.`;
      cta.textContent = 'Coordinar el pago al recibir';
      wsp.href = wspLink(`Hola Alta Pinta! Es mi primera compra, estoy en ${nombre} y quiero pagar al recibir el pedido.`);
    } else {
      msg.textContent = `${nombre} queda fuera de los 50 km, pero te lo mandamos igual: hacemos envíos a todo el país.`;
      cta.textContent = `Consultar el envío a ${nombre}`;
      wsp.href = wspLink(`Hola Alta Pinta! Quiero consultar el envío a ${nombre}.`);
    }
    mapa?.marcar(punto, nombre, dentro);
  };
  sel.addEventListener('change', () => {
    const p = todas.get(sel.value);
    if (p) mostrar(sel.value, p);
  });
  ubic?.addEventListener('click', () => {
    if (!navigator.geolocation) { showToast('Tu navegador no comparte la ubicación. Elegí tu localidad en la lista.'); return; }
    ubic.disabled = true;
    navigator.geolocation.getCurrentPosition(pos => {
      ubic.disabled = false;
      sel.value = '';
      mostrar('Tu ubicación', [pos.coords.latitude, pos.coords.longitude]);
    }, () => {
      ubic.disabled = false;
      showToast('No pudimos leer tu ubicación. Elegí tu localidad en la lista.');
    }, { timeout: 8000, maximumAge: 600000 });
  });
}
function initMapa() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return null;
  try {
    const mapa = L.map(el, { scrollWheelZoom: false, attributionControl: true, zoomSnap: 0.25 }).setView(ORIGEN, 9);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapa);
    const circulo = L.circle(ORIGEN, { radius: RADIO_KM * 1000, color: '#A3262A', weight: 1, fillColor: '#A3262A', fillOpacity: 0.07, interactive: false }).addTo(mapa);
    const pinCasa = L.divIcon({ className: 'mapa-pin', html: `<span>${ICO.pin}</span>`, iconSize: [40, 40], iconAnchor: [20, 38] });
    L.marker(ORIGEN, { icon: pinCasa, title: 'Showroom Alta Pinta · Lomas de Zamora' }).addTo(mapa).bindPopup('<b>Alta Pinta</b><br>Showroom en Lomas de Zamora');
    mapa.fitBounds(circulo.getBounds(), { padding: [12, 12] });
    let marca = null;
    let linea = null;
    return {
      marcar(punto, nombre, dentro) {
        marca?.remove();
        linea?.remove();
        const icono = L.divIcon({ className: `mapa-pin mapa-pin--loc${dentro ? '' : ' mapa-pin--fuera'}`, html: '<i></i>', iconSize: [22, 22], iconAnchor: [11, 11] });
        marca = L.marker(punto, { icon: icono, title: nombre }).addTo(mapa);
        linea = L.polyline([ORIGEN, punto], { color: dentro ? '#A3262A' : '#6A5F58', weight: 2, dashArray: '6 6', interactive: false }).addTo(mapa);
        mapa.fitBounds(L.latLngBounds([circulo.getBounds().getSouthWest(), circulo.getBounds().getNorthEast(), punto]), { padding: [16, 16] });
      },
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

function cerrarPickers(excepto) {
  document.querySelectorAll('.picker').forEach(pk => { if (pk !== excepto) pk.remove(); });
}
function pickerHTML(p, colorSel) {
  const colores = coloresDe(p);
  const filaColor = colores.length > 1
    ? `<p class="picker__tit">Elegí el color</p><div class="picker__colores">${colores.map(c => `<button type="button" class="picker__color" data-picker-color="${esc(c)}" aria-pressed="${c === colorSel}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div>`
    : '';
  const mia = leerMedida();
  const conPrecio = variosPrecios(p);
  return `<div class="picker__head"><p class="picker__tit">Elegí ${opArticulo(p)}</p><button type="button" class="picker__cerrar" data-picker-cerrar aria-label="Cerrar">${ICO.x}</button></div>
    ${filaColor}
    <div class="picker__ops">${p.ops.map(o => `<button type="button" class="picker__op${o.v === mia ? ' es-suya' : ''}" data-picker-op="${esc(o.v)}"${o.stock > 0 ? '' : ' disabled'} aria-label="${esc(o.v)}${conPrecio ? ', ' + formatearPrecio(conDescuento(p, o.precio)) : ''}${o.stock > 0 ? '' : ', sin stock'}"><span>${esc(o.v)}</span>${conPrecio ? `<small>${formatearPrecio(conDescuento(p, o.precio))}</small>` : ''}</button>`).join('')}</div>`;
}
function abrirPicker(card, p, modo) {
  cerrarPickers();
  const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
  const pk = document.createElement('div');
  pk.className = 'picker';
  pk.setAttribute('role', 'dialog');
  pk.setAttribute('aria-label', `Elegí ${opArticulo(p)}: ${p.nombre}`);
  pk.dataset.modo = modo;
  pk.dataset.qty = String(qty);
  pk.dataset.color = coloresDe(p)[0] || '';
  pk.innerHTML = pickerHTML(p, pk.dataset.color) + (qty > 1 ? `<p class="picker__nota">Vas a sumar ${qty} unidades.</p>` : '');
  (card.querySelector('.pcard__media') || card).appendChild(pk);
  (pk.querySelector('.picker__op.es-suya:not([disabled])') || pk.querySelector('.picker__op:not([disabled])') || pk.querySelector('.picker__cerrar'))?.focus({ preventScroll: true });
}

function sumarAlCarrito(p, qty, v, comprar) {
  const sumadas = Cart.add(p, qty, v);
  if (!sumadas) { showToast('Esa opción no tiene stock por ahora.'); return; }
  guardarMedida(medidaDe(v));
  if (comprar) { abrirCarrito(); return; }
  const detalle = varTexto(p, v);
  showToast(`Sumaste ${sumadas > 1 ? sumadas + ' × ' : ''}${p.nombre}${detalle ? ` (${detalle})` : ''} al carrito`);
}

function initTarjetas() {
  document.addEventListener('click', e => {
    const quick = e.target.closest('[data-quick]');
    if (quick && !e.target.closest('.picker')) {
      e.preventDefault();
      abrirQV(quick.dataset.quick, quick);
      return;
    }
    const step = e.target.closest('[data-step]');
    if (step) {
      const box = step.closest('[data-stepper]');
      const n = box?.querySelector('[data-qty]');
      if (!n) return;
      const card = step.closest('.pcard');
      const p = card ? getProducto(card.dataset.id) : null;
      const max = p ? Math.max(...p.ops.map(o => o.stock), 1) : 99;
      n.textContent = String(Math.max(1, Math.min(max, (parseInt(n.textContent, 10) || 1) + Number(step.dataset.step))));
      return;
    }
    const add = e.target.closest('[data-add], [data-comprar]');
    if (add) {
      const card = add.closest('.pcard');
      const p = getProducto(add.dataset.add || add.dataset.comprar);
      if (!p || !card) return;
      const comprar = add.hasAttribute('data-comprar');
      if (pideEleccion(p)) { abrirPicker(card, p, comprar ? 'comprar' : 'agregar'); return; }
      const qty = parseInt(card.querySelector('[data-qty]')?.textContent, 10) || 1;
      sumarAlCarrito(p, qty, p.ops[0].v, comprar);
      return;
    }
    const colorBtn = e.target.closest('[data-picker-color]');
    if (colorBtn) {
      const pk = colorBtn.closest('.picker');
      pk.dataset.color = colorBtn.dataset.pickerColor;
      pk.querySelectorAll('[data-picker-color]').forEach(b => b.setAttribute('aria-pressed', String(b === colorBtn)));
      return;
    }
    const opBtn = e.target.closest('[data-picker-op]');
    if (opBtn) {
      const pk = opBtn.closest('.picker');
      const card = opBtn.closest('.pcard');
      const p = getProducto(card?.dataset.id);
      if (!p || !pk) return;
      const v = coloresDe(p).length > 1 ? `${pk.dataset.color} · ${opBtn.dataset.pickerOp}` : opBtn.dataset.pickerOp;
      sumarAlCarrito(p, parseInt(pk.dataset.qty, 10) || 1, v, pk.dataset.modo === 'comprar');
      pk.remove();
      if (pk.dataset.modo !== 'comprar') card.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-picker-cerrar]')) {
      const card = e.target.closest('.pcard');
      e.target.closest('.picker')?.remove();
      card?.querySelector('[data-add]')?.focus({ preventScroll: true });
      return;
    }
    if (!e.target.closest('.picker')) cerrarPickers();
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const pk = document.querySelector('.picker');
    if (!pk) return;
    const card = pk.closest('.pcard');
    pk.remove();
    card?.querySelector('[data-add]')?.focus({ preventScroll: true });
  });
}

let ultimoFoco = null;
function atraparFoco(panel, e) {
  if (e.key !== 'Tab' || !panel) return;
  const focos = [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  if (!focos.length) return;
  const primero = focos[0], ultimo = focos[focos.length - 1];
  if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
}

const qvEstado = { p: null, op: '', color: '', qty: 1 };
function abrirQV(id, origen) {
  const p = getProducto(id);
  const qv = document.getElementById('qv');
  if (!p || !qv) return;
  cerrarPickers();
  qvEstado.p = p;
  const mia = p.ops.find(o => o.v === leerMedida() && o.stock > 0);
  qvEstado.op = p.ops.length === 1 && p.ops[0].stock > 0 ? p.ops[0].v : mia ? mia.v : '';
  qvEstado.color = coloresDe(p)[0] || '';
  qvEstado.qty = 1;
  if (!qv.classList.contains('open')) ultimoFoco = origen || document.activeElement;
  pintarQV();
  qv.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('open')));
  qv.querySelector('.qv__panel').scrollTop = 0;
  qv.querySelector('.qv__close')?.focus({ preventScroll: true });
  const url = new URL(location.href);
  url.searchParams.set('producto', p.id);
  window.history.replaceState(null, '', url);
  const ld = document.getElementById('ldProducto');
  if (ld) ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product', name: p.nombre, image: new URL(p.img, location.href).href, description: p.desc, color: coloresDe(p).join(', '),
    brand: { '@type': 'Brand', name: 'Alta Pinta' },
    offers: { '@type': 'AggregateOffer', priceCurrency: 'ARS', lowPrice: precioDesde(p), highPrice: Math.max(...p.ops.map(o => conDescuento(p, o.precio))), offerCount: p.ops.length, availability: stockTotal(p) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' },
  });
}
function guiaHTML(p) {
  if (!esCama(p)) return '';
  const propias = new Set(p.ops.map(o => o.v));
  const tabla = `<table><thead><tr><th scope="col">Medida</th><th scope="col">Colchón de</th></tr></thead><tbody>${MEDIDAS_CAMA.filter(m => propias.has(m[0])).map(m => `<tr${m[0] === qvEstado.op ? ' class="es-actual"' : ''}><th scope="row">${esc(m[0])}</th><td>${esc(m[1])}</td></tr>`).join('')}</tbody></table>`;
  return `<details class="qv__det"><summary>${ICO.regla}Guía de medidas</summary>
    <div class="guia">${tabla}<p class="guia__nota">Medidas de referencia del colchón. Si tu colchón es más alto de 25 cm, consultanos antes de comprar.</p></div></details>`;
}
function pintarQV() {
  const p = qvEstado.p;
  const cont = document.getElementById('qvContent');
  if (!p || !cont) return;
  const { items: rel } = Tienda.consultar({ filtros: { cat: p.cat, excluir: p.id, stock: true }, orden: 'destacados', limite: 3 });
  rel.forEach(cachear);
  const sinStock = !(stockTotal(p) > 0);
  const colores = coloresDe(p);
  const o = p.ops.find(x => x.v === qvEstado.op);
  const nombreOp = opNombre(p);
  const stockTxt = sinStock ? 'Sin stock por ahora' : !o ? `Elegí ${opArticulo(p)} para ver el precio y la disponibilidad` : o.stock <= 2 ? `Quedan ${o.stock} en ${o.v}` : `${o.v}: en stock`;
  const selColor = colores.length > 1
    ? `<div class="qv__var"><p class="qv__var-tit">Color: <b>${esc(qvEstado.color)}</b></p><div class="qv__colores" role="radiogroup" aria-label="Color">${colores.map(c => `<button type="button" class="qv__color" role="radio" aria-checked="${c === qvEstado.color}" data-qv-color="${esc(c)}"><i style="--sw:${COLORES[c] || '#ccc'}"></i>${esc(c)}</button>`).join('')}</div></div>`
    : `<p class="qv__color-fijo">${swatchesHTML(p)}Color: ${esc(colores[0] || '')}</p>`;
  const conPrecio = variosPrecios(p);
  const selOp = p.ops.length > 1
    ? `<div class="qv__var" data-qv-ops><p class="qv__var-tit">${nombreOp === 'pack' ? 'Pack' : nombreOp === 'tamaño' ? 'Tamaño' : 'Medida'}${qvEstado.op ? `: <b>${esc(qvEstado.op)}</b>` : ''}</p><div class="qv__ops" role="radiogroup" aria-label="${esc(nombreOp)}">${p.ops.map(x => `<button type="button" class="qv__op" role="radio" aria-checked="${x.v === qvEstado.op}" data-qv-op="${esc(x.v)}"${x.stock > 0 ? '' : ' disabled'}><span>${esc(x.v)}</span>${conPrecio ? `<small>${formatearPrecio(conDescuento(p, x.precio))}</small>` : ''}</button>`).join('')}</div><p class="qv__aviso" data-qv-aviso hidden>Elegí ${opArticulo(p)} para sumarlo al carrito.</p></div>`
    : `<p class="qv__var-tit">${esc(p.ops[0].v)}</p>`;
  cont.innerHTML = `<div class="qv__grid">
    <div class="qv__media"><img src="${esc(p.img)}" alt="${esc(p.alt)}" width="960" height="1200">${p.descuento > 0 ? `<span class="pcard__badge pcard__badge--off">-${p.descuento}%</span>` : ''}</div>
    <div class="qv__info">
      <p class="qv__meta">${esc(catDe(p.cat)?.nombre)}</p>
      <h2 class="qv__nombre">${esc(p.nombre)}</h2>
      ${precioHTML(p, 'qv__precio', qvEstado.op || null)}
      ${selColor}
      ${selOp}
      <p class="qv__stock${sinStock || !o ? ' qv__stock--sin' : ''}">${sinStock || !o ? ICO.info : ICO.check}<span>${esc(stockTxt)}</span></p>
      <div class="qv__acc">
        <div class="stepper" data-qv-stepper><button type="button" data-qv-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n" data-qv-qty>${qvEstado.qty}</span><button type="button" data-qv-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="btn btn--cta" data-qv-add${sinStock ? ' disabled' : ''}>${ICO.carrito}Agregar al carrito</button>
        <button type="button" class="btn btn--line" data-qv-comprar${sinStock ? ' disabled' : ''}>Comprar ahora</button>
      </div>
      <a class="qv__mayor" href="${wspLink(`Hola Alta Pinta! Quiero el precio por mayor de: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.paquete}<span>¿Comprás por cantidad? <u>Pedí el precio por mayor</u></span></a>
      <details class="qv__det" open><summary>${ICO.info}Detalle</summary><p>${esc(p.desc)}</p></details>
      ${guiaHTML(p)}
      <a class="qv__wsp" href="${wspLink(`Hola Alta Pinta! Tengo una consulta sobre: ${p.nombre}`)}" target="_blank" rel="noopener">${ICO.wsp}<span>${sinStock ? 'Preguntá cuándo vuelve por WhatsApp' : '¿Dudas con la medida? Preguntá por WhatsApp'}</span></a>
      ${rel.length ? `<div class="qv__rel"><p class="qv__rel-tit">También en ${esc((catDe(p.cat)?.corto || '').toLowerCase())}</p><div class="qv__rel-grid">${rel.map(r => `<button type="button" class="qv__rel-item" data-quick="${esc(r.id)}"><img src="${esc(r.img)}" alt="" width="240" height="300"><span>${esc(r.nombre)}</span><b>${variosPrecios(r) ? 'Desde ' : ''}${formatearPrecio(precioDesde(r))}</b></button>`).join('')}</div></div>` : ''}
    </div>
  </div>`;
}
function cerrarQV() {
  const qv = document.getElementById('qv');
  if (!qv || qv.hidden) return;
  qv.classList.remove('open');
  if (!document.getElementById('cartDrawer')?.classList.contains('open')) document.body.classList.remove('no-scroll');
  setTimeout(() => { qv.hidden = true; }, 320);
  const url = new URL(location.href);
  url.searchParams.delete('producto');
  window.history.replaceState(null, '', url);
  if (ultimoFoco && document.contains(ultimoFoco)) ultimoFoco.focus({ preventScroll: true });
}
function initQV() {
  const qv = document.getElementById('qv');
  if (!qv) return;
  qv.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-qv]')) { cerrarQV(); return; }
    const p = qvEstado.p;
    if (!p) return;
    const opBtn = e.target.closest('[data-qv-op]');
    if (opBtn) {
      qvEstado.op = opBtn.dataset.qvOp;
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || 1;
      qvEstado.qty = Math.min(qvEstado.qty, max);
      pintarQV();
      qv.querySelector(`[data-qv-op="${CSS.escape(qvEstado.op)}"]`)?.focus();
      return;
    }
    const colorBtn = e.target.closest('[data-qv-color]');
    if (colorBtn) {
      qvEstado.color = colorBtn.dataset.qvColor;
      pintarQV();
      qv.querySelector(`[data-qv-color="${CSS.escape(qvEstado.color)}"]`)?.focus();
      return;
    }
    const step = e.target.closest('[data-qv-step]');
    if (step) {
      const max = p.ops.find(o => o.v === qvEstado.op)?.stock || Math.max(...p.ops.map(o => o.stock), 1);
      qvEstado.qty = Math.max(1, Math.min(max, qvEstado.qty + Number(step.dataset.qvStep)));
      qv.querySelector('[data-qv-qty]').textContent = String(qvEstado.qty);
      return;
    }
    const comprar = e.target.closest('[data-qv-comprar]');
    const agregar = e.target.closest('[data-qv-add]');
    if (!comprar && !agregar) return;
    if (!qvEstado.op) {
      const aviso = qv.querySelector('[data-qv-aviso]');
      if (aviso) { aviso.hidden = false; aviso.classList.remove('sacude'); void aviso.offsetWidth; aviso.classList.add('sacude'); }
      qv.querySelector('.qv__op:not([disabled])')?.focus();
      return;
    }
    const v = coloresDe(p).length > 1 ? `${qvEstado.color} · ${qvEstado.op}` : qvEstado.op;
    if (comprar) {
      const n = Cart.add(p, qvEstado.qty, v);
      if (!n) { showToast('Esa opción no tiene stock por ahora.'); return; }
      guardarMedida(qvEstado.op);
      cerrarQV();
      abrirCarrito();
      return;
    }
    sumarAlCarrito(p, qvEstado.qty, v, false);
  });
  qv.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarQV(); return; }
    atraparFoco(qv.querySelector('.qv__panel'), e);
  });
  const id = PARAMS.get('producto');
  if (id && Tienda.obtener(id)) abrirQV(id, null);
}

let focoCarrito = null;
function abrirCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr) return;
  cerrarPickers();
  if (!dr.classList.contains('open')) focoCarrito = document.activeElement;
  renderCarrito();
  dr.hidden = false;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(() => requestAnimationFrame(() => dr.classList.add('open')));
  dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
}
function cerrarCarrito() {
  const dr = document.getElementById('cartDrawer');
  if (!dr || dr.hidden) return;
  dr.classList.remove('open');
  if (document.getElementById('qv')?.hidden !== false) document.body.classList.remove('no-scroll');
  setTimeout(() => { dr.hidden = true; }, 380);
  if (focoCarrito && document.contains(focoCarrito)) focoCarrito.focus({ preventScroll: true });
}
function renderCarrito() {
  const body = document.getElementById('cartLines');
  const foot = document.getElementById('cartFoot');
  const cuenta = document.querySelector('[data-cart-titulo-n]');
  if (!body || !foot) return;
  const items = Cart.get().filter(i => getProducto(i.id));
  if (cuenta) cuenta.textContent = items.length ? `(${Cart.count()})` : '';
  if (!items.length) {
    body.innerHTML = `<div class="cart-vacio">${ICO.capas}<p class="cart-vacio__tit">Tu carrito está vacío</p><p>Elegí la medida en cualquier producto y sumalo acá.</p><a class="btn btn--cta" href="${URL_CATALOGO}">Volver al catálogo</a></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = `<ul class="lineas">${items.map(i => {
    const p = getProducto(i.id);
    return `<li class="linea" data-linea="${esc(i.id)}" data-v="${esc(i.v)}">
      <img src="${esc(p.img)}" alt="" width="72" height="90">
      <div><p class="linea__nombre">${esc(p.nombre)}</p><p class="linea__var">${esc(varTexto(p, i.v))} · ${formatearPrecio(precioFinal(p, i.v))} c/u</p>
        <div class="linea__acc"><div class="stepper"><button type="button" data-linea-step="-1" aria-label="Restar uno">${ICO.menos}</button><span class="stepper__n">${i.qty}</span><button type="button" data-linea-step="1" aria-label="Sumar uno">${ICO.mas}</button></div>
        <button type="button" class="linea__quitar" data-linea-quitar aria-label="Quitar ${esc(p.nombre)}">${ICO.basura}</button></div></div>
      <p class="linea__precio">${formatearPrecio(precioFinal(p, i.v) * i.qty)}</p>
    </li>`;
  }).join('')}</ul>`;
  const pago = leerPago();
  const lineas = items.map(i => { const p = getProducto(i.id); return `- ${i.qty} × ${p.nombre} (${varTexto(p, i.v)}): ${formatearPrecio(precioFinal(p, i.v) * i.qty)}`; }).join('\n');
  const msg = `Hola Alta Pinta! Quiero hacer este pedido:\n${lineas}\nTotal: ${formatearPrecio(Cart.total())}\n${pago ? 'Es mi primera compra, estoy a menos de 50 km del local y quiero pagar al recibir.\n' : ''}Mi nombre es: \nMi localidad es: `;
  const home = `${URL_HOME === './' ? './' : URL_HOME}#pago-al-recibir`;
  foot.innerHTML = `<p class="drawer__total"><span>Total</span><b>${formatearPrecio(Cart.total())}</b></p>
    <label class="pago-recibir"><input type="checkbox" data-pago-recibir${pago ? ' checked' : ''}><span><b>Es mi primera compra y estoy a menos de 50 km del local:</b> quiero pagar al recibir el pedido.</span></label>
    ${pago ? `<p class="pago-recibir__nota">${ICO.billetera}<span>Coordinamos la entrega por WhatsApp y pagás cuando lo recibís. <a href="${home}">¿Entrás en el radio?</a></span></p>
    <a class="btn btn--cta" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Coordinar el pago al recibir</a>`
    : `<button type="button" class="btn btn--cta" data-finalizar>Finalizar compra</button>
    <a class="btn btn--line" href="${wspLink(msg)}" target="_blank" rel="noopener">${ICO.wsp}Enviar el pedido por WhatsApp</a>`}`;
}
function initCarrito() {
  const dr = document.getElementById('cartDrawer');
  document.addEventListener('click', e => {
    if (e.target.closest('[data-open-cart]')) { abrirCarrito(); return; }
    if (e.target.closest('[data-finalizar]')) showToast('¡Genial! El pago online se activa al pasar la web a producción.');
  });
  if (!dr) return;
  dr.addEventListener('change', e => {
    const chk = e.target.closest('[data-pago-recibir]');
    if (!chk) return;
    guardarPago(chk.checked);
    renderCarrito();
    dr.querySelector('[data-pago-recibir]')?.focus({ preventScroll: true });
  });
  dr.addEventListener('click', e => {
    if (e.target.closest('[data-cerrar-cart]')) { cerrarCarrito(); return; }
    if (e.target.closest('.pago-recibir__nota a')) { cerrarCarrito(); return; }
    const linea = e.target.closest('[data-linea]');
    if (!linea) return;
    const id = linea.dataset.linea, v = linea.dataset.v;
    const step = e.target.closest('[data-linea-step]');
    if (step) {
      const it = Cart.get().find(i => i.id === id && i.v === v);
      if (it) Cart.setQty(id, v, it.qty + Number(step.dataset.lineaStep));
      [...dr.querySelectorAll('[data-linea]')].find(l => l.dataset.linea === id && l.dataset.v === v)?.querySelector(`[data-linea-step="${step.dataset.lineaStep}"]`)?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-linea-quitar]')) {
      Cart.remove(id, v);
      dr.querySelector('.drawer__head .icon-btn')?.focus({ preventScroll: true });
    }
  });
  dr.addEventListener('keydown', e => {
    if (e.key === 'Escape') { cerrarCarrito(); return; }
    atraparFoco(dr.querySelector('.drawer__panel'), e);
  });
  document.addEventListener('cart:updated', () => { if (!dr.hidden) renderCarrito(); });
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
  sync();
}

function initCatalogo() {
  const grid = document.querySelector('[data-cat-grid]');
  if (!grid) return {};
  const valido = (v, lista) => (v && Object.prototype.hasOwnProperty.call(lista, v) ? v : '');
  const catIds = Object.fromEntries(CATEGORIAS.map(c => [c.id, c]));
  const lista = k => (PARAMS.get(k) || '').split(',').map(s => s.trim()).filter(Boolean);
  const estado = {
    cat: valido(PARAMS.get('cat'), catIds),
    amb: valido(PARAMS.get('amb'), AMBIENTES),
    medidas: new Set(lista('medida').filter(m => NOMBRES_CAMA.includes(m))),
    colores: new Set(lista('color').filter(c => COLORES[c])),
    precio: valido(PARAMS.get('precio'), RANGOS),
    ofertas: PARAMS.get('ofertas') === '1',
    stock: PARAMS.get('stock') === '1',
    q: (PARAMS.get('q') || '').trim().slice(0, 60),
    orden: valido(PARAMS.get('orden'), ORDENES) || 'destacados',
  };
  let cursor = null;
  const buscar = document.getElementById('catBuscar');
  const ordenSel = document.getElementById('catOrden');
  const verMas = document.querySelector('[data-ver-mas]');
  const vacio = document.querySelector('[data-cat-vacio]');
  const cuenta = document.querySelector('[data-cat-cuenta]');
  const filtrosN = document.querySelector('[data-filtros-n]');
  const activosBox = document.querySelector('[data-activos]');

  document.querySelectorAll('[data-cat-opciones]').forEach(cont => {
    cont.innerHTML = [{ id: '', nombre: 'Todas las categorías' }, ...CATEGORIAS].map(c => `<label class="opt"><input type="radio" name="f-cat" value="${c.id}" data-filtro="cat"><span>${esc(c.nombre)}</span><span class="opt__n" data-cuenta-filtro-cat="${c.id}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-amb-opciones]').forEach(cont => {
    const opciones = [['', cont.dataset.ambOpciones === 'chips' ? 'Toda la casa' : 'Todos los ambientes'], ...Object.entries(AMBIENTES).map(([k, a]) => [k, a.nombre])];
    cont.innerHTML = cont.dataset.ambOpciones === 'chips'
      ? opciones.map(([k, n]) => `<button type="button" class="chip" data-filtro="amb" data-valor="${k}" aria-pressed="false">${esc(n)}<small data-cuenta-amb="${k}"></small></button>`).join('')
      : opciones.map(([k, n]) => `<label class="opt"><input type="radio" name="f-amb" value="${k}" data-filtro="amb"><span>${esc(n)}</span><span class="opt__n" data-cuenta-amb="${k}"></span></label>`).join('');
  });
  document.querySelectorAll('[data-medida-opciones]').forEach(cont => {
    cont.innerHTML = MEDIDAS_CAMA.map(([m, d]) => `<label class="medida-op" title="Colchón de ${esc(d)}"><input type="checkbox" value="${esc(m)}" data-f="medida"><span>${esc(m)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-color-opciones]').forEach(cont => {
    const usados = Object.keys(COLORES).filter(c => Tienda.contar({ colores: [c] }) > 0);
    cont.innerHTML = usados.map(c => `<label class="color-op"><input type="checkbox" value="${esc(c)}" data-f="color"><i style="--sw:${COLORES[c]}"></i><span>${esc(c)}</span></label>`).join('');
  });
  document.querySelectorAll('[data-precio-opciones]').forEach(cont => {
    cont.innerHTML = [['', 'Todos los precios'], ...Object.entries(RANGOS).map(([k, r]) => [k, r.nombre])].map(([k, n]) => `<label class="opt"><input type="radio" name="f-precio" value="${k}" data-filtro="precio"><span>${esc(n)}</span></label>`).join('');
  });
  if (ordenSel) ordenSel.innerHTML = Object.entries(ORDENES).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');

  const filtrosDe = (sin = '') => {
    const f = {};
    if (estado.cat && sin !== 'cat') f.cat = estado.cat;
    if (estado.amb && sin !== 'amb') f.amb = estado.amb;
    if (estado.ofertas && sin !== 'ofertas') f.ofertas = true;
    if (estado.precio && sin !== 'precio') { const r = RANGOS[estado.precio]; if (r.min != null) f.precioMin = r.min; if (r.max != null) f.precioMax = r.max; }
    if (estado.stock && sin !== 'stock') f.stock = true;
    if (estado.medidas.size && sin !== 'medida') f.medidas = [...estado.medidas];
    if (estado.colores.size && sin !== 'color') f.colores = [...estado.colores];
    return f;
  };
  const enChips = !!document.querySelector('[data-amb-opciones="chips"]');
  const pintarActivos = () => {
    if (!activosBox) return;
    const chips = [];
    if (estado.cat && enChips) chips.push(['cat', '', catIds[estado.cat].nombre]);
    estado.medidas.forEach(m => chips.push(['medida', m, m]));
    estado.colores.forEach(c => chips.push(['color', c, c]));
    if (estado.precio) chips.push(['precio', '', RANGOS[estado.precio].nombre]);
    if (estado.ofertas) chips.push(['ofertas', '', 'Con descuento']);
    if (estado.stock) chips.push(['stock', '', 'Solo con stock']);
    if (estado.q) chips.push(['q', '', `«${estado.q}»`]);
    activosBox.hidden = !chips.length;
    activosBox.innerHTML = chips.map(([f, v, t]) => `<button type="button" class="activo" data-quitar="${f}" data-valor="${esc(v)}" aria-label="Quitar filtro: ${esc(t)}">${esc(t)}${ICO.x}</button>`).join('') + (chips.length ? '<button type="button" class="activo activo--limpiar" data-limpiar>Limpiar filtros</button>' : '');
  };
  const sincronizarUI = () => {
    document.querySelectorAll('[data-filtro]').forEach(el => {
      const f = el.dataset.filtro;
      if (el.type === 'radio') el.checked = el.value === (estado[f] || '');
      else if (el.type === 'checkbox') el.checked = !!estado[f];
      else el.setAttribute('aria-pressed', String((el.dataset.valor || '') === (estado[f] || '')));
    });
    document.querySelectorAll('input[data-f="medida"]').forEach(el => { el.checked = estado.medidas.has(el.value); });
    document.querySelectorAll('input[data-f="color"]').forEach(el => { el.checked = estado.colores.has(el.value); });
    pintarActivos();
    if (ordenSel) ordenSel.value = estado.orden;
    if (buscar && document.activeElement !== buscar) buscar.value = estado.q;
    document.querySelectorAll('[data-cuenta-filtro-cat]').forEach(el => {
      const id = el.dataset.cuentaFiltroCat;
      el.textContent = Tienda.contar({ ...filtrosDe('cat'), ...(id ? { cat: id } : {}) });
    });
    document.querySelectorAll('[data-cuenta-amb]').forEach(el => {
      const id = el.dataset.cuentaAmb;
      el.textContent = Tienda.contar({ ...filtrosDe('amb'), ...(id ? { amb: id } : {}) });
    });
    const enPanel = estado.medidas.size + estado.colores.size + (estado.precio ? 1 : 0) + (estado.ofertas ? 1 : 0) + (estado.stock ? 1 : 0) + (estado.cat ? 1 : 0) + (!enChips && estado.amb ? 1 : 0);
    if (filtrosN) { filtrosN.textContent = enPanel; filtrosN.hidden = !enPanel; }
    const cat = catIds[estado.cat];
    const amb = AMBIENTES[estado.amb];
    let titulo = cat ? cat.nombre : amb ? amb.titulo : estado.ofertas ? 'Con descuento' : estado.orden === 'nuevos' ? 'Recién ingresados' : 'Todo el catálogo';
    if (!cat && !amb && estado.medidas.size === 1) titulo = `Todo en ${[...estado.medidas][0]}`;
    const tituloEl = document.querySelector('[data-cat-titulo]');
    if (tituloEl) tituloEl.textContent = titulo;
    const bajada = document.querySelector('[data-cat-bajada]');
    if (bajada) bajada.textContent = cat ? `${cat.bajada} Precios por menor; por mayor, pedinos la lista.` : amb ? `${amb.sub}. Precios por menor; por mayor, pedinos la lista.` : 'Juegos de sábanas de todas las medidas, cubrecamas, cortinas, alfombras, toallas, peluches, repasadores y cubresillones. Precios por menor; por mayor, pedinos la lista.';
    const miga = document.querySelector('[data-miga-actual]');
    if (miga) { miga.hidden = titulo === 'Todo el catálogo'; miga.textContent = titulo; }
    document.title = `${titulo} — Alta Pinta`;
    document.querySelectorAll('.nav-drop__cat').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      if (u.searchParams.get('cat') === estado.cat) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    initMenuMarcas();
  };
  const initMenuMarcas = () => {
    document.querySelectorAll('.main-nav .nav-link[href*="catalogo"]').forEach(a => {
      const u = new URL(a.getAttribute('href'), location.href);
      const es = (estado.cat && u.searchParams.get('cat') === estado.cat) || (estado.amb && !estado.cat && u.searchParams.get('amb') === estado.amb);
      if (es) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const escribirURL = () => {
    const u = new URL(location.href);
    ['cat', 'amb', 'medida', 'color', 'precio', 'q', 'orden', 'stock', 'ofertas'].forEach(k => u.searchParams.delete(k));
    if (estado.cat) u.searchParams.set('cat', estado.cat);
    if (estado.amb) u.searchParams.set('amb', estado.amb);
    if (estado.medidas.size) u.searchParams.set('medida', [...estado.medidas].join(','));
    if (estado.colores.size) u.searchParams.set('color', [...estado.colores].join(','));
    if (estado.precio) u.searchParams.set('precio', estado.precio);
    if (estado.ofertas) u.searchParams.set('ofertas', '1');
    if (estado.stock) u.searchParams.set('stock', '1');
    if (estado.q) u.searchParams.set('q', estado.q);
    if (estado.orden !== 'destacados') u.searchParams.set('orden', estado.orden);
    window.history.replaceState(null, '', u);
  };
  const pintar = (agregar = false) => {
    const res = buscarPaginado(Tienda, { q: estado.q, filtros: filtrosDe(), orden: estado.orden, cursor: agregar ? cursor : null, limite: POR_PAGINA });
    res.items.forEach(cachear);
    cursor = res.cursor;
    const html = res.items.map(p => cardHTML(p)).join('');
    if (agregar) grid.insertAdjacentHTML('beforeend', html); else grid.innerHTML = html;
    const mostrados = grid.children.length;
    if (verMas) verMas.hidden = !cursor;
    if (vacio) vacio.hidden = mostrados > 0;
    grid.hidden = mostrados === 0;
    if (cuenta) {
      if (estado.q) cuenta.innerHTML = mostrados ? `<strong>${mostrados}</strong> ${mostrados === 1 ? 'resultado' : 'resultados'} para «${esc(estado.q)}»${cursor ? ' (hay más)' : ''}` : '';
      else { const total = Tienda.contar(filtrosDe()); cuenta.innerHTML = total ? `Mostrando <strong>${mostrados}</strong> de ${total} ${total === 1 ? 'producto' : 'productos'}` : ''; }
    }
    if (agregar && !res.items.length) showToast('No hay más resultados para esa búsqueda.');
    revelarNuevos(grid);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  };
  const aplicar = () => { cursor = null; sincronizarUI(); escribirURL(); pintar(); };
  const limpiar = () => {
    estado.cat = ''; estado.amb = ''; estado.precio = ''; estado.ofertas = false; estado.stock = false; estado.q = '';
    estado.medidas.clear(); estado.colores.clear();
    if (buscar) buscar.value = '';
    aplicar();
  };

  document.addEventListener('change', e => {
    const multi = e.target.closest('input[data-f]');
    if (multi) {
      const set = multi.dataset.f === 'medida' ? estado.medidas : estado.colores;
      if (multi.checked) set.add(multi.value); else set.delete(multi.value);
      aplicar();
      return;
    }
    const el = e.target.closest('input[data-filtro]');
    if (!el) return;
    const f = el.dataset.filtro;
    if (el.type === 'checkbox') estado[f] = el.checked;
    else estado[f] = el.value;
    aplicar();
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('button[data-filtro]');
    if (b) {
      estado[b.dataset.filtro] = b.dataset.valor || '';
      aplicar();
      return;
    }
    const quitar = e.target.closest('[data-quitar]');
    if (quitar) {
      const f = quitar.dataset.quitar;
      if (f === 'medida') estado.medidas.delete(quitar.dataset.valor);
      else if (f === 'color') estado.colores.delete(quitar.dataset.valor);
      else if (f === 'q') { estado.q = ''; if (buscar) buscar.value = ''; }
      else estado[f] = typeof estado[f] === 'boolean' ? false : '';
      aplicar();
      return;
    }
    if (e.target.closest('[data-limpiar]')) limpiar();
  });
  ordenSel?.addEventListener('change', () => { estado.orden = valido(ordenSel.value, ORDENES) || 'destacados'; aplicar(); });
  let tBuscar = 0;
  buscar?.addEventListener('input', () => { clearTimeout(tBuscar); tBuscar = setTimeout(() => { estado.q = buscar.value.trim().slice(0, 60); aplicar(); }, 260); });
  document.querySelector('[data-cat-buscar-form]')?.addEventListener('submit', e => { e.preventDefault(); clearTimeout(tBuscar); estado.q = (buscar?.value || '').trim().slice(0, 60); aplicar(); buscar?.blur(); });
  verMas?.addEventListener('click', () => pintar(true));

  const filtros = document.getElementById('filtros');
  const abrirF = document.querySelector('[data-filtros-abrir]');
  if (filtros && getComputedStyle(filtros).position === 'fixed') filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in'));
  filtros?.addEventListener('scroll', () => filtros.querySelectorAll('[data-animate]:not(.in)').forEach(el => el.classList.add('in')), { passive: true });
  if (filtros && 'IntersectionObserver' in window) {
    const ioF = new IntersectionObserver(es => { if (es.some(x => x.isIntersecting)) { revelarNuevos(filtros); ioF.disconnect(); } });
    ioF.observe(filtros);
  }
  if (filtros && abrirF) {
    const bd = document.createElement('div');
    bd.className = 'filtros-bd';
    document.body.appendChild(bd);
    const cerrarF = () => { filtros.classList.remove('open'); bd.classList.remove('open'); document.body.classList.remove('no-scroll'); abrirF.setAttribute('aria-expanded', 'false'); abrirF.focus({ preventScroll: true }); };
    abrirF.addEventListener('click', () => { filtros.querySelectorAll('[data-animate]').forEach(el => el.classList.add('in')); filtros.classList.add('open'); bd.classList.add('open'); document.body.classList.add('no-scroll'); abrirF.setAttribute('aria-expanded', 'true'); filtros.querySelector('button, input')?.focus({ preventScroll: true }); });
    bd.addEventListener('click', cerrarF);
    filtros.querySelectorAll('[data-filtros-cerrar]').forEach(b => b.addEventListener('click', cerrarF));
    filtros.addEventListener('keydown', e => { if (e.key === 'Escape' && filtros.classList.contains('open')) cerrarF(); else if (filtros.classList.contains('open')) atraparFoco(filtros, e); });
  }

  sincronizarUI();
  escribirURL();
  pintar();
  if (PARAMS.has('q') && !estado.q && buscar) buscar.focus({ preventScroll: true });
  return { cat: estado.cat, amb: estado.amb };
}

function initHeroMotion() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const paso = (sel, vars, t) => { const els = hero.querySelectorAll(sel); if (els.length) tl.from(els, vars, t); };
  paso('[data-hero-img]', { scale: 1.09, duration: 1.8, stagger: 0.12 }, 0);
  paso('.hero-eyebrow', { y: 18, opacity: 0, duration: 0.9 }, 0.1);
  paso('h1', { y: 36, opacity: 0, filter: 'blur(10px)', duration: 1.2, clearProps: 'filter' }, 0.2);
  paso('.hero-raya', { scaleX: 0, transformOrigin: '0 50%', duration: 1, clearProps: 'transform' }, 0.5);
  paso('.hero-lead', { y: 24, opacity: 0, duration: 1 }, 0.45);
  paso('.hero-ctas .btn', { y: 20, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform,opacity' }, 0.6);
  paso('.col', { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, clearProps: 'transform,opacity' }, 0.15);
  paso('.sticker', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.7);
  paso('.sello', { scale: 0.92, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.8);
}

function initParallax() {
  if (reduceMotion || typeof ScrollTrigger === 'undefined') return;
  document.querySelectorAll('[data-parallax] > img').forEach(img => {
    ScrollTrigger.create({
      trigger: img.parentElement, start: 'top bottom', end: 'bottom top',
      onUpdate: s => { img.style.translate = `0 ${(-3 + 6 * s.progress).toFixed(2)}%`; },
    });
  });
}

[
  initModelBarScroll,
  initNav,
  initBuscadorHeader,
  initRail,
  initPreview,
  initVitrina,
  initMosaico,
  initCuentas,
  initHorario,
  () => { const sel = PAGINA === 'catalogo' ? initCatalogo() : {}; initMenuTienda(sel); },
  initTarjetas,
  initQV,
  initCarrito,
  initFloats,
  initHeroMotion,
  initReveals,
  initParallax,
  initRadio,
].forEach(fn => { try { fn(); } catch (e) { console.error(e); } });
updateCartBadge();
document.addEventListener('cart:updated', updateCartBadge);
