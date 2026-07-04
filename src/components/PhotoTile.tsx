import { motion } from 'framer-motion';
import { useState } from 'react';
import { LuMapPin } from 'react-icons/lu';
import { BlurImage } from '~/components/BlurImage';
import { aspectRatio, PortfolioImage } from '~/lib/portfolio';
import { mkUseStyles, useTheme } from '~/utils/theme';

type PhotoTileProps = {
  image: PortfolioImage;
  onClick: () => void;
};

export const PhotoTile = ({ image, onClick }: PhotoTileProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <motion.button
      style={styles.tile}
      onClick={onClick}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        style={styles.zoom}
        animate={{ scale: hover ? 1.045 : 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <BlurImage
          cover={image.coverUrl}
          lowRes={image.lowResUrl}
          alt={image.localization ?? ''}
          ratio={aspectRatio(image)}
        />
      </motion.div>

      <div style={{ ...styles.overlay, opacity: hover ? 1 : 0 }} />

      {image.localization && (
        <div style={styles.badge}>
          <LuMapPin size={12} stroke={theme.colors.accentSoft} style={{ marginRight: 6 }} />
          <span style={styles.badgeText}>{image.localization}</span>
        </div>
      )}
    </motion.button>
  );
};

const useStyles = mkUseStyles((t) => ({
  tile: {
    position: 'relative',
    display: 'block',
    width: '100%',
    padding: 0,
    border: 'none',
    background: t.colors.surface03,
    borderRadius: t.borderRadius.small,
    overflow: 'hidden',
    cursor: 'pointer',
  },
  zoom: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(0deg, rgba(12,12,14,0.55) 0%, rgba(12,12,14,0) 42%)',
    opacity: 0,
    transition: 'opacity 0.4s',
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    left: t.spacing.sm,
    bottom: t.spacing.sm,
    display: 'flex',
    alignItems: 'center',
    padding: `5px 10px`,
    borderRadius: 999,
    backgroundColor: 'rgba(12,12,14,0.5)',
    backdropFilter: 'blur(6px)',
    pointerEvents: 'none',
  },
  badgeText: {
    fontSize: 11,
    letterSpacing: '0.04em',
    color: t.colors.text,
  },
}));
