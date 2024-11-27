import axios, { AxiosResponse } from 'axios';
import { useContext, useEffect, useMemo, useState } from 'react';
import { GalleryContext } from '~/contexts/Gallery/GalleryContext';

export const usePhotoPreview = (id: string) => {
  const [lowRes, setLowRes] = useState<Blob>();
  const [cover, setCover] = useState<Blob>();

  const ctx = useContext(GalleryContext);

  const fetchPhotoPreview = async (type: 'cover' | 'low-res') => {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`https://api.whcp.pl/gallery/${type}`, {
        params: { id },
        responseType: 'blob',
      });
      type === 'cover' ? setCover(response.data) : setLowRes(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching image data:', error);
    }
  };

  useEffect(() => {
    fetchPhotoPreview('low-res');
    fetchPhotoPreview('cover');
  }, []);

  if (!ctx) throw new Error('use inside of GalleryContextProvider');

  return useMemo(
    () => ({
      cover,
      lowRes,
    }),
    [cover, lowRes],
  );
};
