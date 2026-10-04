import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import Markdown from 'react-markdown';
import { useContactConfig } from '~/hooks/usePortfolio';
import { CONTACT_LOCALES } from '~/lib/portfolio';
import { useResponsive } from '~/hooks/useResponsive';
import { mkUseStyles, useTheme } from '~/utils/theme';

type PrivacyModalProps = {
  open: boolean;
  onClose: () => void;
  /** The visitor's locale — the notice they acknowledge. Other translations are read-only views. */
  locale: string;
};

export const PrivacyModal = ({ open, onClose, locale }: PrivacyModalProps) => {
  const [viewLocale, setViewLocale] = useState(locale);
  const { data, loading } = useContactConfig(viewLocale);
  const notice = data?.privacyNotice ?? '';
  const lang = data?.privacyNoticeLocale ?? data?.locale ?? viewLocale;

  // Every opening starts from the visitor's own language.
  useEffect(() => {
    if (open) setViewLocale(locale);
  }, [open, locale]);

  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open, onClose]);

  // Portal: keeps the dialog out of the consent <label> / <form> in the DOM.
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          style={{ ...styles.backdrop, padding: isMobile ? 0 : 'clamp(16px, 5vh, 56px) 16px' }}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            role='dialog'
            aria-modal='true'
            aria-label='Privacy notice'
            lang={lang}
            style={{
              ...styles.dialog,
              height: isMobile ? '100%' : 'auto',
              borderRadius: isMobile ? 0 : theme.borderRadius.large,
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={styles.bar}>
              {CONTACT_LOCALES.length > 1 ? (
                <div style={styles.langs} role='group' aria-label='Language'>
                  {CONTACT_LOCALES.map((l) => (
                    <button
                      key={l.code}
                      type='button'
                      aria-pressed={viewLocale === l.code}
                      onClick={() => setViewLocale(l.code)}
                      style={{
                        ...styles.lang,
                        color: viewLocale === l.code ? theme.colors.text : theme.colors.textFaint,
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              ) : (
                <span style={styles.eyebrow}>Privacy</span>
              )}
              <button ref={closeRef} type='button' style={styles.close} onClick={onClose} aria-label='Close'>
                <LuX size={20} />
              </button>
            </div>

            <div
              style={{ ...styles.scroll, opacity: loading ? 0.45 : 1, transition: 'opacity 0.2s' }}
              className='prose'
              aria-busy={loading}
            >
              <Markdown
                components={{
                  a: ({ href, children }) => (
                    <a href={href} {...(href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                      {children}
                    </a>
                  ),
                }}
              >
                {notice}
              </Markdown>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

const useStyles = mkUseStyles((t) => ({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9,9,11,0.82)',
    backdropFilter: 'blur(6px)',
  },
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 720,
    maxHeight: '100%',
    backgroundColor: t.colors.surface,
    overflow: 'hidden',
  },
  bar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: t.spacing.m,
    padding: `${t.spacing.sm}px ${t.spacing.sm}px ${t.spacing.sm}px clamp(24px, 4vw, 40px)`,
    backgroundColor: t.colors.surface02,
    flexShrink: 0,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  langs: {
    display: 'flex',
    gap: t.spacing.m,
  },
  lang: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
  },
  close: {
    display: 'flex',
    background: 'none',
    border: 'none',
    padding: t.spacing.s,
    color: t.colors.textMuted,
    cursor: 'pointer',
  },
  scroll: {
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: 'clamp(24px, 4vw, 40px)',
  },
}));
