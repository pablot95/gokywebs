const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../../demo/anitaraices');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'anita-api-tests-'));
fs.copyFileSync(path.join(root,'api.php'),path.join(temporary,'api.php'));
const originals=fs.readFileSync(path.join(root,'products.ndjson'),'utf8').trim().split('\n').map(JSON.parse);
const items=Array.from({length:237},(_,i)=>({...originals[i%originals.length],id:'test-'+String(i).padStart(3,'0'),slug:'test-'+i,nombre:'Artículo '+String(i).padStart(3,'0'),precio:1000+(i%17)*100,descripcion:i===236?'Tesoro único tardío':'Ejemplo',stock:i%9===0?0:12}));
fs.writeFileSync(path.join(temporary,'products.ndjson'),items.map(x=>JSON.stringify(x)).join('\n'));
const runner='$_GET=json_decode($argv[1],true);$_SERVER["REQUEST_METHOD"]=$argv[2];require $argv[3];';
function api(params={},method='GET'){
 const r=spawnSync('php',['-r',runner,JSON.stringify(params),method,path.join(temporary,'api.php')],{encoding:'utf8',windowsHide:true});
 assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);
}
function context(){
 const storage=new Map();
 const c=vm.createContext({console,URLSearchParams,URL,Map,Set,AbortController,setTimeout,clearTimeout,CustomEvent:class{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:false})},document:{body:{dataset:{modelo:'1',pagina:'home'}},addEventListener:()=>{},dispatchEvent:()=>{}}});
 const source=fs.readFileSync(path.join(root,'script.js'),'utf8');
 const pos=source.indexOf('\nif (\n  typeof gsap');
 const fallback=source.indexOf('\nif (typeof gsap !==');
 assert.ok(pos>0||fallback>0);
 vm.runInContext(source.slice(0,pos>0?pos:fallback)+'\nglobalThis.logic={Cart,remember,precioFinal,normalize,cacheSize:()=>PRODUCTOS.length};',c);
 return {logic:c.logic,storage};
}
after(()=>fs.rmSync(temporary,{recursive:true,force:true}));
test('servidor limita home a 6, catálogo a 16 y panel a 100 aunque se pidan 99999',()=>{
 for(const [scope,max] of [['home',6],['catalog',16],['admin',100],['lookup',100]]){
  const d=api({scope,limit:'99999',...(scope==='lookup'?{ids:items.map(p=>p.id).join(',')}:{})});
  assert.ok(d.items.length<=max);assert.equal(d.limit,max);
 }
});
test('cursor admin entrega 100 + 100 + 37 sin duplicados ni precarga',()=>{
 let cursor,seen=[];const lengths=[];
 do {const d=api({scope:'admin',cursor});lengths.push(d.items.length);seen.push(...d.items.map(p=>p.id));cursor=d.nextCursor;}while(cursor);
 assert.deepEqual(lengths,[100,100,37]);assert.equal(new Set(seen).size,237);
});
test('cursor ordenado por precio funciona con empates y ambos sentidos',()=>{
 for(const orden of ['precio-asc','precio-desc']){
  let cursor,seen=[];
  do {const d=api({scope:'admin',limit:'100',orden,cursor});seen.push(...d.items);cursor=d.nextCursor;}while(cursor);
  assert.equal(new Set(seen.map(p=>p.id)).size,237);
  for(let i=1;i<seen.length;i++)assert.ok(orden==='precio-asc'?seen[i].precio>=seen[i-1].precio:seen[i].precio<=seen[i-1].precio);
 }
});
test('búsqueda encuentra el registro 237 sin descargar las páginas anteriores',()=>{
 const d=api({scope:'admin',q:'TESORO UNICO TARDIO'});assert.equal(d.total,1);assert.equal(d.items[0].id,'test-236');assert.equal(d.nextCursor,null);
});
test('cursor no sirve con otro filtro y un cursor corrupto produce error',()=>{
 const d=api({scope:'admin'});assert.ok(api({scope:'admin',cat:'familia',cursor:d.nextCursor}).error);assert.ok(api({scope:'admin',cursor:'corrupto'}).error);
});
test('validación de parámetros, scope y método',()=>{
 assert.ok(api({scope:'inexistente'}).error);assert.ok(api({q:['a']}).error);assert.ok(api({},'POST').error);assert.equal(api({scope:'admin',limit:'-4'}).items.length,1);
});
test('combinación de sector, talle, color, precio y disponibilidad',()=>{
 const d=api({cat:'familia',talle:'S',color:'rosa',stock:'1',precio:'2400'});
 assert.ok(d.items.length>0);assert.ok(d.items.every(p=>p.categoria==='familia'&&p.variantes.includes('S')&&p.color==='rosa'&&p.stock>0&&p.precio<=2400));
});
test('cat/sub inválidas vuelven al catálogo general o al sector elegido',()=>{
 assert.equal(api({scope:'admin',cat:'desconocida'}).total,237);
 assert.equal(api({scope:'admin',cat:'hogar',sub:'velas'}).total,api({scope:'admin',cat:'hogar'}).total);
});
test('búsqueda vacía, sin coincidencias y lookup inválido',()=>{
 assert.equal(api({scope:'admin',q:''}).total,237);assert.equal(api({q:'inexistentezz'}).total,0);assert.deepEqual(api({scope:'lookup'}).items,[]);assert.deepEqual(api({scope:'lookup',slug:'inexistente'}).items,[]);
});
test('dataset vacío y uno solo no dejan cursor',()=>{
 const file=path.join(temporary,'products.ndjson'),saved=fs.readFileSync(file);
 try {fs.writeFileSync(file,'');assert.equal(api({}).total,0);fs.writeFileSync(file,JSON.stringify(items[0]));assert.equal(api({}).items.length,1);assert.equal(api({}).nextCursor,null);}finally{fs.writeFileSync(file,saved);}
});
test('normalización y descuentos',()=>{
 const {logic}=context();assert.equal(logic.normalize('  JABÓN ÁRBOL '),'jabon arbol');assert.equal(logic.precioFinal({precio:10000,descuento:15}),8500);
});
test('carrito corrupto y datos inválidos se descartan',()=>{
 const {logic,storage}=context();storage.set(logic.Cart.KEY,'{corrupto');assert.equal(logic.Cart.count(),0);
 storage.set(logic.Cart.KEY,JSON.stringify([{id:'a',talle:'M',qty:-1},{id:'a',talle:'invalid',qty:1},{id:'a',talle:'M',qty:3},{id:'a',talle:'M',qty:2}]));assert.equal(logic.Cart.count(),5);assert.equal(logic.Cart.get().length,1);
});
test('variantes se mantienen separadas y comparten el límite de stock',()=>{
 const {logic}=context();const p={...originals[0],stock:5};logic.remember([p]);assert.equal(logic.Cart.add(p,3,'S'),true);assert.equal(logic.Cart.add(p,4,'M'),true);assert.equal(logic.Cart.count(),5);assert.equal(logic.Cart.get().length,2);assert.equal(logic.Cart.add(p,1,'L'),false);
 logic.Cart.remove(p.id,'S');assert.equal(logic.Cart.count(),2);logic.Cart.setQty(p.id,100,'M');assert.equal(logic.Cart.count(),5);
});
test('precios actuales, agotados e ids retirados',()=>{
 const {logic}=context();const p={...originals[0],precio:10000,stock:4};logic.remember([p]);logic.Cart.add(p,2,'S');assert.equal(logic.Cart.total(),20000);logic.remember([{...p,precio:12000}]);assert.equal(logic.Cart.total(),24000);
 logic.Cart.syncStock([{...p,stock:1}]);assert.equal(logic.Cart.count(),1);logic.Cart.syncStock([]);assert.equal(logic.Cart.count(),0);assert.equal(logic.Cart.add({...p,stock:0},1,'S'),false);
});
test('cache cliente se mantiene acotada a cien productos',()=>{
 const {logic}=context();logic.remember(items);assert.equal(logic.cacheSize(),100);logic.remember([items[236]]);assert.equal(logic.cacheSize(),100);
});
test('fixtures tienen categorías válidas, slugs únicos y referencias de fotos existentes',()=>{
 assert.equal(new Set(originals.map(p=>p.id)).size,20);
 for(const p of originals){assert.ok(['hogar','familia','bienestar'].includes(p.categoria));for(const image of p.imagenes)assert.ok(fs.existsSync(path.join(root,image)));}
});
