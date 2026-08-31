
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capítulo 01: Conciencia',
  description: 'La verdad como punto de partida: honestidad radical sin filtros en la comunicación para la sostenibilidad.',
};

export default function ConcienciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
