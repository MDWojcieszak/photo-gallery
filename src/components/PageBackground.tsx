import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { apiUrl } from '~/config';
import { useHero } from '~/hooks/usePortfolio';
import { mkUseStyles } from '~/utils/theme';

export const PageBackground = () => {
  const styles = useStyles();
  const { data } = useHero(12);
  const images = data?.images ?? [];

  const image = useMemo(
    () => (images.length ? images[Math.floor(Math.random() * images.length)] : null),
    [images.length],
  );

  if (!image) return null;

  return (
    <div style={styles.bg} aria-hidden>
      <motion.img
        src={apiUrl(image.coverUrl) ?? ''}
        alt=''
        decoding='async'
        style={styles.img}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div style={styles.veil} />
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  bg: {
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    opacity: 0.1,
    backgroundColor: t.colors.ink,
  },
  img: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  veil: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(120% 90% at 50% 30%, rgba(12,12,13,0) 40%, rgba(12,12,13,0.55) 100%)',
  },
}));
