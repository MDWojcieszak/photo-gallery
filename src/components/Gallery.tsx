import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Image } from '~/components/Image';
import imagesData from '~/constants/images.json';
import { useResponsive } from '~/hooks/useResponsive';
import { ImageType } from '~/types/image';
import { splitData } from '~/utils/splitData';
import { mkUseStyles } from '~/utils/theme';
export const Gallery = () => {
  const images = useMemo(() => imagesData.photos as ImageType[], []);
  const [selectedImage, setSelectedImage] = useState<number | false>(false);
  const { device } = useResponsive();
  const columns =
    device === 'largeMobile' || device === 'mobile' ? 1 : device === 'tablet' ? 2 : device === 'desktop' ? 3 : 4;
  const renderImage = (image: ImageType, index: number) => (
    <Image
      index={index}
      variant={image.variant}
      url={image.url}
      isSelected={index === selectedImage}
      setSelectedImage={setSelectedImage}
    />
  );
  console.log();

  const renderColumns = () => {
    const colData = splitData(images, columns);
    return (
      <div style={styles.galery}>
        {colData.map((col) => (
          <div style={styles.column}>{col.images.map((image) => renderImage(image.data, image.index))}</div>
        ))}
      </div>
    );
  };
  const styles = useStyles();
  return (
    <>
      {/* <div style={{ ...styles.grid, ...{ gridTemplateColumns: `repeat(${columns}, 1fr)` } }}>
        {images.map(renderImage)}
      </div> */}
      {renderColumns()}
      <motion.div
        animate={{ opacity: selectedImage !== false ? 1 : 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 155, duration: 0.2 }}
        style={{ ...styles.shade, ...{ pointerEvents: selectedImage !== false ? 'auto' : 'none' } }}
        onClick={() => setSelectedImage(false)}
      />
    </>
  );
};

const useStyles = mkUseStyles((t) => ({
  galery: {
    display: 'flex',
    flexDirestion: 'row',
    gap: t.spacing.m,
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateRows: 'mansory',
  },
  shade: {
    position: 'fixed',
    backdropFilter: 'blur(1vmax)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    zIndex: 2,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: t.spacing.m,
  },
}));
