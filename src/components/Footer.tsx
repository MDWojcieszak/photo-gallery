import { motion } from 'framer-motion';
import { useState } from 'react';
import { LuArrowUp, LuArrowUpRight, LuInstagram, LuMail, LuMapPin } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { PrivacyModal } from '~/components/PrivacyModal';
import { useContactConfig } from '~/hooks/usePortfolio';
import { CONTACT, SITE } from '~/config';
import { useResponsive } from '~/hooks/useResponsive';
import { mkUseStyles, useTheme } from '~/utils/theme';

type Dest = string | { pathname: string; hash: string };

const EXPLORE: { label: string; to: Dest }[] = [
  { label: 'Home', to: '/' },
  { label: 'Albums', to: { pathname: '/', hash: '#albums' } },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const RevealLink = ({
  children,
  to,
  href,
  target,
  rel,
}: {
  children: React.ReactNode;
  to?: Dest;
  href?: string;
  target?: string;
  rel?: string;
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const [active, setActive] = useState(false);

  const handlers = {
    onMouseEnter: () => setActive(true),
    onMouseLeave: () => setActive(false),
    onFocus: () => setActive(true),
    onBlur: () => setActive(false),
    style: styles.revealWrap,
  };

  const inner = (
    <motion.span
      style={styles.revealText}
      animate={{ color: active ? theme.colors.text : theme.colors.textMuted }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.span>
  );

  return to !== undefined ? (
    <Link to={to} {...handlers}>
      {inner}
    </Link>
  ) : (
    <a href={href} target={target} rel={rel} {...handlers}>
      {inner}
    </a>
  );
};

export const Footer = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const year = new Date().getFullYear();

  const [privacyOpen, setPrivacyOpen] = useState(false);
  const contact = useContactConfig().data;
  const privacyNotice = contact?.privacyNotice;

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer id='contact' style={styles.footer}>
      <div style={styles.inner}>
        <div
          style={{
            ...styles.top,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            gap: isMobile ? theme.spacing.xxl : theme.spacing.xl,
          }}
        >
          <div style={styles.statementCol}>
            <span style={styles.kicker}>Available for commissions &amp; prints</span>

            <motion.a
              href={`mailto:${CONTACT.email}?subject=Project%20enquiry`}
              style={styles.emailLink}
              initial={false}
              animate='rest'
              whileHover='hover'
              whileFocus='hover'
            >
              <motion.span
                style={styles.emailIcon}
                variants={{ rest: { color: theme.colors.accentSoft }, hover: { color: theme.colors.text } }}
                transition={{ duration: 0.25 }}
              >
                <LuMail size={15} />
              </motion.span>
              <motion.span
                style={styles.email}
                variants={{ rest: { color: theme.colors.text }, hover: { color: theme.colors.accent } }}
                transition={{ duration: 0.25 }}
              >
                {CONTACT.email}
              </motion.span>
              <motion.span
                style={styles.emailArrow}
                variants={{
                  rest: { x: 0, y: 0, color: theme.colors.textMuted },
                  hover: { x: 4, y: -4, color: theme.colors.accent },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <LuArrowUpRight size={14} />
              </motion.span>
            </motion.a>

            <div style={styles.location}>
              <LuMapPin size={13} color={theme.colors.accentSoft} style={styles.locationIcon} />
              {CONTACT.location}
            </div>
          </div>

          <div
            style={{
              ...styles.metaCol,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? theme.spacing.xl : theme.spacing.xxxl,
            }}
          >
            <div style={styles.metaGroup}>
              <span style={styles.metaLabel}>Explore</span>
              <nav style={styles.metaList}>
                {EXPLORE.map((l) => (
                  <RevealLink key={l.label} to={l.to}>
                    {l.label}
                  </RevealLink>
                ))}
              </nav>
            </div>

            <div style={styles.metaGroup}>
              <span style={styles.metaLabel}>Connect</span>
              <nav style={styles.metaList}>
                <RevealLink href={CONTACT.instagram} target='_blank' rel='noreferrer'>
                  <span style={styles.connectRow}>
                    <LuInstagram size={14} style={styles.connectIcon} />@{CONTACT.instagramHandle}
                  </span>
                </RevealLink>
                <RevealLink href={`mailto:${CONTACT.email}`}>
                  <span style={styles.connectRow}>
                    <LuMail size={14} style={styles.connectIcon} />
                    Email
                  </span>
                </RevealLink>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.inner}>
        <div
          style={{
            ...styles.microbar,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? theme.spacing.m : theme.spacing.l,
          }}
        >
          <Link to='/' onClick={toTop} style={styles.brand}>
            <span style={styles.brandName}>{SITE.name}</span>
            <span style={styles.brandSub}>{SITE.role}</span>
          </Link>

          <div
            style={{
              ...styles.microRight,
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'space-between' : 'flex-end',
            }}
          >
            <span style={styles.copy}>
              &copy; {year} {SITE.name}
              <span style={styles.dot}>&middot;</span>
              {CONTACT.location}
              {privacyNotice && (
                <>
                  <span style={styles.dot}>&middot;</span>
                  <button type='button' style={styles.privacy} onClick={() => setPrivacyOpen(true)}>
                    Privacy
                  </button>
                </>
              )}
            </span>

            <motion.button
              type='button'
              onClick={toTop}
              style={styles.toTop}
              initial={false}
              animate='rest'
              whileHover='hover'
              whileFocus='hover'
            >
              <motion.span
                style={styles.toTopLabel}
                variants={{ rest: { color: theme.colors.textMuted }, hover: { color: theme.colors.text } }}
                transition={{ duration: 0.25 }}
              >
                Back to top
              </motion.span>
              <motion.span
                style={styles.toTopIcon}
                variants={{
                  rest: { y: 0, backgroundColor: theme.colors.surface02, color: theme.colors.textMuted },
                  hover: { y: -3, backgroundColor: theme.colors.surface03, color: theme.colors.text },
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <LuArrowUp size={13} />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
      {contact && privacyNotice && (
        <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} locale={contact.locale} />
      )}
    </footer>
  );
};

const useStyles = mkUseStyles((t) => ({
  footer: {
    backgroundColor: t.colors.surface,
    overflow: 'hidden',
  },
  inner: {
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: '0 clamp(20px, 5vw, 56px)',
  },

  top: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 'clamp(56px, 8vw, 96px)',
    paddingBottom: 'clamp(48px, 7vw, 80px)',
  },
  statementCol: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 620,
  },
  kicker: {
    fontFamily: t.fonts.sans,
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    marginBottom: t.spacing.m,
  },
  emailLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: t.spacing.sm,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  emailIcon: {
    display: 'inline-flex',
    flexShrink: 0,
  },
  email: {
    fontFamily: t.fonts.sans,
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: '0.02em',
    lineHeight: 1.2,
    overflowWrap: 'anywhere',
    minWidth: 0,
  },
  emailArrow: {
    display: 'inline-flex',
    flexShrink: 0,
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    marginTop: t.spacing.l,
    fontFamily: t.fonts.sans,
    fontSize: 11,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  locationIcon: {
    marginRight: t.spacing.s,
  },

  metaCol: {
    display: 'flex',
    flexShrink: 0,
  },
  metaGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.m,
  },
  metaLabel: {
    fontFamily: t.fonts.sans,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    marginBottom: t.spacing.xxs,
  },
  metaList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: t.spacing.sm,
  },
  revealWrap: {
    display: 'inline-flex',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  revealText: {
    fontFamily: t.fonts.sans,
    fontSize: 14,
    letterSpacing: '0.04em',
    lineHeight: 1.2,
  },
  connectRow: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  connectIcon: {
    marginRight: t.spacing.s,
    opacity: 0.85,
  },

  microbar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 'clamp(28px, 4vw, 44px)',
    paddingBottom: 'clamp(28px, 4vw, 44px)',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
    userSelect: 'none',
    textDecoration: 'none',
  },
  brandName: {
    fontFamily: t.fonts.sans,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: t.colors.text,
  },
  brandSub: {
    fontFamily: t.fonts.sans,
    fontSize: 10,
    letterSpacing: '0.34em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  microRight: {
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.l,
  },
  privacy: {
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    letterSpacing: 'inherit',
    textTransform: 'inherit',
    color: 'inherit',
    cursor: 'pointer',
  },
  copy: {
    display: 'inline-flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontFamily: t.fonts.sans,
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  dot: {
    margin: `0 ${t.spacing.s}px`,
    color: t.colors.textFaint,
  },
  toTop: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: t.spacing.s,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: t.fonts.sans,
  },
  toTopLabel: {
    fontFamily: t.fonts.sans,
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
  },
  toTopIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: '50%',
  },
}));
