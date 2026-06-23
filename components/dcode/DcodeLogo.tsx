import Image from 'next/image';
import { DCODE_BRAND } from '@/lib/dcode/brand';

// D'code wordmark. On the brand's dark theme we use the official white wordmark with
// the red dot (logoOnDark) so the brand red is preserved — the dark SVG would
// otherwise need inverting, which flattens the dot to white.
type DcodeLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function DcodeLogo({ className, priority }: DcodeLogoProps) {
  return (
    <Image
      src={DCODE_BRAND.logoOnDark}
      alt={`${DCODE_BRAND.name} logo`}
      width={2000}
      height={554}
      priority={priority}
      className={className}
    />
  );
}
