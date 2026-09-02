export interface FeaturedVideoItem {
  id: string;
  title: string;
  thumbnail?: string;
}

export interface SiteSettings {
  // HERO & PORTADA
  heroTitleLine1: string;
  heroTitleHighlight1: string;
  heroTitleLine2: string;
  heroTitleHighlight2: string;
  heroPurpose: string;
  heroVideoId: string;
  heroButtonPrimaryText: string;
  heroButtonPrimaryLink: string;
  heroButtonSecondaryText: string;
  heroButtonSecondaryLink: string;

  // EL DESAFÍO / MISIÓN
  missionEyebrow: string;
  missionTitle: string;
  missionTitleHighlight: string;
  missionText: string;
  missionQuote: string;
  missionImage: string;

  // MULTIMEDIA DE PORTADA (3 videos)
  featuredVideos: FeaturedVideoItem[];

  // CANALES Y CONTACTO
  whatsappNumber: string;
  whatsappMessage: string;
  linkedinUrl: string;
  spotifyUrl: string;
  contactEmail: string;

  // FOOTER & BRANDING
  footerMotto: string;
  footerDescription: string;
  footerCopyright: string;

  updatedAt?: any;
}

export const defaultSiteSettings: SiteSettings = {
  // HERO & PORTADA
  heroTitleLine1: 'Narrativas que generan',
  heroTitleHighlight1: 'confianza.',
  heroTitleLine2: 'Estrategias que movilizan',
  heroTitleHighlight2: 'personas.',
  heroPurpose: 'En un entorno saturado, ayudamos a organizaciones a transformar conocimiento, propósito y estrategia en narrativas capaces de generar comprensión, participación y acción.',
  heroVideoId: '0DmyalU2zL4',
  heroButtonPrimaryText: 'INSIGHTS',
  heroButtonPrimaryLink: '/blog',
  heroButtonSecondaryText: 'NUESTRA MIRADA',
  heroButtonSecondaryLink: '#mission',

  // EL DESAFÍO / MISIÓN
  missionEyebrow: 'EL DESAFÍO',
  missionTitle: 'Articular',
  missionTitleHighlight: 'Realidades.',
  missionText: 'Las organizaciones enfrentan un desafío cada vez mayor: comunicar en medio de la saturación informativa, construir confianza en entornos complejos y conectar sus objetivos de negocio con las expectativas de una sociedad que exige coherencia, transparencia e impacto.',
  missionQuote: 'No creemos en comunicar por comunicar. Creemos en construir conversaciones que ayuden a generar valor para los negocios, la sociedad y el planeta.',
  missionImage: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/01_articular_realidades.png',

  // MULTIMEDIA DE PORTADA
  featuredVideos: [
    { id: '0DmyalU2zL4', title: 'HAY FESTIVAL: Diálogos de Cambio' },
    { id: 'VzQC-PPZmKQ', title: 'Conferencia: Narrativas que Movilizan' },
    { id: 'JhQ_EpuoiOQ', title: 'Estrategia de Comunicación Responsable' }
  ],

  // CANALES Y CONTACTO
  whatsappNumber: '573162809797',
  whatsappMessage: 'Hola Ángela, vi tu bitácora y me gustaría conversar sobre regeneración y comunicación.',
  linkedinUrl: 'https://www.linkedin.com/in/angelamgomezd/?skipRedirect=true',
  spotifyUrl: 'https://open.spotify.com/show/4fIwE8OUNlJkszY6XQZcO5',
  contactEmail: 'angelamgomez@gmail.com',

  // FOOTER & BRANDING
  footerMotto: 'Narrativas. Confianza. Participación. Impacto.',
  footerDescription: 'Laboratorio estratégico y editorial que ayuda a transformar conocimiento, propósito y estrategia en narrativas capaces de generar comprensión y acción.',
  footerCopyright: 'THE OTHER NARRATIVE | NARRATIVAS QUE GENERAN CONFIANZA.'
};

/**
 * Extrae el ID de un video de YouTube a partir de una URL completa o ID directo.
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  
  // Si ya es un ID de 11 caracteres sin diagonales ni signos
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : trimmed;
}
