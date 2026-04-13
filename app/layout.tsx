import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'AI Travel Planner | Explore the Unseen',
  description: 'Visual. Smart. Personalized. Generate your dream trip in seconds.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body suppressHydrationWarning className="font-outfit antialiased">
        {children}
      </body>
    </html>
  );
}