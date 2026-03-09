import type { Metadata } from 'next';
import { Inter, Noto_Sans_Telugu } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-telugu',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Srimaan Bhaskara Bharadwaja Astrology',
  description: 'రోజువారీ పంచాంగం, కుండలి, మరియు వివాహ సరిహద్దు',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#6366f1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te" className={`${inter.variable} ${notoSansTelugu.variable}`}>
      <body className={inter.className}>
        <AuthProvider>
          <AppProvider>
            <Navigation />
            <main className="min-h-screen bg-gray-50">{children}</main>
          </AppProvider>
        </AuthProvider>
        <Script id="service-worker-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/serviceWorker.js')
              .catch(function(err) { console.log('SW registration failed:', err); });
          }`}
        </Script>
      </body>
    </html>
  );
}
