const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../../demo/byfridacase');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'byfrida-api-'));
fs.copyFileSync(path.join(root,'api.php'),path.join(tmp,'api.php'));
fs.copyFileSync(path.join(root,'products.sqlite'),path.join(tmp,'products.sqlite'));
const prep=spawnSync('python',['-c',`import sqlite3,json,sys
db=sqlite3.connect(sys.argv[1]);db.execute('DELETE FROM products')
for i in range(237):
 p=dict(id=f't-{i:03}',slug=f'test-{i}',nombre=f'Funda {i:03}',categoria='fundas',marca='Samsung',precio=1000+i,descuento=0,stock=i%3,variantes=['A15'],descripcion='cámara flor' if i==230 else 'lisa',imagenes=[],tags=[],destacado=True,nuevo=True)
 db.execute('INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',(p['id'],p['slug'],'fundas','Samsung',p['precio'],0,p['precio'],p['stock'],1,1,p['nombre'].lower(),p['descripcion'].replace('á','a'),json.dumps(p)))
db.commit()`,path.join(tmp,'products.sqlite')],{encoding:'utf8'});
assert.equal(prep.status,0,prep.stderr);
function api(params={},synthetic=false){const p=path.join(synthetic?tmp:root,'api.php');const run=spawnSync('php',['-d','extension=php_pdo_sqlite.dll','-r','$_SERVER["REQUEST_METHOD"]="GET"; $_GET=json_decode($argv[1],true); include $argv[2];',JSON.stringify(params),p],{encoding:'utf8'});assert.equal(run.status,0,run.stderr);return JSON.parse(run.stdout);}
function cartEnv(){const storage=new Map();const context={console,URL,URLSearchParams,Set,Map,Uint32Array,CustomEvent:class{constructor(type){this.type=type;}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{matchMedia:()=>({matches:false})},document:{body:{dataset:{modelo:'1'}},dispatchEvent:()=>{}},location:{href:'http://localhost/'}};vm.createContext(context);const code=fs.readFileSync(path.join(root,'script.js'),'utf8');vm.runInContext(code.slice(0,code.indexOf('document.addEventListener("contextmenu"'))+'\nglobalThis.x={Cart,PRODUCTOS,precioFinal,formatearPrecio,cleanCart,normalize,cacheProducts};',context);return{...context.x,storage};}
test('server caps every public and admin request',()=>{for(const [scope,cap]of Object.entries({home:8,catalog:16,admin:100,lookup:100})){const d=api({scope,limit:'99999',...(scope==='lookup'?{ids:Array.from({length:237},(_,i)=>`t-${String(i).padStart(3,'0')}`).join(',')}:{})},true);assert.equal(d.limit,cap);assert.equal(d.items.length,cap);}});
test('admin cursor walks 100 + 100 + 37 without duplicates',()=>{let cursor='',all=[];for(let i=0;i<3;i++){const d=api({scope:'admin',limit:'100',cursor},true);assert.equal(d.items.length,[100,100,37][i]);all.push(...d.items.map(p=>p.id));cursor=d.nextCursor;}assert.equal(cursor,null);assert.equal(new Set(all).size,237);});
test('late search is resolved directly on server',()=>{const d=api({scope:'admin',q:'CÁMARA FLOR'},true);assert.equal(d.items.length,1);assert.equal(d.items[0].id,'t-230');assert.equal(d.nextCursor,null);});
test('cursor bound to query rejects changed search',()=>{const d=api({scope:'admin'},true);assert.ok(api({scope:'admin',q:'flor',cursor:d.nextCursor},true).error);});
test('malformed cursor and array parameters rejected',()=>{assert.ok(api({cursor:'%%%'}).error);assert.ok(api({q:['fundas']}).error);});
test('descending price pagination is stable',()=>{const a=api({scope:'admin',orden:'precio-desc'},true),b=api({scope:'admin',orden:'precio-desc',cursor:a.nextCursor},true);assert.equal(a.items[0].precio,1236);assert.equal(b.items[0].precio,1136);assert.equal(new Set([...a.items,...b.items].map(p=>p.id)).size,200);});
test('actual catalogue is 16 + 8',()=>{const a=api(),b=api({cursor:a.nextCursor});assert.equal(a.items.length,16);assert.equal(b.items.length,8);assert.equal(b.nextCursor,null);});
test('combined filters find compatible cases only',()=>{const d=api({cat:'fundas',marca:'Samsung',stock:'1',precio:'13000'});assert.equal(d.items.length,1);assert.equal(d.items[0].nombre,'Funda Soft Samsung');});
test('unknown category falls back and nonexistent slug returns empty',()=>{assert.equal(api({cat:'inventada'}).total,24);assert.equal(api({scope:'lookup',slug:'no-existe'}).items.length,0);});
test('search escapes wildcards instead of returning all products',()=>{assert.equal(api({q:'%'}).items.length,0);assert.equal(api({q:'_'}).items.length,0);});
test('corrupt storage and invalid quantities become an empty cart',()=>{const e=cartEnv();e.storage.set(e.Cart.KEY,'broken');assert.equal(e.Cart.count(),0);e.storage.set(e.Cart.KEY,JSON.stringify([{id:'x',variante:'A',qty:-2},{id:'x',variante:'A',qty:1.2}]));assert.equal(e.Cart.count(),0);});
test('variant stock is shared and totals use current prices',()=>{const e=cartEnv(),p={id:'x',stock:5,variantes:['A','B'],precio:1000,descuento:10};e.PRODUCTOS.push(p);assert.equal(e.Cart.add(p,3,'A'),true);assert.equal(e.Cart.add(p,4,'B'),true);assert.equal(e.Cart.count(),5);assert.equal(e.Cart.total(),4500);assert.equal(e.Cart.add(p,1,'A'),false);p.precio=2000;assert.equal(e.Cart.total(),9000);e.Cart.remove('x','A');assert.equal(e.Cart.count(),2);});
test('zero stock and unsupported variant cannot be added',()=>{const e=cartEnv();assert.equal(e.Cart.add({id:'x',stock:0,variantes:['A']},1,'A'),false);assert.equal(e.Cart.add({id:'x',stock:4,variantes:['A']},1,'B'),false);});
test('cache remains bounded to 100 across pages',()=>{const e=cartEnv();e.cacheProducts(Array.from({length:237},(_,i)=>({id:'x'+i})));assert.equal(e.PRODUCTOS.length,100);});
test('same identity cannot duplicate a cart line',()=>{const e=cartEnv();const raw=[{id:'x',variante:'A',qty:1},{id:'x',variante:'A',qty:2}];assert.equal(e.cleanCart(raw).length,1);});
test('price formatting and accents follow local conventions',()=>{const e=cartEnv();assert.equal(e.formatearPrecio(12500),'$12.500');assert.equal(e.normalize('CÁMARA'),'camara');});
