import json
import sys
from pathlib import Path

OUT = Path(sys.argv[1])

ALT = {
    "calzado.webp": "Zapatillas sobre pedestales blancos en el showroom",
    "indumentaria.webp": "Prendas dobladas y colgadas en el showroom",
    "iphone.webp": "iPhone con sus cajas sobre una mesa blanca",
    "coleccion.webp": "Zapatillas blancas y buzos doblados sobre mármol",
    "vertical-mesa.webp": "Mesa de mármol con zapatillas y buzos colgados",
}


def talles(desde, hasta):
    return [str(t) for t in range(desde, hasta + 1)]


def vertical(x, y):
    return round((y - 22) / 56 * 100)


def prod(**k):
    base = {
        "descuento": 0,
        "visible": True,
        "destacado": False,
        "nuevo": False,
        "color": "",
        "material": "",
        "condicion": "",
    }
    base.update(k)
    base["alt"] = ALT[base["imagen"]]
    return base


CALZADO = [
    prod(id="urbana-court-blanca-fucsia", nombre="Urbana Court blanca y fucsia", subcategoria="Urbanas", precio=48900, stock=36,
         color="Blanco / Fucsia", material="Cuero sintético", imagen="calzado.webp", foco={"x": 50, "y": 48, "z": 2.6}, nuevo=True, destacado=True,
         variantes={"tipo": "talle", "opciones": talles(35, 41)},
         descripcion="Corte tipo court con suela cupsole y detalle fucsia en el talón. La base más pedida para reponer en colores claros.",
         etiquetas="zapatilla urbana mujer blanca fucsia court"),
    prod(id="running-knit-negra", nombre="Running Knit negra", subcategoria="Running", precio=52900, stock=28,
         color="Negro", material="Tejido knit", imagen="calzado.webp", foco={"x": 50, "y": 22, "z": 2.6}, destacado=True,
         variantes={"tipo": "talle", "opciones": talles(38, 44)},
         descripcion="Capellada tejida sin costuras y suela liviana de doble densidad. Entra en pie ancho sin cambiar de talle.",
         etiquetas="zapatilla running hombre negra tejida knit"),
    prod(id="chunky-dad-beige", nombre="Chunky Dad beige", subcategoria="Chunky", precio=61900, stock=18,
         color="Beige", material="Gamuza y malla", imagen="calzado.webp", foco={"x": 82, "y": 26, "z": 2.6}, nuevo=True,
         variantes={"tipo": "talle", "opciones": talles(36, 43)},
         descripcion="Suela gruesa en tono crudo con paneles de gamuza y malla. El modelo que más rota en vidriera de temporada.",
         etiquetas="zapatilla chunky dad beige plataforma"),
    prod(id="urbana-court-blanca-clasica", nombre="Urbana Court blanca clásica", subcategoria="Urbanas", precio=44900, stock=60,
         color="Blanco", material="Cuero sintético", imagen="calzado.webp", foco={"x": 22, "y": 24, "z": 2.6}, destacado=True,
         variantes={"tipo": "talle", "opciones": talles(35, 44)},
         descripcion="Blanca total, lisa, con talonera reforzada. Curva completa de talles para armar el surtido base del local.",
         etiquetas="zapatilla urbana blanca lisa unisex"),
    prod(id="running-knit-rosa", nombre="Running Knit rosa", subcategoria="Running", precio=52900, stock=14, descuento=10,
         color="Rosa", material="Tejido knit", imagen="calzado.webp", foco={"x": 17, "y": 46, "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(35, 39)},
         descripcion="La misma horma de la Knit negra en rosa empolvado, con cordones al tono. Sale en talles chicos.",
         etiquetas="zapatilla running mujer rosa tejida"),
    prod(id="urbana-cuero-negra", nombre="Urbana cuero negra", subcategoria="Urbanas", precio=49900, stock=32,
         color="Negro", material="Cuero sintético", imagen="calzado.webp", foco={"x": 82, "y": 50, "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(38, 44)},
         descripcion="Negra con suela blanca y perforaciones laterales. Combina con uniforme de trabajo y con jean.",
         etiquetas="zapatilla urbana negra cuero hombre"),
    prod(id="slip-on-tejida-gris", nombre="Slip-on tejida gris", subcategoria="Tejidas", precio=39900, stock=40,
         color="Gris", material="Tejido knit", imagen="calzado.webp", foco={"x": 15, "y": 70, "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(36, 42)},
         descripcion="Sin cordones, con elástico en el empeine y suela flexible. Liviana para todo el día.",
         etiquetas="zapatilla slip on tejida gris sin cordones"),
    prod(id="urbana-cuero-suela", nombre="Urbana cuero suela", subcategoria="Urbanas", precio=54900, stock=22,
         color="Marrón", material="Cuero sintético", imagen="calzado.webp", foco={"x": 47, "y": 72, "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(39, 44)},
         descripcion="Tono suela con suela crema y cordones al tono. Un clásico que sale parejo todo el año.",
         etiquetas="zapatilla urbana marron cuero suela hombre"),
    prod(id="runner-retro-crema", nombre="Runner retro crema", subcategoria="Running", precio=57900, stock=16, descuento=15,
         color="Crema / Gris", material="Gamuza y malla", imagen="calzado.webp", foco={"x": 80, "y": 78, "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(36, 43)},
         descripcion="Silueta retro con gamuza gris, malla crema y suela caramelo. Pensada para calle, no para pista.",
         etiquetas="zapatilla runner retro crema gris gamuza"),
    prod(id="urbana-low-gris-blanca", nombre="Urbana Low gris y blanca", subcategoria="Urbanas", precio=46900, stock=30,
         color="Gris / Blanco", material="Cuero sintético", imagen="vertical-mesa.webp", foco={"x": 25, "y": vertical(25, 64), "z": 2.4}, nuevo=True,
         variantes={"tipo": "talle", "opciones": talles(36, 44)},
         descripcion="Caña baja con paneles grises y detalle negro. Entra en la curva de talles unisex.",
         etiquetas="zapatilla urbana low gris blanca unisex"),
    prod(id="urbana-low-negra-total", nombre="Urbana Low negra total", subcategoria="Urbanas", precio=46900, stock=26,
         color="Negro", material="Cuero sintético", imagen="vertical-mesa.webp", foco={"x": 55, "y": vertical(55, 53), "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(38, 44)},
         descripcion="Negra de punta a suela, sin contrastes. La que piden para uniformes y para quien no quiere que se ensucie.",
         etiquetas="zapatilla urbana negra total hombre"),
    prod(id="urbana-low-crema", nombre="Urbana Low crema", subcategoria="Urbanas", precio=46900, stock=20,
         color="Crema", material="Cuero sintético", imagen="vertical-mesa.webp", foco={"x": 60, "y": vertical(60, 62), "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(35, 41)},
         descripcion="Tono crema con paneles beige y suela al tono. Sale en talles chicos y medianos.",
         etiquetas="zapatilla urbana crema beige mujer"),
    prod(id="urbana-retro-blanca-fucsia", nombre="Urbana retro blanca y fucsia", subcategoria="Urbanas", precio=47900, stock=4,
         color="Blanco / Fucsia", material="Cuero sintético", imagen="coleccion.webp", foco={"x": 30, "y": 48, "z": 2.0},
         variantes={"tipo": "talle", "opciones": talles(35, 42)},
         descripcion="Puntera perforada, gamuza gris en el talón y franja fucsia. Quedan pocas unidades de esta tanda.",
         etiquetas="zapatilla urbana retro blanca fucsia mujer"),
    prod(id="urbana-low-blanca", nombre="Urbana Low blanca", subcategoria="Urbanas", precio=45900, stock=48,
         color="Blanco", material="Cuero sintético", imagen="vertical-mesa.webp", foco={"x": 30, "y": vertical(30, 56), "z": 2.6},
         variantes={"tipo": "talle", "opciones": talles(35, 44)},
         descripcion="Blanca lisa de caña baja, con suela plana. Curva completa para reponer sin faltantes.",
         etiquetas="zapatilla urbana blanca lisa low"),
]

INDUMENTARIA = [
    prod(id="buzo-canguro-fucsia", nombre="Buzo canguro fucsia", subcategoria="Buzos", precio=38900, stock=24,
         color="Fucsia", material="Algodón frisa", imagen="indumentaria.webp", foco={"x": 24, "y": 27, "z": 2.8}, nuevo=True, destacado=True,
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL"]},
         descripcion="Frisa pesada, capucha doble y bolsillo canguro. El color de la temporada en talle real, sin encoger.",
         etiquetas="buzo canguro fucsia frisa capucha"),
    prod(id="buzo-canguro-gris-melange", nombre="Buzo canguro gris melange", subcategoria="Buzos", precio=36900, stock=40,
         color="Gris", material="Algodón frisa", imagen="indumentaria.webp", foco={"x": 23, "y": 50, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL", "XXL"]},
         descripcion="Gris melange clásico con puños y cintura acanalados. El básico que más reponen los locales.",
         etiquetas="buzo canguro gris melange frisa basico"),
    prod(id="buzo-canguro-negro", nombre="Buzo canguro negro", subcategoria="Buzos", precio=36900, stock=44,
         color="Negro", material="Algodón frisa", imagen="indumentaria.webp", foco={"x": 41, "y": 50, "z": 2.8}, destacado=True,
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL", "XXL"]},
         descripcion="Negro liso, corte regular, cordón al tono. Talle completo hasta XXL.",
         etiquetas="buzo canguro negro frisa basico"),
    prod(id="remera-oversize-blanca", nombre="Remera oversize blanca", subcategoria="Remeras", precio=17900, stock=80,
         color="Blanco", material="Algodón peinado", imagen="indumentaria.webp", foco={"x": 57, "y": 52, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL"]},
         descripcion="Algodón peinado de 24/1, hombro caído y largo extra. Se vende por curva de talles.",
         etiquetas="remera oversize blanca algodon lisa"),
    prod(id="remera-oversize-fucsia", nombre="Remera oversize fucsia", subcategoria="Remeras", precio=17900, stock=36, descuento=10,
         color="Fucsia", material="Algodón peinado", imagen="indumentaria.webp", foco={"x": 70, "y": 52, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL"]},
         descripcion="Mismo molde oversize en fucsia pleno. Combina con el buzo canguro del mismo color.",
         etiquetas="remera oversize fucsia algodon"),
    prod(id="campera-denim-negra", nombre="Campera denim negra", subcategoria="Camperas", precio=64900, stock=15,
         color="Negro", material="Denim", imagen="indumentaria.webp", foco={"x": 67, "y": 16, "z": 2.8}, nuevo=True,
         variantes={"tipo": "talle", "opciones": ["M", "L", "XL"]},
         descripcion="Denim rígido negro con botones metálicos y bolsillos al pecho. Corte recto.",
         etiquetas="campera denim jean negra"),
    prod(id="campera-denim-clara", nombre="Campera denim clara", subcategoria="Camperas", precio=62900, stock=12,
         color="Beige", material="Denim", imagen="indumentaria.webp", foco={"x": 75, "y": 16, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L"]},
         descripcion="Denim lavado en tono arena, con cierre de botones y puños ajustables.",
         etiquetas="campera denim clara beige arena"),
    prod(id="bomber-fucsia", nombre="Bomber fucsia", subcategoria="Camperas", precio=69900, stock=10,
         color="Fucsia", material="Poliéster con forro", imagen="indumentaria.webp", foco={"x": 84, "y": 16, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L"]},
         descripcion="Bomber liviana con cierre completo, puños y cintura elastizados. Forro interno liso.",
         etiquetas="campera bomber fucsia liviana"),
    prod(id="sweater-tejido-crema", nombre="Sweater tejido crema", subcategoria="Sweaters", precio=42900, stock=18,
         color="Crema", material="Hilo acrílico", imagen="indumentaria.webp", foco={"x": 21, "y": 67, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL"]},
         descripcion="Punto medio, cuello redondo y terminaciones acanaladas. Sale también en gris, negro y fucsia.",
         etiquetas="sweater tejido crema punto"),
    prod(id="jean-recto-celeste", nombre="Jean recto celeste", subcategoria="Jeans", precio=45900, stock=30,
         color="Celeste", material="Denim", imagen="indumentaria.webp", foco={"x": 22, "y": 83, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["38", "40", "42", "44", "46"]},
         descripcion="Tiro medio, pierna recta y lavado claro. Denim de 12 onzas con un punto de elastano.",
         etiquetas="jean recto celeste claro denim"),
    prod(id="jean-recto-negro", nombre="Jean recto negro", subcategoria="Jeans", precio=45900, stock=28,
         color="Negro", material="Denim", imagen="indumentaria.webp", foco={"x": 62, "y": 83, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["38", "40", "42", "44", "46"]},
         descripcion="Mismo molde recto en negro lavado. Costuras al tono y cinco bolsillos.",
         etiquetas="jean recto negro denim"),
]


def iphone(id, nombre, color, condicion, base, caps, extras=None, foco=None, imagen="iphone.webp", stock=3, **k):
    return prod(id=id, nombre=nombre, categoria="iPhone", subcategoria=nombre, color=color, condicion=condicion, precio=base, stock=stock,
                imagen=imagen, foco=foco, variantes={"tipo": "capacidad", "opciones": caps, "extras": extras or {}},
                etiquetas=f"iphone apple celular {nombre.lower()} {color.lower()} {condicion.lower()} " + " ".join(caps), **k)


IPHONES = [
    iphone("iphone-17-pro-max-titanio-negro", "iPhone 17 Pro Max", "Titanio negro", "Nuevo sellado", 2890000, ["256 GB", "512 GB"], {"512 GB": 280000},
           foco={"x": 52, "y": 32, "z": 2.2}, nuevo=True, destacado=True, stock=4,
           descripcion="Caja cerrada con garantía de fábrica. Se entrega con cable y documentación original."),
    iphone("iphone-17-pro-titanio-plata", "iPhone 17 Pro", "Titanio plata", "Nuevo sellado", 2490000, ["256 GB", "512 GB"], {"512 GB": 260000},
           foco={"x": 24, "y": 40, "z": 2.2}, nuevo=True, destacado=True, stock=5,
           descripcion="Caja cerrada con garantía de fábrica. Pantalla de 6,3 pulgadas y triple cámara."),
    iphone("iphone-17-lavanda", "iPhone 17", "Lavanda", "Nuevo sellado", 1790000, ["256 GB", "512 GB"], {"512 GB": 220000},
           foco={"x": 86, "y": 42, "z": 2.2}, nuevo=True, stock=6,
           descripcion="Caja cerrada con garantía de fábrica. El modelo base de la línea 17 en el color nuevo de la temporada."),
    iphone("iphone-16-pro-titanio-natural", "iPhone 16 Pro", "Titanio natural", "Nuevo sellado", 1990000, ["128 GB", "256 GB", "512 GB"], {"256 GB": 150000, "512 GB": 350000},
           foco={"x": 52, "y": 72, "z": 2.2}, stock=4,
           descripcion="Caja cerrada con garantía de fábrica. Tres capacidades disponibles."),
    iphone("iphone-16-blanco", "iPhone 16", "Blanco", "Nuevo sellado", 1390000, ["128 GB", "256 GB"], {"256 GB": 140000},
           foco={"x": 80, "y": 82, "z": 2.2}, stock=6,
           descripcion="Caja cerrada con garantía de fábrica. Botón de acción y cámara doble vertical."),
    iphone("iphone-16e-negro", "iPhone 16e", "Negro", "Nuevo sellado", 1090000, ["128 GB", "256 GB"], {"256 GB": 120000},
           foco={"x": 75, "y": vertical(75, 37), "z": 3.0}, imagen="vertical-mesa.webp", stock=8,
           descripcion="Caja cerrada con garantía de fábrica. La opción de entrada con el mismo chip de la línea 16."),
    iphone("iphone-15-pro-titanio-azul", "iPhone 15 Pro", "Titanio azul", "Seminuevo", 1290000, ["128 GB", "256 GB"], {"256 GB": 130000},
           foco={"x": 80, "y": vertical(80, 37), "z": 3.0}, imagen="vertical-mesa.webp", stock=2,
           descripcion="Equipo revisado, sin marcas de uso y con batería informada en la ficha al momento de la venta."),
    iphone("iphone-15-rosa", "iPhone 15", "Rosa", "Nuevo sellado", 1150000, ["128 GB", "256 GB"], {"256 GB": 130000},
           foco={"x": 85, "y": 18, "z": 2.2}, stock=5,
           descripcion="Caja cerrada con garantía de fábrica. Isla dinámica y puerto USB-C."),
    iphone("iphone-14-medianoche-seminuevo", "iPhone 14", "Medianoche", "Seminuevo", 890000, ["128 GB", "256 GB"], {"256 GB": 110000},
           foco={"x": 52, "y": 72, "z": 2.5}, stock=3,
           descripcion="Equipo revisado, con detalles mínimos de uso y batería informada en la ficha al momento de la venta."),
    iphone("iphone-14-purpura", "iPhone 14", "Púrpura", "Nuevo sellado", 990000, ["128 GB"], {},
           foco={"x": 90, "y": vertical(90, 37), "z": 3.0}, imagen="vertical-mesa.webp", stock=2,
           descripcion="Caja cerrada con garantía de fábrica. Última tanda de este color."),
    iphone("iphone-13-medianoche-seminuevo", "iPhone 13", "Medianoche", "Seminuevo", 720000, ["128 GB", "256 GB"], {"256 GB": 90000},
           foco={"x": 80, "y": 82, "z": 2.5}, stock=4,
           descripcion="Equipo revisado y funcionando al cien por ciento, con batería informada en la ficha al momento de la venta."),
    iphone("iphone-13-blanco-estelar-seminuevo", "iPhone 13", "Blanco estelar", "Seminuevo", 690000, ["128 GB"], {},
           foco={"x": 24, "y": 40, "z": 2.6}, stock=3, descuento=10,
           descripcion="Equipo revisado, con detalles mínimos de uso. Precio con descuento por ser la última unidad de la tanda."),
]

OCULTOS = [
    prod(id="buzo-canguro-blanco", nombre="Buzo canguro blanco", categoria="Indumentaria", subcategoria="Buzos", precio=36900, stock=0, visible=False,
         color="Blanco", material="Algodón frisa", imagen="indumentaria.webp", foco={"x": 37, "y": 28, "z": 2.8},
         variantes={"tipo": "talle", "opciones": ["S", "M", "L", "XL"]},
         descripcion="Blanco liso de frisa pesada. Oculto hasta que vuelva a entrar stock.",
         etiquetas="buzo canguro blanco frisa"),
    iphone("iphone-12-negro-seminuevo", "iPhone 12", "Negro", "Seminuevo", 560000, ["64 GB", "128 GB"], {"128 GB": 60000},
           foco={"x": 52, "y": 32, "z": 2.6}, stock=0, visible=False,
           descripcion="Equipo revisado. Oculto del catálogo público hasta confirmar nuevas unidades."),
]

for p in CALZADO:
    p["categoria"] = "Calzado"
for p in INDUMENTARIA:
    p["categoria"] = "Indumentaria"

TODOS = CALZADO + INDUMENTARIA + IPHONES + OCULTOS
ids = [p["id"] for p in TODOS]
assert len(ids) == len(set(ids)), "ids repetidos"
for p in TODOS:
    assert p["precio"] > 0 and 0 <= p["descuento"] <= 90 and p["stock"] >= 0
    assert p["variantes"]["opciones"], p["id"]

with OUT.open("w", encoding="utf-8", newline="\n") as f:
    for p in TODOS:
        f.write(json.dumps(p, ensure_ascii=False) + "\n")

print(f"{len(TODOS)} productos: {len(CALZADO)} calzado, {len(INDUMENTARIA)} indumentaria, {len(IPHONES)} iPhone, {len(OCULTOS)} ocultos")
