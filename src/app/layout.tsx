import type {Metadata} from 'next';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

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
    <html lang="es" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
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