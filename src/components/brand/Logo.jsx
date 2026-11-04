import lockup from '../../assets/brand/transt-lockup.png';
import mark from '../../assets/brand/transt-mark.png';

/**
 * The official TRANST logo (cropped from the supplied asset, background removed).
 * Never recolour, redraw or stretch it — only `height` is configurable; width follows the
 * intrinsic aspect ratio. Use on light surfaces (cream / secondary cream) only.
 */
const RATIO = { lockup: 702 / 235, mark: 237 / 235 };

export default function Logo({ variant = 'lockup', height = 32, className, alt = 'TRANST' }) {
  const src = variant === 'mark' ? mark : lockup;
  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={Math.round(height * RATIO[variant])}
      className={className}
      style={{ height, width: 'auto' }}
      draggable={false}
      decoding="async"
    />
  );
}
