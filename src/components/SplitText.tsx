import React from 'react';

interface SplitTextProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  /** `words` for editorial headings, `chars` for short display lines. */
  mode?: 'words' | 'chars';
  /** Stagger delay in seconds. */
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';
}

/**
 * Character / word level heading reveal.
 *
 * The split is performed in React (deterministic, no DOM mutation) and the
 * animation is owned by the GSAP ScrollTrigger layer which targets
 * `[data-split] span > span`. Content is fully readable before JS runs, so a
 * failed script can never leave invisible text behind.
 */
export const SplitText: React.FC<SplitTextProps> = ({
  text,
  mode = 'words',
  className = '',
  delay = 0,
  as = 'span',
  ...rest
}) => {
  const Component = as as React.ElementType;

  const chunks = React.useMemo(() => {
    if (mode === 'chars') return Array.from(text);
    return text.split(/(\s+)/).filter((chunk) => chunk.length > 0);
  }, [mode, text]);

  return React.createElement(
    Component,
    {
      'data-split': mode,
      'data-split-ready': 'true',
      'data-reveal-delay': delay,
      className,
      style: { display: 'inline-block', ...rest.style },
      ...rest,
    },
    chunks.map((chunk, index) => {
        if (/^\s+$/.test(chunk)) {
          return <React.Fragment key={`space-${index}`}>{chunk}</React.Fragment>;
        }
        return (
          <span key={`chunk-${index}`} className="inline-block overflow-hidden align-bottom">
            <span className="inline-block">{chunk}</span>
          </span>
        );
      }),
  );
};

interface RevealHeadingProps extends SplitTextProps {
  /** Accessible single-line label for screen readers. */
  label?: string;
}

/**
 * Heading with a word-level reveal. The plain text is exposed to assistive
 * technology through `aria-label` while the visual split remains decorative.
 */
export const RevealHeading: React.FC<RevealHeadingProps> = ({ label, text, ...rest }) => {
  return (
    <span className="inline-block">
      <span className="sr-only">{label ?? text}</span>
      <SplitText text={text} aria-hidden="true" {...rest} />
    </span>
  );
};
