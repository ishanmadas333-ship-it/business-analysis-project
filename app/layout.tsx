import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Startup Sheild — See Your Business Before You Build It',
  description: 'AI-powered Business Feasibility and Decision Support Platform that analyzes a business idea, location, budget, market, competition, financial requirements, risks and scenarios before you invest.',
  keywords: [
    'business feasibility',
    'startup validator',
    'decision support',
    'financial calculator',
    'break-even analysis',
    'what-if simulator',
    'business plan generator'
  ],
  authors: [{ name: 'Startup Sheild' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
