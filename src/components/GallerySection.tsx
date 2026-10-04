import { motion } from 'framer-motion';
import { useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { Lightbox } from '~/components/Lightbox';
import { MasonryGrid } from '~/components/MasonryGrid';
import { useContactConfig } from '~/hooks/usePortfolio';
import { contactFormOpen, HomeSection } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

export const GallerySection = ({ section }: { section: HomeSection }) => {
  const styles = useStyles();
  const theme = useTheme();
  const [hover, setHover] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const canAsk = contactFormOpen(useContactConfig().data);

  const items = section.previewItems;
  if (!items.length) return null;

  const openById = (id: string) => {
    const i = items.findIndex((x) => x.imageId === id);
    if (i >= 0) setLightboxIndex(i);
  };

  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 style={styles.title}>{section.title}</h2>
            {section.description && <p style={styles.description}>{section.description}</p>}
          </div>
          <Link
            to={`/portfolio/${section.slug}`}
            style={styles.viewAll}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            View album
            <span style={styles.count}>({section.imageCount})</span>
            <motion.span style={styles.arrow} animate={{ x: hover ? 4 : 0 }} transition={{ duration: 0.3 }}>
              <LuArrowRight size={15} color={theme.colors.accent} />
            </motion.span>
          </Link>
        </motion.div>

        <MasonryGrid images={items} maxColumns={3} onOpen={openById} />
      </div>

      <Lightbox
        images={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndex={setLightboxIndex}
        gallery={canAsk ? { id: section.id, title: section.title } : undefined}
      />
    </section>
  );
};

const useStyles = mkUseStyles((t) => ({
  section: {
    width: '100%',
    padding: 'clamp(32px, 5vh, 64px) 0',
  },
  inner: {
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: '0 clamp(20px, 5vw, 56px)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: t.spacing.l,
    flexWrap: 'wrap',
    marginBottom: t.spacing.xl,
  },
  eyebrow: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    marginBottom: t.spacing.s,
  },
  title: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(30px, 4.5vw, 48px)',
    lineHeight: 1.05,
    color: t.colors.text,
  },
  description: {
    maxWidth: 520,
    marginTop: t.spacing.s,
    fontSize: 14,
    fontWeight: 300,
    lineHeight: 1.6,
    color: t.colors.textMuted,
  },
  viewAll: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.textMuted,
    whiteSpace: 'nowrap',
    paddingBottom: 4,
  },
  count: {
    color: t.colors.textFaint,
  },
  arrow: {
    display: 'flex',
  },
}));
