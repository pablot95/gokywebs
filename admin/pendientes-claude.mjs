#!/usr/bin/env node
/* Pendientes de las webs en desarrollo, para que Claude los marque cuando los hace
   (Pablo, 11-oct-2026). Lee y escribe `clientes.pendientes` (ver pendientes-catalogo.js)
   con la cuenta de servicio de la raíz del repo (service-account.json, gitignored).

   node admin/pendientes-claude.mjs listar [texto]                    # webs en desarrollo y sus pendientes
   node admin/pendientes-claude.mjs marcar <cliente> <pendiente>       # lo deja hecho, por 'claude'
   node admin/pendientes-claude.mjs desmarcar <cliente> <pendiente>
   node admin/pendientes-claude.mjs agregar <cliente> "texto"          # un pendiente propio de esa web

   <cliente>: el id del doc o parte del nombre/proyecto (tiene que ser uno solo).
   <pendiente>: el id (dominio, email, google, accesos, firebase, tienda, contenido…) o parte del texto.
   Si la web todavía no tiene `pendientes`, el panel los siembra al abrirse: abrí el admin una vez. */
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const cuenta = JSON.parse(readFileSync(join(RAIZ, "service-account.json"), "utf8"));
const BASE = `https://firestore.googleapis.com/v1/projects/${cuenta.project_id}/databases/(default)/documents`;

const b64 = (o) => Buffer.from(typeof o === "string" ? o : JSON.stringify(o)).toString("base64url");
async function token() {
    const ahora = Math.floor(Date.now() / 1000);
    const cuerpo = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
        iss: cuenta.client_email, scope: "https://www.googleapis.com/auth/datastore",
        aud: "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3000,
    })}`;
    const firma = createSign("RSA-SHA256").update(cuerpo).sign(cuenta.private_key, "base64url");
    const r = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${cuerpo}.${firma}` }),
    });
    const j = await r.json();
    if (!j.access_token) throw new Error("No se pudo obtener el token: " + JSON.stringify(j));
    return j.access_token;
}

// Firestore REST ↔ JS (solo los tipos que usan los pendientes).
const leer = (v) => {
    if (!v) return undefined;
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return v.doubleValue;
    if ("timestampValue" in v) return v.timestampValue;
    if ("nullValue" in v) return null;
    if ("arrayValue" in v) return (v.arrayValue.values || []).map(leer);
    if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, leer(x)]));
    return undefined;
};
const escribir = (x) => {
    if (typeof x === "boolean") return { booleanValue: x };
    if (typeof x === "number") return { integerValue: String(x) };
    if (Array.isArray(x)) return { arrayValue: { values: x.map(escribir) } };
    if (x && typeof x === "object") return { mapValue: { fields: Object.fromEntries(Object.entries(x).map(([k, v]) => [k, escribir(v)])) } };
    return { stringValue: String(x ?? "") };
};

async function websEnDesarrollo(tk) {
    const r = await fetch(`${BASE}:runQuery`, {
        method: "POST", headers: { authorization: `Bearer ${tk}`, "content-type": "application/json" },
        body: JSON.stringify({ structuredQuery: { from: [{ collectionId: "clientes" }], where: { fieldFilter: { field: { fieldPath: "estadoCliente" }, op: "EQUAL", value: { stringValue: "cliente" } } } } }),
    });
    const filas = await r.json();
    if (!Array.isArray(filas)) throw new Error("Firestore: " + JSON.stringify(filas));
    return filas.filter(f => f.document).map(f => {
        const campos = Object.fromEntries(Object.entries(f.document.fields || {}).map(([k, v]) => [k, leer(v)]));
        return { id: f.document.name.split("/").pop(), ...campos };
    }).filter(c => !c.entregadoAt && !c.completadoId);
}

const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

function buscarCliente(webs, q) {
    const porId = webs.find(c => c.id === q);
    if (porId) return porId;
    const n = norm(q);
    const hallados = webs.filter(c => norm(`${c.nombre} ${c.proyecto}`).includes(n));
    if (hallados.length === 1) return hallados[0];
    throw new Error(hallados.length ? `"${q}" coincide con varias webs: ${hallados.map(c => `${c.proyecto || c.nombre} (${c.id})`).join(", ")}` : `No hay una web en desarrollo que coincida con "${q}".`);
}

function buscarPendiente(c, q) {
    const lista = c.pendientes;
    if (!Array.isArray(lista)) throw new Error(`"${c.proyecto || c.nombre}" todavía no tiene pendientes: abrí el admin una vez y se siembran.`);
    const exacto = lista.find(p => p.id === q);
    if (exacto) return exacto;
    const n = norm(q);
    const hallados = lista.filter(p => norm(p.texto).includes(n));
    if (hallados.length === 1) return hallados[0];
    throw new Error(hallados.length ? `"${q}" coincide con varios: ${hallados.map(p => p.id).join(", ")}` : `No hay un pendiente "${q}". Los de esa web: ${lista.map(p => p.id).join(", ")}`);
}

async function guardar(tk, c, lista) {
    const url = `${BASE}/clientes/${c.id}?updateMask.fieldPaths=pendientes`;
    const r = await fetch(url, {
        method: "PATCH", headers: { authorization: `Bearer ${tk}`, "content-type": "application/json" },
        body: JSON.stringify({ fields: { pendientes: escribir(lista) } }),
    });
    if (!r.ok) throw new Error(`No se pudo guardar (${r.status}): ${await r.text()}`);
}

const [, , cmd, a, b] = process.argv;
try {
    const tk = await token();
    const webs = await websEnDesarrollo(tk);
    if (cmd === "listar") {
        const n = a ? norm(a) : "";
        for (const c of webs.filter(c => !n || norm(`${c.nombre} ${c.proyecto}`).includes(n))) {
            console.log(`\n${c.proyecto || c.nombre}  [${c.id}]${c.webCompletadaAt ? "  · completada (Por cobrar)" : ""}`);
            if (!Array.isArray(c.pendientes)) { console.log("  (sin pendientes: abrí el admin para sembrarlos)"); continue; }
            for (const p of c.pendientes) console.log(`  ${p.hecho ? "[x]" : "[ ]"} ${p.id.padEnd(10)} ${p.texto}${p.hecho ? `  — ${p.por || "?"}` : ""}`);
        }
    } else if ((cmd === "marcar" || cmd === "desmarcar") && a && b) {
        const c = buscarCliente(webs, a);
        const p = buscarPendiente(c, b);
        const hecho = cmd === "marcar";
        await guardar(tk, c, c.pendientes.map(x => x.id !== p.id ? x : { ...x, hecho, por: hecho ? "claude" : "", at: hecho ? new Date().toISOString() : "" }));
        console.log(`${hecho ? "Marcado" : "Desmarcado"}: ${p.texto} — ${c.proyecto || c.nombre}`);
    } else if (cmd === "agregar" && a && b) {
        const c = buscarCliente(webs, a);
        if (!Array.isArray(c.pendientes)) throw new Error("Esa web todavía no tiene pendientes: abrí el admin una vez y se siembran.");
        await guardar(tk, c, [...c.pendientes, { id: "p" + Date.now().toString(36), texto: b, hecho: false, por: "", at: "" }]);
        console.log(`Agregado: ${b} — ${c.proyecto || c.nombre}`);
    } else {
        console.log("Uso: listar [texto] | marcar <cliente> <pendiente> | desmarcar <cliente> <pendiente> | agregar <cliente> \"texto\"");
        process.exitCode = 1;
    }
} catch (e) {
    console.error(e.message);
    process.exitCode = 1;
}
