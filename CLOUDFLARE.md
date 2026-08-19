# gokywebs.com en Cloudflare

Hecho el 18-ago-2026. **El cambio de nameservers ya está aplicado.** No queda nada
por hacer: Cloudflare verifica solo y activa la zona (1-24 h).

## Estado

- Dominio registrado en **Hostinger** (no en NIC.ar), así que los nameservers se
  cambiaron directo desde hPanel → Dominios → gokywebs.com → DNS/Nameservers.
- Nameservers: `vicente.ns.cloudflare.com` + `zoe.ns.cloudflare.com`
  (reemplazaron a `ns1/ns2.dns-parking.com`). Ya propagados en el TLD.
- Zone ID `e0ccc9313ef3d946b299b33661d7bfcd`, plan Free.
- Mientras la zona está *pending*, Cloudflare sirve la IP del origen sin proxear:
  el sitio funciona igual, sin downtime. Cuando active, `curl -sI https://gokywebs.com/`
  va a devolver `server: cloudflare` y un `cf-ray`.

## Config aplicada

| Config | Valor | Por qué |
|---|---|---|
| SSL/TLS | **Full (strict)** | Cert Let's Encrypt del origen válido para apex y www hasta el 20-oct-2026 (verificado con `ssl_verify_result=0`). |
| Always Use HTTPS | On | |
| Rocket Loader | Off (default) | |
| Bot fight mode | **Off** | Prendido challengearía el webhook de Meta del wabot y los callbacks de MP/PayPal/Stripe. |
| Cache rule | Bypass si la ruta contiene `.php` o empieza con `/admin`, `/wabot`, `/pago`, `/paneladmin`, `/panelelearning` | Cubre todos los endpoints dinámicos sin enumerar carpeta por carpeta. |

**DNS:** `A @ → 195.200.3.71` proxeado y `CNAME www → gokywebs.com` proxeado.
Todo lo demás en ⚪ DNS only.

⚠️ **El import automático de Cloudflare vino con `ftp` proxeado** — se pasó a DNS only.
Cloudflare solo proxea HTTP/HTTPS: proxeado, el FTP dejaba de funcionar.
Lo mismo con `autoconfig`, `autodiscover` y los tres `hostingermail-*._domainkey`
(el DKIM proxeado manda el mail a spam).

Se borró el AAAA del apex: Cloudflare le sigue sirviendo IPv6 a los visitantes, pero
llega al origen solo por IPv4 — una vía de falla menos.

## El problema de fondo: server1525

`gokywebs.com` y `academiaalquimiadelser.com.ar` viven en la misma máquina.

**Plan Business:** 2 núcleos de CPU, 3072 MB RAM, 60 PHP workers, 120 procesos,
**35 sitios** — en `server1525`, South America (Brazil), IP 195.200.3.71.

**Medición del 18-ago (50 requests a un HTML estático):**
- Mediana de TTFB: **140 ms**. El `connect` TCP siempre estable en ~47 ms.
- **2 de 50 requests con TTFB de 1,07 s y 2,18 s** — 7× y 15× la mediana, sobre un
  archivo estático, sin carga concurrente de por medio.
- Una segunda tanda de 30 requests salió 30/30 limpia (máx 197 ms): el freno es
  **esporádico**, no constante.
- 12 requests en paralelo: todas ~0,14 s. O sea que no es saturación por tráfico propio.
- **Uso de la cuenta en 7 días: 2 % de CPU y 49 MB de 3072 MB.** No estás ni cerca
  de tus límites.

**Conclusión:** los frenos no los causa el uso de la cuenta. Vienen del servidor
compartido. Con esos números se le puede pedir a soporte de Hostinger una
**migración a otro servidor** — es un pedido que atienden y no cuesta nada.

**Lo que Cloudflare arregla y lo que no:**
- ✅ Estáticos (HTML, CSS, JS, imágenes) pasan a servirse del edge y dejan de tocar
  server1525. Para un sitio mayormente estático como gokywebs.com, eso saca a la
  mayoría de las visitas del problema.
- ❌ Todo lo que es PHP (paneles, formularios, webhooks, presupuestos) sigue pegándole
  al origen. Si el servidor se traba, se traba igual.
