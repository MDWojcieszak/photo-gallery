import { motion } from 'framer-motion';
import { LuCamera, LuFilm, LuGlobe, LuLaptop, LuMapPin } from 'react-icons/lu';
import { Footer } from '~/components/Footer';
import { GearSection } from '~/components/GearSection';
import { Nav } from '~/components/Nav';
import { PageBackground } from '~/components/PageBackground';
import { SITE } from '~/config';
import { useResponsive } from '~/hooks/useResponsive';
import { useSeo } from '~/hooks/useSeo';
import { mkUseStyles, useTheme } from '~/utils/theme';

const BIO = [
  'I’m a passionate photographer who loves capturing the beauty of nature — stunning sunsets, majestic mountains and the unique atmosphere of interesting architectural spots around the world. I have a special appreciation for cityscapes at night; there’s something captivating about the way lights transform urban landscapes.',
  'I’m a big fan of Fujifilm, drawn to its amazing colour science and vintage-inspired design. While I usually rely on my digital gear, I occasionally dive into analog photography.',
  'Photography isn’t just something I do — it’s how I connect with the world around me, one frame at a time.',
];

const TAGS = [
  { icon: LuLaptop, label: 'Programmer' },
  { icon: LuCamera, label: 'Photographer' },
  { icon: LuGlobe, label: 'Traveler' },
  { icon: LuFilm, label: 'Fujifilm Enthusiast' },
];

export const About = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const avatarSize = isMobile ? 140 : 210;
  useSeo({
    title: `About — ${SITE.name}`,
    description: `About ${SITE.name} — photographer, traveler and Fujifilm enthusiast based in Cracow, Poland.`,
    path: '/about',
  });

  return (
    <div style={styles.page}>
      <PageBackground />
      <Nav variant='solid' />

      <div style={styles.content}>
        <div style={styles.inner}>
          <motion.div
            style={{
              ...styles.hero,
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src='avatar.webp'
              alt='Mateusz Wojcieszak'
              style={{ ...styles.avatar, width: avatarSize, height: avatarSize }}
            />
            <div>
              <span style={styles.eyebrow}>About</span>
              <h1 style={styles.name}>Mateusz Wojcieszak</h1>
              <div style={{ ...styles.tags, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {TAGS.map((t) => (
                  <span key={t.label} style={styles.tag}>
                    <t.icon size={15} style={{ marginRight: 7, color: theme.colors.accent }} />
                    {t.label}
                  </span>
                ))}
              </div>
              <div style={{ ...styles.location, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <LuMapPin size={14} style={{ marginRight: 6, color: theme.colors.accentSoft }} />
                Cracow, Poland
              </div>
            </div>
          </motion.div>

          <div style={styles.bio}>
            {BIO.map((p, i) => (
              <motion.p
                key={i}
                style={{
                  ...styles.paragraph,
                  fontSize: i === 0 ? 'clamp(18px, 2.4vw, 26px)' : 16,
                  color: i === 0 ? theme.colors.text : theme.colors.textMuted,
                  fontFamily: i === 0 ? theme.fonts.serif : theme.fonts.sans,
                  lineHeight: i === 0 ? 1.5 : 1.8,
                }}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <GearSection />
        </div>

        <Footer />
      </div>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  page: { minHeight: '100svh', position: 'relative' },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  inner: {
    minHeight: '100svh',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    padding: 'clamp(120px, 18vh, 190px) clamp(20px, 5vw, 56px) clamp(72px, 10vh, 120px)',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(24px, 4vw, 48px)',
    marginBottom: 'clamp(40px, 7vh, 72px)',
  },
  avatar: {
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  eyebrow: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.accent,
    marginBottom: t.spacing.sm,
  },
  name: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(34px, 5vw, 52px)',
    lineHeight: 1.05,
    color: t.colors.text,
    marginBottom: t.spacing.m,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: t.spacing.m,
    marginBottom: t.spacing.m,
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: t.colors.textMuted,
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: t.colors.textFaint,
  },
  bio: {
    display: 'flex',
    flexDirection: 'column',
    gap: t.spacing.l,
    paddingTop: 'clamp(24px, 4vh, 40px)',
  },
  paragraph: {
    margin: 0,
  },
}));
