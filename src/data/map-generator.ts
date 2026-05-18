/**
 * Generador determinista de ubicaciones demo para el mapa WeedConnect.
 *
 * IMPORTANTE: Todos los nombres son completamente ficticios.
 * isDemo: true en cada registro. source: "demo".
 * No se usa Math.random() — los offsets son tablas precomputadas.
 * No incluye precios, contactos, delivery ni intermediación.
 *
 * Total generado: 520 ubicaciones
 *   - 260 dispensarios USA
 *   -  90 cannabis clubs EU
 *   -  70 CBD shops (EU + USA)
 *   -  50 chill spots (EU + USA)
 *   -  50 food / munchies (EU + USA)
 */

import type { MapLocation, MapCategory, LocationStatus, LocationContinent } from "@/types";

// ─── Tablas de offsets precomputadas ─────────────────────────────────────────

const LAT_OFF = [
  0.000, 0.012, -0.009, 0.007, -0.015, 0.018, -0.003, 0.022, -0.017, 0.005,
  0.013, -0.011, 0.020, -0.006, 0.016, -0.019, 0.009, -0.014, 0.003, -0.021,
  0.015, -0.008, 0.024, -0.010, 0.006,
];

const LNG_OFF = [
  0.000, -0.008, 0.015, 0.021, -0.005, -0.012, -0.019, 0.007, 0.014, -0.023,
  0.018, -0.016, -0.003, 0.020, 0.011, -0.009, -0.017, 0.006, 0.025, 0.013,
  -0.011, 0.022, -0.007, -0.018, 0.010,
];

const RATINGS = [
  4.2, 4.6, 4.4, 4.7, 4.1, 4.8, 4.3, 4.5, 3.9, 4.7,
  4.4, 4.6, 4.2, 4.8, 4.5, 4.1, 4.3, 4.7, 4.9, 4.2,
  4.6, 3.8, 4.5, 4.4, 4.3,
];

const REVIEWS = [
  234, 1284, 567, 892, 156, 2103, 421, 743, 89, 1847,
  678, 312, 2341, 1156, 567, 788, 1024, 345, 3241, 892,
  1567, 234, 456, 891, 67,
];

// ─── Pools de tags por categoría ─────────────────────────────────────────────

const TAGS: Record<string, string[]> = {
  dispensary: [
    "licensed", "top rated", "accessible", "medical focus", "recreational",
    "open daily", "educational staff", "wide variety", "community pick",
    "veteran owned", "organic products", "CBD selection", "pre-rolls",
    "edibles available", "clean facility",
  ],
  cannabis_club: [
    "members only", "verify rules", "private club", "chill atmosphere",
    "music", "events", "terrace", "18+ required", "social lounge",
    "friendly community", "regular events", "arts scene", "rooftop",
    "smoking area", "private lounge",
  ],
  cbd_shop: [
    "cbd", "hemp", "wellness", "legal", "organic", "full spectrum",
    "oils", "topicals", "gummies", "cosmetics", "natural products",
    "lab tested", "vegan", "cruelty free", "wide selection",
  ],
  chill_spot: [
    "gratuito", "vistas", "naturaleza", "parque", "mirador", "lago",
    "picnic", "plan amigos", "atardecer", "plan tranquilo",
    "música en vivo", "accesible", "pet friendly", "fotografía",
    "terraza natural",
  ],
  food: [
    "24h", "abierto tarde", "munchie perfecto", "económico", "comfort food",
    "late night", "burger", "pizza", "tacos", "kebab",
    "donuts", "helados", "snacks", "vegetarian options", "popular",
  ],
};

// ─── Pools de descripciones por categoría ─────────────────────────────────────

