import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  /** Called once the curtain animation has finished. */
  onComplete: () => void;
  /** Minimum time the curtain stays up, in ms. */
  minDuration?: number;
}

const BRAND_LINES = ['H', 'O', 'R', 'I', 'Z', 'O', 'N'];

/**
 * Premium loading curtain.
 *
 * Progress is driven by the real `window.load` event (with a gentle simulated
 * ramp so the bar never stalls), and the curtain always releases — even if an
 * asset hangs — so the site can never be trapped behind it.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete, minDuration = 900 }) => {
  const [progress, setProgress] = useState(6);
  const startRef = useRef(Date.now());
  const completedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let loaded = document.readyState === 'complete';

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      const elapsed = Date.now() - startRef.current;
      const wait = Math.max(0, minDuration - elapsed);
      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(onComplete, 620);
      }, wait);
    };

    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    const tick = () => {
      setProgress((current) => {
        const ceiling = loaded ? 100 : 88;
        const next = current + (ceiling - current) * 0.06 + 0.35;
        if (next >= ceiling) {
          if (loaded) finish();
          return ceiling;
        }
        return next;
      });
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    // Hard safety valve — never block the site longer than 4.5s.
    const failsafe = window.setTimeout(finish, 4500);

    return () => {
      window.removeEventListener('load', onLoad);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, [minDuration, onComplete]);

  const rounded = Math.min(100, Math.round(progress));

  return (
    <motion.div
      id="preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading Horizon Estates"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center wash-ink"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="relative flex flex-col items-center px-8">
        {/* Monogram */}
        <div className="mb-8 flex items-end gap-[5px]" aria-hidden="true">
          {BRAND_LINES.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className="preloader-bar w-[3px] origin-bottom rounded-t-[2px] bg-gold-400"
              style={{ height: `${26 + (index % 3) * 9}px`, animationDelay: `${index * 0.09}s` }}
            />
          ))}
        </div>

        <div className="preloader-fade text-center">
          <p className="font-brand text-[15px] font-bold tracking-[0.42em] text-bone-100">
            HORIZON
          </p>
          <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-400">
            Estates · India
          </p>
        </div>

        {/* Progress rail */}
        <div className="relative mt-10 h-[2px] w-[220px] overflow-hidden bg-bone-100/15 sm:w-[280px]">
          <div
            className="preloader-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold-300 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 bg-gold-400 transition-[width] duration-200 ease-out"
            style={{ width: `${rounded}%` }}
          />
        </div>

        <div className="mt-4 flex w-[220px] items-center justify-between sm:w-[280px]">
          <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-bone-400">
            Curating residences
          </span>
          <span className="font-brand text-[11px] font-bold tabular-nums text-bone-200">
            {String(rounded).padStart(3, '0')}
          </span>
        </div>
      </div>

      <span className="sr-only">{`Loading ${rounded}%`}</span>
    </motion.div>
  );
};
