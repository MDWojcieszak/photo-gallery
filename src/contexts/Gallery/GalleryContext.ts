import { createContext } from 'react';
import { Photo } from '~/contexts/Gallery/types';

export type GalleryContextType = {
  photos?: Photo[];
  count?: number;
};

export const GalleryContext = createContext<GalleryContextType | null>(null);