const DESC: Record<string, string[]> = {
  dispensary: [
    "Dispensario licenciado con amplia selección de productos regulados. Personal especializado y ambiente profesional. Información orientativa.",
    "Dispensario público con servicio educativo para la comunidad. Amplia variedad de productos regulados. Verifica normativa local.",
    "Centro de dispensación regulado con enfoque en el bienestar del consumidor. Información de referencia orientativa.",
    "Dispensario certificado con buenas valoraciones de la comunidad local. Dato orientativo — confirma horarios y requisitos.",
    "Establecimiento licenciado con personal atento y variedad de productos regulados. Información orientativa.",
  ],
  cannabis_club: [
    "Club cannábico privado. El acceso requiere ser socio registrado y mayor de edad. Información orientativa — verifica normativa local vigente.",
    "Asociación cannábica con ambiente social. Membresía obligatoria. Dato orientativo — sin garantía de acceso.",
    "Club privado con instalaciones para socios. El acceso requiere registro previo y mayoría de edad. Verifica normativa vigente.",
    "Entidad privada cannábica con área de descanso. Solo socios. Información orientativa — normativa puede variar.",
    "Asociación con actividades para socios. Acceso solo previo registro. Dato de referencia orientativo.",
  ],
  cbd_shop: [
    "Tienda de productos CBD y wellness. Selección de productos de cáñamo legales. Información orientativa.",
    "Shop de CBD con enfoque en bienestar natural. Productos de cáñamo regulados. Dato orientativo.",
    "Centro de bienestar con amplia gama de productos CBD. Verifica disponibilidad antes de visitar.",
    "Tienda de botánica y CBD con productos orgánicos certificados. Información de referencia orientativa.",
    "Establecimiento de wellness con selección de CBD y hemp. Dato demo orientativo.",
  ],
  chill_spot: [
    "Espacio público al aire libre con ambiente relajado. Ideal para planes tranquilos con amigos. Acceso gratuito.",
    "Zona pública con buenas vistas y ambiente social. Un spot recomendado por la comunidad para planes chill.",
    "Parque o espacio público con zona de descanso y naturaleza. Verifica las normas del espacio antes de visitar.",
    "Mirador o zona de descanso con ambiente tranquilo. Punto de encuentro popular entre la comunidad local.",
    "Espacio verde urbano ideal para desconectar. Gratuito y abierto al público. Dato orientativo.",
  ],
  food: [
    "Local de comida con horario ampliado. Muy recomendado para el antojo tardío. Dato orientativo — confirma horarios actuales.",
    "Restaurante o local popular para el plan nocturno. Buena relación calidad-precio. Información de referencia orientativa.",
    "Establecimiento de comida informal con buen ambiente. El munchie perfecto para cuando el antojo ataca. Dato demo.",
    "Local de comida rápida con horario nocturno. Muy valorado por la comunidad local. Información orientativa.",
    "Sitio de comida recomendado por la comunidad. Amplia selección y ambiente relajado. Dato de referencia demo.",
  ],
};

// ─── Tipos internos del generador ─────────────────────────────────────────────

interface CityGroup {
  city: string;
  region: string;
  country: string;
  continent: LocationContinent;
  lat: number;
  lng: number;
  count: number;
  category: MapCategory;
  status: LocationStatus;
  tagPool: string;   // key into TAGS
  descPool: string;  // key into DESC
}

// ─── Definición de grupos de ciudades ────────────────────────────────────────
// Total: 260 dispensarios US + 90 cannabis clubs EU + 70 CBD + 50 chill + 50 food = 520

