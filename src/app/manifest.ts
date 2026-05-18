import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WeedConnect",
    short_name: "WeedConnect",
    description:
      "El hub de la comunidad cannábica. Foro, mapa de clubs, catálogo de strains y más.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#022c22",
    theme_color: "#059669",
    lang: "es-ES",
    categories: ["social", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Foro",
        url: "/comunidad/foro",
        description: "Debates de la comunidad cannábica",
      },
      {
        name: "Strains",
        url: "/strains",
        description: "Catálogo de variedades de cannabis",
      },
      {
        name: "Mapa",
        url: "/mapa",
        description: "Mapa de asociaciones y spots chill en Europa",
      },
    ],
  };
}
