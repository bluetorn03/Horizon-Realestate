import React from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

type Variant = 'gold' | 'ink' | 'outline' | 'ghost';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  gold: 'bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-lux-md hover:shadow-lux-lg',
  ink: 'bg-ink-900 text-bone-50 hover:bg-ink-800 shadow-lux-md hover:shadow-lux-lg',
  outline:
    'border border-ink-900/25 text-ink-900 hover:border-gold-500 hover:text-gold-600 bg-transparent',
  ghost: 'text-ink-700 hover:text-gold-600 bg-transparent',
};

const SIZES = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-[13px]',
};

/**
 * Premium magnetic CTA.
 *
 * The whole button leans toward the cursor while its label travels a little
 * further, producing the "expensive" pull used across the site. Movement is
 * written as CSS custom properties so React never re-renders on pointer move.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  magnetic = true,
  className = '',
  ...rest
}) => {
  const ref = useMagnetic<HTMLButtonElement>({ strength: 13, labelStrength: 6 });

  return (
    <button
      ref={magnetic ? ref : undefined}
      className={`magnetic group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-md font-bold uppercase tracking-[0.18em] transition-colors duration-300 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      <span className="magnetic-label relative z-10 inline-flex items-center gap-2.5">
        {children}
      </span>
    </button>
  );
};
