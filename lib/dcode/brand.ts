import { mediaUrl } from '@/lib/mediaUrl';

// D'code brand identity. The brand uses its own black + red palette taken from the
// official D'code logo. On this standalone site the whole brand themes off these
// tokens (mirrored as CSS custom properties in assets/styles/globals.css).
//
// The red below (#E40614) is sampled from the official logo (public/logos) — this is
// the authoritative brand red, replacing the earlier #E30613 approximation.

export const dcodeAsset = (path: string) => mediaUrl(`/dcode/${path}`);
export const dcodeLogoAsset = (path: string) => mediaUrl(`/logos/${path}`);

export const DCODE_BRAND = {
  name: "D'code",
  // Dark, monochrome wordmark — used on light surfaces.
  logo: dcodeAsset('dcode-logo.svg'),
  // Official white wordmark + red dot — used on the brand's dark surfaces.
  logoOnDark: dcodeLogoAsset('logo-white-red-2000px.png'),
  colors: {
    black: '#0B0B0B',
    red: '#E40614',
    redHover: '#FF1F2D',
    white: '#FFFFFF',
    // Layered dark surfaces for depth on the cinematic theme.
    surface: '#111114',
    surfaceMuted: '#18181C',
    // Light "stage" — white products (e.g. the AC) sit on this so they read on dark.
    stage: '#F4F5F7',
    textPrimary: '#FAFAFA',
    textMuted: '#A1A1AA',
    textFaint: '#71717A',
  },
} as const;
