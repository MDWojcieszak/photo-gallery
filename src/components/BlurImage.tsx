import { motion } from 'framer-motion';
import { CSSProperties, useState } from 'react';
import { apiUrl } from '~/config';
import { mkUseStyles } from '~/utils/theme';

type BlurImageProps = {
  cover: string;
  lowRes?: string | null;
  alt?: string;
  ratio?: number;
  objectFit?: 'cover' | 'contain';
  radius?: number;
  priority?: boolean;
  style?: CSSProperties;
};

export const BlurImage = ({
  cover,
  lowRes,
  alt = '',
  ratio,
  objectFit = 'cover',
  radius = 0,
  priority = false,
  style,
}: BlurImageProps) => {
  const styles = useStyles();
  const [loaded, setLoaded] = useState(false);

  const coverSrc = apiUrl(cover) ?? '';
  const lowSrc = apiUrl(lowRes);

  return (
    <div
      style={{
        ...styles.container,
        borderRadius: radius,
        aspectRatio: ratio ? `${ratio}` : undefined,
        ...style,
      }}
    >
      {lowSrc && (
        <img
          src={lowSrc}
          alt=''
          aria-hidden
          style={{
            ...styles.layer,
            objectFit,
            filter: 'blur(18px)',
            transform: 'scale(1.1)',
            opacity: loaded ? 0 : 1,
          }}
        />
      )}
      <motion.img
        src={coverSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding='async'
        onLoad={() => setLoaded(true)}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ ...styles.layer, objectFit }}
      />
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: t.colors.surface03,
  },
  layer: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
}));
