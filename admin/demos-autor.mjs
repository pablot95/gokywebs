/* Quién hizo cada demo (Pablo, 13-oct-2026): lee el historial de git y arma admin/demos-autor.json
   = { "<carpeta de demo/>": { por: "claude" | "chatgpt", fecha: "YYYY-MM-DD", commit: "abc1234" } }.
   Regla: el commit que CREÓ la carpeta demo/<slug>/ con "Co-Authored-By: Claude…" es de Claude;
   sin esa línea se toma como ChatGPT (Codex), que es como se commitea desde ahí. Es una inferencia:
   en el panel (Bocetos y prospectos) se corrige a mano por boceto.
   Desde el 4-oct-2026 (antes no se registraba). Volver a correrlo después de cada demo nueva:
     node admin/demos-autor.mjs
   Git: el del PATH o, si no está, GIT=<ruta a git.exe>. */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GIT = process.env.GIT || "git";
const DESDE = "2026-10-04";

const salida = execFileSync(GIT, ["log", "--reverse", `--since=${DESDE}`, "--diff-filter=A", "--name-only",
    "--format=@@%h|%ad|%(trailers:key=Co-Authored-By,valueonly,separator=;)", "--date=short", "--", "demo"],
    { cwd: raiz, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const demos = {};
let actual = null;
for (const linea of salida.split(/\r?\n/)) {
    if (linea.startsWith("@@")) {
        const [commit, fecha, trailers] = linea.slice(2).split("|");
        actual = { commit, fecha, por: /claude/i.test(trailers || "") ? "claude" : "chatgpt" };
        continue;
    }
    const m = /^demo\/([^/]+)\//.exec(linea.trim());
    if (m && actual && !demos[m[1]]) demos[m[1]] = { ...actual };   // el primero que la creó
}

const ordenado = Object.fromEntries(Object.entries(demos).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(path.join(raiz, "admin", "demos-autor.json"), JSON.stringify(ordenado, null, 1) + "\n");
const n = p => Object.values(ordenado).filter(d => d.por === p).length;
console.log(`demos desde ${DESDE}: ${Object.keys(ordenado).length} (Claude ${n("claude")}, ChatGPT ${n("chatgpt")})`);
