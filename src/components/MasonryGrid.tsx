import { useMemo } from 'react';
import { PhotoTile } from '~/components/PhotoTile';
import { useGridColumns } from '~/hooks/useGridColumns';
import { aspectRatio, PortfolioImage } from '~/lib/portfolio';
import { splitIntoColumns } from '~/utils/masonry';
import { mkUseStyles } from '~/utils/theme';

type MasonryGridProps = {
  images: PortfolioImage[];
  maxColumns?: number;
  onOpen: (imageId: string) => void;
};

const GAP = 'clamp(8px, 1vw, 16px)';
/** Tallest a single row of photos may get, so one or two photos don't fill the screen. */
const ROW_MAX_HEIGHT = 'min(70vh, 720px)';

export const MasonryGrid = ({ images, maxColumns = 3, onOpen }: MasonryGridProps) => {
  const styles = useStyles();
  const columns = useGridColumns(maxColumns);
  // Everything fits in one row → equal-height row instead of stretched columns.
  const asRow = columns > 1 && images.length > 0 && images.length <= columns;

  const cols = useMemo(
    () => (asRow ? [] : splitIntoColumns(images, columns, (img) => aspectRatio(img))),
    [asRow, images, columns],
  );

  if (asRow) {
    // Widths proportional to aspect ratios ⇒ every photo ends up the same height.
    const ratios = images.map((img) => aspectRatio(img));
    const sum = ratios.reduce((a, b) => a + b, 0);
    return (
      <div
        style={{
          ...styles.row,
          maxWidth: `calc(${sum.toFixed(4)} * ${ROW_MAX_HEIGHT} + ${images.length - 1} * ${GAP})`,
        }}
      >
        {images.map((img, i) => (
          <div key={img.imageId} style={{ ...styles.rowItem, flex: `${ratios[i].toFixed(4)} 1 0%` }}>
            <PhotoTile image={img} onClick={() => onOpen(img.imageId)} />
          </div>
        ))}
      </div>
    );
  }

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
    gap: GAP,
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: GAP,
  },
  row: {
    display: 'flex',
    gap: GAP,
    alignItems: 'flex-start',
    margin: '0 auto',
  },
  rowItem: {
    minWidth: 0,
  },
}));
