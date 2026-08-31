
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capítulo 02: Construir sobre Realidades',
  description: 'Trayectoria técnica en entornos complejos: Pacto Global, Hub de Comunicación Responsable y COP16.',
};

export default function ExperienciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
