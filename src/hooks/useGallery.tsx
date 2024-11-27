import { useContext, useMemo } from 'react';
import { GalleryContext } from '~/contexts/Gallery/GalleryContext';

export const useGallery = () => {
  const ctx = useContext(GalleryContext);

  if (!ctx) throw new Error('use inside of GalleryContextProvider');

  return useMemo(
    () => ({
      photos: ctx.photos,
      count: ctx.count,
    }),
    [ctx.photos, ctx.count],
  );
};
