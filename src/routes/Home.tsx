import { useCallback, useEffect, useMemo, useState } from 'react';
import { Footer } from '~/components/Footer';
import { GallerySection } from '~/components/GallerySection';
import { Hero } from '~/components/Hero';
import { Lightbox } from '~/components/Lightbox';
import { IrisCurtain } from '~/components/IrisCurtain';
import { Nav } from '~/components/Nav';
import { EmptyState, GridSkeleton } from '~/components/states';
import { useSeo } from '~/hooks/useSeo';
import { useHome } from '~/hooks/usePortfolio';
import { SITE } from '~/config';
import { mkUseStyles } from '~/utils/theme';

/** Longest the opening curtain may wait for the first hero photo. */
const CURTAIN_MAX_MS = 6000;
// The curtain is for the first entry only — coming back to Home must not blank it again.
let curtainDone = false;

export const Home = () => {
  const styles = useStyles();
  useSeo({ title: `${SITE.name} — ${SITE.role}`, path: '/' });

  const { data, loading } = useHome();
  const heroImages = useMemo(() => data?.hero ?? [], [data]);
  const sections = data?.sections ?? [];
  const [heroLightbox, setHeroLightbox] = useState<number | null>(null);

  // A closed lens covers the page until the hero is ready (so nothing reflows in view), then
  // opens onto it: `entered` starts the hero's entrance, `curtainGone` removes the curtain.
  const [heroReady, setHeroReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [entered, setEntered] = useState(curtainDone);
  const [curtainGone, setCurtainGone] = useState(curtainDone);
  const onHeroReady = useCallback(() => setHeroReady(true), []);
  const onReveal = useCallback(() => setEntered(true), []);
  const onCurtainDone = useCallback(() => setCurtainGone(true), []);
  const contentReady = heroReady || timedOut || (!loading && heroImages.length === 0);

  useEffect(() => {
    const id = window.setTimeout(() => setTimedOut(true), CURTAIN_MAX_MS);
    return () => window.clearTimeout(id);
  }, []);
  useEffect(() => {
    if (entered) curtainDone = true;
  }, [entered]);

  return (
    <div>
      <Nav variant='overlay' />

      {!curtainGone && <IrisCurtain ready={contentReady} onReveal={onReveal} onDone={onCurtainDone} />}

      <Hero
        images={heroImages}
        onReady={onHeroReady}
        entered={entered}
        onOpen={(img) => setHeroLightbox(heroImages.findIndex((i) => i.imageId === img.imageId))}
      />

      <div id='albums'>
        {loading ? (
          <div style={styles.loadingWrap}>
            <GridSkeleton maxColumns={3} count={6} />
          </div>
        ) : sections.length > 0 ? (
          sections.map((s) => <GallerySection key={s.id} section={s} />)
        ) : (
          <div style={styles.emptyWrap}>
            <EmptyState title='No albums yet' hint='Published albums will appear here.' />
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
    padding: 'clamp(48px, 8vh, 90px) clamp(20px, 5vw, 56px)',
  },
  emptyWrap: {
    padding: 'clamp(48px, 8vh, 90px) clamp(20px, 5vw, 56px)',
  },
}));
