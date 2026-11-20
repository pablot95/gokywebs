import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
const base = 'C:/Users/pablo/OneDrive/Escritorio/Gokywebs';
const out = [];
for (const grupo of ['Mantenimiento', 'EnProceso']) {
  for (const d of fs.readdirSync(path.join(base, grupo), { withFileTypes: true })) {
    if (!fs.statSync(path.join(base, grupo, d.name)).isDirectory() || /^[._]|^(Templates|Fork|guias)$/.test(d.name)) continue;
    const dir = path.join(base, grupo, d.name);
    const hosts = {};
    const add = (h, w) => { if (!h) return; h = h.toLowerCase().replace(/^www\./, ''); if (/gokywebs|google|gstatic|facebook|instagram|whatsapp|wa\.me|schema\.org|w3\.org|unpkg|jsdelivr|cloudflare|openstreetmap|tile|fonts|mercadopago|github|firebase|vercel\.app$|example|cdn|youtube|maps|tiktok|linkedin|twitter|x\.com|wix|unsplash|pexels|leaflet|googleapis|emailjs|andreani|correo/.test(h)) return; hosts[h] = (hosts[h] || 0) + w; };
    const leer = (f) => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch { return ''; } };
    for (const f of ['index.html', 'index.php']) {
      const t = leer(f);
      for (const m of t.matchAll(/<link[^>]+rel=["']canonical["'][^>]+href=["']https?:\/\/([^/"']+)/gi)) add(m[1], 5);
      for (const m of t.matchAll(/property=["']og:url["'][^>]+content=["']https?:\/\/([^/"']+)/gi)) add(m[1], 4);
    }
    const ht = leer('.htaccess');
    for (const m of ht.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) add(m[1], 3);
    for (const f of ['sitemap.xml', 'robots.txt', 'CNAME', 'README.md']) for (const m of leer(f).matchAll(/https?:\/\/([a-z0-9.-]+\.(?:com\.ar|com|ar|org|org\.ar|net|store|shop))/gi)) add(m[1], f === 'CNAME' ? 9 : 2);
    let remote = '';
    try { remote = execSync('git remote get-url origin', { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch {}
    const best = Object.entries(hosts).sort((a, b) => b[1] - a[1]).map(x => x[0]);
    out.push({ grupo, carpeta: d.name, dominio: best[0] || '', otros: best.slice(1, 3).join(' '), remote: remote.replace('https://github.com/', '') });
  }
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
for (const o of out) console.log([o.grupo[0], o.carpeta, o.dominio, o.otros, o.remote].join('\t'));
