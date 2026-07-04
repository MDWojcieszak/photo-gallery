import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { LuChevronLeft, LuChevronRight, LuInfo, LuMapPin, LuX } from 'react-icons/lu';
import { BlurImage } from '~/components/BlurImage';
import { useResponsive } from '~/hooks/useResponsive';
import { fetchImageMeta, formatCamera, formatExifSpecs, hasExif, ImageMeta, PortfolioImage } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

type LightboxProps = {
  images: PortfolioImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export const Lightbox = ({ images, index, onClose, onIndex }: LightboxProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const open = index !== null && !!images[index];
  const current = open ? images[index] : null;
  const count = images.length;

  const prev = useCallback(() => index !== null && onIndex((index - 1 + count) % count), [index, count, onIndex]);
  const next = useCallback(() => index !== null && onIndex((index + 1) % count), [index, count, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'i' || e.key === 'I') setShowInfo((s) => !s);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  useEffect(() => {
    setShowInfo(open ? !isMobile : false);
  }, [open, isMobile]);

  useEffect(() => {
    if (!current) return;
    setMeta(null);
    const controller = new AbortController();
    fetchImageMeta(current.imageId, controller.signal)
      .then(setMeta)
      .catch(() => undefined);
    return () => controller.abort();
  }, [current?.imageId]);

  const specs = current ? formatExifSpecs(current.exif) : '';
  const camera = current ? formatCamera(current.exif) : '';
  const showTech = !!(current && hasExif(current.exif) && (camera || current.exif.lens || specs));
  const date = meta?.dateTaken ?? current?.exif.takenAt ?? null;
  const dateLabel = date ? new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;
  const hasInfo = !!(current && (meta?.title || meta?.description || current.localization || dateLabel || showTech));

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          style={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            style={{ ...styles.topBar, padding: isMobile ? '8px 10px' : `${theme.spacing.m}px clamp(16px, 3vw, 32px)` }}
          >
            <span style={styles.counter}>
              {String((index ?? 0) + 1).padStart(2, '0')}{' '}
              <span style={styles.counterFaint}>/ {String(count).padStart(2, '0')}</span>
            </span>
            <div style={styles.topRight}>
              {hasInfo && (
                <button
                  style={{ ...styles.iconBtn, color: showInfo ? theme.colors.text : theme.colors.textMuted }}
                  onClick={() => setShowInfo((s) => !s)}
                  aria-label='Photo info'
                  aria-pressed={showInfo}
                >
                  <LuInfo size={isMobile ? 20 : 21} />
                </button>
              )}
              <button style={styles.iconBtn} onClick={onClose} aria-label='Close'>
                <LuX size={isMobile ? 22 : 22} />
              </button>
            </div>
          </div>

          {count > 1 && (
            <button
              style={{
                ...styles.nav,
                left: isMobile ? 6 : 'clamp(8px, 2vw, 28px)',
                width: isMobile ? 38 : 48,
                height: isMobile ? 38 : 48,
              }}
              onClick={prev}
              aria-label='Previous'
            >
              <LuChevronLeft size={isMobile ? 20 : 26} />
            </button>
          )}
          {count > 1 && (
            <button
              style={{
                ...styles.nav,
                right: isMobile ? 6 : 'clamp(8px, 2vw, 28px)',
                width: isMobile ? 38 : 48,
                height: isMobile ? 38 : 48,
              }}
              onClick={next}
              aria-label='Next'
            >
              <LuChevronRight size={isMobile ? 20 : 26} />
            </button>
          )}

          <div
            style={{
              ...styles.stage,
              padding: isMobile ? '44px 8px 12px' : 'clamp(56px, 8vh, 96px) clamp(24px, 6vw, 96px)',
            }}
            onClick={onClose}
          >
            <motion.div
              key={current.imageId}
              style={styles.imageWrap}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <BlurImage
                cover={current.coverUrl}
                lowRes={current.lowResUrl}
                alt={meta?.title ?? current.localization ?? ''}
                objectFit='contain'
                priority
                style={{ height: '100%', backgroundColor: 'transparent' }}
              />
            </motion.div>
          </div>

          <AnimatePresence>
            {showInfo && hasInfo && (
              <motion.div
                style={styles.infoPanel}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div
                  style={{ ...styles.infoInner, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 0 }}
                >
                  <div style={styles.infoLeft}>
                    {meta?.title && <span style={styles.title}>{meta.title}</span>}
                    <div style={styles.metaRow}>
                      {current.localization && (
                        <span style={styles.metaItem}>
                          <LuMapPin size={13} stroke={theme.colors.accentSoft} style={{ marginRight: 5 }} />
                          {current.localization}
                        </span>
                      )}
                      {dateLabel && <span style={styles.metaDim}>{dateLabel}</span>}
                      {meta?.author && <span style={styles.metaDim}>© {meta.author}</span>}
                    </div>
                    {meta?.description && <p style={styles.desc}>{meta.description}</p>}
                  </div>

                  {showTech && (
                    <div style={{ ...styles.tech, alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
                      {camera && <span style={styles.camera}>{camera}</span>}
                      {current.exif.lens && <span style={styles.lens}>{current.exif.lens}</span>}
                      {specs && <span style={styles.specs}>{specs}</span>}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const useStyles = mkUseStyles((t) => ({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    backgroundColor: 'rgba(9,9,11,0.97)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    flexDirection: 'column',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counter: {
    fontSize: 12,
    letterSpacing: '0.12em',
    color: t.colors.text,
    fontVariantNumeric: 'tabular-nums',
  },
  counterFaint: {
    color: t.colors.textFaint,
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.xs,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: t.colors.textMuted,
    display: 'flex',
    padding: t.spacing.xs,
    cursor: 'pointer',
  },
  nav: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 4,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(20,20,24,0.55)',
    color: t.colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  stage: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
  },
  imageWrap: {
    maxWidth: '100%',
    maxHeight: '100%',
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 4,
    padding: `clamp(40px, 10vh, 80px) clamp(16px, 4vw, 48px) clamp(16px, 3vh, 28px)`,
    background: 'linear-gradient(0deg, rgba(9,9,11,0.96) 0%, rgba(9,9,11,0.75) 55%, rgba(9,9,11,0) 100%)',
    pointerEvents: 'none',
  },
  infoInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    maxWidth: 1100,
    width: '100%',
    margin: '0 auto',
    pointerEvents: 'auto',
  },
  infoLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    maxWidth: 560,
  },
  title: {
    fontFamily: t.fonts.serif,
    fontSize: 22,
    color: t.colors.text,
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: t.spacing.m,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: t.colors.text,
  },
  metaDim: {
    fontSize: 12,
    color: t.colors.textFaint,
    letterSpacing: '0.02em',
  },
  desc: {
    fontSize: 13,
    lineHeight: 1.6,
    color: t.colors.textMuted,
    marginTop: 2,
  },
  tech: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  camera: {
    fontSize: 13,
    color: t.colors.text,
    letterSpacing: '0.02em',
  },
  lens: {
    fontSize: 12,
    color: t.colors.textMuted,
  },
  specs: {
    fontSize: 12,
    color: t.colors.textFaint,
    fontVariantNumeric: 'tabular-nums',
    marginTop: 2,
  },
}));
