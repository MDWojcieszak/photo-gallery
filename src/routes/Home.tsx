import { useMemo, useState } from 'react';
import { Footer } from '~/components/Footer';
import { GallerySection } from '~/components/GallerySection';
import { Hero } from '~/components/Hero';
import { Lightbox } from '~/components/Lightbox';
import { Nav } from '~/components/Nav';
import { EmptyState, GridSkeleton } from '~/components/states';
import { useSeo } from '~/hooks/useSeo';
import { useHome } from '~/hooks/usePortfolio';
import { SITE } from '~/config';
import { mkUseStyles } from '~/utils/theme';

export const Home = () => {
  const styles = useStyles();
  useSeo({ title: `${SITE.name} — ${SITE.role}`, path: '/' });

  const { data, loading } = useHome();
  const heroImages = useMemo(() => data?.hero ?? [], [data]);
  const sections = data?.sections ?? [];
  const [heroLightbox, setHeroLightbox] = useState<number | null>(null);

  return (
    <div>
      <Nav variant='overlay' />

      <Hero
        images={heroImages}
        loading={loading}
        onOpen={(img) => setHeroLightbox(heroImages.findIndex((i) => i.imageId === img.imageId))}
      />

      <div id='galleries'>
        {loading ? (
          <div style={styles.loadingWrap}>
            <GridSkeleton columns={3} count={6} />
          </div>
        ) : sections.length > 0 ? (
          sections.map((s) => <GallerySection key={s.id} section={s} />)
        ) : (
          <div style={styles.emptyWrap}>
            <EmptyState title='No galleries yet' hint='Published galleries will appear here.' />
          </div>
        )}
      </div>

      <Footer />

      <Lightbox
        images={heroImages}
        index={heroLightbox}
        onClose={() => setHeroLightbox(null)}
        onIndex={setHeroLightbox}
      />
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  loadingWrap: {
    maxWidth: t.layout.maxWidth,
    margin: '0 auto',
    padding: `clamp(48px, 8vh, 90px) clamp(20px, 5vw, 56px)`,
  },
  emptyWrap: {
    padding: `clamp(48px, 8vh, 90px) clamp(20px, 5vw, 56px)`,
  },
}));
