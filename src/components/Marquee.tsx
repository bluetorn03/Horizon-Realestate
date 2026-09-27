import React from 'react';

interface MarqueeProps {
  items: React.ReactNode[];
  /** Seconds for one full loop. */
  duration?: number;
  direction?: 'left' | 'right';
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  pauseOnHover?: boolean;
}

/**
 * Modern infinite marquee.
 *
 * The track holds two identical copies of the content and translates by -50%,
 * so the loop is seamless with no layout jump. Purely CSS driven (compositor
 * only) and fully disabled under `prefers-reduced-motion`.
 */
export const Marquee: React.FC<MarqueeProps> = ({
  items,
  duration = 34,
  direction = 'left',
  className = '',
  itemClassName = '',
  separator,
  pauseOnHover = true,
}) => {
  const sequence = (
    <>
      {items.map((item, index) => (
        <React.Fragment key={`item-${index}`}>
          <span className={`inline-flex items-center ${itemClassName}`}>{item}</span>
          {separator ? (
            <span className="inline-flex items-center opacity-50" aria-hidden="true">
              {separator}
            </span>
          ) : null}
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div
      className={`marquee-mask relative overflow-hidden ${className}`}
      data-pause-on-hover={pauseOnHover ? 'true' : 'false'}
      data-cursor="hover"
    >
      <div
        className="marquee-track"
        data-direction={direction}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{sequence}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {sequence}
        </div>
      </div>
    </div>
  );
};
