const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function makeLocalStorageMock() {
  const store = new Map();
  return {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: key => store.delete(key),
    clear: () => store.clear(),
  };
}

function loadLogic() {
  const scriptPath = path.join(__dirname, '..', 'script.js');
  const source = fs.readFileSync(scriptPath, 'utf-8');
  const cutMarker = 'document.addEventListener("contextmenu"';
  const cutIndex = source.indexOf(cutMarker);
  if (cutIndex === -1) throw new Error('No se encontro el marcador de corte en script.js');
  const logicSource = source.slice(0, cutIndex);

  const exportLine = `
var __TESTHOOKS = {
  Cart, PRODUCTOS, CATEGORIAS, filtros, PAGE_SIZE,
  getFiltered, normalize, precioFinal, formatearPrecio,
  esc, catNombre, getProducto, cardHTML, getBadges, priceHTML,
};
`;

  const localStorage = makeLocalStorageMock();
  const sandbox = {
    console,
    window: {
      matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
      addEventListener() {},
      removeEventListener() {},
    },
    document: {
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {},
      querySelectorAll: () => [],
      getElementById: () => null,
      querySelector: () => null,
    },
    localStorage,
    CustomEvent: class CustomEvent {
      constructor(type) {
        this.type = type;
      }
    },
  };
  vm.createContext(sandbox);
  const script = new vm.Script(logicSource + exportLine, { filename: 'script-logic-slice.js' });
  script.runInContext(sandbox);

  return { hooks: sandbox.__TESTHOOKS, localStorage };
}

module.exports = { loadLogic, makeLocalStorageMock };
