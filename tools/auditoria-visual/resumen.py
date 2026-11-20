import json, glob, sys
r = {}
for f in glob.glob('out/res-*.json'):
    r.update(json.load(open(f, encoding='utf8')))

def padre(ruta):
    return ruta.rsplit(' > ', 1)[0]

def reales(p):
    # interlineado apretado: dos líneas de un mismo título (mismo padre) que se tocan poco
    return [x for x in p if not (padre(x['el']) == padre(x['el2']) and x['pct'] < 50)]

for k in sorted(r):
    v = r[k]; lineas = []
    for a, x in v['anchos'].items():
        if 'error' in x and len(x) <= 2:
            lineas.append(f'  {a}: ERROR {x["error"][:120]}'); continue
        p = reales(x.get('pisados') or [])
        for z in p[:4]: lineas.append(f'  {a} PISA y={z["y"]} [{z["txt"]}] / [{z["txt2"]}] {z["pct"]}% {z["el"]} | {z["el2"]}')
        for z in [c for c in (x.get('cortados') or []) if 'textpath' not in c['el']][:4]: lineas.append(f'  {a} CORTA y={z["y"]} [{z["txt"]}] {z["como"]} {z["visible"]}% por {z["por"]} ({z["el"]})')
        for z in (x.get('fuera') or [])[:3]: lineas.append(f'  {a} FUERA y={z["y"]} [{z["txt"]}] der={z["der"]} izq={z["izq"]} ({z["el"]})')
        if x.get('desborde'): lineas.append(f'  {a} DESBORDE {x["desborde"]}px {x.get("desbordeEl")[:3]}')
        for z in (x.get('rotas') or [])[:3]: lineas.append(f'  {a} ROTA y={z["y"]} {z["src"]}')
        for z in (x.get('js') or [])[:2]: lineas.append(f'  {a} JS {z[:120]}')
        if x.get('final') and v['url'].split('/')[2].replace('www.', '') not in x['final']: lineas.append(f'  {a} REDIRIGE a {x["final"][:80]}')
    if lineas:
        print(k, v['url']); print('\n'.join(lineas))
print(len(r), 'webs')
