import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'TripMadly | AI Travel Planner',
  description: 'Visual. Smart. Personalized. Generate your dream trip in seconds.',
  applicationName: 'TripMadly',
  appleWebApp: {
    title: 'TripMadly',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body suppressHydrationWarning className="font-outfit antialiased">

        {/* ✅ Structured Data (SAFE ADDITION) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TripMadly",
              url: "https://tripmadly.com",
            }),
          }}
        />

        {children}

      </body>
    </html>
  );
}