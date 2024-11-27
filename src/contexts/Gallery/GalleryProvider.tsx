import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { GalleryContext } from '~/contexts/Gallery/GalleryContext';
import { GetAllResponse, Photo } from '~/contexts/Gallery/types';

type GalleryProviderProps = {
  children: ReactNode;
};

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  const [photos, setPhotos] = useState<Photo[]>();
  const [count, setCount] = useState<number>();
  const fetchPhotos = async () => {
    try {
      const res = await axios.get('https://api.whcp.pl/gallery/all');
      const parsedRes = GetAllResponse.parse(res.data);
      setPhotos(parsedRes.images);
      setCount(parsedRes.count);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return <GalleryContext.Provider value={{ photos, count }}>{children}</GalleryContext.Provider>;
};
