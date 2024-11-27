import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { LuMapPin } from 'react-icons/lu';
import { PhotoData } from '~/contexts/Gallery/types';
import { usePhotoPreview } from '~/hooks/usePhotoPreview';
import { useResponsive } from '~/hooks/useResponsive';
import { mkUseStyles, useTheme } from '~/utils/theme';

type PhotoProps = {
  id: string;
  index: number;
  variant: 'horizontal' | 'vertical';
  columnSize: number;
  width: number;
  height: number;
  data: PhotoData;
  setImageActive: F2<string, boolean>;
};

export const Photo = (p: PhotoProps) => {
  const [isSelected, setSelectedImage] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState(true);
  const [isLayoutAnimation, setIsLayoutAnimation] = useState(false);
  const [showShortDetails, setShowShortDetails] = useState(false);

  const photoHeight = useMemo(() => (p.height / p.width) * p.columnSize, [p.columnSize]);
  const { lowRes, cover } = usePhotoPreview(p.id);

  const { isMobile } = useResponsive();

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const theme = useTheme();

  const url = useMemo(() => {
    if (!cover && !lowRes) return null;
    return URL.createObjectURL(cover || lowRes || new Blob());
  }, [cover, lowRes]);

  if (!lowRes) return null;
  const handleClose = () => {
    setSelectedImage(false);
    setShowDetails(false);
    setShowShortDetails(false);
  };

  const handleOpen = () => {};

  return (
    <div
      ref={containerRef}
      style={{ ...styles.container, ...{ minHeight: photoHeight, height: photoHeight } }}
      onMouseEnter={() => setShowShortDetails(true)}
      onMouseLeave={() => setShowShortDetails(false)}
    >
      <motion.div
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 155, duration: 2 }}
        style={{ ...styles.shade, ...{ pointerEvents: isSelected ? 'auto' : 'none' } }}
        onClick={handleClose}
      />
      <motion.div
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 155, duration: 2 }}
        style={{ ...styles.floatingButton, ...{ pointerEvents: isSelected ? 'auto' : 'none' } }}
        onClick={() => setShowDetails((p) => !p)}
      >
        <FaQuestionCircle />
      </motion.div>
      {url && (
        <motion.img
          src={url}
          layout
          onClick={() =>
            setSelectedImage((prev) => {
              if (!prev) p.setImageActive(p.id, true);
              return !prev;
            })
          }
          ref={imageRef}
          animate={{ zIndex: isSelected ? 6 : isLayoutAnimation ? 5 : 4 }}
          style={isSelected ? styles.imageOpened : { ...styles.image, height: photoHeight, width: p.columnSize }}
          alt='Bimhuis in Amsterdam'
          onLayoutAnimationStart={() => setIsLayoutAnimation(true)}
          onLayoutAnimationComplete={() => {
            setIsLayoutAnimation(false);
            p.setImageActive(p.id, isSelected);
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 155, duration: 2 }}
        />
      )}

      {!isSelected && !isLayoutAnimation && (
        <AnimatePresence>
          {showShortDetails && (
            <motion.div
              style={styles.infoContainer}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              layout
              // key='description'
              exit={{ opacity: 0, translateY: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div style={styles.row}>
                <LuMapPin stroke={theme.colors.lightBlue} style={{ marginRight: theme.spacing.xxs }} />
                <span style={{ color: theme.colors.lightBlue, fontSize: 13 }}>{p.data.localization}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AnimatePresence>
        {showDetails && isSelected && (
          <motion.div
            style={{ ...styles.infoContainer, ...styles.infoContainerOpened }}
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            layout
            // key='description-extended'
            exit={{ opacity: 0, translateY: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div style={styles.row}>
              <span style={{ color: theme.colors.lightBlue, flex: 1, opacity: 0.6, fontSize: 14 }}>September 2023</span>
              <LuMapPin stroke={theme.colors.lightBlue} style={{ marginRight: theme.spacing.xxs }} />
              <span style={{ color: theme.colors.lightBlue, fontSize: 14 }}>{p.data.localization}</span>
            </div>
            {p.data.description && <p style={{ lineHeight: '18px' }}>{p.data.description}</p>}
          </motion.div>
        )}
      </AnimatePresence>
      {!isMobile && (
        <AnimatePresence>
          {isSelected && (
            <motion.div
              onClick={handleClose}
              style={styles.barContainer}
              onHoverStart={() => setShowDetails(true)}
              onHoverEnd={() => setShowDetails(false)}
            ></motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    lineHeight: 0,
    width: '100%',
    position: 'relative',
    marginBottom: t.spacing.m,
  },

  imageContainer: {
    backgroundColor: 'red',
    cursor: 'pointer',
    position: 'relative',
  },
  imageContainerOpened: {
    backgroundColor: 'red',

    position: 'fixed',
    cursor: 'pointer',

    top: t.spacing.m,
    left: t.spacing.m,
    right: t.spacing.m,
    bottom: t.spacing.m,
  },
  image: {
    borderRadius: t.borderRadius.default,
    cursor: 'pointer',

    objectFit: 'contain',
    margin: 'auto',
    position: 'relative',
  },
  imageOpened: {
    borderRadius: t.borderRadius.default,

    objectFit: 'contain',
    position: 'fixed',
    cursor: 'pointer',
    maxWidth: 'calc(100% - 32px)',
    maxHeight: 'calc(100% - 32px)',

    top: t.spacing.m,
    left: t.spacing.m,
    right: t.spacing.m,
    bottom: t.spacing.m,
    margin: 'auto',
  },
  infoContainer: {
    position: 'absolute',
    bottom: t.spacing.m,
    padding: t.spacing.m,
    left: t.spacing.m,
    right: t.spacing.m,
    backgroundColor: t.colors.gray04,
    zIndex: 7,
    pointerEvents: 'none',
    borderRadius: t.borderRadius.default,
    boxShadow: '0px 0px 40px 5px rgba(50, 50, 50, 0.5)',
  },
  infoContainerOpened: {
    position: 'fixed',
    maxWidth: '400px',
    margin: 'auto',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shade: {
    position: 'fixed',
    backdropFilter: 'blur(50px)',
    top: 0,
    left: 0,
    height: '100svh',
    width: '100svw',
    opacity: 0,
    zIndex: 5,
  },
  barContainer: {
    position: 'fixed',
    cursor: 'pointer',
    left: 0,
    right: 0,
    bottom: 0,
    height: '10%',
    justifyContent: 'center',
    display: 'flex',
    zIndex: 20,
  },

  floatingButton: {
    position: 'fixed',
    top: 0,
    padding: t.spacing.m,
    right: 0,
    cursor: 'pointer',
    fontSize: 24,
    opacity: 0,
    zIndex: 8,
  },
}));
