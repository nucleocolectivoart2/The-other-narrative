export interface SpotifyShow {
  id: string;
  name: string;
  url: string;
  image: string;
  description: string;
}

export const spotifyShows: SpotifyShow[] = [
  {
    id: "033PCu2aysmpjGuazxZ0Oz",
    name: "The Other Narrative",
    url: "https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1f118b74d043976031011e2bda",
    description: "Periodismo de soluciones, regeneración e innovación conducido por Ángela María Gómez."
  },
  {
    id: "4fIwE8OUNlJkszY6XQZcO5",
    name: "Planeta Sostenible",
    url: "https://open.spotify.com/show/4fIwE8OUNlJkszY6XQZcO5",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1fe9dc719e69a6ab1da9d7bda7",
    description: "Pacto Global Red Colombia y URosario Radio. Visibilizando el liderazgo empresarial y el desarrollo regenerativo."
  }
];

export interface PodcastEpisode {
  id: string;
  showId?: string;
  showName?: string;
  title: string;
  description: string;
  url: string;
  image: string;
  guest?: string;
  category?: string;
  date?: string;
}

export const spotifyPodcasts: PodcastEpisode[] = [
  // --- The Other Narrative (https://open.spotify.com/show/033PCu2aysmpjGuazxZ0Oz) ---
  {
    id: "6WBH5WFfaOkk9FlFQmFJxR",
    showId: "033PCu2aysmpjGuazxZ0Oz",
    showName: "The Other Narrative",
    title: "2. Economía circular sobre ruedas",
    description: "The Other Narrative con Ángela María Gómez: Exploramos cómo la economía circular, la regeneración y la innovación están transformando la movilidad, la industria y la gestión de recursos hacia modelos de valor compartido.",
    url: "https://open.spotify.com/episode/6WBH5WFfaOkk9FlFQmFJxR",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1fb0fe15baf1aa424669faf50e",
    guest: "Ángela María Gómez",
    category: "The Other Narrative"
  },
  {
    id: "32yg7Fv9CqoKTgewQvNbkh",
    showId: "033PCu2aysmpjGuazxZ0Oz",
    showName: "The Other Narrative",
    title: "1. Construir futuro desde la salud visual",
    description: "En el episodio debut de The Other Narrative, analizamos el periodismo de soluciones, la salud visual y el impacto social transformador en las comunidades y territorios.",
    url: "https://open.spotify.com/episode/32yg7Fv9CqoKTgewQvNbkh",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1f5fa13f574dfdaa787e5a5049",
    guest: "Ángela María Gómez",
    category: "The Other Narrative"
  },

  // --- Planeta Sostenible (https://open.spotify.com/show/4fIwE8OUNlJkszY6XQZcO5) ---
  {
    id: "40cX72MuwvaXMijBIxFdoa",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Licencia social, cuando la confianza define el futuro de un proyecto",
    description: "¿Qué pasa cuando una empresa tiene el capital, la tecnología y los permisos legales… pero la comunidad le dice NO? En este episodio hablamos sobre un concepto vital pero muchas veces incomprendido: la licencia social para operar. Con Felipe Montes, experto en regeneración y relacionamiento territorial, analizamos por qué la confianza de las comunidades es un factor crítico para la viabilidad de cualquier proyecto.",
    url: "https://open.spotify.com/episode/40cX72MuwvaXMijBIxFdoa",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1f23606b1b49fa47471f99484d",
    guest: "Felipe Montes",
    category: "Planeta Sostenible"
  },
  {
    id: "1OgqmFFPhsM6vS9VA1Q55s",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Impuestos con Impacto: Caso Aris Mining",
    description: "En este episodio de Planeta Sostenible, conversamos sobre un mecanismo que está transformando la relación entre el sector privado y los territorios en Colombia: Obras por Impuestos. A través del caso de éxito de Aris Mining, analizamos cómo este modelo va más allá del cumplimiento tributario para convertirse en una herramienta de cierre de brechas sociales.",
    url: "https://open.spotify.com/episode/1OgqmFFPhsM6vS9VA1Q55s",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f4564759b0f62ec677cc136e2",
    guest: "Aris Mining",
    category: "Planeta Sostenible"
  },
  {
    id: "5F36oTabmfSIA4sAtJJ44W",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Latidos del Manglar: Historias que se tejen en el corazón azul del Urabá Antioqueño",
    description: "Sumérgete en un viaje sonoro hacia uno de los ecosistemas más vitales y amenazados de Colombia: el manglar del Urabá antioqueño. En este episodio descubrimos cómo las comunidades locales, junto con organizaciones ambientales, están trabajando para conservar y restaurar este tesoro azul.",
    url: "https://open.spotify.com/episode/5F36oTabmfSIA4sAtJJ44W",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1fe9dc719e69a6ab1da9d7bda7",
    guest: "Comunidades de Urabá",
    category: "Planeta Sostenible"
  },
  {
    id: "12FVoWZvTWUrQEePWpmI7z",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Regenerar el futuro: biodiversidad, comunidades y propósito en Natura",
    description: "Una conversación inspiradora y práctica sobre cómo llevar la regeneración del discurso a la implementación real, construyendo modelos empresariales más responsables, medibles y coherentes con los desafíos del planeta.",
    url: "https://open.spotify.com/episode/12FVoWZvTWUrQEePWpmI7z",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1fa3d4b5b93e45af77221c9dd0",
    guest: "Natura",
    category: "Planeta Sostenible"
  },
  {
    id: "2wpTowFWqAtVAcxBfU1Z0O",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Ciudades regenerativas y el rol de los centros comerciales en el futuro urbano",
    description: "Los centros comerciales ya no son solo lugares de consumo; son espacios de encuentro y convivencia en el corazón de nuestras ciudades. Analizamos cómo están integrando prácticas regenerativas, desde la eficiencia energética hasta la gestión de recursos y el impacto social.",
    url: "https://open.spotify.com/episode/2wpTowFWqAtVAcxBfU1Z0O",
    image: "https://image-cdn-ak.spotifycdn.com/image/ab67656300005f1fe9dc719e69a6ab1da9d7bda7",
    guest: "Líderes de Regeneración Urbana",
    category: "Planeta Sostenible"
  },
  {
    id: "6AJ7XZvyRcyofKHDJERTUV",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Plásticos y regeneración: Conversación para avanzar hacia la economía circular",
    description: "El plástico está en el centro de uno de los debates más incómodos y necesarios de la regeneración y el cuidado planetario. ¿Es realmente el problema o parte de la solución? Abrimos una conversación que va más allá de los discursos para entender cómo avanzar hacia una economía circular real.",
    url: "https://open.spotify.com/episode/6AJ7XZvyRcyofKHDJERTUV",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f0d83a7dcd718c8660d152e06",
    guest: "Expertos en Economía Circular",
    category: "Planeta Sostenible"
  },
  {
    id: "5GIb3ApwX9kb3fA85cnL0A",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "El pensamiento, la empresa y la regeneración",
    description: "Un episodio especial grabado desde la Feria del Libro de Bogotá. Una mesa de trabajo con Juan Camilo Pinzón y Mauricio López para conversar sobre cómo conectar la regeneración con el rumbo del país y el papel del pensamiento crítico en la transformación empresarial.",
    url: "https://open.spotify.com/episode/5GIb3ApwX9kb3fA85cnL0A",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1ff496b31be9ae4fd3aa43a8de",
    guest: "Juan Camilo Pinzón y Mauricio López",
    category: "Planeta Sostenible"
  },
  {
    id: "2mFE7bMUuakTUeO7kW2YUx",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "¿Es posible recuperar ecosistemas y transformar comunidades al mismo tiempo?",
    description: "Conversamos con Diana de la Vega, Directora de la Fundación Bahía y Ecosistemas de Colombia, quien lidera procesos de recuperación ambiental en Cartagena. Una historia sobre restauración de ecosistemas marinos, trabajo con comunidades eco-dependientes y soluciones climáticas desde el territorio.",
    url: "https://open.spotify.com/episode/2mFE7bMUuakTUeO7kW2YUx",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f6e488d572ba2979ff38e5ffb",
    guest: "Diana de la Vega",
    category: "Planeta Sostenible"
  },
  {
    id: "1ock5WdsnBTbBOcu56encS",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "¿Se puede desarrollar un territorio sin destruir su biodiversidad?",
    description: "Conversamos con Isabel Mathieu Barrios, Directora Ejecutiva de la Fundación Serena del Mar, sobre cómo este ambicioso proyecto en Cartagena está integrando desarrollo urbanístico, bienestar comunitario y protección de la naturaleza.",
    url: "https://open.spotify.com/episode/1ock5WdsnBTbBOcu56encS",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1ffffab89b0782628539bf1b42",
    guest: "Isabel Mathieu Barrios",
    category: "Planeta Sostenible"
  },
  {
    id: "6ibXZnbbYxvIR0WZNZISTu",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "Pilas con el ambiente: cuando los residuos se convierten en soluciones",
    description: "¿A dónde va una pila cuando se agota? Con Alberto Ladino Hernández, director de Pilas con el Ambiente - ANDI, entendemos cómo en Colombia más de 200 millones de pilas han sido recolectadas y transformadas en oportunidades productivas, mostrando que el impacto regenerativo empieza en los pequeños hábitos.",
    url: "https://open.spotify.com/episode/6ibXZnbbYxvIR0WZNZISTu",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1fc20997e65f3c126200589f92",
    guest: "Alberto Ladino Hernández",
    category: "Planeta Sostenible"
  },
  {
    id: "1QTktvCeMZmYxiHjKOExw6",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "La regeneración se construye desde la cultura, una conversación necesaria",
    description: "¿Y si el mayor reto de la regeneración no fuera técnico... sino cultural? La regeneración se construye desde lo que pensamos, valoramos y decidimos como sociedad. Hablamos de identidad, narrativas y la necesidad de transformar la forma en que imaginamos el mundo.",
    url: "https://open.spotify.com/episode/1QTktvCeMZmYxiHjKOExw6",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f8f5ea45088bfd34612a3ad12",
    guest: "Equipo Planeta Sostenible",
    category: "Planeta Sostenible"
  },
  {
    id: "72mDkJK9cuU41aYQtBfbfU",
    showId: "4fIwE8OUNlJkszY6XQZcO5",
    showName: "Planeta Sostenible",
    title: "¿El verdadero reto de la regeneración es técnico… o es de liderazgo?",
    description: "A pesar del conocimiento y las herramientas disponibles, seguimos fragmentados. Exploramos el tipo de liderazgo que el mundo necesita hoy: uno que no simplifique la realidad en bandos, que construya puentes y entienda que la regeneración es una decisión de acción.",
    url: "https://open.spotify.com/episode/72mDkJK9cuU41aYQtBfbfU",
    image: "https://image-cdn-fa.spotifycdn.com/image/ab67656300005f1f302dadfde5042c89a8b1a662",
    guest: "Víctor Hugo Malagón & Ángela Gómez",
    category: "Planeta Sostenible"
  }
];

