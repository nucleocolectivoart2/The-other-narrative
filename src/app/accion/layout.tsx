
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Capítulo 03: Traducción Operativa',
  description: 'Llevando la sostenibilidad al muelle de carga: endomarketing, logística y finanzas con propósito.',
};

export default function AccionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
