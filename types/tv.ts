import { type StaticImageData } from 'next/image';

// Minimal shared media/locale primitives. In the parent (zarrinac) repo this file
// also carries the full Hisense TV catalog types; the standalone D'code site only
// needs the image + locale primitives that the D'code content model references.
export type ImageSource = StaticImageData | string;

export type Locale = 'en' | 'fa';
