import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'The Other Narrative | Narrativas. Confianza. Participación. Impacto.',
    template: '%s | The Other Narrative'
  },
  description: 'Laboratorio estratégico y editorial: transformamos conocimiento, propósito y estrategia en narrativas que generan confianza y movilizan personas.',
  openGraph: {
    title: 'The Other Narrative',
    description: 'Narrativas que generan confianza. Estrategias que movilizan personas.',
    type: 'website',
    locale: 'es_CO',
    url: 'https://theothernarrative.co',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20 bg-background overflow-x-hidden">
        <FirebaseClientProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}