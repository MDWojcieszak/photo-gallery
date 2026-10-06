import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuExpand } from 'react-icons/lu';
import { BlurImage } from '~/components/BlurImage';
import { apiUrl } from '~/config';
import { useResponsive } from '~/hooks/useResponsive';
import { PortfolioImage } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

const AUTOPLAY_MS = 6500;
const MAX_DOTS = 5;

const DESKTOP_SCRIM =
  'linear-gradient(90deg, rgba(12,12,14,0.9) 0%, rgba(12,12,14,0.55) 35%, rgba(12,12,14,0.15) 65%, rgba(12,12,14,0.35) 100%), linear-gradient(0deg, rgba(12,12,14,0.75) 0%, rgba(12,12,14,0) 40%)';
const MOBILE_SCRIM =
  'linear-gradient(0deg, rgba(12,12,14,0.94) 0%, rgba(12,12,14,0.7) 22%, rgba(12,12,14,0.15) 55%, rgba(12,12,14,0) 78%), linear-gradient(180deg, rgba(12,12,14,0.45) 0%, rgba(12,12,14,0) 20%)';

type HeroProps = {
  images: PortfolioImage[];
  onOpen?: (image: PortfolioImage) => void;
  /** Called once the first photo is decoded and on screen. */
  onReady?: () => void;
  /** False while an opening curtain covers the page — the text makes its entrance after. */
  entered?: boolean;
};

export const Hero = ({ images, onOpen, onReady, entered = true }: HeroProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  // Index of the slide on screen; null until the first photo is decoded.
  const [active, setActive] = useState<number | null>(null);
  const decoded = useRef(new Set<string>());
  const request = useRef(0);

  const count = images.length;

  /** Download + decode a slide's photo so it can appear fully sharp, with no blur stage. */
  const preload = useCallback((img: PortfolioImage | undefined): Promise<void> => {
    const src = img && apiUrl(img.coverUrl);
    if (!src || decoded.current.has(src)) return Promise.resolve();
    const el = new Image();
    el.src = src;
    return el
      .decode()
      .catch(() => undefined)
      .then(() => {
        decoded.current.add(src);
      });
  }, []);

  /** Switch only once the target photo is ready; a newer request wins over an older one. */
  const goTo = useCallback(
    (i: number) => {
      const token = ++request.current;
      preload(images[i]).then(() => {
        if (token === request.current) setActive(i);
      });
    },
    [images, preload],
  );

  useEffect(() => {
    if (count) goTo(0);
    else setActive(null);
  }, [count, goTo]);

  // Autoplay: warm the next photo right away, advance when its time comes and it's ready.
  useEffect(() => {
    if (active === null || count <= 1) return;
    const next = (active + 1) % count;
    preload(images[next]);
    const id = window.setTimeout(() => goTo(next), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [active, count, images, preload, goTo]);

  const current = active === null ? undefined : images[active];

  const shown = active !== null;
  useEffect(() => {
    if (shown) onReady?.();
  }, [shown, onReady]);
  const dots = Math.min(count, MAX_DOTS);

  const open = useCallback(() => {
    if (current && onOpen) onOpen(current);
  }, [current, onOpen]);

  return (
    <section style={styles.hero}>
      <div style={styles.media}>
        <AnimatePresence>
          {current && (
            <motion.div
              key={current.imageId}
              style={styles.slide}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1 }, scale: { duration: 7, ease: 'linear' } }}
            >
              <BlurImage
                cover={current.coverUrl}
                lowRes={current.lowResUrl}
                priority
                style={{ backgroundColor: 'transparent' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ ...styles.scrim, background: isMobile ? MOBILE_SCRIM : DESKTOP_SCRIM }} />
      </div>

      <div style={{ ...styles.content, ...(isMobile ? styles.contentMobile : {}) }}>
        <motion.h1
          style={{ ...styles.title, fontSize: isMobile ? 'clamp(44px, 15vw, 72px)' : 'clamp(64px, 7vw, 120px)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={entered ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          Selected
          <br />
          Work
        </motion.h1>

        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: entered ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Light remembers what time forgets.
        </motion.p>

        {current && onOpen && (
          <motion.button
            style={styles.fullscreen}
            onClick={open}
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            whileHover={{ color: theme.colors.text }}
          >
            <LuExpand size={15} style={{ marginRight: 10 }} /> View Fullscreen
          </motion.button>
        )}

        {dots > 1 && (
          <motion.div
            style={{ ...styles.dots, flexDirection: isMobile ? 'row' : 'column' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: entered ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {Array.from({ length: dots }).map((_, i) => (
              <button key={i} style={styles.dotBtn} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}>
                <span style={{ ...styles.dotNum, color: i === active ? theme.colors.text : theme.colors.textFaint }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ ...styles.dotLine, width: i === active ? 26 : 10, opacity: i === active ? 1 : 0.3 }} />
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

const useStyles = mkUseStyles((t) => ({
  hero: {
    position: 'relative',
    width: '100%',
    height: '100svh',
    minHeight: 560,
    overflow: 'hidden',
    backgroundColor: t.colors.ink,
  },
  media: {
    position: 'absolute',
    inset: 0,
  },
  slide: {
    position: 'absolute',
    inset: 0,
  },
  scrim: {
    position: 'absolute',
    inset: 0,
  },
  content: {
    position: 'absolute',
    left: 'clamp(20px, 5vw, 56px)',
    top: '50%',
    transform: 'translateY(-50%)',
    maxWidth: 620,
    zIndex: 2,
  },
  contentMobile: {
    top: 'auto',
    transform: 'none',
    bottom: 'clamp(48px, 11vh, 110px)',
    right: 'clamp(20px, 5vw, 56px)',
    maxWidth: '100%',
  },
  title: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    lineHeight: 0.98,
    letterSpacing: '-0.01em',
    color: t.colors.text,
  },
  subtitle: {
    fontFamily: t.fonts.sans,
    fontWeight: 300,
    fontSize: 'clamp(13px, 1.4vw, 16px)',
    color: t.colors.textMuted,
    lineHeight: 1.7,
    marginTop: t.spacing.l,
  },
  fullscreen: {
    marginTop: t.spacing.l,
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: 0,
    color: t.colors.textMuted,
    fontFamily: t.fonts.sans,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
  },
  dots: {
    display: 'flex',
    gap: t.spacing.sm,
    marginTop: t.spacing.xl,
    zIndex: 2,
  },
  dotBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'none',
    border: 'none',
    padding: 0,
  },
  dotNum: {
    fontSize: 11,
    letterSpacing: '0.12em',
    fontVariantNumeric: 'tabular-nums',
  },
  dotLine: {
    height: 1,
    backgroundColor: t.colors.text,
    transition: 'width 0.4s, opacity 0.4s',
  },
}));
