export type NavChild = { href: string; label: string; description?: string };
export type NavItem = { href: string; label: string; children?: NavChild[] };

export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/comunidad",
    label: "Comunidad",
    children: [
      { href: "/feed", label: "Muro Social" },
      { href: "/comunidad/foro", label: "Foro" },
      { href: "/comunidad/eventos", label: "Eventos y ferias" },
      { href: "/comunidad/blog", label: "Blog" },
      { href: "/comunidad/podcast", label: "Podcast" },
      { href: "/comunidad/recetas", label: "Recetas" },
      { href: "/comunidad/grupos", label: "Grupos" },
      { href: "/comunidad/normas", label: "Normas" },
    ],
  },
  { href: "/mapa", label: "Mapa" },
  { href: "/strains", label: "Strains" },
  {
    href: "/herramientas",
    label: "Herramientas",
    children: [
      { href: "/herramientas/dosis", label: "Calculadora de dosis" },
      { href: "/herramientas/cultivo", label: "Seguimiento de cultivo" },
      { href: "/herramientas/asistente", label: "Asistente IA" },
    ],
  },
  {
    href: "/info",
    label: "Info",
    children: [
      { href: "/info/educacion", label: "Tips & Educación" },
      { href: "/info/legal", label: "Marco legal" },
      { href: "/info/noticias", label: "Noticias" },
      { href: "/info/peliculas", label: "Pelis" },
      { href: "/info/munchies", label: "Munchies" },
      { href: "/info/juegos", label: "Juegos" },
    ],
  },
  {
    href: "/tienda",
    label: "Tienda",
    children: [
      { href: "/tienda/merch", label: "Merchandising" },
      { href: "/tienda/comparador", label: "Comparador" },
    ],
  },
];
