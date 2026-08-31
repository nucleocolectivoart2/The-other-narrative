import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proyectos & Casos de Éxito',
  description: 'Portafolio técnico de The Other Narrative: Estrategias, comunicación y regeneración en acción.',
};

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
