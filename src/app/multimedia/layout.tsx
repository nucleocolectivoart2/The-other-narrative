import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multimedia | The Other Narrative — Podcasts y proyectos audiovisuales',
  description: 'Escucha The Other Narrative, explora conversaciones sobre sostenibilidad e innovación y descubre proyectos audiovisuales y un archivo editorial de experiencias anteriores.',
  openGraph: {
    title: 'Multimedia | The Other Narrative — Ideas que conectan',
    description: 'Un ecosistema de podcasts, conversaciones y producciones audiovisuales que explora cómo las ideas, la colaboración y la innovación pueden transformar empresas, comunidades y territorios.',
    type: 'website',
    url: 'https://theothernarrative.co/multimedia',
    images: [
      {
        url: 'https://raw.githubusercontent.com/nucleocolectivoart2/The-other-narrative/main/img/banners/banners_05%20multimedia.png',
        width: 1200,
        height: 630,
        alt: 'Multimedia · The Other Narrative',
      },
    ],
  },
};

export default function MultimediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
