import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import '@/assets/styles/globals.css';
import Analytics from '@/components/seo/Analytics';

// Root layout sets the html lang/dir attributes based on resolved locale and applies global styles.

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = (await getLocale()) ?? 'fa';
  const direction = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="bg-(--background-color) text-(--default-black-font)">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