const CITY_GROUPS: CityGroup[] = [
  // ── US Dispensaries (260) ──────────────────────────────────────────────────
  // California: 68
  { city: "Los Angeles",      region: "California",         country: "United States", continent: "north_america", lat: 34.0522, lng: -118.2437, count: 30, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "San Diego",        region: "California",         country: "United States", continent: "north_america", lat: 32.7157, lng: -117.1611, count: 15, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "San Jose",         region: "California",         country: "United States", continent: "north_america", lat: 37.3382, lng: -121.8863, count: 12, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Sacramento",       region: "California",         country: "United States", continent: "north_america", lat: 38.5816, lng: -121.4944, count: 11, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Nevada: 15
  { city: "Las Vegas",        region: "Nevada",             country: "United States", continent: "north_america", lat: 36.1699, lng: -115.1398, count: 15, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Colorado: 22
  { city: "Denver",           region: "Colorado",           country: "United States", continent: "north_america", lat: 39.7392, lng: -104.9903, count: 14, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Colorado Springs", region: "Colorado",           country: "United States", continent: "north_america", lat: 38.8339, lng: -104.8214, count: 8,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Oregon: 14
  { city: "Portland",         region: "Oregon",             country: "United States", continent: "north_america", lat: 45.5051, lng: -122.6750, count: 14, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Washington: 18
  { city: "Seattle",          region: "Washington",         country: "United States", continent: "north_america", lat: 47.6062, lng: -122.3321, count: 14, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Tacoma",           region: "Washington",         country: "United States", continent: "north_america", lat: 47.2529, lng: -122.4443, count: 4,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Illinois: 12
  { city: "Chicago",          region: "Illinois",           country: "United States", continent: "north_america", lat: 41.8781, lng:  -87.6298, count: 12, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Massachusetts: 14
  { city: "Boston",           region: "Massachusetts",      country: "United States", continent: "north_america", lat: 42.3601, lng:  -71.0589, count: 14, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // New York: 22
  { city: "New York City",    region: "New York",           country: "United States", continent: "north_america", lat: 40.7128, lng:  -74.0060, count: 16, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Buffalo",          region: "New York",           country: "United States", continent: "north_america", lat: 42.8864, lng:  -78.8784, count: 6,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Florida: 14
  { city: "Miami",            region: "Florida",            country: "United States", continent: "north_america", lat: 25.7617, lng:  -80.1918, count: 10, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Tampa",            region: "Florida",            country: "United States", continent: "north_america", lat: 27.9506, lng:  -82.4572, count: 4,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Arizona: 12
  { city: "Phoenix",          region: "Arizona",            country: "United States", continent: "north_america", lat: 33.4484, lng: -112.0740, count: 12, category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Michigan: 11
  { city: "Detroit",          region: "Michigan",           country: "United States", continent: "north_america", lat: 42.3314, lng:  -83.0458, count: 8,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Grand Rapids",     region: "Michigan",           country: "United States", continent: "north_america", lat: 42.9634, lng:  -85.6681, count: 3,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // DC/Mid-Atlantic: 16
  { city: "Washington DC",    region: "District of Columbia", country: "United States", continent: "north_america", lat: 38.9072, lng: -77.0369, count: 8,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Baltimore",        region: "Maryland",           country: "United States", continent: "north_america", lat: 39.2904, lng:  -76.6122, count: 8,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  // Midwest/South: 22
  { city: "Minneapolis",      region: "Minnesota",          country: "United States", continent: "north_america", lat: 44.9778, lng:  -93.2650, count: 7,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "St. Louis",        region: "Missouri",           country: "United States", continent: "north_america", lat: 38.6270, lng:  -90.1994, count: 8,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },
  { city: "Columbus",         region: "Ohio",               country: "United States", continent: "north_america", lat: 39.9612, lng:  -82.9988, count: 7,  category: "dispensary", status: "negocio_publico", tagPool: "dispensary", descPool: "dispensary" },

  // ── EU Cannabis Clubs (90) ────────────────────────────────────────────────
  // Spain: 40
  { city: "Barcelona",    region: "Cataluña",             country: "Spain",          continent: "europe", lat: 41.3851, lng:  2.1734, count: 15, category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Madrid",       region: "Comunidad de Madrid",  country: "Spain",          continent: "europe", lat: 40.4168, lng: -3.7038, count: 13, category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Valencia",     region: "Comunitat Valenciana", country: "Spain",          continent: "europe", lat: 39.4699, lng: -0.3763, count: 7,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Seville",      region: "Andalucía",            country: "Spain",          continent: "europe", lat: 37.3891, lng: -5.9845, count: 5,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  // Netherlands: 15
  { city: "Amsterdam",    region: "Noord-Holland",        country: "Netherlands",    continent: "europe", lat: 52.3676, lng:  4.9041, count: 8,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Rotterdam",    region: "Zuid-Holland",         country: "Netherlands",    continent: "europe", lat: 51.9244, lng:  4.4777, count: 4,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Eindhoven",    region: "Noord-Brabant",        country: "Netherlands",    continent: "europe", lat: 51.4416, lng:  5.4697, count: 3,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  // Germany: 10
  { city: "Berlin",       region: "Berlin",               country: "Germany",        continent: "europe", lat: 52.5200, lng: 13.4050, count: 6,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Hamburg",      region: "Hamburg",              country: "Germany",        continent: "europe", lat: 53.5753, lng:  9.9954, count: 4,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  // Portugal: 7
  { city: "Lisbon",       region: "Lisboa",               country: "Portugal",       continent: "europe", lat: 38.7223, lng: -9.1393, count: 5,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Porto",        region: "Porto",                country: "Portugal",       continent: "europe", lat: 41.1579, lng: -8.6291, count: 2,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  // Czech Republic: 5
  { city: "Prague",       region: "Prague",               country: "Czech Republic", continent: "europe", lat: 50.0755, lng: 14.4378, count: 5,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  // Others: 13
  { city: "Vienna",       region: "Vienna",               country: "Austria",        continent: "europe", lat: 48.2082, lng: 16.3738, count: 4,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Brussels",     region: "Brussels",             country: "Belgium",        continent: "europe", lat: 50.8503, lng:  4.3517, count: 4,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Geneva",       region: "Geneva",               country: "Switzerland",    continent: "europe", lat: 46.2044, lng:  6.1432, count: 2,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },
  { city: "Zurich",       region: "Zürich",               country: "Switzerland",    continent: "europe", lat: 47.3769, lng:  8.5417, count: 3,  category: "cannabis_club", status: "verificar_normativa", tagPool: "cannabis_club", descPool: "cannabis_club" },

  // ── CBD Shops EU (42) ─────────────────────────────────────────────────────
  { city: "Paris",        region: "Île-de-France",        country: "France",         continent: "europe", lat: 48.8566, lng:  2.3522, count: 8,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "London",       region: "England",              country: "United Kingdom", continent: "europe", lat: 51.5074, lng: -0.1278, count: 8,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Berlin",       region: "Berlin",               country: "Germany",        continent: "europe", lat: 52.5200, lng: 13.4050, count: 6,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Amsterdam",    region: "Noord-Holland",        country: "Netherlands",    continent: "europe", lat: 52.3676, lng:  4.9041, count: 5,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Barcelona",    region: "Cataluña",             country: "Spain",          continent: "europe", lat: 41.3851, lng:  2.1734, count: 5,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Milan",        region: "Lombardia",            country: "Italy",          continent: "europe", lat: 45.4642, lng:  9.1900, count: 4,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Copenhagen",   region: "Hovedstaden",          country: "Denmark",        continent: "europe", lat: 55.6761, lng: 12.5683, count: 4,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Zurich",       region: "Zürich",               country: "Switzerland",    continent: "europe", lat: 47.3769, lng:  8.5417, count: 2,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },

  // ── CBD Shops USA (28) ────────────────────────────────────────────────────
  { city: "Los Angeles",  region: "California",           country: "United States",  continent: "north_america", lat: 34.0522, lng: -118.2437, count: 8,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "New York City",region: "New York",             country: "United States",  continent: "north_america", lat: 40.7128, lng:  -74.0060, count: 6,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Chicago",      region: "Illinois",             country: "United States",  continent: "north_america", lat: 41.8781, lng:  -87.6298, count: 5,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Miami",        region: "Florida",              country: "United States",  continent: "north_america", lat: 25.7617, lng:  -80.1918, count: 4,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },
  { city: "Seattle",      region: "Washington",           country: "United States",  continent: "north_america", lat: 47.6062, lng: -122.3321, count: 5,  category: "cbd_shop", status: "negocio_publico", tagPool: "cbd_shop", descPool: "cbd_shop" },

  // ── Chill Spots EU (28) ───────────────────────────────────────────────────
  { city: "Barcelona",    region: "Cataluña",             country: "Spain",          continent: "europe",        lat: 41.3851, lng:  2.1734, count: 8,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "Madrid",       region: "Comunidad de Madrid",  country: "Spain",          continent: "europe",        lat: 40.4168, lng: -3.7038, count: 7,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "Amsterdam",    region: "Noord-Holland",        country: "Netherlands",    continent: "europe",        lat: 52.3676, lng:  4.9041, count: 5,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "Berlin",       region: "Berlin",               country: "Germany",        continent: "europe",        lat: 52.5200, lng: 13.4050, count: 4,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "Lisbon",       region: "Lisboa",               country: "Portugal",       continent: "europe",        lat: 38.7223, lng: -9.1393, count: 4,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },

  // ── Chill Spots USA (22) ──────────────────────────────────────────────────
  { city: "Los Angeles",  region: "California",           country: "United States",  continent: "north_america", lat: 34.0522, lng: -118.2437, count: 7,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "New York City",region: "New York",             country: "United States",  continent: "north_america", lat: 40.7128, lng:  -74.0060, count: 6,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "San Francisco",region: "California",           country: "United States",  continent: "north_america", lat: 37.7749, lng: -122.4194, count: 5,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },
  { city: "Portland",     region: "Oregon",               country: "United States",  continent: "north_america", lat: 45.5051, lng: -122.6750, count: 4,  category: "chill_spot", status: "info_orientativa", tagPool: "chill_spot", descPool: "chill_spot" },

  // ── Food EU (24) ──────────────────────────────────────────────────────────
  { city: "Barcelona",    region: "Cataluña",             country: "Spain",          continent: "europe",        lat: 41.3851, lng:  2.1734, count: 6,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Madrid",       region: "Comunidad de Madrid",  country: "Spain",          continent: "europe",        lat: 40.4168, lng: -3.7038, count: 6,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Amsterdam",    region: "Noord-Holland",        country: "Netherlands",    continent: "europe",        lat: 52.3676, lng:  4.9041, count: 5,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Berlin",       region: "Berlin",               country: "Germany",        continent: "europe",        lat: 52.5200, lng: 13.4050, count: 4,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Lisbon",       region: "Lisboa",               country: "Portugal",       continent: "europe",        lat: 38.7223, lng: -9.1393, count: 3,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },

  // ── Food USA (26) ─────────────────────────────────────────────────────────
  { city: "Los Angeles",  region: "California",           country: "United States",  continent: "north_america", lat: 34.0522, lng: -118.2437, count: 8,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "New York City",region: "New York",             country: "United States",  continent: "north_america", lat: 40.7128, lng:  -74.0060, count: 7,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Denver",       region: "Colorado",             country: "United States",  continent: "north_america", lat: 39.7392, lng: -104.9903, count: 5,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
  { city: "Seattle",      region: "Washington",           country: "United States",  continent: "north_america", lat: 47.6062, lng: -122.3321, count: 6,  category: "food", status: "info_orientativa", tagPool: "food", descPool: "food" },
];

// ─── Labels de categoría para nombres ────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  dispensary:   "Dispensary Demo",
  cannabis_club: "Cannabis Club Demo",
  cbd_shop:     "CBD Shop Demo",
  chill_spot:   "Chill Spot Demo",
  food:         "Food Spot Demo",
  association:  "Association Demo",
  nightlife:    "Nightlife Demo",
  point_of_interest: "POI Demo",
};

// ─── Función generadora ───────────────────────────────────────────────────────

function generateGroup(group: CityGroup, groupIdx: number, globalStart: number): MapLocation[] {
  const results: MapLocation[] = [];
  const tagPool = TAGS[group.tagPool] ?? TAGS.dispensary;
  const descPool = DESC[group.descPool] ?? DESC.dispensary;
  const catLabel = CATEGORY_LABEL[group.category] ?? "Demo";
  const citySlug = group.city.toLowerCase().replace(/[\s.]+/g, "-").replace(/[^a-z0-9-]/g, "");
  const catSlug  = group.category.replace(/_/g, "-");

  for (let i = 0; i < group.count; i++) {
    const idx = globalStart + i;
    const n   = (i + 1).toString().padStart(2, "0");

    const tags = [
      tagPool[(idx + 0) % tagPool.length],
      tagPool[(idx + 3) % tagPool.length],
      tagPool[(idx + 7) % tagPool.length],
    ];
    if (idx % 4 === 0) tags.push(tagPool[(idx + 11) % tagPool.length]);

    results.push({
      id:          `gen-${groupIdx}-${i}`,
      name:        `${group.city} ${catLabel} ${n}`,
      slug:        `${citySlug}-${catSlug}-demo-${n}`,
      category:    group.category,
      city:        group.city,
      country:     group.country,
      region:      group.region,
      continent:   group.continent,
      lat:         parseFloat((group.lat + LAT_OFF[idx % LAT_OFF.length]).toFixed(4)),
      lng:         parseFloat((group.lng + LNG_OFF[idx % LNG_OFF.length]).toFixed(4)),
      rating:      RATINGS[idx % RATINGS.length],
      reviewCount: REVIEWS[idx  % REVIEWS.length],
      tags,
      description: descPool[idx % descPool.length],
      status:      group.status,
      verified:    idx % 3 !== 0,
      isDemo:      true,
      source:      "demo",
      confidenceScore: 0,
      legalNotice: group.category === "cannabis_club"
        ? "Entidad privada. Acceso solo con membresía. Verifica normativa local vigente."
        : undefined,
    });
  }
  return results;
}

// ─── Exportación ──────────────────────────────────────────────────────────────

let _cache: MapLocation[] | null = null;

export function generateMapLocations(): MapLocation[] {
  if (_cache) return _cache;

  const all: MapLocation[] = [];
  let globalIdx = 0;

  CITY_GROUPS.forEach((group, groupIdx) => {
    const locations = generateGroup(group, groupIdx, globalIdx);
    all.push(...locations);
    globalIdx += group.count;
  });

  _cache = all;
  return all;
}
