import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useResponsive } from '~/hooks/useResponsive';
import { mkUseStyles, useTheme } from '~/utils/theme';

type NavLink = { label: string; to: string; hash?: string };

const LINKS: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Galleries', to: '/', hash: '#galleries' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

type NavProps = {
  variant?: 'overlay' | 'solid';
};

export const Nav = ({ variant = 'solid' }: NavProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  const solid = variant === 'solid' || scrolled;

  const isActive = (l: NavLink) =>
    l.hash ? location.pathname === l.to && location.hash === l.hash : location.pathname === l.to && !location.hash;

  const go = (l: NavLink) => {
    setMenuOpen(false);
    navigate({ pathname: l.to, hash: l.hash ?? '' });
    if (l.hash) {
      const id = l.hash.slice(1);
      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else if (tries++ < 14) window.setTimeout(attempt, 90);
      };
      window.setTimeout(attempt, 60);
    }
  };

  const onHero = variant === 'overlay' && !scrolled;
  const textShadow = onHero
    ? '0 1px 2px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.6), 0 2px 20px rgba(0,0,0,0.45)'
    : undefined;
  const iconShadow = onHero ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))' : undefined;
  const brandNameColor = onHero ? '#ffffff' : theme.colors.text;
  const brandSubColor = onHero ? 'rgba(255,255,255,0.72)' : theme.colors.textFaint;
  const linkColor = (active: boolean) =>
    onHero ? (active ? '#ffffff' : 'rgba(255,255,255,0.82)') : active ? theme.colors.text : theme.colors.textMuted;

  return (
    <>
      <motion.header
        style={styles.header}
        initial={false}
        animate={{
          backgroundColor: solid ? 'rgba(12,12,14,0.82)' : 'rgba(12,12,14,0)',
          backdropFilter: solid ? 'blur(14px)' : 'blur(0px)',
        }}
        transition={{ duration: 0.35 }}
      >
        <div style={styles.inner}>
          <Link to='/' style={styles.brand}>
            <span style={{ ...styles.brandName, textShadow, color: brandNameColor }}>Mateusz Wojcieszak</span>
            <span style={{ ...styles.brandSub, textShadow, color: brandSubColor }}>Photography</span>
          </Link>

          {!isMobile && (
            <nav style={styles.links}>
              {LINKS.map((l) => (
                <motion.button
                  key={l.label}
                  style={{ ...styles.link, color: linkColor(isActive(l)), textShadow }}
                  onClick={() => go(l)}
                  whileHover={{ color: '#ffffff' }}
                >
                  {l.label}
                </motion.button>
              ))}
            </nav>
          )}

          {isMobile && (
            <button
              aria-label='Menu'
              style={{ ...styles.burger, filter: menuOpen ? undefined : iconShadow }}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span style={{ ...styles.burgerLine, transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none' }} />
              <span style={{ ...styles.burgerLine, opacity: menuOpen ? 0 : 1 }} />
              <span
                style={{ ...styles.burgerLine, transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none' }}
              />
            </button>
          )}
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            style={styles.mobileMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.label}
                style={{ ...styles.mobileLink, color: isActive(l) ? theme.colors.accent : theme.colors.text }}
                onClick={() => go(l)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.05 }}
              >
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const useStyles = mkUseStyles((t) => ({
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  inner: {
    position: 'relative',
    zIndex: 1,
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: `${t.spacing.m}px clamp(20px, 5vw, 56px)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: t.spacing.l,
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.15,
    userSelect: 'none',
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
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: t.spacing.xl,
  },
  link: {
    background: 'none',
    border: 'none',
    padding: `${t.spacing.xs}px 0`,
    fontFamily: t.fonts.sans,
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  burger: {
    width: 34,
    height: 34,
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 5,
    padding: 0,
    zIndex: 60,
  },
  burgerLine: {
    display: 'block',
    width: 26,
    height: 1.5,
    backgroundColor: t.colors.text,
    transition: 'transform 0.3s, opacity 0.3s',
  },
  mobileMenu: {
    position: 'fixed',
    inset: 0,
    zIndex: 45,
    backgroundColor: 'rgba(12,12,14,0.97)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: t.spacing.l,
  },
  mobileLink: {
    background: 'none',
    border: 'none',
    fontFamily: t.fonts.serif,
    fontSize: 34,
    fontWeight: 500,
  },
}));
