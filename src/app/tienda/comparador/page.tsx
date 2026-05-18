import type { Metadata } from "next";
import { ShoppingCart, Star, ShieldCheck, ArrowUpRight, Tag, Sparkles, Lightbulb, Zap, Box, Cookie } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Compras Recomendadas WeedConnect — Setup & Parafernalia",
  description: "Nuestra selección premium de productos de parafernalia, vaporizadores, gadgets electrónicos y setups chill recomendados con enlaces de afiliado.",
};

const CATEGORIES = [
  { id: "parafernalia", label: "Parafernalia", icon: Box },
  { id: "vaporizadores", label: "Vaporizadores", icon: Zap },
  { id: "setup", label: "Setup Chill & LED", icon: Lightbulb },
  { id: "juegos", label: "Juegos y Diversión", icon: Sparkles },
  { id: "snacks", label: "Snacks & Bebidas", icon: Cookie },
];

const PRODUCTS = [
  // --- PARAFERNALIA ---
  {
    category: "parafernalia",
    name: "Grinder Premium de Aluminio CNC (4 partes)",
    desc: "Dientes de tiburón ultraafilados, recogedor de polen magnético y anillo deslizante para un giro suave.",
    price: "19.99€",
    rating: 4.8,
    bestSeller: true,
    tag: "Parafernalia",
    amazonLink: "#",
    specs: ["4 piezas", "Imán de neodimio", "50mm Ø"]
  },
  {
    category: "parafernalia",
    name: "Bandeja para Liar de Bambú Orgánico",
    desc: "Diseño minimalista con bordes redondeados y compartimentos dedicados para grinder, papel y mecheros.",
    price: "14.50€",
    rating: 4.6,
    tag: "Parafernalia",
    amazonLink: "#",
    specs: ["Madera sostenible", "Ranura para papel"]
  },
  // --- VAPORIZADORES ---
  {
    category: "vaporizadores",
    name: "Vaporizador Herbal Portátil con Control Temp",
    desc: "Calentamiento híbrido por conducción y convección. Pantalla OLED y batería de alta duración para hierbas legales.",
    price: "89.00€",
    rating: 4.9,
    bestSeller: true,
    tag: "Vaporizador",
    amazonLink: "#",
    specs: ["100% vapor limpio", "OLED", "USB-C"]
  },
  {
    category: "vaporizadores",
    name: "Vaporizador Analógico de Acero Inoxidable",
    desc: "Sin baterías. Calentamiento por llama/antorcha. El estándar de la industria para microdosificación duradera.",
    price: "75.00€",
    rating: 4.7,
    tag: "Vaporizador",
    amazonLink: "#",
    specs: ["Sin batería", "Indestructible", "Eficiente"]
  },
  // --- SETUP CHILL ---
  {
    category: "setup",
    name: "Tira LED RGB Inteligente (WiFi/App)",
    desc: "Crea el ambiente perfecto con luz ambiental difusa controlable por el móvil o la voz (Alexa/Google). Sincronización de música.",
    price: "24.99€",
    rating: 4.7,
    bestSeller: true,
    tag: "Setup",
    amazonLink: "#",
    specs: ["5 metros", "Smart App", "Ritmo musical"]
  },
  {
    category: "setup",
    name: "Proyector Portátil HD Cine en Casa",
    desc: "Monta un cine en el techo de tu habitación. Ideal para ver las pelis recomendadas de WeedConnect tumbado.",
    price: "69.00€",
    rating: 4.5,
    tag: "Setup",
    amazonLink: "#",
    specs: ["HD 720p nativo", "Altavoz integrado", "HDMI/USB"]
  },
  {
    category: "setup",
    name: "Altavoz Bluetooth Portátil Resistente al Agua",
    desc: "Sonido 360º con graves potentes para ambientar tus sesiones en el exterior (playa o miradores).",
    price: "39.90€",
    rating: 4.8,
    tag: "Setup",
    amazonLink: "#",
    specs: ["Batería 12h", "IPX7 Waterproof", "Extra Bass"]
  },
  // --- PARAFERNALIA EXTRA ---
  {
    category: "parafernalia",
    name: "Pack Papel de Liar King Size + Filtros",
    desc: "Papel ultrafino sin cloro con filtros de cartón incluidos. Pack de 50 libritos para un suministro completo.",
    price: "12.50€",
    rating: 4.7,
    tag: "Parafernalia",
    amazonLink: "#",
    specs: ["King Size Slim", "50 libritos", "Sin cloro"]
  },
  {
    category: "parafernalia",
    name: "Mechero de Gas Recargable Windproof",
    desc: "Mechero de llama azul resistente al viento. Ideal para exteriores: miradores, playas y parques. Recargable y duradero.",
    price: "8.99€",
    rating: 4.6,
    tag: "Parafernalia",
    amazonLink: "#",
    specs: ["Windproof", "Recargable", "Gas ajustable"]
  },
  {
    category: "parafernalia",
    name: "Bandeja Magnética Antideslizante con Caja",
    desc: "Sistema modular: bandeja de liar con fondo magnético, cajita con cierre y compartimentos para grinder y papel.",
    price: "22.00€",
    rating: 4.8,
    bestSeller: true,
    tag: "Parafernalia",
    amazonLink: "#",
    specs: ["Magnético", "Compartimentos", "Kit completo"]
  },
  // --- SETUP EXTRA ---
  {
    category: "setup",
    name: "Ambientador Eléctrico de Bambú y Cítrico",
    desc: "Difusor ultrasónico silencioso que combina esencias naturales de bambú y cítrico para neutralizar olores y crear ambiente.",
    price: "18.99€",
    rating: 4.5,
    tag: "Setup",
    amazonLink: "#",
    specs: ["Ultrasónico", "Sin ruido", "Aceites incluidos"]
  },
  // --- JUEGOS ---
  {
    category: "juegos",
    name: "Jenga Clásico de Madera",
    desc: "La torre tambaleante definitiva. Pon a prueba el pulso y los reflejos cuando la risa dificulta concentrarse.",
    price: "15.99€",
    rating: 4.9,
    tag: "Juegos",
    amazonLink: "#",
    specs: ["Madera maciza", "Clásico 54 bloques"]
  },
  {
    category: "juegos",
    name: "Juego de Cartas UNO (Edición Especial)",
    desc: "Colores vivos y jugadas caóticas. El juego social por excelencia que nunca defrauda tras cenar.",
    price: "9.99€",
    rating: 4.9,
    bestSeller: true,
    tag: "Juegos",
    amazonLink: "#",
    specs: ["Para todos", "2-10 jugadores"]
  },
  {
    category: "juegos",
    name: "Exploding Kittens — Juego de Cartas",
    desc: "Juego de cartas explosivo y absurdo para 2-5 jugadores. Estrategia y caos en un mazo que garantiza carcajadas.",
    price: "19.99€",
    rating: 4.7,
    tag: "Juegos",
    amazonLink: "#",
    specs: ["2-5 jugadores", "15 min partida", "Mayores 7 años"]
  },
  // --- SNACKS ---
  {
    category: "snacks",
    name: "Pack Snacks Variados (Doritos, Cheetos, Oreos)",
    desc: "El pack definitivo para una sesión: mezcla equilibrada de salado, picante y dulce para el antojo perfecto.",
    price: "14.99€",
    rating: 4.8,
    bestSeller: true,
    tag: "Snacks",
    amazonLink: "#",
    specs: ["8 unidades", "Salado + dulce", "Formato fiesta"]
  },
  {
    category: "snacks",
    name: "Cereales Captain Crunch (importación)",
    desc: "Los cereales más icónicos del cine americano. Crujientes, dulces y adictivos. El desayuno o merienda chill de culto.",
    price: "8.50€",
    rating: 4.6,
    tag: "Snacks",
    amazonLink: "#",
    specs: ["397g", "Importación USA", "Crunch garantizado"]
  },
  {
    category: "snacks",
    name: "Bebidas Isotónicas Pack 12 uds",
    desc: "Hidratación top para tu sesión. Pack variado de isotónicas con electrolitos para mantenerte hidratado y refrescado.",
    price: "11.90€",
    rating: 4.5,
    tag: "Snacks",
    amazonLink: "#",
    specs: ["12 latas 330ml", "Electrolitos", "Sin alcohol"]
  }
];

