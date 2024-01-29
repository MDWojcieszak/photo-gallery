import { AnimatePresence, motion, useDomEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { LuMapPin } from 'react-icons/lu';
import { mkUseStyles, useTheme } from '~/utils/theme';

type ImageProps = {
  url: string;
  index: number;
  variant: 'horizontal' | 'vertical';
  isSelected: boolean;
  setSelectedImage: F1<number | false>;
};

const body = document.getElementsByTagName('body')[0];
let resizeObserver: ResizeObserver;
export const Image = (p: ImageProps) => {
  const [isLayoutAnimation, setIsLayoutAnimation] = useState(false);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [height, setHeight] = useState<number>();
  const [aspectRatio, setAspectRatio] = useState<number>();
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const theme = useTheme();
  useDomEvent(useRef(window), 'scroll', () => p.isSelected && p.setSelectedImage(false));
  window.addEventListener('resize', () => {
    setHeight((containerRef.current?.offsetWidth || 1) * (aspectRatio || 1));
  });

  useEffect(() => {
    resizeObserver = new ResizeObserver(() => {
      setHeight((containerRef.current?.offsetWidth || 1) * (aspectRatio || 1));
    });
    resizeObserver.observe(body);
    return () => resizeObserver.disconnect();
  }, [containerRef, aspectRatio]);

  return (
    <div
      ref={containerRef}
      style={{ ...styles.container, ...{ height: height } }}
      onMouseEnter={() => setIsOpenDetails(true)}
      onMouseLeave={() => setIsOpenDetails(false)}
    >
      <motion.img
        src={p.url}
        ref={imageRef}
        onLoad={() => {
          setHeight(imageRef.current?.height);
          setAspectRatio((imageRef.current?.height || 1) / (imageRef.current?.width || 1));
        }}
        style={p.isSelected ? styles.imageOpened : styles.image}
        alt='Bimhuis in Amsterdam'
        animate={{ zIndex: p.isSelected ? 4 : isLayoutAnimation ? 3 : 1 }}
        onClick={() => p.setSelectedImage(p.isSelected ? false : p.index)}
        onLayoutAnimationStart={() => setIsLayoutAnimation(true)}
        onLayoutAnimationComplete={() => setIsLayoutAnimation(false)}
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 155, duration: 0.2 }}
      />
      <AnimatePresence>
        {isOpenDetails && !p.isSelected && (
          <motion.div
            style={{ ...styles.infoContainer, ...(p.isSelected ? styles.infoContainerOpened : {}) }}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div style={styles.row}>
              <span style={{ color: theme.colors.lightBlue, flex: 1, opacity: 0.6, fontSize: 14 }}>September 2023</span>
              <LuMapPin stroke={theme.colors.lightBlue} style={{ marginRight: theme.spacing.xxs }} />
              <span style={{ color: theme.colors.lightBlue, fontSize: 14 }}>New York</span>
            </div>
            <p style={{ lineHeight: '18px' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    lineHeight: 0,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    borderRadius: t.borderRadius.default,
    cursor: 'pointer',
    position: 'relative',
    zIndex: 1,
  },
  imageOpened: {
    objectFit: 'contain',
    borderRadius: '12px',
    cursor: 'pointer',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    maxWidth: '100vw',
    maxHeight: '100vh',
  },
  infoContainer: {
    position: 'absolute',
    bottom: t.spacing.m,
    padding: t.spacing.m,
    left: '10%',
    right: '10%',
    backgroundColor: t.colors.gray04,
    zIndex: 5,
    pointerEvents: 'none',
    borderRadius: t.borderRadius.default,
  },
  infoContainerOpened: {
    position: 'fixed',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
