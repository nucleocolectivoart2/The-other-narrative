
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bitácora Abierta',
  description: 'Crónicas, preguntas y reflexiones para habitar la regeneración desde la verdad organizacional.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
