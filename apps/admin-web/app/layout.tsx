import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SideNav, BottomNav } from './nav';
import { SwRegister } from './sw-register';

export const metadata: Metadata = {
  title: 'M-Inventory',
  description: 'Hospitality inventory management',
  manifest: '/manifest.webmanifest',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0f766e' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <SideNav />
          <main className="main">{children}</main>
        </div>
        <BottomNav />
        <SwRegister />
      </body>
    </html>
  );
}
