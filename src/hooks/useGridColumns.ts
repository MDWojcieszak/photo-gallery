import { useResponsive } from '~/hooks/useResponsive';

/** Masonry column count for the current screen — shared by the grid and its skeleton. */
export const useGridColumns = (maxColumns = 3): number => {
  const { device } = useResponsive();
  if (device === 'mobile' || device === 'largeMobile') return 1;
  if (device === 'tablet') return Math.min(2, maxColumns);
  if (device === 'largeScreen') return maxColumns + 1;
  return maxColumns;
};
