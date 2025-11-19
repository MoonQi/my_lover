import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SWRProvider } from '@/components/providers/SWRProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '我们的纪念日 - Anniversary Calendar',
  description: '记录和珍藏我们的每一个美好时刻，用爱筑就的时光时间轴。A beautiful timeline for our relationship milestones.',
  keywords: ['纪念日', '情侣', '时间轴', 'anniversary', 'relationship', 'milestones', 'timeline'],
  authors: [{ name: 'Anniversary Calendar' }],
  creator: 'Anniversary Calendar',
  openGraph: {
    title: '我们的纪念日 - Anniversary Calendar',
    description: '记录和珍藏我们的每一个美好时刻',
    url: 'https://anniversary-calendar.app',
    siteName: '我们的纪念日',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '我们的纪念日',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '我们的纪念日 - Anniversary Calendar',
    description: '记录和珍藏我们的每一个美好时刻',
    images: ['/og-image.png'],
  },
  robots: {
    index: false, // Privacy: Don't index personal anniversary calendars
    follow: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#fce7f3" />
      </head>
      <body className={inter.className}>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
