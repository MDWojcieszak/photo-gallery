import { motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Photo } from '~/components/Photo';
import { Scrollbar } from '~/components/Scrollbar';
import { Photo as PhotoType } from '~/contexts/Gallery/types';
import { useGallery } from '~/hooks/useGallery';
import { useResponsive } from '~/hooks/useResponsive';
import { useSideBarSize } from '~/hooks/useSideBarSize';
import { splitData } from '~/utils/splitData';
import { mkUseStyles, useTheme } from '~/utils/theme';
const body = document.getElementsByTagName('body')[0];
let resizeObserver: ResizeObserver;

type GalleryProps = {
  disableResizing: boolean;
  setImageActive: F2<string, boolean>;
};

export const Gallery = ({ disableResizing, setImageActive }: GalleryProps) => {
  const { photos } = useGallery();
  const sidebarSize = useSideBarSize();

  const styles = useStyles();
  const theme = useTheme();
  const { device, isMobile } = useResponsive();
  const [columnSize, setColumnSize] = useState<number>();
  const columns = useMemo(
    () =>
      device === 'largeMobile' || device === 'mobile' ? 1 : device === 'tablet' ? 2 : device === 'desktop' ? 3 : 4,
    [device],
  );
  const targetRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (targetRef.current) {
      setColumnSize(
        Math.round(
          (targetRef.current.offsetWidth -
            theme.spacing.m * (columns - 1) -
            theme.spacing.l -
            (sidebarSize.desktopSize || 0)) /
            columns,
        ),
      );
    }
  }, [sidebarSize.desktopSize]);

  useEffect(() => {
    resizeObserver = new ResizeObserver(() => {
      if (disableResizing) return;
      setColumnSize(
        ((targetRef.current?.offsetWidth || 1) -
          theme.spacing.m * columns -
          theme.spacing.l -
          (isMobile ? 0 : theme.spacing.m) -
          (sidebarSize.desktopSize || 0)) /
          columns,
      );
    });
    resizeObserver.observe(body);
    return () => resizeObserver.disconnect();
  }, [targetRef, columns, disableResizing, sidebarSize.desktopSize]);

  const renderImage = useCallback(
    (image: PhotoType, index: number) => {
      if (!columnSize) return null;
      return (
        <Photo
          setImageActive={setImageActive}
          key={image.id}
          data={image.data}
          id={image.id}
          width={image.dimensions.width}
          height={image.dimensions.height}
          columnSize={columnSize}
          index={index}
          variant={image.dimensions && image.dimensions?.height > image.dimensions?.width ? 'vertical' : 'vertical'}
        />
      );
    },
    [columnSize, columns],
  );

  const renderColumns = useCallback(() => {
    if (!photos) return;
    const colData = splitData(photos, columns);
    return (
      <>
        {colData.map((col) => (
          <div style={styles.column}>{col.images.map((image) => renderImage(image.data, image.index))}</div>
        ))}
      </>
    );
  }, [photos, columns, columnSize]);

  return (
    <motion.div
      style={{
        ...styles.container,
        height: `100svh`,
      }}
      ref={targetRef}
    >
      <Scrollbar>
        <div
          style={{
            ...styles.galery,
            ...{
              paddingLeft: sidebarSize.desktopSize ? sidebarSize.desktopSize + theme.spacing.m * 2 : theme.spacing.m,
              paddingBottom: sidebarSize.mobileSize ? sidebarSize.mobileSize + theme.spacing.m * 2 : theme.spacing.m,
            },
          }}
        >
          {photos && renderColumns()}
        </div>
      </Scrollbar>
    </motion.div>
  );
};

const useStyles = mkUseStyles((t) => ({
  container: {
    flex: 1,
    pointeEvents: 'none',
  },
  galery: {
    paddingTop: t.spacing.m,
    paddingRight: t.spacing.l,
    display: 'flex',
    flexDirection: 'row',
    gap: t.spacing.m,
    flex: 1,
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
}));
