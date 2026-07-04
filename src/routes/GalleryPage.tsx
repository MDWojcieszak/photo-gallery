import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuArrowLeft, LuPlus } from 'react-icons/lu';
import { Link, useParams } from 'react-router-dom';
import { Footer } from '~/components/Footer';
import { Lightbox } from '~/components/Lightbox';
import { MasonryGrid } from '~/components/MasonryGrid';
import { Nav } from '~/components/Nav';
import { EmptyState, GridSkeleton } from '~/components/states';
import { useGalleryPaged, useSettings } from '~/hooks/usePortfolio';
import { useSeo } from '~/hooks/useSeo';
import { SITE } from '~/config';
import { mkUseStyles, useTheme } from '~/utils/theme';

const DEFAULT_PAGE_SIZE = 24;

export const GalleryPage = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { slug } = useParams<{ slug: string }>();

  const { data: settings } = useSettings();
  const pageSize = settings?.galleryPageSize ?? DEFAULT_PAGE_SIZE;
  const { meta, items, loading, loadingMore, error, hasMore, loadMore } = useGalleryPaged(slug, pageSize);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openById = (id: string) => {
    const i = items.findIndex((x) => x.imageId === id);
    if (i >= 0) setLightboxIndex(i);
  };

  useSeo({
    title: meta ? `${meta.title} — ${SITE.name}` : `Gallery — ${SITE.name}`,
    description: meta?.description ?? `A photo gallery by ${SITE.name}.`,
    path: `/portfolio/${slug ?? ''}`,
  });

  const remaining = meta ? meta.imageCount - items.length : 0;

  return (
    <div style={styles.page}>
      <Nav variant='solid' />

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <Link to='/' style={styles.back}>
              <LuArrowLeft size={14} style={{ marginRight: 8 }} /> Back to home
            </Link>

            {error === 'notfound' ? (
              <h1 style={styles.title}>Gallery not found</h1>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span style={styles.eyebrow}>Collection</span>
                <h1 style={styles.title}>{meta?.title ?? (loading ? 'Loading…' : '')}</h1>
                {meta?.description && <p style={styles.description}>{meta.description}</p>}
                {meta && (
                  <span style={styles.count}>
                    {meta.imageCount} {meta.imageCount === 1 ? 'photograph' : 'photographs'}
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </header>

        <div style={styles.body}>
          {error === 'notfound' ? (
            <EmptyState title='This gallery isn’t available' hint='It may be unpublished or the link is incorrect.' />
          ) : error === 'error' ? (
            <EmptyState title='Something went wrong' hint='Please try again in a moment.' />
          ) : loading ? (
            <GridSkeleton columns={3} />
          ) : items.length === 0 ? (
            <EmptyState title='This gallery is empty' hint='No photographs to show yet.' />
          ) : (
            <>
              <MasonryGrid images={items} maxColumns={3} onOpen={openById} />

              {hasMore && (
                <div style={styles.moreWrap}>
                  <motion.button
                    style={styles.moreBtn}
                    onClick={loadMore}
                    disabled={loadingMore}
                    whileHover={{ color: theme.colors.text }}
                  >
                    <LuPlus size={14} style={{ marginRight: 10 }} />
                    {loadingMore ? 'Loading…' : `Show more${remaining > 0 ? ` (${remaining})` : ''}`}
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <Lightbox
        images={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onIndex={setLightboxIndex}
      />
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  page: {
    minHeight: '100svh',
    position: 'relative',
  },
  main: {
    minHeight: '100svh',
  },
  header: {
    paddingTop: 'clamp(110px, 16vh, 170px)',
    paddingBottom: t.spacing.l,
  },
  headerInner: {
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: `0 clamp(20px, 5vw, 56px)`,
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 11,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: t.colors.textMuted,
    marginBottom: t.spacing.l,
  },
  eyebrow: {
    display: 'block',
    fontSize: 11,
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
    marginBottom: t.spacing.sm,
  },
  title: {
    fontFamily: t.fonts.serif,
    fontWeight: 500,
    fontSize: 'clamp(40px, 6vw, 76px)',
    lineHeight: 1.02,
    color: t.colors.text,
  },
  description: {
    maxWidth: 620,
    marginTop: t.spacing.m,
    fontSize: 'clamp(14px, 1.5vw, 16px)',
    fontWeight: 300,
    lineHeight: 1.7,
    color: t.colors.textMuted,
  },
  count: {
    display: 'inline-block',
    marginTop: t.spacing.m,
    fontSize: 11,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: t.colors.textFaint,
  },
  body: {
    width: '100%',
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: `${t.spacing.l}px clamp(20px, 5vw, 56px) clamp(56px, 9vh, 110px)`,
  },
  moreWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'clamp(32px, 5vh, 56px)',
  },
  moreBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: `${t.spacing.sm}px ${t.spacing.l}px`,
    backgroundColor: t.colors.surface,
    borderRadius: 999,
    fontFamily: t.fonts.sans,
    fontSize: 11,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: t.colors.textMuted,
    cursor: 'pointer',
  },
}));
