
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capítulo 05: Maquillaje o Verdad',
  description: 'Cierre de la bitácora: La integridad organizacional como único valor innegociable en la sostenibilidad.',
};

export default function CoherenciaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
