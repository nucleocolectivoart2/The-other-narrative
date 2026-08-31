
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hablemos',
  description: 'Inicia una conversación honesta para transformar el impacto de tu organización.',
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
