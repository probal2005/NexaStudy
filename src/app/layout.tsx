import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

import './globals.css';
import { Providers } from '@/components/ui/Providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const faviconSvg = encodeURIComponent(`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
  >
    <rect
      width="32"
      height="32"
      rx="7"
      fill="#4F46E5"
    />
    <text
      x="50%"
      y="55%"
      dominant-baseline="middle"
      text-anchor="middle"
      font-family="system-ui, -apple-system, sans-serif"
      font-size="18"
      font-weight="700"
      fill="white"
    >
      N
    </text>
  </svg>
`);

export const metadata: Metadata = {
  title: {
    default: 'NexaStudy - Complete Student Workspace',
    template: '%s | NexaStudy',
  },

  description:
    'NexaStudy is a complete student productivity and academic workspace for managing study, tasks, notes, assignments, attendance, exams, files, and more.',

  applicationName: 'NexaStudy',

  keywords: [
    'NexaStudy',
    'student dashboard',
    'student productivity',
    'study planner',
    'academic workspace',
    'student tools',
    'student productivity dashboard',
    'study management',
  ],

  authors: [
    {
      name: 'NexaStudy',
    },
  ],

  creator: 'NexaStudy',
  publisher: 'NexaStudy',

  icons: {
    icon: [
      {
        url: `data:image/svg+xml,${faviconSvg}`,
        type: 'image/svg+xml',
      },
    ],
  },

  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#4F46E5',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}