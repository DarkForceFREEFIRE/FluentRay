import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'V2Ray Configurator',
  description: 'WinUI Web Interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#1c1c1c] text-[#f3f3f3] antialiased">
      <body className="h-full font-sans select-none">{children}</body>
    </html>
  );
}