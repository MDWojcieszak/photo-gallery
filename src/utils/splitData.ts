import { Photo } from '~/contexts/Gallery/types';

type Column = {
  images: { data: Photo; index: number }[];
  totalHeight: number;
};

export const splitData = (photos: Photo[], columns: number) => {
  const columnsArray: Column[] = new Array(columns).fill(null).map(() => ({ images: [], totalHeight: 0 }));
  photos.forEach((photo, index) => {
    // Find the column with the minimum total height
    const minColumnIndex = columnsArray.reduce((minIndex, column, currentIndex) => {
      const currentTotalHeight = column.totalHeight;
      const minTotalHeight = columnsArray[minIndex].totalHeight;
      return currentTotalHeight < minTotalHeight ? currentIndex : minIndex;
    }, 0);

    // Add the image to the column with the minimum total height
    columnsArray[minColumnIndex].images.push({ data: photo, index: index });

    // Update the current height of the selected column
    columnsArray[minColumnIndex].totalHeight += (photo.dimensions?.height || 100) / (photo.dimensions?.width || 100);
  });
  return columnsArray;
};
