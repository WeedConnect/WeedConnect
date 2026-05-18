export type EventoCategoria =
  | "feria"
  | "taller"
  | "ponencia"
  | "social"
  | "activismo"
  | "online";

export interface Evento {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  contenido?: string;
  categoria: EventoCategoria;
  fecha: string;
  fechaFin?: string;
  horaInicio: string;
  horaFin?: string;
  lugar: string;
  direccion?: string;
  ciudad: string;
  pais: string;
  precio: "gratuito" | string;
  aforo?: number;
  organizador: string;
  contacto?: string;
  urlExterna?: string;
  destacado?: boolean;
}

export const MOCK_EVENTOS: Evento[] = [
  {
    id: "1",
    slug: "spannabis-2025",
    titulo: "Spannabis 2025",
    descripcion:
      "El mayor salón cannábico de España y uno de los referentes mundiales. Tres días de exposición, concursos de cultivo, ponencias y showcooking. Reunión anual de toda la industria y la comunidad.",
    contenido: `**Spannabis: el salón de referencia del cannabis en Europa**

Spannabis vuelve a la Fira de Cornellà con su edición 2025. Tres días donde la industria cannábica, los cultivadores, los activistas y la comunidad se reúnen bajo un mismo techo en el evento más importante del calendario cannábico europeo.

**¿Qué encontrarás?**

Más de 300 expositores de semilleros, tiendas de grow, marcas de CBD, asociaciones cannábicas y empresas de tecnología agrícola. Los pasillos mezclan marcas consolidadas con proyectos emergentes que buscan hacerse un hueco en el sector.

**Concursos de cultivo**

Los concursos son el corazón de Spannabis. Las categorías Indoor, Outdoor y Sativa/Indica premian a cultivadores de toda España y Europa. Si quieres presentar, la inscripción abre tres meses antes del evento.

**Programa de ponencias**

El auditorio principal acoge charlas sobre investigación médica, regulación europea, técnicas de cultivo avanzado y reducción de daños. Las plazas son limitadas, reserva con antelación a través de la web oficial.

**Showcooking cannábico**

La cocina con cannabis está en auge. Chefs especializados demuestran recetas con aceite de CBD y otras preparaciones gastronómicas dentro del marco legal.

**Cómo llegar**

La Fira de Cornellà está a 15 minutos de Barcelona en metro (L5, estación Cornellà Centre) o en coche por la C-31. Parking disponible en el recinto (precio aparte).`,
    categoria: "feria",
    fecha: "2025-03-14",
    fechaFin: "2025-03-16",
    horaInicio: "10:00",
    horaFin: "20:00",
    lugar: "Fira de Cornellà",
    direccion: "Av. de la Fira, s/n, 08940 Cornellà de Llobregat",
    ciudad: "Barcelona",
    pais: "España",
    precio: "15€",
    aforo: 50000,
    organizador: "Spannabis SL",
    urlExterna: "https://spannabis.com",
    destacado: true,
  },
  {
    id: "2",
    slug: "taller-cultivo-indoor-principiantes-madrid-mayo-2025",
    titulo: "Taller de cultivo indoor para principiantes",
    descripcion:
      "Aprende a montar tu primer armario de cultivo: sustrato, iluminación LED, riegos, pH y fases de crecimiento. Material incluido. Grupos reducidos de máximo 12 personas.",
    contenido: `**Taller práctico: tu primer cultivo indoor**

Este taller está diseñado para quienes nunca han cultivado y quieren aprender desde cero. En tres horas, cubriremos todo lo necesario para montar un armario de cultivo funcional y entender el ciclo de la planta.

**Contenido del taller**

Empezamos con la selección del armario y los materiales básicos: qué tamaño necesitas, cómo ventilarlo correctamente y por qué el olor puede ser un problema. Después pasamos a los sustratos — tierra vs coco vs hidro — y sus diferencias prácticas.

**Iluminación LED: el cambio de paradigma**

Los LEDs de espectro completo han revolucionado el cultivo indoor. Aprenderás a calcular vatios por metro cuadrado, distancias óptimas y cómo ajustar el fotoperiodo para las fases de crecimiento y floración.

**Nutrición y pH**

El pH es el error más común de los principiantes. Veremos cómo medirlo, corregirlo y qué rangos son óptimos para cada sustrato. También introduciremos la nutrición básica: macro y micronutrientes, señales de deficiencia.

**Material incluido**

El precio incluye un kit de inicio: test de pH, muestra de sustrato y guía impresa con los parámetros clave del cultivo.

**Plazas limitadas**

El grupo es de máximo 12 personas para garantizar atención individualizada. Confirma tu reserva con 48h de antelación.`,
    categoria: "taller",
    fecha: "2025-05-24",
    horaInicio: "11:00",
    horaFin: "14:00",
    lugar: "Asociación La Verde",
    direccion: "Calle Embajadores 45, bajo, 28012 Madrid",
    ciudad: "Madrid",
    pais: "España",
    precio: "25€",
    aforo: 12,
    organizador: "Asociación La Verde",
    contacto: "laverde.madrid@proton.me",
    destacado: true,
  },
  {
    id: "3",
    slug: "ponencia-cannabis-salud-mental-barcelona-mayo-2025",
    titulo: "Cannabis y salud mental: mitos y realidades",
    descripcion:
      "Ponencia del Dr. Martí Puig, psiquiatra del Hospital Clínic de Barcelona, sobre los últimos estudios que relacionan el cannabis con la ansiedad, la depresión y la psicosis. Turno de preguntas abierto.",
    contenido: `**Cannabis y salud mental: lo que dice la ciencia**

El Dr. Martí Puig lleva doce años investigando la relación entre el consumo de cannabis y los trastornos mentales en adultos jóvenes. En esta ponencia presentará los resultados de los estudios más recientes y desmontará algunos mitos populares.

**¿El cannabis causa psicosis?**

Esta es la pregunta más frecuente y la respuesta es matizada. Los estudios de cohorte muestran una correlación entre el consumo intenso de variedades con alto THC en adolescentes y un mayor riesgo de episodios psicóticos. Sin embargo, la causalidad directa en adultos sigue siendo debatida.

**CBD como ansiolítico**

Los estudios sobre CBD y ansiedad muestran resultados prometedores, especialmente en el trastorno de ansiedad social. El Dr. Puig revisará los ensayos clínicos más rigurosos y su aplicabilidad real.

**El factor endocannabinoide**

El sistema endocannabinoide juega un papel fundamental en la regulación emocional. Entender cómo el THC y el CBD interactúan con los receptores CB1 y CB2 del cerebro es clave para comprender los efectos mentales del cannabis.

**Turno de preguntas**

La segunda hora está reservada para preguntas del público. No es necesario registro previo, pero se recomienda llegar 10 minutos antes para garantizar asiento.`,
    categoria: "ponencia",
    fecha: "2025-05-30",
    horaInicio: "19:00",
    horaFin: "21:00",
    lugar: "Centre Cívic Barceloneta",
    direccion: "Carrer de Conreria, 1-9, 08003 Barcelona",
    ciudad: "Barcelona",
    pais: "España",
    precio: "gratuito",
    organizador: "WeedConnect",
    destacado: true,
  },
  {
    id: "4",
    slug: "meet-greet-comunidad-weedconnect-valencia-junio-2025",
    titulo: "Meet & Greet — Comunidad WeedConnect Valencia",
    descripcion:
      "Primera quedada presencial de la comunidad de Valencia. Chatea, conoce gente y comparte experiencias en un ambiente relajado. Sin agenda fija: es una quedada informal.",
    contenido: `**¡Nos vemos en Valencia!**

La comunidad de WeedConnect de Valencia organiza su primera quedada presencial. Sin ponencias, sin agenda: solo gente de la comunidad juntándose a charlar en un ambiente relajado.

**¿De qué va esto?**

Una tarde informal donde cultivadores, usuarios y curiosos pueden conocerse en persona. Si llevas meses cruzándote con los mismos usuarios en el foro, esta es la oportunidad de poner cara a los nicks.

**Ambiente y lugar**

El Bar El Cabanyal es un espacio amplio y tranquilo, cerca del mar, con buena terraza. Confirmaremos la zona exacta (interior/terraza) al apuntarte según la previsión del tiempo.

**¿Qué necesito llevar?**

Solo ganas de conocer gente. No hay cuota de entrada ni nada que preparar. Cada uno paga su consumición.

**Apúntate**

Escríbenos por el foro o por el chat de comunidad para que podamos confirmar aforo y reservar espacio suficiente. ¡Te esperamos!`,
    categoria: "social",
    fecha: "2025-06-07",
    horaInicio: "18:00",
    lugar: "Bar El Cabanyal",
    direccion: "Carrer de la Reina, 34, 46011 Valencia (confirmar al apuntarte)",
    ciudad: "Valencia",
    pais: "España",
    precio: "gratuito",
    organizador: "WeedConnect",
  },
  {
    id: "5",
    slug: "webinar-legislacion-cannabica-espana-2025",
    titulo: "Webinar: Legislación cannábica en España en 2025",
    descripcion:
      "Análisis de la situación legal actual: clubs privados, posesión, cultivo personal, jurisprudencia del Tribunal Supremo y comparativa con el marco europeo. Online con Q&A en directo.",
    contenido: `**La situación legal del cannabis en España: 2025 al día**

España tiene una de las legislaciones cannábicas más peculiares de Europa: el consumo es privado, la venta es ilegal, y los clubs funcionan en un limbo jurídico que el Tribunal Supremo ha acotado repetidamente. Este webinar actualiza el mapa completo.

**Los clubs cannábicos: dónde estamos**

Desde la sentencia del Tribunal Supremo de 2019, los requisitos para que un club opere legalmente son más estrictos. El ponente repasará los criterios de "consumo compartido sin ánimo de lucro" y los últimos pronunciamientos judiciales autonómicos.

**Posesión y cultivo personal**

La Ley Mordaza de 2015 estableció multas administrativas para el consumo en la vía pública y la tenencia "visible". Pero ¿cuánto es legal tener en casa? ¿Cuántas plantas? El webinar despeja las dudas más comunes con referencia a jurisprudencia actualizada.

**Marco europeo comparado**

Alemania inició su proceso de regulación en 2024. Portugal lleva décadas con despenalización. Malta fue el primer país de la UE en legalizar el uso recreativo. ¿Qué lecciones puede tomar España?

**Q&A en directo**

Los últimos 30 minutos son preguntas del público. Puedes enviarlas durante la sesión por el chat de Zoom. El enlace se enviará por correo al registrarte.`,
    categoria: "online",
    fecha: "2025-06-12",
    horaInicio: "20:00",
    horaFin: "21:30",
    lugar: "Online (Zoom)",
    ciudad: "Online",
    pais: "España",
    precio: "gratuito",
    organizador: "Colectivo Cáñamo Legal",
    contacto: "info@canamolegal.org",
  },
  {
    id: "6",
    slug: "marcha-regulacion-cannabis-madrid-junio-2025",
    titulo: "Marcha por la regulación del cannabis — Madrid",
    descripcion:
      "Manifestación anual en favor de la regulación del cannabis en España. Sale de Atocha y termina en Retiro con mitin final. Organizada por la Coordinadora de ONGs de Reducción de Daños.",
    contenido: `**Unidos por la regulación**

La manifestación anual por la regulación del cannabis en España celebra su edición de 2025. Miles de personas recorrerán las calles de Madrid en un acto pacífico para exigir al Gobierno un marco regulatorio claro y justo.

**Recorrido**

La marcha parte de la Estación de Atocha a las 12:00h y recorre el Paseo del Prado hasta llegar al Parque del Retiro, donde se celebrará el mitin final con representantes de asociaciones de toda España.

**¿Por qué salir a la calle?**

La regulación no es solo una cuestión de libertad personal. Una regulación responsable reduce el mercado negro, genera ingresos fiscales, garantiza la calidad del producto y permite investigar sus aplicaciones médicas. Mientras el debate se queda en los despachos, las consecuencias (detenciones, multas, estigma) las sufren personas reales.

**Quién organiza**

La Coordinadora de ONGs de Reducción de Daños agrupa a más de 40 organizaciones de toda España. La marcha es abierta a cualquier persona que comparta el objetivo de la regulación.

**Llevar**

Ropa cómoda, agua y, si quieres, una pancarta. El servicio de orden garantiza que la manifestación sea pacífica y familiar.`,
    categoria: "activismo",
    fecha: "2025-06-20",
    horaInicio: "12:00",
    lugar: "Estación de Atocha",
    direccion: "Glorieta del Emperador Carlos V, s/n, 28045 Madrid",
    ciudad: "Madrid",
    pais: "España",
    precio: "gratuito",
    organizador: "Coordinadora ONGRD",
  },
  {
    id: "7",
    slug: "cannabis-cup-espana-zona-norte-2025",
    titulo: "Cannabis Cup España — Zona norte",
    descripcion:
      "Concurso de variedades para cultivadores amateur y profesionales. Categorías: indoor, outdoor y autoflowering. Los ganadores reciben trofeo y figuran en el catálogo de WeedConnect.",
    contenido: `**Cannabis Cup España — Zona Norte 2025**

El concurso de variedades más importante del norte de España llega a San Sebastián. Un día de competición, exposición y celebración de la cultura cannábica vasca y navarra.

**Categorías de concurso**

- **Indoor**: variedades cultivadas bajo luz artificial, en cualquier sustrato
- **Outdoor**: cultivadas al sol, cosecha de temporada 2024
- **Autoflowering**: ruderalis cruzadas, cualquier entorno

Cada categoría premia el primer, segundo y tercer puesto. El jurado está compuesto por cultivadores veteranos, un químico especialista en terpenos y un representante de WeedConnect.

**Inscripción**

La inscripción está abierta hasta dos semanas antes del evento. Cada participante puede presentar hasta dos muestras. Las muestras se entregan anónimas y son evaluadas por el jurado sin conocer al cultivador.

**Exposición paralela**

El Palacio de Congresos acoge también una pequeña feria con semilleros locales, grow shops del País Vasco y Navarra, y stands de asociaciones cannábicas de la zona.

**Catálogo WeedConnect**

Las variedades ganadoras se añaden al catálogo de WeedConnect con el perfil del cultivador y las características documentadas. Es una forma de visibilizar el trabajo de los cultivadores de la zona norte.`,
    categoria: "feria",
    fecha: "2025-07-05",
    horaInicio: "10:00",
    horaFin: "18:00",
    lugar: "Palacio de Congresos Kursaal",
    direccion: "Av. de Zurriola, 1, 20002 Donostia-San Sebastián",
    ciudad: "San Sebastián",
    pais: "España",
    precio: "10€",
    aforo: 300,
    organizador: "CannaCup Ibérica",
    destacado: true,
  },
  {
    id: "8",
    slug: "taller-extraccion-hash-rosin-zaragoza-julio-2025",
    titulo: "Taller de extracción: hash rosin sin disolventes",
    descripcion:
      "Aprende a hacer rosin de calidad en casa con una plancha de calor. Técnicas de lavado en agua helada, temperaturas óptimas y conservación del extracto.",
    contenido: `**Extracción sin disolventes: el arte del rosin**

El rosin es uno de los extractos más puros que puedes hacer en casa: sin butano, sin CO2, sin disolventes de ningún tipo. Solo calor y presión aplicados con precisión. Este taller te enseña todo el proceso desde el principio.

**¿Qué es el rosin?**

El rosin es la resina extraída mecánicamente del material vegetal o del hash mediante una prensa de calor. El resultado es un concentrado transparente o ámbar con alto contenido en cannabinoides y terpenos intactos.

**Lavado en agua helada (bubble hash)**

Antes de prensar, aprenderás a hacer bubble hash: separar las cabezas de los tricomas con agua helada y bolsas de malla de distintos micrones. Este primer concentrado es la materia prima ideal para el rosin de calidad.

**Temperaturas y presión**

La temperatura es el factor más crítico: demasiado calor destruye terpenos, muy poca y el rendimiento cae. Veremos los rangos óptimos según el tipo de material y cómo ajustar la presión de la plancha.

**Conservación**

El rosin se degrada con la luz, el calor y el oxígeno. Aprenderás a conservarlo en papel de silicona, en frío, y cuánto tiempo dura en óptimas condiciones.

**Plazas muy limitadas**

Máximo 8 personas para que todos puedan participar activamente. El precio incluye el material de la práctica y una muestra del resultado.`,
    categoria: "taller",
    fecha: "2025-07-19",
    horaInicio: "10:00",
    horaFin: "13:00",
    lugar: "Club Cannábico Delta",
    direccion: "Calle Predicadores 12, 50003 Zaragoza",
    ciudad: "Zaragoza",
    pais: "España",
    precio: "30€",
    aforo: 8,
    organizador: "Club Cannábico Delta",
    contacto: "delta.zaragoza@proton.me",
  },
];

export const CATEGORIA_EVENTO_LABEL: Record<EventoCategoria, string> = {
  feria: "Feria / Expo",
  taller: "Taller",
  ponencia: "Ponencia",
  social: "Social",
  activismo: "Activismo",
  online: "Online",
};

export const CATEGORIA_EVENTO_COLOR: Record<EventoCategoria, string> = {
  feria: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  taller: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  ponencia: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  social: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200",
  activismo: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  online: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
};
