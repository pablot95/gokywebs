import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, "..", "..", "script.js");

export function loadScript() {
  const raw = fs.readFileSync(scriptPath, "utf8");
  const source = raw.replace(/\b(const|let)\b/g, "var");

  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };

  const elements = {
    buscador: { value: "" },
  };
  const noopEl = () => ({
    value: "",
    textContent: "",
    hidden: false,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {},
    querySelector: () => noopEl(),
    querySelectorAll: () => [],
    appendChild() {},
    setAttribute() {},
  });

  const documentStub = {
    getElementById: (id) => elements[id] || null,
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener() {},
    createElement: () => noopEl(),
    head: { appendChild() {} },
    body: { appendChild() {}, classList: { add() {}, remove() {}, toggle() {} } },
  };

  const windowStub = {
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    addEventListener() {},
    scrollY: 0,
    innerWidth: 1024,
    getComputedStyle: () => ({ paddingInlineStart: "0px" }),
  };

  const sandbox = {
    window: windowStub,
    document: documentStub,
    localStorage,
    navigator: { userAgent: "node" },
    console,
    gsap: undefined,
    ScrollTrigger: undefined,
    getComputedStyle: windowStub.getComputedStyle,
  };
  sandbox.globalThis = sandbox;

  const context = vm.createContext(sandbox);
  vm.runInContext(source, context, { filename: "script.js" });

  return { context, localStorage, elements };
}
