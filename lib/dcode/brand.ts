import { mediaUrl } from '@/lib/mediaUrl';

// D'code brand identity. The brand uses its own black + red palette (taken from the
// D'code logo). On this standalone site the whole brand themes off these tokens.
//
// NOTE: the red below is an approximation of the logo red — verify against the
// official D'code brand guideline before launch.

export const dcodeAsset = (path: string) => mediaUrl(`/dcode/${path}`);

export const DCODE_BRAND = {
  name: "D'code",
  logo: dcodeAsset('dcode-logo.svg'),
  colors: {
    black: '#0B0B0B',
    red: '#E30613',
    white: '#FFFFFF',
    // Supporting neutrals for surfaces/borders on the dcode pages.
    surface: '#0B0B0B',
    surfaceMuted: '#161616',
    textPrimary: '#FFFFFF',
    textMuted: '#B3B3B3',
  },
} as const;
