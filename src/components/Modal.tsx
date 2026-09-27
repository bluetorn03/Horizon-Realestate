import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  /** `id` of the element that labels the dialog. */
  labelledBy?: string;
  /** Convenience: `titleId` of the `ModalHeader` rendered inside. */
  titleId?: string;
  size?: ModalSize;
  /** Optional id applied to the panel element (used by e2e hooks). */
  id?: string;
  /** Hide the built-in close button when the header supplies its own. */
  showCloseButton?: boolean;
  className?: string;
}

/**
 * Accessible overlay shell shared by every dialog in the app.
 *
 * Handles Escape-to-close, backdrop dismissal, background scroll locking and
 * initial focus so no individual modal has to re-implement that behaviour.
 */
export const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  labelledBy,
  titleId,
  size = 'md',
  id,
  showCloseButton = true,
  className = '',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useScrollLock(true);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Move focus into the dialog without stealing it from assistive tech.
    const frame = requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        '[data-autofocus], button, [href], input, select, textarea',
      );
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-950/80 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId ?? labelledBy}
        className={`modal-panel relative my-auto flex max-h-[92svh] w-full flex-col overflow-hidden rounded-2xl border border-bone-300/70 bg-white shadow-lux-lg ${SIZES[size]} ${className}`}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-ink-950"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  titleId: string;
  subtitle?: string;
  tone?: 'light' | 'ink';
  children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  icon: Icon,
  title,
  titleId,
  subtitle,
  tone = 'light',
  children,
}) => {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b px-6 py-4 ${
        tone === 'ink'
          ? 'wash-ink border-bone-100/10 text-bone-50'
          : 'border-bone-200 bg-bone-100/60'
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon className="h-5 w-5 shrink-0 text-gold-600" /> : null}
          <h2 id={titleId} className="truncate font-display text-base font-bold sm:text-lg">
            {title}
          </h2>
        </div>
        {subtitle ? (
          <p className={`mt-1 text-xs ${tone === 'ink' ? 'text-bone-400' : 'text-bone-500'}`}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
};
