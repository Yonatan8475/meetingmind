import { Bebas_Neue, Outfit, DM_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
});

export const metadata = {
  title: 'MeetingMind — AI Meeting Intelligence',
  description: 'Multi-agent AI system that turns meeting transcripts into structured action items.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas.variable} ${outfit.variable} ${dmMono.variable}`}>
      <body>
        <Header />
        <main className="max-w-[1400px] mx-auto px-12 py-12 pb-24 max-sm:px-5">
          {children}
        </main>
      </body>
    </html>
  );
}
