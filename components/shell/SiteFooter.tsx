import { getTranslations } from 'next-intl/server';
import DcodeLogo from '@/components/dcode/DcodeLogo';
import type { Locale } from '@/i18n/routing';

// Slim, D'code-branded site footer: logo, tagline, and copyright.
export default async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Shell' });
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--dcode-border) bg-(--dcode-black)">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6 lg:px-10">
        <DcodeLogo className="h-7 w-auto" />
        <p className="text-sm text-(--dcode-text-muted)">{t('footerTagline')}</p>
        <p className="text-xs text-(--dcode-text-muted)">{t('footerRights', { year })}</p>
      </div>
    </footer>
  );
}
