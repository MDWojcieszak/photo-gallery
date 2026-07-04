import { useMemo } from 'react';
import { PhotoTile } from '~/components/PhotoTile';
import { useResponsive } from '~/hooks/useResponsive';
import { aspectRatio, PortfolioImage } from '~/lib/portfolio';
import { splitIntoColumns } from '~/utils/masonry';
import { mkUseStyles } from '~/utils/theme';

type MasonryGridProps = {
  images: PortfolioImage[];
  maxColumns?: number;
  onOpen: (imageId: string) => void;
};

export const MasonryGrid = ({ images, maxColumns = 3, onOpen }: MasonryGridProps) => {
  const styles = useStyles();
  const { device } = useResponsive();

  const columns = useMemo(() => {
    const base =
      device === 'mobile' || device === 'largeMobile'
        ? 1
        : device === 'tablet'
          ? 2
          : device === 'largeScreen'
            ? maxColumns + 1
            : maxColumns;
    return Math.min(base, maxColumns + 1, Math.max(images.length, 1));
  }, [device, maxColumns, images.length]);

  const cols = useMemo(() => splitIntoColumns(images, columns, (img) => aspectRatio(img)), [images, columns]);

  return (
    <div style={styles.grid}>
      {cols.map((col, ci) => (
        <div style={styles.col} key={ci}>
          {col.map((img) => (
            <PhotoTile key={img.imageId} image={img} onClick={() => onOpen(img.imageId)} />
          ))}
        </div>
      ))}
    </div>
  );
};

const useStyles = mkUseStyles(() => ({
  grid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 'clamp(8px, 1vw, 16px)',
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(8px, 1vw, 16px)',
  },
}));