export default function ComparadorPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 animate-in fade-in duration-500">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <ShoppingCart className="size-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Gear & Gadgets</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compras Recomendadas</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
          ¿Quieres montar el setup chill definitivo? Hemos analizado y filtrado los mejores productos de Amazon por su
          relación calidad/precio para tu salón, dormitorio o salidas al aire libre.
        </p>
      </header>

      <div className="mb-8 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 dark:border-emerald-950/30 dark:bg-emerald-950/10 px-4 py-4 text-sm leading-relaxed">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
        <div className="text-foreground/90">
          <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Garantía de Selección:</strong> Los productos mostrados han sido elegidos basándose en valoraciones comunitarias excelentes y tests de durabilidad. Compras a través del enlace seguro oficial.
        </div>
      </div>

      {/* Bucle por Categorías */}
      <div className="flex flex-col gap-12">
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const items = PRODUCTS.filter(p => p.category === cat.id);

          if (items.length === 0) return null;

          return (
            <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground/90">
                  <div className="p-1.5 bg-muted rounded-lg">
                    <CatIcon className="size-4 text-emerald-600" />
                  </div>
                  {cat.label}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  {items.length} productos
                </Badge>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                  <Card key={p.name} className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-emerald-500/30 border border-border/60 group">
                    <CardHeader className="pb-3 relative bg-gradient-to-b from-muted/20 to-transparent pt-6 px-5">
                      {p.bestSeller && (
                        <Badge className="absolute top-4 right-4 text-[9px] uppercase tracking-wide font-bold border-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                          🔥 Top Ventas
                        </Badge>
                      )}
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground mb-1">
                        <Tag className="size-2.5" /> {p.tag}
                      </div>
                      <CardTitle className="text-base leading-snug font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors pr-6">
                        {p.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-1 justify-between gap-4 px-5 pb-5">
                      <div className="space-y-3">
                        <CardDescription className="text-xs text-foreground/80 leading-relaxed">
                          {p.desc}
                        </CardDescription>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-1.5">
                          {p.specs.map((s) => (
                            <span key={s} className="rounded bg-muted/60 px-2 py-0.5 text-[9px] font-medium text-muted-foreground border border-border/20">
                              • {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 mt-auto border-t border-border/40 space-y-3">
                        <div className="flex items-end justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs text-muted-foreground line-through leading-none font-medium">{(parseFloat(p.price)*1.2).toFixed(2)}€</p>
                            <p className="text-xl font-extrabold leading-none tracking-tight text-foreground">{p.price}</p>
                          </div>

                          <div className="text-right space-y-0.5">
                            <span className="flex items-center gap-0.5 justify-end text-xs font-bold text-foreground">
                              <Star className="size-3 fill-amber-400 text-amber-400" /> {p.rating}
                            </span>
                            <p className="text-[9px] text-muted-foreground leading-none">Envío Prime 🚀</p>
                          </div>
                        </div>

                        <a 
                          href={p.amazonLink}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-xs shadow transition-all transform active:scale-[0.98]"
                        >
                          🛒 Ver Oferta en Amazon <ArrowUpRight className="size-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-16 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          🤝 <strong>Divulgación de Afiliados:</strong> Al comprar a través de nuestros enlaces, WeedConnect recibe una pequeña comisión de Amazon Services LLC u otros partners sin ningún coste adicional para ti. Esto nos ayuda a pagar los servidores y mantener la comunidad libre y abierta.
        </p>
      </footer>
    </section>
  );
}
